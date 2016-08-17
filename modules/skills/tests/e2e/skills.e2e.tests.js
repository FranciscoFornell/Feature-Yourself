'use strict';

describe('Skills E2E Tests:', function () {
  describe('Test Skills page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/skills');
      expect(element.all(by.repeater('skill in skills')).count()).toEqual(0);
    });
  });
});
