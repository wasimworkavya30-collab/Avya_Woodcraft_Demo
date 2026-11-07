/**
 * Frontend data layer (presentation tier <-> API tier).
 *
 * The approved single-page app keeps its working state in the `S` object and
 * calls persist() after every render. This module keeps that contract and
 * replaces browser storage with the REST API: only the collections that
 * actually changed are sent, coalesced into one request per burst of edits.
 */
(function (global) {
  'use strict';

  var COLLECTIONS = ['emps', 'records', 'work', 'leaves', 'blocked', 'advances', 'inv', 'reqs', 'products', 'orders', 'videos', 'petty'];
  var SAVE_DELAY = 400;
  var RETRY_DELAY = 3000;

  var lastSync = {};
  var sessionActive = false;
  var timer = null;
  var retryTimer = null;
  var saving = false;
  var queued = false;
  var stateRef = null;
  var transientRef = [];

  function request(method, url, body) {
    var options = { method: method, credentials: 'same-origin', headers: { Accept: 'application/json' } };
    if (body !== undefined) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
    return fetch(url, options).then(function (response) {
      var type = response.headers.get('content-type') || '';
      var parsed = type.indexOf('application/json') > -1 ? response.json() : response.text();
      return parsed.then(function (data) {
        if (!response.ok) {
          var message = (data && data.error && (data.error.message || data.error)) || 'The server could not complete that request.';
          var error = new Error(message);
          error.status = response.status;
          throw error;
        }
        return data;
      });
    });
  }

  function notify(message, isError) {
    if (typeof global.__avyaToast === 'function') global.__avyaToast(message, isError);
  }

  function snapshot(state, transient) {
    var out = { collections: {}, settings: {} };
    Object.keys(state).forEach(function (key) {
      if (transient && transient.indexOf(key) > -1) return;
      if (COLLECTIONS.indexOf(key) > -1) out.collections[key] = state[key];
      else out.settings[key] = state[key];
    });
    return out;
  }

  function flush() {
    if (!sessionActive || !stateRef) return;
    var snap = snapshot(stateRef, transientRef);
    var changes = {};
    var dirty = false;

    COLLECTIONS.forEach(function (key) {
      var json = JSON.stringify(snap.collections[key]);
      if (lastSync[key] !== json) {
        changes[key] = snap.collections[key];
        dirty = true;
      }
    });
    var settingsJson = JSON.stringify(snap.settings);
    if (lastSync.__settings !== settingsJson) {
      changes.settings = snap.settings;
      dirty = true;
    }
    if (!dirty) return;
    if (saving) {
      queued = true;
      return;
    }

    saving = true;
    request('PUT', '/api/state', { changes: changes })
      .then(function () {
        COLLECTIONS.forEach(function (key) {
          if (Object.prototype.hasOwnProperty.call(changes, key)) lastSync[key] = JSON.stringify(changes[key]);
        });
        if (changes.settings) lastSync.__settings = JSON.stringify(changes.settings);
        saving = false;
        if (queued) {
          queued = false;
          flush();
        }
      })
      .catch(function (error) {
        saving = false;
        queued = false;
        if (error.status === 401) {
          sessionActive = false;
          notify('Your session ended. Please sign in again.', true);
          return;
        }
        if (!retryTimer) {
          retryTimer = setTimeout(function () {
            retryTimer = null;
            flush();
          }, RETRY_DELAY);
        }
        notify('Could not save to the server. Retrying…', true);
      });
  }

  var api = {
    /** Replaces localStorage persistence: debounced, diffed sync to the API. */
    persist: function (state, transient) {
      stateRef = state;
      transientRef = transient || [];
      if (!sessionActive) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        timer = null;
        flush();
      }, SAVE_DELAY);
    },

    /** Marks the freshly loaded state as already saved (no redundant writes). */
    markSynced: function (state, transient) {
      stateRef = state;
      transientRef = transient || [];
      var snap = snapshot(state, transientRef);
      lastSync = {};
      COLLECTIONS.forEach(function (key) {
        lastSync[key] = JSON.stringify(snap.collections[key]);
      });
      lastSync.__settings = JSON.stringify(snap.settings);
    },

    /** Forces the next sync to send everything (used after a backup import). */
    invalidate: function () {
      lastSync = {};
      if (sessionActive) flush();
    },

    login: function (payload) {
      return request('POST', '/api/auth/login', payload).then(function (result) {
        sessionActive = true;
        lastSync = {};
        return result;
      });
    },

    load: function () {
      return request('GET', '/api/bootstrap').then(function (result) {
        sessionActive = true;
        return result.state;
      });
    },

    logout: function () {
      sessionActive = false;
      if (timer) clearTimeout(timer);
      lastSync = {};
      return request('POST', '/api/auth/logout').catch(function () {
        /* signing out locally is enough */
      });
    },

    reset: function () {
      return request('POST', '/api/state/reset').then(function (result) {
        sessionActive = true;
        lastSync = {};
        return result.state;
      });
    },

    publicEmployees: function () {
      return request('GET', '/api/public/employees').then(function (result) {
        return result.employees || [];
      });
    },

    health: function () {
      return request('GET', '/api/health');
    },
  };

  global.AvyaApi = api;
})(window);
