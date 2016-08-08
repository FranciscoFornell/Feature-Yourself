(function() {
  'use strict';

  angular
    .module('users')
    .factory('socialProvidersService', socialProvidersService);

  function socialProvidersService(){
    var providersArray = [
      {
        provider: 'facebook',
        name: 'Facebook',
        mdIcon: 'facebook-box',
        color: '#3b5998'
      },
      {
        provider: 'twitter',
        name: 'Twitter',
        mdIcon: 'twitter-box',
        color: '#55acee'
      },
      {
        provider: 'google',
        name: 'Google+',
        mdIcon: 'google-plus-box',
        color: '#dc4e41'
      },
      {
        provider: 'linkedin',
        name: 'Linkedin',
        mdIcon: 'linkedin-box',
        color: '#0077b5'
      },
      {
        provider: 'github',
        name: 'Github',
        mdIcon: 'github-box',
        color: '#333333'
      }],
      service = {
        providersArray : providersArray,
        providersCollection: generateProvidersCollection()
      };

    return service;

    function generateProvidersCollection(){
      var collection = {};

      for (var i = 0, l = providersArray.length; i < l; i++){
        collection[providersArray[i].provider] = providersArray[i];
      }

      return collection;
    }
  }
})();