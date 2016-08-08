'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  var user = req.user;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  var user = req.user;
  // NOTE: Cambiadas las opciones para que el nombre de archivo sea uno por usuario y se sobreescriba el fichero si existe
  var options = {
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, config.uploads.profileUpload.dest);
      },
      filename: function (req, file, cb) {
        cb(null, user._id.toString());
      }
    }),
    limits: config.uploads.profileUpload.limits
  };
  var upload = multer(options).single('newProfilePicture');
  // NOTE: Así estaba antes, por si tengo que volverlo a su estado anterior
  // var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;
  
  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        user.profileImageURL = config.uploads.profileUpload.dest + req.file.filename + '?r=' + Math.round(Math.random() * 999999);

        user.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            req.login(user, function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                res.json(user);
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.json(req.user || null);
};
/**
 * Send Public Local User Data
 */
exports.local = function (req, res) {
  User.find({ provider: 'local' }).limit(1).exec(function(err, users){
    var user = users[0],
      data = { exists: false };
    
    if (!!user) {
      data = {
        exists: true,
        displayName: user.displayName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImageURL: user.profileImageURL,
        social: {}        
      };
      if (user.additionalProvidersData && user.additionalProvidersData.google) {
        data.social.google = user.additionalProvidersData.google.url;
      }
      // TODO: Añadir el resto de cuentas sociales)
    }
    
    res.json(data);
  });
};