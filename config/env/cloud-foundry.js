'use strict';

var cfenv = require('cfenv'),
  appEnv = cfenv.getAppEnv();
var cfMongoUrl = (function() {
  if (appEnv.getService('FY-mongo')) {
    var mongoCreds = appEnv.getService('FY-mongo').credentials;
    return mongoCreds.uri || mongoCreds.url;
  } else {
    throw new Error('No service names "FY-mongo" bound to the application.');
  }
}());

var getCred = function (serviceName, credProp) {
  return appEnv.getService(serviceName) ?
    appEnv.getService(serviceName).credentials[credProp] : undefined;
};

module.exports = {
  port: appEnv.port,
  db: {
    uri: cfMongoUrl,
    options: {
      user: '',
      pass: ''
    }
  },
  log: {
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'combined',
    // Stream defaults to process.stdout
    // By default we want logs to go to process.out so the Cloud Foundry Loggregator will collect them
    options: {}
  },
  facebook: {
    clientID: getCred('mean-facebook', 'id') || process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: getCred('mean-facebook', 'secret') || process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/facebook/callback'
  },
  twitter: {
    clientID: getCred('mean-twitter', 'key') || process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: getCred('mean-twitter', 'secret') || process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: '/api/auth/twitter/callback'
  },
  google: {
    clientID: getCred('mean-google', 'id') || process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: getCred('mean-google', 'secret') || process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/google/callback'
  },
  linkedin: {
    clientID: getCred('mean-linkedin', 'id') || process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: getCred('mean-linkedin', 'secret') || process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/linkedin/callback'
  },
  github: {
    clientID: getCred('mean-github', 'id') || process.env.GITHUB_ID || 'APP_ID',
    clientSecret: getCred('mean-github', 'secret') || process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/github/callback'
  },
  paypal: {
    clientID: getCred('mean-paypal', 'id') || 'CLIENT_ID',
    clientSecret: getCred('mean-paypal', 'secret') || 'CLIENT_SECRET',
    callbackURL: '/api/auth/paypal/callback',
    sandbox: false
  },
  mailer: {
    from: getCred('mean-mail', 'from') || process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: getCred('mean-mail', 'service') || process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: getCred('mean-mail', 'username') || process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: getCred('mean-mail', 'password') || process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
    }
  },
  seedDB: {
    seed: process.env.MONGO_SEED === 'true' ? true : false,
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS === 'false' ? false : true,
      seedUser: {
        username: process.env.MONGO_SEED_USER_USERNAME || 'user',
        provider: 'local',
        email: process.env.MONGO_SEED_USER_EMAIL || 'user@localhost.com',
        firstName: 'User',
        lastName: 'Local',
        displayName: 'User Local',
        roles: ['user']
      },
      seedAdmin: {
        username: process.env.MONGO_SEED_ADMIN_USERNAME || 'admin',
        provider: 'local',
        email: process.env.MONGO_SEED_ADMIN_EMAIL || 'admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'admin']
      }
    }
  }
};
