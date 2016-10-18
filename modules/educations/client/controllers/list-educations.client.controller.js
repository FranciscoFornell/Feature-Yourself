(function () {
  'use strict';

  angular
    .module('educations')
    .controller('EducationsListController', EducationsListController);

  EducationsListController.$inject = ['$scope', 'educationsService', '$translatePartialLoader', '$mdDialog', '$translate', '$q', '$mdMedia', '$mdEditDialog', '$mdToast', '$rootScope', 'profileListService', 'iconsService'];

  function EducationsListController($scope, educationsService, $translatePartialLoader, $mdDialog, $translate, $q, $mdMedia, $mdEditDialog, $mdToast, $rootScope, profileListService, iconsService) {
    var vm = this;

    vm.editName = editName;
    vm.isScreenSize = isScreenSize;
    vm.newEducation = newEducation;
    vm.removeSelected = removeSelected;
    vm.showEditEducationDialog = showEditEducationDialog;
    vm.showViewEducationDialog = showViewEducationDialog;
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
      $translatePartialLoader.addPart('educations');
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

      vm.promise = educationsService.query(function (data) {
        vm.educations = data;
      }).$promise;

      vm.profilesCollection = profileListService.data.profilesCollection;
      vm.profileIdsArray = profileListService.data.profileIdsArray;
    }

    function dialogCancel() {
      $mdDialog.cancel();
    }

    function editName(ev, education) {
      var editDialog = {
        modelValue: education.name[vm.currentLanguage],
        save: function (input) {
          education.name[vm.currentLanguage] = input.$modelValue;
          education.$update(function () {
            $translate('EDUCATION_UPDATE_SUCCESS')
              .then(function(translation){
                $mdToast.showSimple(translation);
              });
          }, function (err) {
            $mdToast.showSimple('ERROR:\n' + err.data);
            vm.promise = educationsService.query(function (data) {
              vm.educations = data;
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

    function newEducation (ev) {
      var Education = educationsService,
        education = new Education();

      vm.showEditEducationDialog(ev, education);
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
                if (vm.educations.indexOf(vm.selected[i]) !== -1){
                  vm.educations.splice(vm.educations.indexOf(vm.selected[i]), 1);
                }
              }
              vm.selected = [];
            });
        });
      }
    }

    function showEditEducationDialog(ev, education) {
      var useFullscreen = $mdMedia('xs');
      ev.stopPropagation(); // in case autoselect is enabled

      $mdDialog.show({
        templateUrl: 'modules/educations/client/views/edit-education.client.view.html',
        targetEvent: ev,
        clickOutsideToClose: true,
        controller: EditEducationDialogController,
        controllerAs: 'dialogVm',
        locals: {
          education: education
        },
        fullscreen: $mdMedia('xs')
      });

      function EditEducationDialogController ($scope, education) {
        var dialogVm = this;

        dialogVm.addProfile = addProfile;
        dialogVm.cancel = dialogCancel;
        dialogVm.filterProfilesNotAssigned = filterProfilesNotAssigned;
        dialogVm.update = dialogUpdate;

        activateDialog();

        function activateDialog() {
          dialogVm.currentLanguage = vm.currentLanguage;
          dialogVm.education = angular.merge({}, education);
          dialogVm.icons = iconsService.icons;
          dialogVm.isNewEducation = !education._id;
          dialogVm.profilesCollection = vm.profilesCollection;
          dialogVm.profileIdsArray = vm.profileIdsArray;
          dialogVm.searchText = '';

          $translate('SELECT_ICON').then(function(translation){
            dialogVm.iconsPlaceholder = translation;
          });

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

          if(dialogVm.isNewEducation) {
            dialogVm.education.educationType = 'ACADEMIC';
            dialogVm.education.profiles = [];
          }

          updateSelectLabel();
          $scope.$watch(
            'dialogVm.education.profiles.length', 
            function(newValue, oldValue) {
              updateSelectLabel();
            }
          );
        }

        function addProfile () {
          dialogVm.education.profiles.push(dialogVm.selectedProfile);
          dialogVm.selectedProfile = '';
        }
        
        function dialogUpdate(isValid) {
          if (!isValid) {
            return false;
          }

          angular.merge(education, dialogVm.education);
          education.profiles = dialogVm.education.profiles.slice();

          if (dialogVm.isNewEducation) {
            education.$save(saveSuccess, saveError);
          } else {
            education.$update(saveSuccess, saveError);            
          }          

          function saveError(errorResponse) {
            dialogVm.error = errorResponse.data.message;
          }

          function saveSuccess(shouldRefresh) {
            $translate('EDUCATION_UPDATE_SUCCESS')
              .then(function(translation){
                $mdToast.showSimple(translation);
              });
            $mdDialog.hide();
            if (dialogVm.isNewEducation) {
              vm.promise = educationsService.query(function (data) {
                vm.educations = data;
              }).$promise;
            }
          }
        }

        function filterProfilesNotAssigned (item) {
          return (dialogVm.education.profiles.indexOf(item) === -1);
        }

        function updateSelectLabel() {
          if (dialogVm.education.profiles.length === dialogVm.profileIdsArray.length) {
            dialogVm.selectLabel = 'NO_MORE_PROFILES_TO_ASSIGN';
          } else {
            dialogVm.selectLabel = 'SELECT_PROFILE_TO_ASSIGN';
          }
        }
      }
    }

    function showViewEducationDialog(ev, education) {
      ev.stopPropagation(); // in case autoselect is enabled

      $mdDialog.show({
        templateUrl: 'modules/educations/client/views/view-education.client.view.html',
        targetEvent: ev,
        clickOutsideToClose: true,
        controller: ViewEducationDialogController,
        controllerAs: 'dialogVm',
        locals: {
          education: education
        },
        fullscreen: $mdMedia('xs')
      });

      function ViewEducationDialogController (education) {
        var dialogVm = this;

        dialogVm.cancel = dialogCancel;

        activateDialog();

        function activateDialog() {
          dialogVm.profilesCollection = vm.profilesCollection;
          dialogVm.education = education;
          dialogVm.currentLanguage = vm.currentLanguage;
        }
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