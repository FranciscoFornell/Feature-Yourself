// 'use strict';

// angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
//   function ($scope, $filter, Admin) {
//     Admin.query(function (data) {
//       $scope.users = data;
//       $scope.buildPager();
//     });

//     $scope.buildPager = function () {
//       $scope.pagedItems = [];
//       $scope.itemsPerPage = 15;
//       $scope.currentPage = 1;
//       $scope.figureOutItemsToDisplay();
//     };

//     $scope.figureOutItemsToDisplay = function () {
//       $scope.filteredItems = $filter('filter')($scope.users, {
//         $: $scope.search
//       });
//       $scope.filterLength = $scope.filteredItems.length;
//       var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
//       var end = begin + $scope.itemsPerPage;
//       $scope.pagedItems = $scope.filteredItems.slice(begin, end);
//     };

//     $scope.pageChanged = function () {
//       $scope.figureOutItemsToDisplay();
//     };
//   }
// ]);

// NOTE: conservo de momento el controlador anterior comentado
(function(){
  'use strict';
  
  angular
    .module('users.admin')
    .controller('UserListController', UserListController);

  UserListController.$inject = ['$scope', '$filter', 'Admin', '$translatePartialLoader', '$mdDialog', '$translate', '$q', '$mdMedia', '$mdEditDialog', '$mdToast', 'SocialProviders', 'Authentication'];

  function UserListController ($scope, $filter, Admin, $translatePartialLoader, $mdDialog, $translate, $q, $mdMedia, $mdEditDialog, $mdToast, SocialProviders, Authentication) {
    /* jshint validthis: true */

    var vm = this;

    $translatePartialLoader.addPart('users');

    vm.Authentication = Authentication;

    vm.pager = {
      order: 'username',
      limit: 5,
      page: 1,
      search: '',
      filterEnabled: false,
      label: {
        page: 'PAG_LABEL_PAGE',
        rowsPerPage: 'PAG_LABEL_ROWS_PER_PAGE',
        of: 'PAG_LABEL_OF'
      }
    };

    vm.providersCollection = SocialProviders.providersCollection;

    // Automaticaly adjust the initial rows per page
    if ($mdMedia('(min-height: 1010px)')){
      vm.pager.limit = 15;
    } else if ($mdMedia('(min-height: 800px)')){
      vm.pager.limit = 10;
    }

    vm.rolesOptions = [
      'ROLE_USER',
      'ROLE_ADMIN',
      'ROLE_USER_ADMIN'
    ];

    vm.selected = [];

    vm.promise = Admin.query(function (data) {
      vm.users = data;
    }).$promise;

    vm.toggleFilter = function () {
      vm.pager.filterEnabled = !vm.pager.filterEnabled;

      if (!vm.pager.filterEnabled) {
        vm.pager.search = '';
      }
    };

    vm.removeSelected = function (ev) {
      var titleText,
        contentText,
        cancelText,
        confirm;

      if (vm.selected.length) {
        // The translations will be run simultaneously, and continue when all of them are finished.
        $q.all([
          $translate('REMOVE_ELEMENTS_TITLE')
            .then(function(translation){
              titleText = translation;
            }),
          $translate('REMOVE_ELEMENTS_CONTENT')
            .then(function(translation){
              contentText = translation;
            }),
          $translate('CANCEL')
            .then(function(translation){
              cancelText = translation;
            })
        ]).then(function(){
          confirm = $mdDialog.confirm()
            .title(titleText)
            .textContent(contentText)
            .ariaLabel('Remove Selected Elements Dialog')
            .targetEvent(ev)
            .ok('Ok')
            .cancel(cancelText);

          $mdDialog.show(confirm)
            .then(function(){
              for(var i=0; i<vm.selected.length; i++){
                vm.selected[i].$remove();
                if (vm.users.indexOf(vm.selected[i]) !== -1){
                  vm.users.splice(vm.users.indexOf(vm.selected[i]), 1);
                }
              }
              vm.selected = [];
            });
        });
      }
    };

    vm.editFirstname = function (ev, user) {
      var editDialog = {
        modelValue: user.firstName,
        save: function (input) {
          var rolesString = user.rolesString;
          delete user.rolesString;
          user.firstName = input.$modelValue;
          user.$update(function () {
            user.rolesString = rolesString;
          }, function (err) {
            $mdToast.showSimple('ERROR:\n' + err.data);
            vm.promise = Admin.query(function (data) {
              vm.users = data;
            }).$promise;
          });
        },
        targetEvent: ev,
        validators: {
          'md-maxlength': 30,
          'required': true
        }
      };

      ev.stopPropagation(); // in case autoselect is enabled

      $mdEditDialog.small(editDialog);

    };
    vm.editLastname = function (ev, user) {
      var editDialog = {
        modelValue: user.lastName,
        save: function (input) {
          var rolesString = user.rolesString;
          delete user.rolesString;
          user.lastName = input.$modelValue;
          user.$update(function () {
            user.rolesString = rolesString;
          }, function (err) {
            $mdToast.showSimple('ERROR:\n' + err.data);
            vm.promise = Admin.query(function (data) {
              vm.users = data;
            }).$promise;
          });
        },
        targetEvent: ev,
        validators: {
          'md-maxlength': 30
        }
      };

      ev.stopPropagation(); // in case autoselect is enabled

      $mdEditDialog.small(editDialog);

    };

    vm.stringifyRoles = function (user) {
      var rolesString;

      switch (user.roles.join()) {
        case 'user':
          rolesString = 'ROLE_USER';
          break;
        case 'admin':
          rolesString = 'ROLE_ADMIN';
          break;
        case 'user,admin':
        case 'admin,user':
          rolesString = 'ROLE_USER_ADMIN';
          break;
        default:
          rolesString = 'Roles not recognised';
          break;
      }

      return rolesString;
    };

    vm.destringifyRoles = function (user, updateUser) {
      var roles,
        rolesString = user.rolesString;

      switch (rolesString) {
        case 'ROLE_USER':
          roles = ['user'];
          break;
        case 'ROLE_ADMIN':
          roles = ['admin'];
          break;
        case 'ROLE_USER_ADMIN':
          roles = ['user', 'admin'];
          break;
        default:
          break;
      }

      if (!!roles) {
        user.roles = roles;
        if (updateUser) {
          delete user.rolesString;
          user.$update(function () {
            user.rolesString = rolesString;
          }, function (err) {
            $mdToast.showSimple('ERROR:\n' + err.data);
            vm.promise = Admin.query(function (data) {
              vm.users = data;
            }).$promise;
          });  
        }        
      }      
    };

    vm.showEditUserDialog = function (ev, user) {
      ev.stopPropagation(); // in case autoselect is enabled

      $mdDialog.show({
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        targetEvent: ev,
        clickOutsideToClose: true,
        controller: editUserDialogController,
        controllerAs: 'eUDCtrl',
        locals: {
          user: user
        }
      });

      function editUserDialogController ($scope, user) {
        var editVm = this,
          rolesString;

        editVm.user = angular.extend({}, user);
        editVm.rolesOptions = vm.rolesOptions;
        editVm.stringifyRoles = vm.stringifyRoles;
        editVm.destringifyRoles = vm.destringifyRoles;
        editVm.update = function (isValid) {
          if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'editUserForm');

            return false;
          }

          angular.extend(user, editVm.user);

          rolesString = user.rolesString;
          delete user.rolesString;
          user.$update(function () {
            user.rolesString = rolesString;
            $mdDialog.hide();
          }, function (errorResponse) {
            user.rolesString = rolesString;
            editVm.error = errorResponse.data.message;
          });
        };
        editVm.cancel = function () {
          $mdDialog.cancel();
        };
      }
    };

    vm.showViewUserDialog = function (ev, user, provider) {
      ev.stopPropagation(); // in case autoselect is enabled

      $mdDialog.show({
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        targetEvent: ev,
        clickOutsideToClose: true,
        controller: viewUserDialogController,
        controllerAs: 'vUDCtrl',
        locals: {
          user: user,
          provider: provider
        }
      });

      function viewUserDialogController ($scope, user) {
        var viewVm = this,
          rolesString;

        viewVm.user = user;
        viewVm.provider = provider;
        viewVm.stringifyRoles = vm.stringifyRoles;
        viewVm.cancel = function () {
          $mdDialog.cancel();
        };
      }
    };
  }
})();
