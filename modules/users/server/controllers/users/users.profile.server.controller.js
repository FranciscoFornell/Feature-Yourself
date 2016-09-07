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
  User = mongoose.model('User'),
  cfenv = require('cfenv'),
  appEnv = cfenv.getAppEnv(),
  objectStorage = require(path.resolve('./modules/core/server/controllers/cf-object-storage.server.controller.js'));

var getCred = function (serviceName, credProp) {
  return appEnv.getService(serviceName) ?
    appEnv.getService(serviceName).credentials[credProp] : undefined;
};

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
        if (process.env.NODE_ENV === 'cloud-foundry' && getCred('FY-Object-Storage', 'projectId')) {
          objectStorage.uploadToObjectStorage(
            config.uploads.profileUpload.dest,
            req.file.filename,
            'user_pics',
            function (err) {
              if (err) {
                return res.status(400).send({
                  message: 'Error occurred while uploading profile picture'
                });
              }
            }
          );
        }

        user.profileImageURL = '/files/users/picture/' + req.file.filename + '?r=' + Math.round(Math.random() * 999999);

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
 * Get profile picture
 */
exports.getProfilePicture = function (req, res) {
  var user = req.model,
    path = config.uploads.profileUpload.dest,
    filename = user._id;

  fs.access(path + filename, fs.F_OK, function(err) {
    if (!err) {
      console.log('File exists. Serving file...');
      res.sendFile(path + filename, { root: './' });            
    } else {
      if(process.env.NODE_ENV === 'cloud-foundry' && getCred('FY-Object-Storage', 'projectId')) {
        console.log('File doesn\'t exist. Trying to download from Object Storage...');
        objectStorage.downloadFromObjectStorage(path, filename, 'user_pics',
          function (err, result) {
            if (!err) {
              console.log('File found in Object Storage. Serving file...');
              res.sendFile(path + filename, { root: './' });
            } else {
              console.error('File not found in Object Storage.');
              res.status(404).send({
                message: 'File not found'
              });
            }            
          });
      } else {
        console.error('File doesn\'t exist.');
        res.status(404).send({
          message: 'File not found'
        });
      }
    }
  });
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
      if (user.additionalProvidersData){
        if (user.additionalProvidersData.google) {
          data.social.google = user.additionalProvidersData.google.url;
        }
        if (user.additionalProvidersData.facebook) {
          data.social.facebook = 'https://www.facebook.com/' + user.additionalProvidersData.facebook.id;
        }
        if (user.additionalProvidersData.github) {
          data.social.github = user.additionalProvidersData.github.html_url;
        }
        if (user.additionalProvidersData.twitter) {
          data.social.twitter = 'https://twitter.com/' + user.additionalProvidersData.twitter.screen_name;
        }
        if (user.additionalProvidersData.linkedin) {
          data.social.linkedin = user.additionalProvidersData.linkedin.publicProfileUrl;
        }
      }
    }
    
    res.json(data);
  });
};