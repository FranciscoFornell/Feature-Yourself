'use strict';

describe('Experiences E2E Tests:', function () {
  describe('Test Experiences page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/experiences');
      expect(element.all(by.repeater('experience in experiences')).count()).toEqual(0);
    });
  });
});
