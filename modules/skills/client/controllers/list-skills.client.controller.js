(function () {
  'use strict';

  angular
    .module('skills')
    .controller('SkillsListController', SkillsListController);

  SkillsListController.$inject = ['$scope', 'skillsService', '$translatePartialLoader', '$mdDialog', '$translate', '$q', '$mdMedia', '$mdEditDialog', '$mdToast', '$rootScope', 'profileListService'];

  function SkillsListController($scope, skillsService, $translatePartialLoader, $mdDialog, $translate, $q, $mdMedia, $mdEditDialog, $mdToast, $rootScope, profileListService) {
    var vm = this;

    vm.editName = editName;
    vm.isScreenSize = isScreenSize;
    vm.newSkill = newSkill;
    vm.removeSelected = removeSelected;
    vm.showEditSkillDialog = showEditSkillDialog;
    vm.showViewSkillDialog = showViewSkillDialog;
    vm.toggleFilter = toggleFilter;
    vm.updateSkill = updateSkill;

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
      $translatePartialLoader.addPart('skills');
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

      vm.promise = skillsService.query(function (data) {
        vm.skills = data;
      }).$promise;

      vm.profilesCollection = profileListService.data.profilesCollection;
      vm.profileIdsArray = profileListService.data.profileIdsArray;
    }

    function dialogCancel() {
      $mdDialog.cancel();
    }

    function editName(ev, skill) {
      var editDialog = {
        modelValue: skill.name[vm.currentLanguage],
        save: function (input) {
          skill.name[vm.currentLanguage] = input.$modelValue;
          vm.updateSkill(skill);
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

    function isScreenSize(screenSize) {
      return $mdMedia(screenSize);
    }

    function newSkill (ev) {
      var Skill = skillsService,
        skill = new Skill();

      vm.showEditSkillDialog(ev, skill);
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
                if (vm.skills.indexOf(vm.selected[i]) !== -1){
                  vm.skills.splice(vm.skills.indexOf(vm.selected[i]), 1);
                }
              }
              vm.selected = [];
            });
        });
      }
    }

    function showEditSkillDialog(ev, skill) {
      var useFullscreen = $mdMedia('xs');
      ev.stopPropagation(); // in case autoselect is enabled

      $mdDialog.show({
        templateUrl: 'modules/skills/client/views/edit-skill.client.view.html',
        targetEvent: ev,
        clickOutsideToClose: true,
        controller: EditSkillDialogController,
        controllerAs: 'dialogVm',
        locals: {
          skill: skill
        },
        fullscreen: $mdMedia('xs')
      });

      function EditSkillDialogController ($scope, skill) {
        var dialogVm = this;

        dialogVm.addProfile = addProfile;
        dialogVm.cancel = dialogCancel;
        dialogVm.filterProfilesNotAssigned = filterProfilesNotAssigned;
        dialogVm.update = dialogUpdate;

        activateDialog();

        function activateDialog () {
          dialogVm.currentLanguage = vm.currentLanguage;
          dialogVm.isNewSkill = !skill._id;
          dialogVm.profilesCollection = vm.profilesCollection;
          dialogVm.profileIdsArray = vm.profileIdsArray;
          dialogVm.skill = angular.merge({}, skill);

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

          if(dialogVm.isNewSkill) {
            dialogVm.skill.level = 1;
            dialogVm.skill.profiles = [];
          }

          updateSelectLabel();
          $scope.$watch(
            'dialogVm.skill.profiles.length', 
            function(newValue, oldValue) {
              updateSelectLabel();
            }
          );
        }

        function addProfile () {
          dialogVm.skill.profiles.push(dialogVm.selectedProfile);
          dialogVm.selectedProfile = '';
        }

        function filterProfilesNotAssigned (item) {
          return (dialogVm.skill.profiles.indexOf(item) === -1);
        }

        function dialogUpdate(isValid) {
          if (!isValid) {
            return false;
          }

          angular.merge(skill, dialogVm.skill);
          skill.profiles = dialogVm.skill.profiles.slice();

          if (dialogVm.isNewSkill) {
            skill.$save(saveSuccess, saveError);
          } else {
            skill.$update(saveSuccess, saveError);            
          }

          function saveError(errorResponse) {
            dialogVm.error = errorResponse.data.message;
          }

          function saveSuccess(shouldRefresh) {
            $translate('SKILL_UPDATE_SUCCESS')
              .then(function(translation){
                $mdToast.showSimple(translation);
              });
            $mdDialog.hide();
            if (dialogVm.isNewSkill) {
              vm.promise = skillsService.query(function (data) {
                vm.skills = data;
              }).$promise;
            }
          }
        }

        function updateSelectLabel() {
          if (dialogVm.skill.profiles.length === dialogVm.profileIdsArray.length) {
            dialogVm.selectLabel = 'NO_MORE_PROFILES_TO_ASSIGN';
          } else {
            dialogVm.selectLabel = 'SELECT_PROFILE_TO_ASSIGN';
          }
        }
      }
    }

    function showViewSkillDialog(ev, skill) {
      ev.stopPropagation(); // in case autoselect is enabled

      $mdDialog.show({
        templateUrl: 'modules/skills/client/views/view-skill.client.view.html',
        targetEvent: ev,
        clickOutsideToClose: true,
        controller: ViewSkillDialogController,
        controllerAs: 'dialogVm',
        locals: {
          skill: skill
        },
        fullscreen: $mdMedia('xs')
      });

      function ViewSkillDialogController (skill) {
        var dialogVm = this;

        dialogVm.cancel = dialogCancel;

        activateDialog();

        function activateDialog () {
          dialogVm.profilesCollection = vm.profilesCollection;
          dialogVm.skill = skill;
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

    function updateSkill(skill) {
      skill.$update(function () {
        $translate('SKILL_UPDATE_SUCCESS')
          .then(function(translation){
            $mdToast.showSimple(translation);
          });
      }, function (err) {
        $mdToast.showSimple('ERROR:\n' + err.data);
        vm.promise = skillsService.query(function (data) {
          vm.skills = data;
        }).$promise;
      });
    }
  }
})();