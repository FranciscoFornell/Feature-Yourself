(function () {
  'use strict';

  angular
    .module('core')
    .run(routeFilter);

  routeFilter.$inject = ['$rootScope', '$state', 'authenticationService'];

  function routeFilter($rootScope, $state, authenticationService) {
    $rootScope.$on('$stateChangeStart', stateChangeStart);
    $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeStart(event, toState, toParams, fromState, fromParams) {
      // Check authentication before changing state
      if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
        var allowed = false;

        for (var i = 0, roles = toState.data.roles; i < roles.length; i++) {
          if ((roles[i] === 'guest') || (authenticationService.user && authenticationService.user.roles !== undefined && authenticationService.user.roles.indexOf(roles[i]) !== -1)) {
            allowed = true;
            break;
          }
        }

        if (!allowed) {
          event.preventDefault();
          if (authenticationService.user !== undefined && typeof authenticationService.user === 'object') {
            $state.transitionTo('forbidden');
          } else {
            $state.go('reqAuthentication').then(function () {
              // Record previous state
              storePreviousState(toState, toParams);
            });
          }
        }
      }
    }

    function stateChangeSuccess(event, toState, toParams, fromState, fromParams) {
      // Record previous state
      storePreviousState(fromState, fromParams);
    }

    // Store previous state
    function storePreviousState(state, params) {
      // only store this state if it shouldn't be ignored
      if (!state.data || !state.data.ignoreState) {
        $state.previous = {
          state: state,
          params: params,
          href: $state.href(state, params)
        };
      }
    }
  }
}());
