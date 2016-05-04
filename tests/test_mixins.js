import QUnit from 'steal-qunit';
import VM from '../src/view-model';
import mixin from '../src/mixins/mixin-util';
import mixinSort from '../src/mixins/sort';
import { mixinSortHelpers } from '../src/mixins/sort';
import mixinCheckbox from '../src/mixins/checkbox';
import mixinChildRows from '../src/mixins/child-rows';

var vm;

QUnit.module('Grid viewModel', {
  beforeEach: function() {
    vm = new (can.Map.extend(mixin(VM, mixinSort, mixinCheckbox, mixinChildRows)))();
  },

  afterEach: function() {
  }
});

QUnit.test('checkedRows', function(assert) {
  //console.log(vm.attr('rows.length'));
  var count = 0;

  assert.equal(vm.attr('checkedRows.length'), 0, 'there should be 0 checkedRows');

  vm.bind('checkedRows', function(ev, newVal, oldVal){
    if (newVal.hasChanged) {
      //console.log('- Has changed!');
      count++;
    }
    //console.log('- bind change ' + count, newVal, oldVal);
  });

  vm.attr('rows').push({isChecked: true, val: 1});
  vm.attr('rows').push({isChecked: false, val: 1});
  vm.attr('rows').push({isChecked: true, val: 1});
  assert.equal(vm.attr('rows.length'), 3, 'there should be 3 items in rows');
  assert.equal(vm.attr('checkedRows.length'), 2, 'there should be 2 items in checkedRows');
  assert.equal(count, 2, 'checkedRows should have changed 2 times');


  vm.attr('rows', [
    {isChecked: true, val: 1},
    {isChecked: true, val: 1},
    {isChecked: true, val: 1}
  ]);

  count = 0;
  //console.log('replacing rows with the same array');
  vm.attr('rows', [
    {isChecked: true, val: 1},
    {isChecked: true, val: 1},
    {isChecked: true, val: 1}
  ]);
  assert.equal(count, 0, 'should be 0 changes if rows is replaced with the same array');


  count = 0;
  //console.log('replacing rows with a different array of the same length');
  vm.attr('rows', [
    {isChecked: true, val: 1},
    {isChecked: true, val: 2},
    {isChecked: true, val: 1}
  ]);
  assert.equal(vm.attr('checkedRows.length'), 3, 'there should be 3 items in checkedRows');
  assert.equal(count, 1, 'should be 1 change if rows is replaced with a different array of the same length');

  vm.attr('rows', []);

  count = 0;
  //console.log('replacing rows with a different array of the same length');
  vm.attr('rows').push({isChecked: false, val: 1});
  assert.equal(vm.attr('checkedRows.length'), 0, 'there should be 0 items in checkedRows');
  assert.equal(count, 0, 'checkedRows should have changed 0 times for an empty array');
});

QUnit.test('Mixin child-rows', function(assert) {
  vm.attr('rows', [
    {val:1, childrenVisible: false},
    {val:2, childrenVisible: false},
    {val:3, childrenVisible: false}
  ]);
  assert.notOk(vm.attr('rows.0.childrenVisible'), '1st row\' children are hidden');
  vm.toggleChildrenVisible(vm.attr('rows.0'));
  assert.ok(vm.attr('rows.0.childrenVisible'), '1st row\' children should become visible');

  vm.toggleAllChildrenVisible();
  assert.equal(vm.attr('rows').filter(a => a.attr('childrenVisible')).length, vm.attr('rows.length'), 'All rows should have children visible');

  vm.toggleAllChildrenVisible();
  assert.equal(vm.attr('rows').filter(a => a.attr('childrenVisible')).length, 0, 'No rows should have children visible');
});

