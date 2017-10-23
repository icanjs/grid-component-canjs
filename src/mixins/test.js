import DefineMap from 'can-define/map/map';
import QUnit from 'steal-qunit';
import VM from '../view-model';
import mixin from './mixin-util';
import mixinSort from './sort';
import mixinCheckbox from './checkbox';
import mixinChildRows from './child-rows';
import mixinPagination from './pagination';
import mixinPaginationServer from './pagination-server';
import _ from 'lodash';

var vm;

QUnit.module('Grid viewModel', {
  beforeEach: function () {
    vm = new (DefineMap.extend({seal: false}, mixin(VM, mixinSort, mixinCheckbox, mixinChildRows)))();
  },

  afterEach: function () {
  }
});

QUnit.test('checkedRows', function (assert) {
  console.log(vm.rows.length);
  var count = 0;

  assert.equal(vm.checkedRows.length, 0, 'there should be 0 checkedRows');

  vm.bind('checkedRows', function (ev, newVal, oldVal) {
    if (newVal.hasChanged) {
      // console.log('- Has changed!');
      count++;
    }
    // console.log('- bind change ' + count, newVal, oldVal);
  });

  vm.rows.push({isChecked: true, val: 1});
  vm.rows.push({isChecked: false, val: 1});
  vm.rows.push({isChecked: true, val: 1});
  assert.equal(vm.rows.length, 3, 'there should be 3 items in rows');
  assert.equal(vm.checkedRows.length, 2, 'there should be 2 items in checkedRows');
  assert.equal(count, 2, 'checkedRows should have changed 2 times');

  vm.set('rows', [
    {isChecked: true, val: 1},
    {isChecked: true, val: 1},
    {isChecked: true, val: 1}
  ]);

  count = 0;
  // console.log('replacing rows with the same array');
  vm.set('rows', [
    {isChecked: true, val: 1},
    {isChecked: true, val: 1},
    {isChecked: true, val: 1}
  ]);
  assert.equal(count, 0, 'should be 0 changes if rows is replaced with the same array');

  count = 0;
  // console.log('replacing rows with a different array of the same length');
  vm.set('rows', [
    {isChecked: true, val: 1},
    {isChecked: true, val: 2},
    {isChecked: true, val: 1}
  ]);
  assert.equal(vm.checkedRows.length, 3, 'there should be 3 items in checkedRows');
  assert.equal(count, 1, 'should be 1 change if rows is replaced with a different array of the same length');

  vm.set('rows', []);

  count = 0;
  // console.log('replacing rows with a different array of the same length');
  vm.rows.push({isChecked: false, val: 1});
  assert.equal(vm.checkedRows.length, 0, 'there should be 0 items in checkedRows');
  assert.equal(count, 0, 'checkedRows should have changed 0 times for an empty array');
});

QUnit.test('Mixin child-rows', function (assert) {
  vm.set('rows', [
    {val: 1, childrenVisible: false},
    {val: 2, childrenVisible: false},
    {val: 3, childrenVisible: false}
  ]);
  assert.notOk(vm.rows[0].childrenVisible, '1st row\' children are hidden');
  vm.toggleChildrenVisible(vm.rows[0]);
  assert.ok(vm.rows[0].childrenVisible, '1st row\' children should become visible');

  vm.toggleAllChildrenVisible();
  assert.equal(vm.rows.filter(a => a.childrenVisible).length, vm.rows.length, 'All rows should have children visible');

  vm.toggleAllChildrenVisible();
  assert.equal(vm.rows.filter(a => a.childrenVisible).length, 0, 'No rows should have children visible');
});

QUnit.test('Mixin local pagination', function (assert) {
  var vm = new (DefineMap.extend(mixinPagination))({
    rows: _.times(24, i => i),
    pagination: 10
  });

  assert.equal(vm.rowsPerPage, 10, 'rowsPerPage is 10');
  assert.equal(vm.totalPages, 3, 'totalPages is 3');
  assert.equal(vm.hasPages, true, 'More than 1 page, show nav');
  assert.deepEqual(vm.pagedRows.get(), _.times(10, i => i), 'should show 1st 10 rows');
  assert.equal(vm.isPrevActive, false, 'Prev is inactive');

  // page 1:
  vm.next();
  assert.deepEqual(vm.pagedRows.get(), _.times(10, i => i + 10), 'should show 2nd 10 rows');
  assert.equal(vm.isNextActive, true, 'Next is active');
  assert.equal(vm.isPrevActive, true, 'Prev is active');

  // page 2:
  vm.next();
  assert.deepEqual(vm.pagedRows.get(), _.times(4, i => i + 20), 'should show last 4 rows');
  assert.equal(vm.isNextActive, false, 'Next is inactive');

  vm.next();
  assert.equal(vm.currentPage, 2, 'last page should stay #2');

  // page1:
  vm.prev();
  assert.equal(vm.currentPage, 1, 'prev should move currentPage to #1');

  // page 0:
  vm.prev();
  vm.prev();
  vm.prev();
  assert.equal(vm.currentPage, 0, '3 x prev should move and keep currentPage to #0');

  vm.changePage(2);
  assert.equal(vm.currentPage, 2, 'Change page to 2');
});

