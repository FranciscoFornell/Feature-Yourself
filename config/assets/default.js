'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        // 'public/lib/bootstrap/dist/css/bootstrap.css',
        // 'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/angular-material/angular-material.css',
        'public/lib/md-data-table/md-data-table.css',
        'public/lib/angular-material-expansion-panel/dist/md-expansion-panel.css',
        'public/lib/ng-img-crop/compile/unminified/ng-img-crop.css'
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-file-upload/dist/angular-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angular-material/angular-material.js',
        'public/lib/md-data-table/md-data-table.js',
        'public/lib/angular-aria/angular-aria.js',
        'public/lib/angular-translate/angular-translate.js',
        'public/lib/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
        'public/lib/angular-translate-storage-local/angular-translate-storage-local.js',
        'public/lib/angular-translate-loader-partial/angular-translate-loader-partial.js',
        'public/lib/angular-cookies/angular-cookies.js',
        // 'public/lib/angular-sanitize/angular-sanitize.js',
        'https://cdn.jsdelivr.net/angular.textangular/1.5.4/textAngular-sanitize.js',
        'public/lib/angular-material-expansion-panel/dist/md-expansion-panel.js',
        'public/lib/ng-img-crop/compile/unminified/ng-img-crop.js',
        'public/lib/tinymce-dist/tinymce.js',
        'public/lib/angular-ui-tinymce/src/tinymce.js'
        // endbower
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    img: [
      'modules/**/*/img/**/*.jpg',
      'modules/**/*/img/**/*.png',
      'modules/**/*/img/**/*.gif',
      'modules/**/*/img/**/*.svg'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: ['gruntfile.js'],
    gulpConfig: ['gulpfile.js'],
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: ['modules/*/server/config/*.js'],
    policies: 'modules/*/server/policies/*.js',
    views: ['modules/*/server/views/*.html']
  }
};
