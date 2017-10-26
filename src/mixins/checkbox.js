import canBatch from 'can-event/batch/batch';
import DefineList from 'can-define/list/list';
import _ from 'lodash';

export default {
  /**
   * Series of computed properties to get a subset of rows (visible / checked / etc).
   */
  // TODO REVIEW: this derived list gets redefined even if there is no changes in checked items but a new unchecked row is added.
  checkedRows: {
    get () {
      var last = this.checkedRowsLast; // we cannot do both: read this compute and then write it below.
      var hasChanged = true;
      var newCheckedRows = (this.rows && this.rows.length > 0 && this.rows.filter(function (row) {
        return row.isChecked;
      })) || new DefineList();
      if (last && last.length === newCheckedRows.length) {
        hasChanged = _.reduce(last, function (acc, row, i) {
          return acc || !_.isEqual(row.get(), newCheckedRows[i].get());
        }, false);
      } else {
        this.checkedRowsLast = newCheckedRows;
      }
      newCheckedRows.hasChanged = hasChanged;
      return newCheckedRows;
    }
  },
  checkedVisibleRows: {
    get () {
      return this.visibleRows && this.visibleRows.filter(function (row) {
        return row.isChecked;
      });
    }
  },
  checkedVisibleEnabledRows: {
    get () {
      return this.visibleEnabledRows && this.visibleEnabledRows.filter(function (row) {
        return row.isChecked;
      });
    }
  },

  /**
   * @prop {boolean} isHeaderChecked Indicator for the header checkbox (to be used with can-value for the header checkbox)
   */
  isHeaderChecked: {
    get: function () {
      // TODO: when getter starts observing smth it makes a partial template being rerendered (e.g. breaks scroll listener).
      var isChecked = this.visibleEnabledRows.length === this.checkedVisibleEnabledRows.length;
      // console.log('isHeaderChecked.GET: ' + isChecked);
      return isChecked;
    },
    set: function (newVal) {
      // console.log('isHeaderChecked.SET: newVal=%s', newVal, arguments);
      canBatch.start();
      this.visibleEnabledRows && this.visibleEnabledRows.forEach(function (row) {
        row.isChecked = newVal;
      });
      canBatch.stop();
    }
  },

  /**
   * This is to bind from outside. The isHeaderChecked property cannot be used for this because it would cause
   * its setter to be called which will uncheck all rows when user unchecks one row.
   * @prop {boolean} areAllVisibleChecked Indicates if all visible rows (after filtering) are checked
   */
  areAllVisibleChecked: {
    get () {
      return this.visibleRows && this.visibleRows.length === this.checkedVisibleRows.length;
    }
  },

  /**
   * @prop {object} checkedRowsHash A hash map with selected row ids as keys and row items as values
   */
  checkedRowsHash: {
    type: '*',
    value () {
      return {};
    }
  },

  /***
   * Checkbox selection feature: push selected row into a hash map.
   */
  checkRow: function (row) {
    const rowId = row.id;
    const isChecked = row.isChecked;
    // console.log('checkRow()');
    if (isChecked) {
      this.checkedRowsHash[rowId] = row;
    } else {
      this.checkedRowsHash[rowId] = undefined;
    }
  },
  checkRows: function () {
    var self = this;
    canBatch.start();
    this.rows.forEach(function (row) {
      self.checkRow(row);
    });
    canBatch.stop();
  },

  /*
   * @prop areAllVisibleChecked {fn}
   * @return {boolean}
   */
  // areAllVisibleChecked: function(){
  //  var rows = this.rows;
  //  return (
  //    rows.filter(function(a){ return a.isChecked; }).length ===
  //      // TODO: think of an option because grid does not have to have a search
  //      // toolbar (which is used with isMatched).
  //    rows.filter(function(a){ return true || a.isMatched; }).length
  //  );
  // },
  /**
   * Clicking on header checkbox should loop through all visible rows and update them.
   */
  headerCheckboxClicked: function () {
    var isChecked = this.isHeaderChecked;
    console.log('headerCheckboxClicked: ' + isChecked);

    canBatch.start();
    this.rows.filter(function (a) { return true || a.isMatched; }).forEach(function (a) {
      a.isChecked = isChecked;
    });
    canBatch.stop();
  }
};
