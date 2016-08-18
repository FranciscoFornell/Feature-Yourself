'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Education = mongoose.model('Education'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Education
 */
exports.create = function(req, res) {
  var education = new Education(req.body);
  education.user = req.user;

  education.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(education);
    }
  });
};

/**
 * Show the current Education
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var education = req.education ? req.education.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  education.isCurrentUserOwner = req.user && education.user && education.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(education);
};

/**
 * Update a Education
 */
exports.update = function(req, res) {
  var education = req.education ;

  education = _.extend(education , req.body);

  education.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(education);
    }
  });
};

/**
 * Delete an Education
 */
exports.delete = function(req, res) {
  var education = req.education ;

  education.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(education);
    }
  });
};

/**
 * List of Educations
 */
exports.list = function(req, res) { 
  Education.find().sort('-created').populate('user', 'displayName').exec(function(err, educations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(educations);
    }
  });
};

/**
 * Education middleware
 */
exports.educationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Education is invalid'
    });
  }

  Education.findById(id).populate('user', 'displayName').exec(function (err, education) {
    if (err) {
      return next(err);
    } else if (!education) {
      return res.status(404).send({
        message: 'No Education with that identifier has been found'
      });
    }
    req.education = education;
    next();
  });
};
