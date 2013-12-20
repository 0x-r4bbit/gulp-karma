/*global describe, it, expect, ddescribe   */
'use strict';

describe('Demo2 test suite', function () {

  describe('ignored', function () {
    it('should be skipped', function () {
      expect(true).toBeTruthy();
    });
  });

  ddescribe('inner suite 1', function () {
    describe('inner suite 2', function () {
      it('should assert true 2', function () {
        expect(true).toBeTruthy();
      });
    });

    it('should assert true 1', function () {
      expect(true).toBeTruthy();
    });

    it('1 should assert true', function () {
      expect(true).toBeTruthy();
    });

    it('2 should fail', function () {
      expect(true).toBeFalsy();
    });

    it('3 should assert true', function () {
      expect(true).toBeTruthy();
    });

    it('4 should assert true', function () {
      expect(true).toBeTruthy();
    });

    it('5 should throw Error', function () {
      throw new TypeError('wayne');
    });
  });
});
