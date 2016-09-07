'use strict';

var fs = require('fs'),
  cfenv = require('cfenv'),
  appEnv = cfenv.getAppEnv(),
  pkgcloud = require('pkgcloud');

var getCred = function (serviceName, credProp) {
  return appEnv.getService(serviceName) ?
    appEnv.getService(serviceName).credentials[credProp] : undefined;
};

var config = {
    provider: 'openstack',
    useServiceCatalog: true,
    useInternal: false,
    keystoneAuthVersion: 'v3',
    authUrl: getCred('FY-Object-Storage', 'auth_url'),
    tenantId: getCred('FY-Object-Storage', 'projectId'),
    domainId: getCred('FY-Object-Storage', 'domainId'),
    username: getCred('FY-Object-Storage', 'username'),
    password: getCred('FY-Object-Storage', 'password'),
    region: getCred('FY-Object-Storage', 'region')
  },
  storageClient = pkgcloud.storage.createClient(config);

/**
 * Download file from Object Storage container
 */
exports.downloadFromObjectStorage = function (path, filename, container, callback) {  
  var downloadOptions = {
      container: container,
      remote: filename + ''
    },
    writeStream = fs.createWriteStream(path + filename);

  storageClient.auth(function(err) {
    if (err) {
      console.error('Error authenticating on Object Storage: ', err);
    }
    else {
      console.log('Object Storage successfully authenticated.');
    }
  });

  writeStream.on('finish', function () {
    if (callback) {
      return callback();
    }
  });

  writeStream.on('error', function (err) {
    console.error('Error writing on file \'' + path + filename + '\': ', err);
    if (callback) {
      return callback(err);
    }
  });

  storageClient.download(downloadOptions, function(err, result) {
    if (err) {
      console.error('Error downloading from Object Storage to path \'' + path + filename + '\': ', err);
      fs.unlink(path + filename);
      if (callback) {
        return callback(err);
      }
    }
    else {
      console.log('Object Storage file [' + filename + '] successfully downloaded.');
    }
  }).pipe(writeStream);
};

/**
 * Upload file to Object Storage container
 */
exports.uploadToObjectStorage = function (path, filename, container, callback) {
  storageClient.auth(function(err) {
    if (err) {
      console.error('Error authenticating Object Storage: ', err);
    }
    else {
      console.log('Object Storage successfully authenticated. Identity: ', storageClient._identity);
    }
  });

  storageClient.createContainer({
    name: container
  }, function (err, container) {
    if (err) {
      console.error('Error creating Object Storage container: ', err);
    }
    else {

      console.log('Object Storage container successfully created: ', container);

      var readStream = fs.createReadStream(path + filename);

      var upload = storageClient.upload({
        container: container.name,
        remote: filename
      });

      upload.on('error', function(err) {
        console.error('Error uploading Object Storage file: ', err);

        if (callback) {
          return callback(err);
        }
      });

      upload.on('success', function(file) {
        console.log('Object Storage file [' + filename + '] successfully uploaded: ');
        
        if (callback) {
          return callback();
        }
      });

      readStream.pipe(upload);
    }
  });
};