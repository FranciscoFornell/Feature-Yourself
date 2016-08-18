'use strict';

describe('Educations E2E Tests:', function () {
  describe('Test Educations page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/educations');
      expect(element.all(by.repeater('education in educations')).count()).toEqual(0);
    });
  });
});
