'use strict';

/**
 * Module dependencies
 */
var experiencesPolicy = require('../policies/experiences.server.policy'),
  experiences = require('../controllers/experiences.server.controller');

module.exports = function(app) {
  // Experiences Routes
  app.route('/api/experiences').all(experiencesPolicy.isAllowed)
    .get(experiences.list)
    .post(experiences.create);

  app.route('/api/experiences/:experienceId').all(experiencesPolicy.isAllowed)
    .get(experiences.read)
    .put(experiences.update)
    .delete(experiences.delete);

  // Finish by binding the Experience middleware
  app.param('experienceId', experiences.experienceByID);
};
