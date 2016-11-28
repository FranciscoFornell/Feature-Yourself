'use strict';

var validator = require('validator'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {

  var safeUserObject = null,
    userSettings = {
      theme: {
        primary: null,
        accent: null,
        warn: null
      },
      showGeneralProfile: true
    };

  if (req.user) {
    safeUserObject = {
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      created: req.user.created.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData,
      preferences: {
        theme: {
          primary: validator.escape(req.user.preferences.theme.primary || ''),
          accent: validator.escape(req.user.preferences.theme.accent || ''),
          warn: validator.escape(req.user.preferences.theme.warn || '')
        },
        showGeneralProfile: req.user.preferences.showGeneralProfile
      }
    };
  }

  User.find({ provider: 'local' })
    .limit(1)
    .exec(function(err, users){
      var user = users[0];

      if (!!user && user.preferences && user.preferences.theme) {
        userSettings = user.preferences;
      }
      res.render('modules/core/server/views/index', {
        user: safeUserObject,
        userSettings: {
          theme: {
            primary: validator.escape(userSettings.theme.primary || ''),
            accent: validator.escape(userSettings.theme.accent || ''),
            warn: validator.escape(userSettings.theme.warn || '')
          }
        }
      });
    });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};
