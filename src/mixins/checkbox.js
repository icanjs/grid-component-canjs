import canBatch from 'can-event/batch/batch';
import _ from 'lodash';

export default {
  /**
   * Series of computed properties to get a subset of rows (visible / checked / etc).
   */
  // TODO REVIEW: this derived list gets redefined even if there is no changes in checked items but a new unchecked row is added.
  get checkedRows () {
    var last = this.checkedRowsLast; // we cannot do both: read this compute and then write it below.
    var hasChanged = true;
    var newCheckedRows = this.attr('rows.length') > 0 && this.attr('rows').filter(function(row){
        return row.attr('isChecked');
      }) || new can.List();
    if (last && last.length === newCheckedRows.length){
      hasChanged = _.reduce(last, function(acc, row, i){
        return acc || !_.isEqual(row.attr(), newCheckedRows.attr(i).attr());
      }, false);
    } else {
      this.checkedRowsLast = newCheckedRows;
    }
    newCheckedRows.hasChanged = hasChanged;
    return newCheckedRows;
  },
  get checkedVisibleRows () {
    return this.attr('visibleRows').filter(function(row){
      return row.attr('isChecked');
    });
  },
  get checkedVisibleEnabledRows () {
    return this.attr('visibleEnabledRows').filter(function(row){
      return row.attr('isChecked');
    });
  },

  /**
   * @prop {boolean} isHeaderChecked Indicator for the header checkbox (to be used with can-value for the header checkbox)
   */
  isHeaderChecked: {
    get: function(){
      // TODO: when getter starts observing smth it makes a partial template being rerendered (e.g. breaks scroll listener).
      var isChecked = this.attr('visibleEnabledRows.length') === this.attr('checkedVisibleEnabledRows.length');
      //console.log('isHeaderChecked.GET: ' + isChecked);
      return isChecked;
    },
    set: function(newVal){
      //console.log('isHeaderChecked.SET: newVal=%s', newVal, arguments);
      canBatch.start();
      this.attr('visibleEnabledRows').each(function(row){
        row.attr('isChecked', newVal);
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
    get: function(){
      return this.attr('visibleRows.length') === this.attr('checkedVisibleRows.length');
    }
  },

  /**
   * @prop {object} checkedRowsHash A hash map with selected row ids as keys and row items as values
   */
  checkedRowsHash: {
    value: {}
  },

  /***
   * Checkbox selection feature: push selected row into a hash map.
   */
  checkRow: function(row){
    var rowId = row.attr('id'),
      isChecked = row.attr('isChecked');
    //console.log('checkRow()');
    if (isChecked){
      this.attr('checkedRowsHash.' + rowId , row);
    } else {
      this.removeAttr('checkedRowsHash.' + rowId);
    }
  },
  checkRows: function(){
    var self = this;
    canBatch.start();
    this.attr('rows').each(function(row){
      self.checkRow(row);
    });
    canBatch.stop();
  },

  /**
   * @prop areAllVisibleChecked {fn}
   * @return {boolean}
   */
  areAllVisibleChecked: function(){
    var rows = this.attr('rows');
    return (
      rows.filter(function(a){ return a.isChecked; }).length ===
        // TODO: think of an option because grid does not have to have a search
        // toolbar (which is used with isMatched).
      rows.filter(function(a){ return true || a.isMatched; }).length
    );
  },
  /**
   * Clicking on header checkbox should loop through all visible rows and update them.
   */
  headerCheckboxClicked: function(){
    var isChecked = this.attr('isHeaderChecked');
    console.log('headerCheckboxClicked: ' + isChecked);

    canBatch.start();
    this.attr('rows').filter(function(a){ return true || a.isMatched;}).each(function(a){
      a.attr('isChecked', isChecked);
    });
    canBatch.stop();
  }
};