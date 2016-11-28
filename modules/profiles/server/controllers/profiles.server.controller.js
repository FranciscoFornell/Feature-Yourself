'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Profile = mongoose.model('Profile'),
  Skill = mongoose.model('Skill'),
  Education = mongoose.model('Education'),
  Experience = mongoose.model('Experience'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Profile
 */
exports.create = function(req, res) {
  var profile = new Profile(req.body);
  profile.user = req.user;

  profile.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(profile);
    }
  });
};

/**
 * Show the current Profile
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var profile = req.profile ? req.profile.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  profile.isCurrentUserOwner = req.user && profile.user && profile.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(profile);
};

/**
 * Update a Profile
 */
exports.update = function(req, res) {
  var profile = req.profile ;

  profile = _.extend(profile , req.body);

  profile.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(profile);
    }
  });
};

/**
 * Delete an Profile
 */
exports.delete = function(req, res) {
  var profile = req.profile ;

  profile.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(profile);
    }
  });
};

/**
 * List of Profiles
 */
exports.list = function(req, res) { 
  Profile.find().sort('-created').populate('user', 'displayName').exec(function(err, profiles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(profiles);
    }
  });
};

/**
 * List of Profiles with asociated data
 */
exports.listWithAsociatedData = function(req, res) {
  var profileFindParams = {},
    dataFindParams = {},
    profile = req.profile;

  if (profile) {
    profileFindParams._id = profile;
    dataFindParams.profiles = profile;
  }

  Promise.all([
    Profile.find(profileFindParams)
      .sort('-created')
      .select('name bio')
      .lean()
      .exec(),
    Skill.find(dataFindParams)
      .sort('-created')
      .select('name level description icon profiles')
      .lean()
      .exec(),
    Education.find(dataFindParams)
      .sort('-created')
      .select('name icon educationType certificate issuingAuthority description profiles')
      .lean()
      .exec(),
    Experience.find(dataFindParams)
      .sort('-created')
      .select('name icon duration position company mainAssignments projects description profiles')
      .lean()
      .exec(),
    User.find({ provider: 'local' })
      .limit(1)
      .select('preferences')
      .lean()
      .exec()
  ])
    .then(function(results) {
      var i, l,
        profiles = results[0],
        skills = results[1],
        educations = results[2],
        experiences = results[3],
        preferences = { showGeneralProfile: true };

      if (results[4][0]) {
        preferences = results[4][0].preferences;
      }

      for(i = 0, l = profiles.length; i < l; i++) {
        profiles[i].skills = skills.filter(isAssociatedToProfile(profiles[i]._id));
        profiles[i].educations = educations.filter(isAssociatedToProfile(profiles[i]._id));
        profiles[i].experiences = experiences.filter(isAssociatedToProfile(profiles[i]._id));
      }

      if (!profile) {
        if (preferences.showGeneralProfile) {
          profiles.unshift({
            name: {
              en: 'General profile',
              es: 'Perfil general'
            },
            skills: skills,
            educations: educations,
            experiences: experiences
          });  
        }        
      }

      res.jsonp(profiles);
    })
    .catch(function(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });

  function isAssociatedToProfile(profileId) {
    return function (e) {
      return e.profiles.indexOf(profileId) !== -1;
    };
  }
};

/**
 * List of Profiles, Name and ID only
 * Covered query
 */
exports.listIDName = function(req, res) {
  var i,
    l,
    data = {};

  Profile.find()
    .sort('-created')
    .select('_id name')
    .exec(function(err, profiles) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        data.profilesArray = profiles;
        data.profileIdsArray = [];
        data.profilesCollection = {};
        for (i = 0, l = profiles.length; i < l; i++) {
          data.profilesCollection[profiles[i]._id] = profiles[i];
          data.profileIdsArray.push(profiles[i]._id);
        }

        res.jsonp(data);
      }
    });
};

/**
 * Profile middleware
 */
exports.profileByID = function(req, res, next, id) {

  Profile.findById(id).populate('user', 'displayName').exec(function (err, profile) {
    if (err) {
      return next(err);
    } else if (!profile) {
      return res.status(404).send({
        message: 'NO_MATCHING_PROFILE'
      });
    }
    req.profile = profile;
    next();
  });
};
