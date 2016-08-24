'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Experience = mongoose.model('Experience'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Experience
 */
exports.create = function(req, res) {
  var experience = new Experience(req.body);
  experience.user = req.user;

  experience.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(experience);
    }
  });
};

/**
 * Show the current Experience
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var experience = req.experience ? req.experience.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  experience.isCurrentUserOwner = req.user && experience.user && experience.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(experience);
};

/**
 * Update a Experience
 */
exports.update = function(req, res) {
  var experience = req.experience ;

  experience = _.extend(experience , req.body);

  experience.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(experience);
    }
  });
};

/**
 * Delete an Experience
 */
exports.delete = function(req, res) {
  var experience = req.experience ;

  experience.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(experience);
    }
  });
};

/**
 * List of Experiences
 */
exports.list = function(req, res) { 
  Experience.find().sort('-created').populate('user', 'displayName').exec(function(err, experiences) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(experiences);
    }
  });
};

/**
 * Experience middleware
 */
exports.experienceByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Experience is invalid'
    });
  }

  Experience.findById(id).populate('user', 'displayName').exec(function (err, experience) {
    if (err) {
      return next(err);
    } else if (!experience) {
      return res.status(404).send({
        message: 'No Experience with that identifier has been found'
      });
    }
    req.experience = experience;
    next();
  });
};
