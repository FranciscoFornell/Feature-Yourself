(function () {
  'use strict';

  angular
    .module('profiles')
    .controller('ProfilesListController', ProfilesListController);

  ProfilesListController.$inject = ['profilesService', '$translatePartialLoader', '$mdDialog', '$translate', '$q', '$mdMedia', '$mdEditDialog', '$mdToast', '$rootScope'];

  function ProfilesListController(profilesService, $translatePartialLoader, $mdDialog, $translate, $q, $mdMedia, $mdEditDialog, $mdToast, $rootScope) {
    var vm = this;

    vm.editName = editName;
    vm.isScreenSize = isScreenSize;
    vm.newProfile = newProfile;
    vm.removeSelected = removeSelected;
    vm.showEditProfileDialog = showEditProfileDialog;
    vm.showViewProfileDialog = showViewProfileDialog;
    vm.toggleFilter = toggleFilter;

    activate();

    function activate() {
      vm.pager = {
        order: 'name',
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
      $translatePartialLoader.addPart('profiles');
      vm.currentLanguage = $translate.proposedLanguage() || $translate.use();
      $rootScope.$on('$translateChangeSuccess', function(){
        vm.currentLanguage = $translate.proposedLanguage() || $translate.use();
      });

      // Automaticaly adjust the initial rows per page
      if ($mdMedia('(min-height: 1010px)')){
        vm.pager.limit = 15;
      } else if ($mdMedia('(min-height: 800px)')){
        vm.pager.limit = 10;
      }

      vm.promise = profilesService.query(function (data) {
        vm.profiles = data;
      }).$promise;
    }

    function dialogCancel() {
      $mdDialog.cancel();
    }

    function editName(ev, profile) {
      var editDialog = {
        modelValue: profile.name[vm.currentLanguage],
        save: function (input) {
          profile.name[vm.currentLanguage] = input.$modelValue;
          profile.$update(function () {
            $translate('PROFILE_UPDATE_SUCCESS')
              .then(function(translation){
                $mdToast.showSimple(translation);
              });
          }, function (err) {
            $mdToast.showSimple('ERROR:\n' + err.data);
            vm.promise = profilesService.query(function (data) {
              vm.profiles = data;
            }).$promise;
          });
        },
        targetEvent: ev,
        validators: {
          'required': true
        }
      };

      ev.stopPropagation(); // in case autoselect is enabled

      $mdEditDialog.small(editDialog);
    }

    function isScreenSize(screenSize) {
      return $mdMedia(screenSize);
    }

    function newProfile (ev) {
      var Profile = profilesService,
        profile = new Profile();

      vm.showEditProfileDialog(ev, profile);
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
                if (vm.profiles.indexOf(vm.selected[i]) !== -1){
                  vm.profiles.splice(vm.profiles.indexOf(vm.selected[i]), 1);
                }
              }
              vm.selected = [];
            });
        });
      }
    }

    function showEditProfileDialog(ev, profile) {
      var useFullscreen = $mdMedia('xs');
      ev.stopPropagation(); // in case autoselect is enabled

      $mdDialog.show({
        templateUrl: 'modules/profiles/client/views/edit-profile.client.view.html',
        targetEvent: ev,
        clickOutsideToClose: true,
        controller: EditProfileDialogController,
        controllerAs: 'dialogVm',
        locals: {
          profile: profile
        },
        fullscreen: $mdMedia('xs')
      });

      function EditProfileDialogController ($scope, profile) {
        var dialogVm = this;

        dialogVm.cancel = dialogCancel;
        dialogVm.update = dialogUpdate;
        dialogVm.profile = angular.merge({}, profile);
        dialogVm.isNewProfile = !profile._id;
        dialogVm.currentLanguage = vm.currentLanguage;

        activateDialog();

        function activateDialog () {
          if (vm.currentLanguage === 'en') {
            dialogVm.tinymceLanguage = 'en_GB';
          } else if (vm.currentLanguage === 'es') {
            dialogVm.tinymceLanguage = 'es';
          }

          dialogVm.tinymceLanguageUrl = '/lib/tinymce-langs/';
          dialogVm.tinymceLanguageUrl += dialogVm.tinymceLanguage;
          dialogVm.tinymceLanguageUrl += '.js';

          dialogVm.tinymceOptions = {
            language: dialogVm.tinymceLanguage,
            language_url: dialogVm.tinymceLanguageUrl,
            menubar: false,
            plugins: 'textcolor nonbreaking',
            toolbar1: 'bold italic underline forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist indent outdent',
            nonbreaking_force_tab: true,
            content_style: 'p { text-indent: 2em; }'
          };
        }
        
        function dialogUpdate(isValid) {
          if (!isValid) {
            return false;
          }

          angular.merge(profile, dialogVm.profile);

          if (dialogVm.isNewProfile) {
            profile.$save(saveSuccess, saveError);
          } else {
            profile.$update(saveSuccess, saveError);            
          }          

          function saveError(errorResponse) {
            dialogVm.error = errorResponse.data.message;
          }

          function saveSuccess(shouldRefresh) {
            $translate('PROFILE_UPDATE_SUCCESS')
              .then(function(translation){
                $mdToast.showSimple(translation);
              });
            $mdDialog.hide();
            if (dialogVm.isNewProfile) {
              vm.promise = profilesService.query(function (data) {
                vm.profiles = data;
              }).$promise;
            }
          }
        }
      }
    }

    function showViewProfileDialog(ev, profile) {
      ev.stopPropagation(); // in case autoselect is enabled

      $mdDialog.show({
        templateUrl: 'modules/profiles/client/views/view-profile.client.view.html',
        targetEvent: ev,
        clickOutsideToClose: true,
        controller: ViewProfileDialogController,
        controllerAs: 'dialogVm',
        locals: {
          profile: profile
        },
        fullscreen: $mdMedia('xs')
      });

      function ViewProfileDialogController ($scope, profile) {
        var dialogVm = this;

        dialogVm.cancel = dialogCancel;
        dialogVm.profile = profile;
        dialogVm.currentLanguage = vm.currentLanguage;
      }
    }

    function toggleFilter() {
      vm.pager.filterEnabled = !vm.pager.filterEnabled;

      if (!vm.pager.filterEnabled) {
        vm.pager.search = '';
      }
    }
  }
})();