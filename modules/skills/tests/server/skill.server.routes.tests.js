'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Skill = mongoose.model('Skill'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, skill;

/**
 * Skill routes tests
 */
describe('Skill CRUD tests', function () {

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

    // Save a user to the test db and create new Skill
    user.save(function () {
      skill = {
        name: 'Skill name'
      };

      done();
    });
  });

  it('should be able to save a Skill if logged in', function (done) {
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

        // Save a new Skill
        agent.post('/api/skills')
          .send(skill)
          .expect(200)
          .end(function (skillSaveErr, skillSaveRes) {
            // Handle Skill save error
            if (skillSaveErr) {
              return done(skillSaveErr);
            }

            // Get a list of Skills
            agent.get('/api/skills')
              .end(function (skillsGetErr, skillsGetRes) {
                // Handle Skill save error
                if (skillsGetErr) {
                  return done(skillsGetErr);
                }

                // Get Skills list
                var skills = skillsGetRes.body;

                // Set assertions
                (skills[0].user._id).should.equal(userId);
                (skills[0].name).should.match('Skill name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Skill if not logged in', function (done) {
    agent.post('/api/skills')
      .send(skill)
      .expect(403)
      .end(function (skillSaveErr, skillSaveRes) {
        // Call the assertion callback
        done(skillSaveErr);
      });
  });

  it('should not be able to save an Skill if no name is provided', function (done) {
    // Invalidate name field
    skill.name = '';

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

        // Save a new Skill
        agent.post('/api/skills')
          .send(skill)
          .expect(400)
          .end(function (skillSaveErr, skillSaveRes) {
            // Set message assertion
            (skillSaveRes.body.message).should.match('Please fill Skill name');

            // Handle Skill save error
            done(skillSaveErr);
          });
      });
  });

  it('should be able to update an Skill if signed in', function (done) {
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

        // Save a new Skill
        agent.post('/api/skills')
          .send(skill)
          .expect(200)
          .end(function (skillSaveErr, skillSaveRes) {
            // Handle Skill save error
            if (skillSaveErr) {
              return done(skillSaveErr);
            }

            // Update Skill name
            skill.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Skill
            agent.put('/api/skills/' + skillSaveRes.body._id)
              .send(skill)
              .expect(200)
              .end(function (skillUpdateErr, skillUpdateRes) {
                // Handle Skill update error
                if (skillUpdateErr) {
                  return done(skillUpdateErr);
                }

                // Set assertions
                (skillUpdateRes.body._id).should.equal(skillSaveRes.body._id);
                (skillUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Skills if not signed in', function (done) {
    // Create new Skill model instance
    var skillObj = new Skill(skill);

    // Save the skill
    skillObj.save(function () {
      // Request Skills
      request(app).get('/api/skills')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Skill if not signed in', function (done) {
    // Create new Skill model instance
    var skillObj = new Skill(skill);

    // Save the Skill
    skillObj.save(function () {
      request(app).get('/api/skills/' + skillObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', skill.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Skill with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/skills/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Skill is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Skill which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Skill
    request(app).get('/api/skills/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Skill with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Skill if signed in', function (done) {
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

        // Save a new Skill
        agent.post('/api/skills')
          .send(skill)
          .expect(200)
          .end(function (skillSaveErr, skillSaveRes) {
            // Handle Skill save error
            if (skillSaveErr) {
              return done(skillSaveErr);
            }

            // Delete an existing Skill
            agent.delete('/api/skills/' + skillSaveRes.body._id)
              .send(skill)
              .expect(200)
              .end(function (skillDeleteErr, skillDeleteRes) {
                // Handle skill error error
                if (skillDeleteErr) {
                  return done(skillDeleteErr);
                }

                // Set assertions
                (skillDeleteRes.body._id).should.equal(skillSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Skill if not signed in', function (done) {
    // Set Skill user
    skill.user = user;

    // Create new Skill model instance
    var skillObj = new Skill(skill);

    // Save the Skill
    skillObj.save(function () {
      // Try deleting Skill
      request(app).delete('/api/skills/' + skillObj._id)
        .expect(403)
        .end(function (skillDeleteErr, skillDeleteRes) {
          // Set message assertion
          (skillDeleteRes.body.message).should.match('User is not authorized');

          // Handle Skill error error
          done(skillDeleteErr);
        });

    });
  });

  it('should be able to get a single Skill that has an orphaned user reference', function (done) {
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

          // Save a new Skill
          agent.post('/api/skills')
            .send(skill)
            .expect(200)
            .end(function (skillSaveErr, skillSaveRes) {
              // Handle Skill save error
              if (skillSaveErr) {
                return done(skillSaveErr);
              }

              // Set assertions on new Skill
              (skillSaveRes.body.name).should.equal(skill.name);
              should.exist(skillSaveRes.body.user);
              should.equal(skillSaveRes.body.user._id, orphanId);

              // force the Skill to have an orphaned user reference
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

                    // Get the Skill
                    agent.get('/api/skills/' + skillSaveRes.body._id)
                      .expect(200)
                      .end(function (skillInfoErr, skillInfoRes) {
                        // Handle Skill error
                        if (skillInfoErr) {
                          return done(skillInfoErr);
                        }

                        // Set assertions
                        (skillInfoRes.body._id).should.equal(skillSaveRes.body._id);
                        (skillInfoRes.body.name).should.equal(skill.name);
                        should.equal(skillInfoRes.body.user, undefined);

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
      Skill.remove().exec(done);
    });
  });
});
