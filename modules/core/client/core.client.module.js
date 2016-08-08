(function(app) {
  'use strict';

  // Use Application configuration module to register a new module
  app.registerModule('core');
  app.registerModule('core.admin', ['core']);
  app.registerModule('core.admin.routes', ['ui.router']);
})(ApplicationConfiguration);