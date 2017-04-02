import QUnit from 'steal-qunit';
import F from 'funcunit';

F.attach(QUnit);

QUnit.module('Grid Filter - Funcunit', {
  beforeEach: function () {
    F.open('/src/demo/demo-grid-filter.html');
  }
});
QUnit.done(function () {
  // F.win.close();
});

QUnit.test('Grid filter', function () {
  F('grid-component tbody tr:first').visible(function () {
    QUnit.equal(F('grid-component .grid-wrapper tbody tr:visible').size(), 30, 'There should be 30 rows in the table');

    F('grid-filter input:first').type('cad');
    F('grid-filter input:first').type(',');
    F.wait(10, function () {
      QUnit.equal(F('grid-component .grid-wrapper tbody tr:visible').size(), 10, 'There should be 10 rows in the table after applying the 1st filter');

      F('grid-filter input:first').type('europe');
      F('grid-filter input:first').type(',');
      F.wait(10, function () {
        QUnit.equal(F('grid-component .grid-wrapper tbody tr:visible').size(), 2, 'There should be 2 rows in the table after applying the 2nd filter');

        F('grid-filter ul li span').click();
        F.wait(10, function () {
          QUnit.equal(F('grid-component .grid-wrapper tbody tr:visible').size(), 5, 'There should be 5 rows in the table after removing the 1st filter');
        });
      });
    });
  });
});
