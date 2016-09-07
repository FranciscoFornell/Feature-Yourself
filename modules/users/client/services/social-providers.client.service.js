(function() {
  'use strict';

  angular
    .module('users')
    .factory('socialProvidersService', socialProvidersService);

  function socialProvidersService(){
    var configuredSocialProviders = window.configuredSocialProviders,
      providersArray = [
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
        }
      ],
      service = {
        providersArray : providersArray,
        providersCollection: generateProvidersCollection(),
        configuredProvidersArray : providersArray.filter(isConfigured)
      };

    return service;

    function generateProvidersCollection(){
      var i,
        l = providersArray.length,
        collection = {};

      for (i = 0; i < l; i++){
        collection[providersArray[i].provider] = providersArray[i];
      }

      return collection;
    }

    function isConfigured(e){
      return configuredSocialProviders[e.provider];
    }
  }
})();