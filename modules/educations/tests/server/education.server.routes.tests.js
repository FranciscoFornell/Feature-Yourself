'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Education = mongoose.model('Education'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, education;

/**
 * Education routes tests
 */
describe('Education CRUD tests', function () {

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

    // Save a user to the test db and create new Education
    user.save(function () {
      education = {
        name: 'Education name'
      };

      done();
    });
  });

  it('should be able to save a Education if logged in', function (done) {
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

        // Save a new Education
        agent.post('/api/educations')
          .send(education)
          .expect(200)
          .end(function (educationSaveErr, educationSaveRes) {
            // Handle Education save error
            if (educationSaveErr) {
              return done(educationSaveErr);
            }

            // Get a list of Educations
            agent.get('/api/educations')
              .end(function (educationsGetErr, educationsGetRes) {
                // Handle Education save error
                if (educationsGetErr) {
                  return done(educationsGetErr);
                }

                // Get Educations list
                var educations = educationsGetRes.body;

                // Set assertions
                (educations[0].user._id).should.equal(userId);
                (educations[0].name).should.match('Education name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Education if not logged in', function (done) {
    agent.post('/api/educations')
      .send(education)
      .expect(403)
      .end(function (educationSaveErr, educationSaveRes) {
        // Call the assertion callback
        done(educationSaveErr);
      });
  });

  it('should not be able to save an Education if no name is provided', function (done) {
    // Invalidate name field
    education.name = '';

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

        // Save a new Education
        agent.post('/api/educations')
          .send(education)
          .expect(400)
          .end(function (educationSaveErr, educationSaveRes) {
            // Set message assertion
            (educationSaveRes.body.message).should.match('Please fill Education name');

            // Handle Education save error
            done(educationSaveErr);
          });
      });
  });

  it('should be able to update an Education if signed in', function (done) {
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

        // Save a new Education
        agent.post('/api/educations')
          .send(education)
          .expect(200)
          .end(function (educationSaveErr, educationSaveRes) {
            // Handle Education save error
            if (educationSaveErr) {
              return done(educationSaveErr);
            }

            // Update Education name
            education.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Education
            agent.put('/api/educations/' + educationSaveRes.body._id)
              .send(education)
              .expect(200)
              .end(function (educationUpdateErr, educationUpdateRes) {
                // Handle Education update error
                if (educationUpdateErr) {
                  return done(educationUpdateErr);
                }

                // Set assertions
                (educationUpdateRes.body._id).should.equal(educationSaveRes.body._id);
                (educationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Educations if not signed in', function (done) {
    // Create new Education model instance
    var educationObj = new Education(education);

    // Save the education
    educationObj.save(function () {
      // Request Educations
      request(app).get('/api/educations')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Education if not signed in', function (done) {
    // Create new Education model instance
    var educationObj = new Education(education);

    // Save the Education
    educationObj.save(function () {
      request(app).get('/api/educations/' + educationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', education.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Education with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/educations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Education is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Education which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Education
    request(app).get('/api/educations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Education with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Education if signed in', function (done) {
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

        // Save a new Education
        agent.post('/api/educations')
          .send(education)
          .expect(200)
          .end(function (educationSaveErr, educationSaveRes) {
            // Handle Education save error
            if (educationSaveErr) {
              return done(educationSaveErr);
            }

            // Delete an existing Education
            agent.delete('/api/educations/' + educationSaveRes.body._id)
              .send(education)
              .expect(200)
              .end(function (educationDeleteErr, educationDeleteRes) {
                // Handle education error error
                if (educationDeleteErr) {
                  return done(educationDeleteErr);
                }

                // Set assertions
                (educationDeleteRes.body._id).should.equal(educationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Education if not signed in', function (done) {
    // Set Education user
    education.user = user;

    // Create new Education model instance
    var educationObj = new Education(education);

    // Save the Education
    educationObj.save(function () {
      // Try deleting Education
      request(app).delete('/api/educations/' + educationObj._id)
        .expect(403)
        .end(function (educationDeleteErr, educationDeleteRes) {
          // Set message assertion
          (educationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Education error error
          done(educationDeleteErr);
        });

    });
  });

  it('should be able to get a single Education that has an orphaned user reference', function (done) {
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

          // Save a new Education
          agent.post('/api/educations')
            .send(education)
            .expect(200)
            .end(function (educationSaveErr, educationSaveRes) {
              // Handle Education save error
              if (educationSaveErr) {
                return done(educationSaveErr);
              }

              // Set assertions on new Education
              (educationSaveRes.body.name).should.equal(education.name);
              should.exist(educationSaveRes.body.user);
              should.equal(educationSaveRes.body.user._id, orphanId);

              // force the Education to have an orphaned user reference
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

                    // Get the Education
                    agent.get('/api/educations/' + educationSaveRes.body._id)
                      .expect(200)
                      .end(function (educationInfoErr, educationInfoRes) {
                        // Handle Education error
                        if (educationInfoErr) {
                          return done(educationInfoErr);
                        }

                        // Set assertions
                        (educationInfoRes.body._id).should.equal(educationSaveRes.body._id);
                        (educationInfoRes.body.name).should.equal(education.name);
                        should.equal(educationInfoRes.body.user, undefined);

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
      Education.remove().exec(done);
    });
  });
});
