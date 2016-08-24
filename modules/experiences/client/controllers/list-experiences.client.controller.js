(function () {
  'use strict';

  angular
    .module('experiences')
    .controller('ExperiencesListController', ExperiencesListController);

  ExperiencesListController.$inject = ['$scope', 'experiencesService', '$translatePartialLoader', '$mdDialog', '$translate', '$q', '$mdMedia', '$mdEditDialog', '$mdToast', '$rootScope', 'profileListService', 'dateTimeUtilsService'];

  function ExperiencesListController($scope, experiencesService, $translatePartialLoader, $mdDialog, $translate, $q, $mdMedia, $mdEditDialog, $mdToast, $rootScope, profileListService, dateTimeUtilsService) {
    var vm = this;

    vm.editName = editName;
    vm.editPosition = editPosition;
    vm.isScreenSize = isScreenSize;
    vm.newExperience = newExperience;
    vm.removeSelected = removeSelected;
    vm.showEditExperienceDialog = showEditExperienceDialog;
    vm.showViewExperienceDialog = showViewExperienceDialog;
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
      $translatePartialLoader.addPart('experiences');
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

      vm.promise = experiencesService.query(function (data) {
        vm.experiences = data;
      }).$promise;

      vm.profilesCollection = profileListService.data.profilesCollection;
      vm.profileIdsArray = profileListService.data.profileIdsArray;
    }

    function dialogCancel() {
      $mdDialog.cancel();
    }

    function editName(ev, experience) {
      var editDialog = {
        modelValue: experience.name[vm.currentLanguage],
        save: function (input) {
          experience.name[vm.currentLanguage] = input.$modelValue;
          experience.$update(function () {
            $translate('EXPERIENCE_UPDATE_SUCCESS')
              .then(function(translation){
                $mdToast.showSimple(translation);
              });
          }, function (err) {
            $mdToast.showSimple('ERROR:\n' + err.data);
            vm.promise = experiencesService.query(function (data) {
              vm.experiences = data;
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

    function editPosition(ev, experience) {
      var editDialog = {
        modelValue: experience.position[vm.currentLanguage],
        save: function (input) {
          experience.position[vm.currentLanguage] = input.$modelValue;
          experience.$update(function () {
            $translate('EXPERIENCE_UPDATE_SUCCESS')
              .then(function(translation){
                $mdToast.showSimple(translation);
              });
          }, function (err) {
            $mdToast.showSimple('ERROR:\n' + err.data);
            vm.promise = experiencesService.query(function (data) {
              vm.experiences = data;
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

    function newExperience (ev) {
      var Experience = experiencesService,
        experience = new Experience();

      vm.showEditExperienceDialog(ev, experience);
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
                if (vm.experiences.indexOf(vm.selected[i]) !== -1){
                  vm.experiences.splice(vm.experiences.indexOf(vm.selected[i]), 1);
                }
              }
              vm.selected = [];
            });
        });
      }
    }

    function showEditExperienceDialog(ev, experience) {
      var useFullscreen = $mdMedia('xs');
      ev.stopPropagation(); // in case autoselect is enabled

      $mdDialog.show({
        templateUrl: 'modules/experiences/client/views/edit-experience.client.view.html',
        targetEvent: ev,
        clickOutsideToClose: true,
        controller: EditExperienceDialogController,
        controllerAs: 'dialogVm',
        locals: {
          experience: experience
        },
        fullscreen: $mdMedia('xs')
      });

      function EditExperienceDialogController ($scope, experience) {
        var dialogVm = this;

        dialogVm.addProfile = addProfile;
        dialogVm.cancel = dialogCancel;
        dialogVm.preventDefaultEvent = preventDefaultEvent;
        dialogVm.update = dialogUpdate;
        dialogVm.filterProfilesNotAssigned = filterProfilesNotAssigned;

        activateDialog();

        function activateDialog() {
          dialogVm.experience = angular.merge({}, experience);
          dialogVm.isNewExperience = !experience._id;
          dialogVm.currentLanguage = vm.currentLanguage;
          dialogVm.profilesCollection = vm.profilesCollection;
          dialogVm.profileIdsArray = vm.profileIdsArray;

          if (vm.currentLanguage === 'en') {
            dialogVm.tinymceLanguage = 'en_GB';
          } else if (vm.currentLanguage === 'es') {
            dialogVm.tinymceLanguage = 'es';
          }

          dialogVm.tinymceLanguageUrl = '/lib/tinymce-dist/js/langs/';
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

          if(dialogVm.isNewExperience) {
            dialogVm.experience.projects = [];
            dialogVm.experience.profiles = [];
            dialogVm.experience.duration = {};
            dialogVm.experience.mainAssignments = [];
          } else {
            dialogVm.experience.mainAssignments = experience.mainAssignments.map(convertI18nToString);
            $scope.$watch(
              'dialogVm.experience.mainAssignments.length', 
              function(newValue, oldValue) {
                var newElement = {},
                  index;

                if(newValue > oldValue) {
                  newElement[dialogVm.currentLanguage] = dialogVm.experience.mainAssignments[newValue - 1];
                  experience.mainAssignments.push(newElement);
                } else {
                  for(index = 0; index < newValue; index++) {
                    if (dialogVm.experience.mainAssignments.indexOf(experience.mainAssignments[index][dialogVm.currentLanguage]) === -1) {
                      experience.mainAssignments.splice(index, 1);
                    }
                  }
                }
              }
            );
            $scope.$watch(
              'dialogVm.experience.mainAssignments.length === 0', 
              function(newValue, oldValue) {
                if(newValue) {
                  experience.mainAssignments = [];
                }
              }
            );
          }

          updateSelectLabel();
          $scope.$watch(
            'dialogVm.experience.profiles.length', 
            function(newValue, oldValue) {
              updateSelectLabel();
            }
          );

          if (dialogVm.experience.duration) {
            if (!!dialogVm.experience.duration.start) {
              dialogVm.experience.duration.start = new Date(dialogVm.experience.duration.start);
            } else {
              delete dialogVm.experience.duration.start;
            }
            if (!!dialogVm.experience.duration.end) {
              dialogVm.experience.duration.end = new Date(dialogVm.experience.duration.end);
            } else {
              delete dialogVm.experience.duration.end;
            }
          }
        }

        function addProfile() {
          dialogVm.experience.profiles.push(dialogVm.selectedProfile);
          dialogVm.selectedProfile = '';
        }

        function convertI18nToString(element) {
          return element[dialogVm.currentLanguage];
        }

        function convertStringToI18n(element) {
          var newElement = {};

          newElement[dialogVm.currentLanguage] = element;
          return newElement;
        }
        
        function dialogUpdate(isValid) {
          var i,
            l = dialogVm.experience.mainAssignments.length;

          if (!isValid) {
            return false;
          }

          dialogVm.experience.mainAssignments = dialogVm.experience.mainAssignments.map(convertStringToI18n);
          angular.merge(experience, dialogVm.experience);
          experience.profiles = dialogVm.experience.profiles.slice();
          experience.projects = dialogVm.experience.projects.slice();
          if (dialogVm.isNewExperience) {
            experience.mainAssignments = dialogVm.experience.mainAssignments.slice();
          } else {
            for(i = 0; i < l; i++) {
              experience.mainAssignments[i][dialogVm.currentLanguage] = dialogVm.experience.mainAssignments[i][dialogVm.currentLanguage];
            }
          }

          if (dialogVm.isNewExperience) {
            experience.$save(saveSuccess, saveError);
          } else {
            experience.$update(saveSuccess, saveError);            
          }

          function saveError(errorResponse) {
            dialogVm.error = errorResponse.data.message;
          }

          function saveSuccess(shouldRefresh) {
            $translate('EXPERIENCE_UPDATE_SUCCESS')
              .then(function(translation){
                $mdToast.showSimple(translation);
              });
            $mdDialog.hide();
            if (dialogVm.isNewExperience) {
              vm.promise = experiencesService.query(function (data) {
                vm.experiences = data;
              }).$promise;
            }
          }
        }

        function filterProfilesNotAssigned (item) {
          return (dialogVm.experience.profiles.indexOf(item) === -1);
        }

        function preventDefaultEvent(event) {
          event.preventDefault();
        }

        function updateSelectLabel() {
          if (dialogVm.experience.profiles.length === dialogVm.profileIdsArray.length) {
            dialogVm.selectLabel = 'NO_MORE_PROFILES_TO_ASSIGN';
          } else {
            dialogVm.selectLabel = 'SELECT_PROFILE_TO_ASSIGN';
          }
        }
      }
    }

    function showViewExperienceDialog(ev, experience) {
      ev.stopPropagation(); // in case autoselect is enabled

      $mdDialog.show({
        templateUrl: 'modules/experiences/client/views/view-experience.client.view.html',
        targetEvent: ev,
        clickOutsideToClose: true,
        controller: ViewExperienceDialogController,
        controllerAs: 'dialogVm',
        locals: {
          experience: experience
        },
        fullscreen: $mdMedia('xs')
      });

      function ViewExperienceDialogController ($scope, experience) {
        var dialogVm = this;

        dialogVm.cancel = dialogCancel;

        activateDialog();

        function activateDialog() {
          dialogVm.profilesCollection = vm.profilesCollection;
          dialogVm.experience = experience;
          dialogVm.currentLanguage = vm.currentLanguage;
          if(dialogVm.experience.duration && dialogVm.experience.duration.start && dialogVm.experience.duration.end) {
            dialogVm.durationInfo = dateTimeUtilsService.getDurationInfo(
              new Date(dialogVm.experience.duration.start),
              new Date(dialogVm.experience.duration.end)
            );
          }
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