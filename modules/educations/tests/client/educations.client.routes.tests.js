(function () {
  'use strict';

  describe('Educations Route Tests', function () {
    // Initialize global variables
    var $scope,
      EducationsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _EducationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      EducationsService = _EducationsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('educations');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/educations');
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
          EducationsController,
          mockEducation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('educations.view');
          $templateCache.put('modules/educations/client/views/view-education.client.view.html', '');

          // create mock Education
          mockEducation = new EducationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Education Name'
          });

          //Initialize Controller
          EducationsController = $controller('EducationsController as vm', {
            $scope: $scope,
            educationResolve: mockEducation
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:educationId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.educationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            educationId: 1
          })).toEqual('/educations/1');
        }));

        it('should attach an Education to the controller scope', function () {
          expect($scope.vm.education._id).toBe(mockEducation._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/educations/client/views/view-education.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          EducationsController,
          mockEducation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('educations.create');
          $templateCache.put('modules/educations/client/views/form-education.client.view.html', '');

          // create mock Education
          mockEducation = new EducationsService();

          //Initialize Controller
          EducationsController = $controller('EducationsController as vm', {
            $scope: $scope,
            educationResolve: mockEducation
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.educationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/educations/create');
        }));

        it('should attach an Education to the controller scope', function () {
          expect($scope.vm.education._id).toBe(mockEducation._id);
          expect($scope.vm.education._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/educations/client/views/form-education.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          EducationsController,
          mockEducation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('educations.edit');
          $templateCache.put('modules/educations/client/views/form-education.client.view.html', '');

          // create mock Education
          mockEducation = new EducationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Education Name'
          });

          //Initialize Controller
          EducationsController = $controller('EducationsController as vm', {
            $scope: $scope,
            educationResolve: mockEducation
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:educationId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.educationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            educationId: 1
          })).toEqual('/educations/1/edit');
        }));

        it('should attach an Education to the controller scope', function () {
          expect($scope.vm.education._id).toBe(mockEducation._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/educations/client/views/form-education.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
