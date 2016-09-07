(function() {
  'use strict';
  
  angular
    .module('users.admin')
    .controller('UserListController', UserListController);

  UserListController.$inject = ['Admin', '$translatePartialLoader', '$mdDialog', '$translate', '$q', '$mdMedia', '$mdEditDialog', '$mdToast', 'socialProvidersService', 'authenticationService'];

  function UserListController (Admin, $translatePartialLoader, $mdDialog, $translate, $q, $mdMedia, $mdEditDialog, $mdToast, socialProvidersService, authenticationService) {
    var vm = this;

    vm.authentication = authenticationService;
    vm.destringifyRoles = destringifyRoles;
    vm.editFirstname = editFirstname;
    vm.editLastname = editLastname;
    vm.isScreenSize = isScreenSize;
    vm.providersCollection = socialProvidersService.providersCollection;
    vm.removeSelected = removeSelected;
    vm.showEditUserDialog = showEditUserDialog;
    vm.showViewUserDialog = showViewUserDialog;
    vm.stringifyRoles = stringifyRoles;
    vm.toggleFilter = toggleFilter;

    activate();    

    function activate() {
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
      vm.selected = [];
      vm.rolesOptions = [
        'ROLE_USER',
        'ROLE_ADMIN',
        'ROLE_USER_ADMIN'
      ];
      
      $translatePartialLoader.addPart('users');

      // Automaticaly adjust the initial rows per page
      if ($mdMedia('(min-height: 1010px)')){
        vm.pager.limit = 15;
      } else if ($mdMedia('(min-height: 800px)')){
        vm.pager.limit = 10;
      }

      vm.promise = Admin.query(function (data) {
        vm.users = data;
      }).$promise;
    }

    function destringifyRoles(user, updateUser) {
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
    }

    function dialogCancel() {
      $mdDialog.cancel();
    }

    function editFirstname(ev, user) {
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
    }

    function editLastname(ev, user) {
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
    }

    function isScreenSize(screenSize) {
      return $mdMedia(screenSize);
    }

    function removeSelected(ev) {
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
    }

    function showEditUserDialog(ev, user) {
      var useFullscreen = $mdMedia('xs');
      ev.stopPropagation(); // in case autoselect is enabled

      $mdDialog.show({
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        targetEvent: ev,
        clickOutsideToClose: true,
        controller: EditUserDialogController,
        controllerAs: 'dialogVm',
        locals: {
          user: user
        },
        fullscreen: $mdMedia('xs')
      });

      function EditUserDialogController (user) {
        var dialogVm = this,
          rolesString;

        dialogVm.authentication = vm.authentication;
        dialogVm.cancel = dialogCancel;
        dialogVm.destringifyRoles = vm.destringifyRoles;
        dialogVm.rolesOptions = vm.rolesOptions;
        dialogVm.stringifyRoles = vm.stringifyRoles;
        dialogVm.update = dialogUpdate;
        dialogVm.user = angular.extend({}, user);
        
        function dialogUpdate(isValid) {
          if (!isValid) {
            return false;
          }

          angular.extend(user, dialogVm.user);

          rolesString = user.rolesString;
          delete user.rolesString;
          user.$update(function () {
            user.rolesString = rolesString;
            $mdDialog.hide();
          }, function (errorResponse) {
            user.rolesString = rolesString;
            dialogVm.error = errorResponse.data.message;
          });
        }
      }
    }

    function showViewUserDialog(ev, user, provider) {
      ev.stopPropagation(); // in case autoselect is enabled

      $mdDialog.show({
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        targetEvent: ev,
        clickOutsideToClose: true,
        controller: ViewUserDialogController,
        controllerAs: 'dialogVm',
        locals: {
          user: user,
          provider: provider
        },
        fullscreen: $mdMedia('xs')
      });

      function ViewUserDialogController (user) {
        var dialogVm = this,
          rolesString;

        dialogVm.cancel = dialogCancel;
        dialogVm.provider = provider;
        dialogVm.stringifyRoles = vm.stringifyRoles;
        dialogVm.user = user;
      }
    }

    function stringifyRoles(user) {
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
    }

    function toggleFilter() {
      vm.pager.filterEnabled = !vm.pager.filterEnabled;

      if (!vm.pager.filterEnabled) {
        vm.pager.search = '';
      }
    }
  }
})();
