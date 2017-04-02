import QUnit from 'steal-qunit';
import mixin, { deepMixin } from '../src/mixins/mixin-util';

QUnit.module('Mixin Utils', {
  beforeEach: function () {
  },

  afterEach: function () {
  }
});

QUnit.test('deepMixin', function (assert) {
  const obj1 = {
    a: 5,
    b: 'abc',
    c: {
      d: 6,
      e: 'def',
      f: {g: 'ghi'}
    }
  };
  const obj2 = {
    a: 15,
    c: {
      d: 16,
      f: {g: '1ghi'}
    }
  };
  const expected = {
    a: 15,
    b: 'abc',
    c: {
      d: 16,
      e: 'def',
      f: {g: '1ghi'}
    }
  };

  assert.deepEqual(deepMixin(obj1, obj2), expected, 'complex');
  assert.deepEqual(deepMixin({a: 5}, {b: 6}), {a: 5, b: 6}, 'simple');
  assert.deepEqual(deepMixin({a: 5, b: 7}, {b: 6}), {a: 5, b: 6}, 'simple2');
  assert.deepEqual(deepMixin({a: 5, b: {c: true, d: 8}}, {b: {c: false}}), {a: 5, b: {c: false, d: 8}}, 'simple bool');
});
QUnit.test('mixin', function (assert) {
  const obj1 = {
    a: 5,
    b: 'abc',
    c: {
      d: 6,
      e: 'def',
      f: {g: 'ghi'}
    }
  };
  const obj2 = {
    a: 15,
    c: {
      d: 16,
      f: {g: '1ghi'}
    }
  };
  const expected = {
    a: 15,
    b: 'abc',
    c: {
      d: 116,
      e: 'def',
      f: {g: '1ghi'}
    }
  };

  assert.deepEqual(mixin({a: 5}, {b: 6}, {c: 7}), {a: 5, b: 6, c: 7}, 'simple mixin({a:5}, {b:6},{c:7})');
  assert.deepEqual(mixin({a: 5, b: {c: 6}}, {a: 15}, {b: {c: 116}}), {a: 15, b: {c: 116}}, 'simple mixin({a:5,b:{c:6}}, {a:15},{b:{c:116}})');
  assert.deepEqual(mixin(obj1, obj2, {c: {d: 116}}), expected, 'complex');
});
