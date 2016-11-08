(function() {
  'use strict';

  angular
  	.module('core')
  	.controller('HomeController', HomeController);

  HomeController.$inject = ['$timeout', '$rootScope', 'profilesService', 'usersService', '$translate', '$http', '$stateParams', 'socialProvidersService', '$mdDialog', '$mdMedia', 'dateTimeUtilsService', '$q'];

  function HomeController ($timeout, $rootScope, profilesService, usersService, $translate, $http, $stateParams, socialProvidersService, $mdDialog, $mdMedia, dateTimeUtilsService, $q) {
    var vm = this;

    vm.filterLT = filterLT;
    vm.params = $stateParams;
    vm.providersCollection = socialProvidersService.providersCollection;
    vm.viewEducation = viewEducation;
    vm.viewExperience = viewExperience;
    vm.viewProfilePic = viewProfilePic;
    vm.viewSkill = viewSkill;

    activate();

    function activate() {
      vm.currentLanguage = $translate.proposedLanguage() || $translate.use();
      $rootScope.$on('$translateChangeSuccess', function(){
        vm.currentLanguage = $translate.proposedLanguage() || $translate.use();
      });
      
      vm.showSplash = true;
      vm.loadingData = true;
      $q.all([
        usersService.getLocalUser(),
        profilesService.getProfilesWithData(
          vm.params.singleProfile ? vm.params.profile : null
        )
      ])
        .then(function(responses) {
          vm.localUserData = responses[0].data;
          vm.profiles = responses[1].data;
          if(!vm.localUserData.exists){
            vm.noUser = true;
          }
          vm.noProfiles = !vm.profiles.length;
          vm.loadingData = false;
          if(!(vm.noProfiles || vm.noUser)){
            vm.showSplash = false;
          }
        })
        .catch(function(response) {
          vm.loadingData = false;
          vm.error = response.status;
          vm.errorMessage = response.data.message;
        });
    }

    function dialogCancel() {
      $mdDialog.cancel();
    }

    // "Less than" comparator for "filter" filters 
    function filterLT(actual, expected) {
      return actual < expected;
    }

    function viewEducation(ev, education) {
      $mdDialog.show({
        templateUrl: 'modules/core/client/views/dialogs/view-home-education.client.view.html',
        targetEvent: ev,
        clickOutsideToClose: true,
        controller: ViewHomeEducationDialogController,
        controllerAs: 'dialogVm',
        locals: {
          education: education
        },
        fullscreen: $mdMedia('xs')
      });

      function ViewHomeEducationDialogController ($scope, education) {
        var dialogVm = this;

        dialogVm.cancel = dialogCancel;
        dialogVm.currentLanguage = vm.currentLanguage;
        dialogVm.education = education;
        dialogVm.title = 'EDUCATION_DETAIL';
      }
    }

    function viewExperience(ev, experience) {
      $mdDialog.show({
        templateUrl: 'modules/core/client/views/dialogs/view-home-experience.client.view.html',
        targetEvent: ev,
        clickOutsideToClose: true,
        controller: ViewHomeExperienceDialogController,
        controllerAs: 'dialogVm',
        locals: {
          experience: experience
        },
        fullscreen: $mdMedia('xs')
      });

      function ViewHomeExperienceDialogController ($scope, experience) {
        var dialogVm = this;

        dialogVm.cancel = dialogCancel;

        dialogVm.currentLanguage = vm.currentLanguage;
        dialogVm.experience = experience;
        dialogVm.title = 'EXPERIENCE_DETAIL';
        if(dialogVm.experience.duration && dialogVm.experience.duration.start && dialogVm.experience.duration.end) {
          dialogVm.durationInfo = dateTimeUtilsService.getDurationInfo(
            new Date(dialogVm.experience.duration.start),
            new Date(dialogVm.experience.duration.end)
          );
        }
      }
    }

    function viewProfilePic(ev, picture) {
      var borderRadius = {
        value: '50%'
      };

      $mdDialog.show({
        templateUrl: 'modules/core/client/views/dialogs/view-pic-dialog.client.view.html',
        targetEvent: ev,
        clickOutsideToClose: true,
        controller: ViewProfilePicDialogController,
        controllerAs: 'dialogVm',
        locals: {
          picture: picture,
          borderRadius: borderRadius
        },
        onRemoving: function () {
          borderRadius.value = '50%';
        },
        fullscreen: $mdMedia('xs')
      });

      function ViewProfilePicDialogController ($scope, picture, borderRadius) {
        var dialogVm = this;

        dialogVm.cancel = dialogCancel;
        dialogVm.currentLanguage = vm.currentLanguage;
        dialogVm.picture = picture;
        dialogVm.title = 'IMAGE_VIEWER';
        dialogVm.imageStyle = {
          'background': 'url(' + dialogVm.picture + ')',
          'background-size': 'contain',
          'background-repeat': 'no-repeat',
          'background-position': 'center'
        };
        dialogVm.borderRadius = borderRadius;
        $timeout(function(){
          dialogVm.borderRadius.value = '0';
        }, 0);
      }
    }

    function viewSkill(ev, skill) {
      $mdDialog.show({
        templateUrl: 'modules/core/client/views/dialogs/view-home-skill.client.view.html',
        targetEvent: ev,
        clickOutsideToClose: true,
        controller: ViewHomeSkillDialogController,
        controllerAs: 'dialogVm',
        locals: {
          skill: skill
        },
        fullscreen: $mdMedia('xs')
      });

      function ViewHomeSkillDialogController ($scope, skill) {
        var dialogVm = this;

        dialogVm.cancel = dialogCancel;
        dialogVm.currentLanguage = vm.currentLanguage;
        dialogVm.skill = skill;
        dialogVm.title = 'SKILL_DETAIL';
      }
    }
  }
})();