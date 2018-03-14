import queues from "can-queues";
import DefineList from 'can-define/list/list';
import _ from 'lodash';

/**
 * Grid View Model
 */
var SortVmMixin = {

  /**
   * Indicates what column the rows are sorted by. Could be used in a template to show the sort indicator (triangle)
   * or from parent's template to set the default sorting.
   * @param {string} sortColumnName Column name for sorting
   * @example
   *  <grid-component sort-column-name="currency"></grid-component>
   */
  sortColumnName: {
    default: ''
  },

  /**
   * @param {string} sortDir A direction name to sort: TRUE for ascending, FALSE for descending.
   */
  sortAsc: {
    default: true,
    type: 'boolean'
  },

  /**
   * We want to sort rows on set if sorting is applied.
   */
  rows: {
    set (rows) {
      var sortColumnName = this.sortColumnName;
      if (sortColumnName) {
        this.sort(rows, sortColumnName, this.sortAsc);
      }
      return rows;
    }
  },

  /**
   * Computed from columns containing just column names (_attrName_ of the column definition) for sorting.
   */
  get sortColumns () {
    return _.map(this.columns, column => { return column.attrName; });
  },

  /**
   * sortBy is used use the sortBy function to trigger sorting on the column name.
   * All table headers will need to use it like this: `can-click="{sortBy 'columnName'}"`
   * @param {String} columnName The name of the attribute used for comparing values for sorting.
   */
  sortBy (columnName) {
    // queues.batch.start();
    if (columnName === this.sortColumnName) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortColumnName = columnName;
    }
    this.sort(this.rows, columnName, this.sortAsc);
    // updateOddness(this.scope.__rows);
    // queues.batch.stop();
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
  sort (list, sortKey, sortAsc, compareFunc) {
    if (!list || !list.length) return;
    // console.log('*** sort: %s by %s, asc=%s', list.length, sortKey, sortAsc);

    compareFunc = compareFunc || function (a, b) {
      const aVal = ((sortAsc && a) || b)[sortKey];
      const bVal = ((sortAsc && b) || a)[sortKey];

      // We need to handle null/undefined values separately, since any value is neither < or > than null/undefined:
      if (aVal == null && bVal == null) {
        return 0;
      }
      if (aVal == null) {
        return -1;
      }
      if (bVal == null) {
        return 1;
      }

      return (aVal < bVal ? -1 : (aVal > bVal ? 1 : 0));
    };
    list.sort(compareFunc);

    list.forEach(parent => {
      if (parent.children && parent.children instanceof DefineList) {
        parent.children.sort(compareFunc);
      }
    });
  },

  /**
   * The sortArrow helper is used to put a sort-direction arrow inside the header
   * of a column on the grid.
   * @param {String} columnName - The name of the column that will be sorted by
   * clicking on the column header.
   */
  sortArrow (columnName) {
    columnName = typeof columnName === 'function' ? columnName() : columnName;
    if (columnName !== this.sortColumnName) return '';
    var arrow = this.sortAsc ? '△' : '▽';
    return '<span class="arrow">' + arrow + '</span>';
  }
};

export default SortVmMixin;
