'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Skill = mongoose.model('Skill'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Skill
 */
exports.create = function(req, res) {
  var skill = new Skill(req.body);
  skill.user = req.user;

  skill.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(skill);
    }
  });
};

/**
 * Show the current Skill
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var skill = req.skill ? req.skill.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  skill.isCurrentUserOwner = req.user && skill.user && skill.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(skill);
};

/**
 * Update a Skill
 */
exports.update = function(req, res) {
  var skill = req.skill ;

  skill = _.extend(skill , req.body);

  skill.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(skill);
    }
  });
};

/**
 * Delete an Skill
 */
exports.delete = function(req, res) {
  var skill = req.skill ;

  skill.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(skill);
    }
  });
};

/**
 * List of Skills
 */
exports.list = function(req, res) { 
  Skill.find().sort('-created').populate('user', 'displayName').exec(function(err, skills) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(skills);
    }
  });
};

/**
 * Skill middleware
 */
exports.skillByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Skill is invalid'
    });
  }

  Skill.findById(id).populate('user', 'displayName').exec(function (err, skill) {
    if (err) {
      return next(err);
    } else if (!skill) {
      return res.status(404).send({
        message: 'No Skill with that identifier has been found'
      });
    }
    req.skill = skill;
    next();
  });
};
