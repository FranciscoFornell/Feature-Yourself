'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Experience = mongoose.model('Experience'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, experience;

/**
 * Experience routes tests
 */
describe('Experience CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Experience
    user.save(function () {
      experience = {
        name: 'Experience name'
      };

      done();
    });
  });

  it('should be able to save a Experience if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Experience
        agent.post('/api/experiences')
          .send(experience)
          .expect(200)
          .end(function (experienceSaveErr, experienceSaveRes) {
            // Handle Experience save error
            if (experienceSaveErr) {
              return done(experienceSaveErr);
            }

            // Get a list of Experiences
            agent.get('/api/experiences')
              .end(function (experiencesGetErr, experiencesGetRes) {
                // Handle Experience save error
                if (experiencesGetErr) {
                  return done(experiencesGetErr);
                }

                // Get Experiences list
                var experiences = experiencesGetRes.body;

                // Set assertions
                (experiences[0].user._id).should.equal(userId);
                (experiences[0].name).should.match('Experience name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Experience if not logged in', function (done) {
    agent.post('/api/experiences')
      .send(experience)
      .expect(403)
      .end(function (experienceSaveErr, experienceSaveRes) {
        // Call the assertion callback
        done(experienceSaveErr);
      });
  });

  it('should not be able to save an Experience if no name is provided', function (done) {
    // Invalidate name field
    experience.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Experience
        agent.post('/api/experiences')
          .send(experience)
          .expect(400)
          .end(function (experienceSaveErr, experienceSaveRes) {
            // Set message assertion
            (experienceSaveRes.body.message).should.match('Please fill Experience name');

            // Handle Experience save error
            done(experienceSaveErr);
          });
      });
  });

  it('should be able to update an Experience if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Experience
        agent.post('/api/experiences')
          .send(experience)
          .expect(200)
          .end(function (experienceSaveErr, experienceSaveRes) {
            // Handle Experience save error
            if (experienceSaveErr) {
              return done(experienceSaveErr);
            }

            // Update Experience name
            experience.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Experience
            agent.put('/api/experiences/' + experienceSaveRes.body._id)
              .send(experience)
              .expect(200)
              .end(function (experienceUpdateErr, experienceUpdateRes) {
                // Handle Experience update error
                if (experienceUpdateErr) {
                  return done(experienceUpdateErr);
                }

                // Set assertions
                (experienceUpdateRes.body._id).should.equal(experienceSaveRes.body._id);
                (experienceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Experiences if not signed in', function (done) {
    // Create new Experience model instance
    var experienceObj = new Experience(experience);

    // Save the experience
    experienceObj.save(function () {
      // Request Experiences
      request(app).get('/api/experiences')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Experience if not signed in', function (done) {
    // Create new Experience model instance
    var experienceObj = new Experience(experience);

    // Save the Experience
    experienceObj.save(function () {
      request(app).get('/api/experiences/' + experienceObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', experience.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Experience with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/experiences/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Experience is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Experience which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Experience
    request(app).get('/api/experiences/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Experience with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Experience if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Experience
        agent.post('/api/experiences')
          .send(experience)
          .expect(200)
          .end(function (experienceSaveErr, experienceSaveRes) {
            // Handle Experience save error
            if (experienceSaveErr) {
              return done(experienceSaveErr);
            }

            // Delete an existing Experience
            agent.delete('/api/experiences/' + experienceSaveRes.body._id)
              .send(experience)
              .expect(200)
              .end(function (experienceDeleteErr, experienceDeleteRes) {
                // Handle experience error error
                if (experienceDeleteErr) {
                  return done(experienceDeleteErr);
                }

                // Set assertions
                (experienceDeleteRes.body._id).should.equal(experienceSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Experience if not signed in', function (done) {
    // Set Experience user
    experience.user = user;

    // Create new Experience model instance
    var experienceObj = new Experience(experience);

    // Save the Experience
    experienceObj.save(function () {
      // Try deleting Experience
      request(app).delete('/api/experiences/' + experienceObj._id)
        .expect(403)
        .end(function (experienceDeleteErr, experienceDeleteRes) {
          // Set message assertion
          (experienceDeleteRes.body.message).should.match('User is not authorized');

          // Handle Experience error error
          done(experienceDeleteErr);
        });

    });
  });

  it('should be able to get a single Experience that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Experience
          agent.post('/api/experiences')
            .send(experience)
            .expect(200)
            .end(function (experienceSaveErr, experienceSaveRes) {
              // Handle Experience save error
              if (experienceSaveErr) {
                return done(experienceSaveErr);
              }

              // Set assertions on new Experience
              (experienceSaveRes.body.name).should.equal(experience.name);
              should.exist(experienceSaveRes.body.user);
              should.equal(experienceSaveRes.body.user._id, orphanId);

              // force the Experience to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Experience
                    agent.get('/api/experiences/' + experienceSaveRes.body._id)
                      .expect(200)
                      .end(function (experienceInfoErr, experienceInfoRes) {
                        // Handle Experience error
                        if (experienceInfoErr) {
                          return done(experienceInfoErr);
                        }

                        // Set assertions
                        (experienceInfoRes.body._id).should.equal(experienceSaveRes.body._id);
                        (experienceInfoRes.body.name).should.equal(experience.name);
                        should.equal(experienceInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Experience.remove().exec(done);
    });
  });
});
