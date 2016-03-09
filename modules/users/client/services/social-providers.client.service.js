(function(){
  'use strict';

  angular
    .module('users')
    .factory('SocialProviders', SocialProviders);

  function SocialProviders(){
    var _providersArray = [
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
      socialProviders = {
        providersArray : _providersArray,
        providersCollection: _generateProvidersCollection()
      };

    return socialProviders;

    function _generateProvidersCollection(){
      var _collection = {};

      for (var i = 0, l = _providersArray.length; i < l; i++){
        _collection[_providersArray[i].provider] = _providersArray[i];
      }

      return _collection;
    }
  }
})();