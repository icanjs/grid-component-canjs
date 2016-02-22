import QUnit from 'steal-qunit';
import VM from './view-model';

var vm;

QUnit.module('Grid filter', {
  beforeEach: function() {
    vm = new VM();
  },

  afterEach: function() {
  }
});

QUnit.test('isFoundOne', function(assert) {
  var row = new can.Map({id: 1, name: 'one', value: 'my-value', prop: 'my-prop'}),
    columns = Object.keys(row.attr());

  assert.ok(typeof vm.isFoundOne === 'function', 'isFoundOne should be defined');
  assert.ok(vm.isFoundOne(['1'], row, columns), '1st prop');
  assert.ok(vm.isFoundOne(['one'], row, columns), '2nd prop');
  assert.ok(vm.isFoundOne(['on'], row, columns), 'partial prop');
  assert.ok(vm.isFoundOne(['1','one'], row, columns), 'two props');
  assert.notOk(vm.isFoundOne(['2'], row, columns), 'non-existing value');
  assert.notOk(vm.isFoundOne(['one','2'], row, columns), 'multiple props with non-existing value');
  assert.ok(vm.isFoundOne(['prop', '1','one'], row, columns), 'three props');
  assert.notOk(vm.isFoundOne(['prop', 'aaa','one'], row, columns), 'three props with non-existing value');
  assert.ok(vm.isFoundOne(['prop', 'val', '1','one'], row, columns), 'four props');
});

QUnit.test('containsMatch', function(assert) {
  var row = new can.Map({id: 1, name: 'one', value: 'my-value', prop: 'my-prop'}),
    columns = Object.keys(row.attr()),
    rowWithChildren = new can.Map({
      id: 1, name: 'one', value: 'my-value', prop: 'my-prop',
      myChildren: [
        {id: 2, name: 'child-two', value: 'my-child-value', prop: 'my-child-prop'}
      ]
    });

  assert.ok(typeof vm.containsMatch === 'function', 'containsMatch should be defined');
  assert.ok(vm.containsMatch(['one'], rowWithChildren, columns, 'myChildren'), 'parent filter');
  assert.ok(vm.containsMatch(['child-two'], rowWithChildren, columns, 'myChildren'), 'child filter');
  assert.ok(vm.containsMatch(['2','child'], rowWithChildren, columns, 'myChildren'), 'child filter two props');
  assert.notOk(vm.containsMatch(['1','child'], rowWithChildren, columns, 'myChildren'), 'one in parent and one in child filter should result negative');
});

QUnit.test('filter', function(assert) {
  var rows = [
        {id: 1, name: 'one', value: 'my-value', prop: 'my-prop', isVisible: true},
        {id: 2, name: 'two', value: 'my-value-two', prop: 'my-prop-two', isVisible: true, children: [
          {id: 3, name: 'child-two', value: 'my-child-value', prop: 'my-child-prop'}
        ]}
      ],
      columns = Object.keys(rows[0]);

  vm.attr({
    rows: rows,
    columns: columns
  });

  assert.ok(typeof vm.containsMatch === 'function', 'filter should be defined');
  assert.equal(vm.attr('rows').filter(row => row.isVisible).length, 2, 'two visible rows');

  vm.attr('searchTerms', ['1']);
  assert.equal(vm.attr('rows').filter(row => row.isVisible).length, 1, 'one visible row after filtering by "1"');

  // TODO: figure out how to avoid buffer as a workaround the template binding (which caused viewmodel property being set twice)
  vm.attr('searchTerms', ['my-value']);
  assert.equal(vm.attr('rows').filter(row => row.isVisible).length, 2, 'one visible row after filtering by ["my-value"]');

  vm.attr('searchTerms', ['child']);
  assert.equal(vm.attr('rows').filter(row => row.isVisible).length, 1, 'one visible row after filtering by child prop ["child"]');
});

QUnit.test('exclude columns', function(assert){
  var rows = [
    {id: 1, name: 'one', value: 'my-value', prop: 'my-prop', isVisible: true},
    {id: 2, name: 'two', value: 'my-value-two', prop: 'my-prop-two', isVisible: true}
  ];

  vm.attr({
    rows:rows,
    columns: Object.keys(rows[0])
  });

  vm.attr('searchTerms', ['my-value']);
  assert.equal(vm.attr('rows.1.isVisible'), true, 'The "value" column was used properly.');

  // Exclude the value column then search for my-value.  Because the value column is ignored, 
  // 'my-value' won't be found and both records will be set to {isVisible: false}.
  vm.attr('excludeColumns', 'value');
  vm.attr('searchTerms', []);
  vm.attr('searchTerms', ['my-value']);
  assert.equal(vm.attr('rows.1.isVisible'), false, 'The "value" column was ignored properly.');

  vm.attr('searchTerms', []);
  vm.attr('searchTerms', ['my-prop-two']);
  assert.equal(vm.attr('rows.0.isVisible'), false, 'The first row was filtered out on the "prop" column correctly.');
});

// FUNCTIONAL TESTS:
