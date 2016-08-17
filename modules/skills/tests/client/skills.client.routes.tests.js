(function () {
  'use strict';

  describe('Skills Route Tests', function () {
    // Initialize global variables
    var $scope,
      SkillsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SkillsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SkillsService = _SkillsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('skills');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/skills');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          SkillsController,
          mockSkill;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('skills.view');
          $templateCache.put('modules/skills/client/views/view-skill.client.view.html', '');

          // create mock Skill
          mockSkill = new SkillsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Skill Name'
          });

          //Initialize Controller
          SkillsController = $controller('SkillsController as vm', {
            $scope: $scope,
            skillResolve: mockSkill
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:skillId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.skillResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            skillId: 1
          })).toEqual('/skills/1');
        }));

        it('should attach an Skill to the controller scope', function () {
          expect($scope.vm.skill._id).toBe(mockSkill._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/skills/client/views/view-skill.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SkillsController,
          mockSkill;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('skills.create');
          $templateCache.put('modules/skills/client/views/form-skill.client.view.html', '');

          // create mock Skill
          mockSkill = new SkillsService();

          //Initialize Controller
          SkillsController = $controller('SkillsController as vm', {
            $scope: $scope,
            skillResolve: mockSkill
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.skillResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/skills/create');
        }));

        it('should attach an Skill to the controller scope', function () {
          expect($scope.vm.skill._id).toBe(mockSkill._id);
          expect($scope.vm.skill._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/skills/client/views/form-skill.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SkillsController,
          mockSkill;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('skills.edit');
          $templateCache.put('modules/skills/client/views/form-skill.client.view.html', '');

          // create mock Skill
          mockSkill = new SkillsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Skill Name'
          });

          //Initialize Controller
          SkillsController = $controller('SkillsController as vm', {
            $scope: $scope,
            skillResolve: mockSkill
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:skillId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.skillResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            skillId: 1
          })).toEqual('/skills/1/edit');
        }));

        it('should attach an Skill to the controller scope', function () {
          expect($scope.vm.skill._id).toBe(mockSkill._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/skills/client/views/form-skill.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
