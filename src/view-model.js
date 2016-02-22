import can from 'can/';
import 'can/map/define/';
import 'can/list/sort/';
import _ from 'lodash';

// var Row = window.Row = can.Map.extend({
//   define: {
//     isVisible: {
//       type: 'boolean',
//       value: true
//     },
//     isChecked: {
//       type: 'boolean',
//       value: false
//     }
//   }
// });

var Row = can.Map.extend({});

/**
 * Grid View Model
 */
var GridVM = can.Map.extend({

  /**
   * Grid settings:
   */

  /**
   * Listen to scroll event on tbody and trigger scrollEventName event when scroll position is close to the bottom (scrollBottomDistance of the body height).
   * We throttle scroll events on scrollThrottleInterval ms.
   */
  loadOnScroll: false,
  scrollThrottleInterval: 300,
  scrollEventName: 'grid-should-load-more',
  scrollBottomDistance: 0.25,

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

    //TODO: review: when we pass data from outside rows elements are not instances of Row.
    // $('grid-component').viewModel().attr('rows') instanceof Row.List === true
    // $('grid-component').viewModel().attr('rows.0') instanceof Row === false        <<<<
    // $('grid-component').viewModel().attr('rows.0') instanceof can.Map === true
    // 
    // var myList = new Row.List([{id:1}])
    // myList[0] instance of Row
    rows: {
      value: [],
      // TODO REVIEW: type coercion breaks list binding (when we push an item to the dataRows this rows does not get it)
      //Type: Row.List
      set(rows){
        var sortColumnName = this.attr('sortColumnName');
        if (sortColumnName){
          this.sort(rows, sortColumnName, this.attr('sortAsc'));
        }
        return rows;
      }
    },

    /**
     * Series of computed properties to get a subset of rows (visible / checked / etc).
     */
    // TODO REVIEW: this derived list gets redefined even if there is no changes in checked items but a new unchecked row is added.
    checkedRows: {
      get: function(){
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
      }
    },

    visibleRows: {
      get: function(){
        if (this.attr('rows')) {
          return this.attr('rows').filter(function(row){
            return row.attr('isVisible');
          });          
        } else {
          return null;
        }
      }
    },
    visibleEnabledRows: {
      get: function(){
        return this.attr('visibleRows').filter(function(row){
          return !row.attr('isDisabled');
        });
      }
    },
    checkedVisibleRows: {
      get: function(){
        return this.attr('visibleRows').filter(function(row){
          return row.attr('isChecked');
        });
      }
    },
    checkedVisibleEnabledRows: {
      get: function(){
        return this.attr('visibleEnabledRows').filter(function(row){
          return row.attr('isChecked');
        });
      }
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
        can.batch.start();
        this.attr('visibleEnabledRows').each(function(row){
          row.attr('isChecked', newVal);
        });
        can.batch.stop();
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
     * @prop {boolean} hasCheckboxes Option to show the checkbox column
     */
    hasCheckboxes: {
      type: 'boolean',
      value: false
    },
    /**
     * @prop {boolean} isToolbarShown Option to show the toolbar (filtering, other controls)
     */
    isToolbarShown: {
      type: 'boolean',
      value: false
    },
    /**
     * @prop {object} checkedRowsHash A hash map with selected row ids as keys and row items as values
     */
    checkedRowsHash: {
      value: {}
    },

    // TODO: define a map for column definition.
    /**
     * Array of columns as column definitions received from server.
     * @example:
     *    ```
     *    {
     *      "title": "Total Revenue",
     *      "attrName": "revenue",
     *      "length": "20",
     *      "uiType": "number",
     *      "decimals": 2,
     *      "before": "$"
     *      "after": ""
     *    }
     *    ```
     */
    columns: {
      value: [],
      set(val){
        return val;
      }
    },

    /**
     * Computed from columns containing just column names (_attrName_ of the column definition) for sorting.
     */
    sortColumns: {
      get: function(){
        return _.map(this.attr('columns').attr(), column => { return column.attrName; });
      }
    },

    /**
     * The selected parent row or the parent of the selected child row.
     * @type {row}
     */
    selectedParentRow: {value: null},

    /**
     * The selected row in the grid. Used for caching which row is selected.
     * @type {row}
     */
    selectedRow: {
      value: null,
      // cant use setter here due to a bug in canjs: https://github.com/canjs/canjs/issues/2191
      set1: function(val){
        var currentRow = this.attr('selectedRow');
        currentRow && currentRow.attr('selected', '');
        val && val.attr('selected', 'selected');
        return val;
      }
    }
  },

  /**
   * Set the selectedRow to the clicked tr element.
   */
  selectRow: function(row, el, ev){
    var target = ev.target.className;
    if (target !== 'expandable-parent' && target !== 'open-toggle' && ev.target.nodeName !== 'INPUT') {
      can.batch.start();

      var index = el.attr('parent-id');
      if (index !== undefined) {
        this.attr('selectedParentRow', this.attr('rows.'+index));
      } else {
        this.attr('selectedParentRow', row);
      }

      if (this.attr('selectedRow')) {
        this.attr('selectedRow.selected', '');
      }
      row.attr('selected', 'selected');
      can.batch.stop();

      this.attr('selectedRow', row);
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
    can.batch.start();
    this.attr('rows').each(function(row){
      self.checkRow(row);
    });
    can.batch.stop();
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

    can.batch.start();
    this.attr('rows').filter(function(a){ return true || a.isMatched;}).each(function(a){
      a.attr('isChecked', isChecked);
    });
    can.batch.stop();
  },

  /**
   * @option {boolean} footerExpanded Flag to expande/collapse grid's footer if one exists.
   */
  footerExpanded: false,
  toggleFooterExpanded: function(){
    this.attr('footerExpanded', !this.attr('footerExpanded'));
  }
  
});

export default GridVM;