QUnit.test('Mixin local pagination 2', function (assert) {
  var vm = new (DefineMap.extend(mixinPagination))({
    rows: _.times(24, i => i),
    pagination: 25
  });

  // page 0:
  assert.equal(vm.rowsPerPage, 25, 'rowsPerPage is 25');
  assert.equal(vm.currentPage, 0, 'currentPage is 0');
  assert.equal(vm.totalPages, 1, 'totalPages is 1');
  assert.equal(vm.hasPages, false, 'Only 1 page, hide nav');
});

QUnit.test('Mixin server pagination', function (assert) {
  var vm = new (DefineMap.extend(mixinPaginationServer))({
    rows: _.times(100, i => i),
    pagination: new (DefineMap.extend({
      skip: 'number',
      limit: 'number',
      total: 'number'
    }))({
      skip: 0,
      limit: 10,
      total: 100
    })
  });

  assert.equal(vm.rowsPerPage, 10, 'rowsPerPage is 10');
  assert.equal(vm.currentPage, 0, 'currentPage is 0');
  assert.equal(vm.hasPages, true, 'hasPages is true');
  assert.equal(vm.isNextActive, true, 'isNextActive true for the page 0');
  assert.equal(vm.isPrevActive, false, 'isNextActive false for the page 0');
  vm.pagination.skip = 10;
  assert.equal(vm.currentPage, 1, 'currentPage is 1 after skipping 10');
  vm.pagination.skip = 90;
  assert.equal(vm.currentPage, 9, 'currentPage is 9 after skipping 90');
  vm.pagination.skip = 10;
  vm.next();
  assert.equal(vm.currentPage, 2, 'currentPage is 2 after next()');
  vm.prev();
  assert.equal(vm.currentPage, 1, 'currentPage is 1 after prev()');
  vm.changePage(5);
  assert.equal(vm.currentPage, 5, 'currentPage is 4 after changePage(5)');
  vm.changePage(9);
  assert.equal(vm.isNextActive, false, 'isNextActive false for the page 9');
  assert.equal(vm.isPrevActive, true, 'isNextActive true for the page 9');
});

QUnit.test('Mixin server pagination', function (assert) {
  var vm = new (DefineMap.extend(mixinPaginationServer))({
    rows: _.times(100, i => i),
    pagination: new (DefineMap.extend({
      skip: 'number',
      limit: 'number',
      total: 'number'
    }))({
      skip: 0,
      limit: 10,
      total: 100
    }),
    pagesVisibleNumber: 3
  });

  assert.equal(vm.pages.length, 10, 'number of pages should be 10');
  assert.equal(vm.pages[0].pageNumber, 0, 'the 1st pages should be 0');
  assert.equal(vm.pagesCurrentSection, 0, 'currentSection should be 0');
  assert.equal(vm.pagesVisible.length, 3, 'number of pagesVisible is 3');
  assert.equal(vm.pagesVisible[0].pageNumber, 0, 'the 1st pagesVisible should be 0');
  assert.equal(vm.isLeftEllipsisShown, false, 'isLeftEllipsisShown should be false');
  assert.equal(vm.isRightEllipsisShown, true, 'isRightEllipsisShown should be true');

  vm.pagination.skip = 10
  assert.equal(vm.pagesCurrentSection, 0, 'currentSection should be 0 after skip=10');
  assert.equal(vm.pagesVisible[0].pageNumber, 0, 'the 1st pagesVisible should be 0');
  assert.equal(vm.isLeftEllipsisShown, false, 'isLeftEllipsisShown should be false');
  assert.equal(vm.isRightEllipsisShown, true, 'isRightEllipsisShown should be true');

  vm.pagination.skip = 30
  assert.equal(vm.pagesCurrentSection, 1, 'currentSection should be 1 after skip=30');
  assert.equal(vm.pagesVisible[0].pageNumber, 3, 'the 1st pagesVisible should be 3');
  assert.equal(vm.isLeftEllipsisShown, true, 'isLeftEllipsisShown should be true');
  assert.equal(vm.isRightEllipsisShown, true, 'isRightEllipsisShown should be true');

  vm.pagination.skip = 60
  assert.equal(vm.pagesCurrentSection, 2, 'currentSection should be 2 after skip=60');
  assert.equal(vm.pagesVisible[0].pageNumber, 6, 'the 1st pagesVisible should be 6');
  assert.equal(vm.pagesVisible[1].pageNumber, 7, 'the 2nd pagesVisible should be 7');

  vm.pagination.skip = 90
  assert.equal(vm.isLeftEllipsisShown, true, 'isLeftEllipsisShown should be true when skip=90');
  assert.equal(vm.isRightEllipsisShown, false, 'isRightEllipsisShown should be false when skip=90');
});
