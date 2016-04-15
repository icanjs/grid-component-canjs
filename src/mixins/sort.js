import can from 'can/';
import 'can/map/define/';
import 'can/list/sort/';
import _ from 'lodash';

/**
 * Grid View Model
 */
var SortVmMixin = {

  define: {

    /**
     * Indicates what column the rows are sorted by. Could be used in a template to show the sort indicator (triangle)
     * or from parent's template to set the default sorting.
     * @param {string} sortColumnName Column name for sorting
     * @example
     *  <grid-component sort-column-name="currency"></grid-component>
     */
    sortColumnName: {
      value: ''
    },

    /**
     * @param {string} sortDir A direction name to sort: TRUE for ascending, FALSE for descending.
     */
    sortAsc: {
      value: true,
      type: 'boolean'
    },

    /**
     * We want to sort rows on set if sorting is applied.
     */
    rows: {
      set(rows){
        var sortColumnName = this.attr('sortColumnName');
        if (sortColumnName){
          this.sort(rows, sortColumnName, this.attr('sortAsc'));
        }
        return rows;
      }
    },

    /**
     * Computed from columns containing just column names (_attrName_ of the column definition) for sorting.
     */
    sortColumns: {
      get: function(){
        return _.map(this.attr('columns').attr(), column => { return column.attrName; });
      }
    }

  },
  
  /**
   * sortBy is used use the sortBy function to trigger sorting on the column name.  
   * All table headers will need to use it like this: `can-click="{sortBy 'columnName'}"`
   * @param {String} columnName The name of the attribute used for comparing values for sorting.
   */
  sortBy: function(columnName){
    can.batch.start();
    if (columnName === this.attr('sortColumnName')) {
      this.attr('sortAsc', !this.attr('sortAsc'));
    } else {
      this.attr('sortColumnName', columnName);
    }
    this.sort(this.attr('rows'), columnName, this.attr('sortAsc'));
    //updateOddness(this.scope.__rows);
    can.batch.stop();
  },

  /**
   * Sorts the provided list on the sortKey attribute in the direction specified
   * by sortAsc.  Can pass in a sort function to override the default one, if desired.
   * The comparator is removed from the list after sorting as a workaround to a 
   * bug with the can.List.sort plugin at the time of implementation.
   * 
   * @param  {can.List} list      The List to be sorted.
   * @param  {String} sortKey     The name of the attribute to be sortedin the List.
   * @param  {Boolean} sortAsc    Set to true for Ascending, false for descending order.
   * @param  {function} compareFunc optional function to use for the comparator.
   */
  sort: function(list, sortKey, sortAsc, compareFunc){
    if (!list || !list.length) return;
    //console.log('*** sort: %s by %s, asc=%s', list.length, sortKey, sortAsc);

    compareFunc = compareFunc || function(a, b) {
      var aVal = (sortAsc && a || b).attr(sortKey),
          bVal = (sortAsc && b || a).attr(sortKey);

      // We need to handle null/undefined values separately, since any value is neither < or > than null/undefined:
      if (aVal == null && bVal == null){
        return 0;
      }
      if (aVal == null){
        return -1;
      }
      if (bVal == null){
        return 1;
      }

      return (aVal < bVal ? -1 : (aVal > bVal ? 1 : 0));
    };
    list.attr('comparator', compareFunc);

    list.forEach(parent => {
      if (parent.children && parent.children.attr) {
        parent.children.attr('comparator', compareFunc);
      }
    });

    // This is due to the sort plugin shuffling rows with equal values on any list update:
    setTimeout(function(){
      list.removeAttr('comparator');
    },0);
  }
};

let mixinSortHelpers = {
  /**
   * The sortArrow helper is used to put a sort-direction arrow inside the header
   * of a column on the grid.
   * @param {String} columnName - The name of the column that will be sorted by
   * clicking on the column header.
   */
  sortArrow: function(columnName){
    columnName = typeof columnName === 'function' ? columnName() : columnName;
    if (columnName !== this.attr('sortColumnName')) return '';
    var arrow = this.attr('sortAsc') ? '△' : '▽';
    return '<span class="arrow">' + arrow + '</span>';
  }
};

export default SortVmMixin;

export { mixinSortHelpers };
