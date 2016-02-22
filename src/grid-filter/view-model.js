import can from 'can/';
import 'can/map/define/';
import _ from 'lodash';

/**
 * The viewModel for the `grid-filter` component contains attributes to assist the
 * jquery.tokeninput library that is initialized on the component's `inserted` event.
 */
export default can.Map.extend({
  define: {
    childrenProp: {
      value: 'children'
    },

    /**
     * searchTerms gets updated by the jquery.tokeninput plugin. When it's set it will
     * apply the filter (using the filter function) with the newly-set terms.
     * @type {Array}
     */
    searchTerms: {
      value: [],
      Type: can.List,
      set(val) {
        if (val !== this.searchTermsLast){
          this.filter(val, this.attr('rows'));
        }
        // if the searchTerms value is reset from the other side of the binding then clear the input:
        if (!val.length && this.attr('searchInput')){
          this.attr('searchInput').tokenInput('clear');
        }
        this.searchTermsLast = val;
        return val;
      }
    },

    /**
     * Rows passed in from the grid component
     */
    rows: {
      value: [],
      set: function(rows){
        // Execute filter when rows is set (e.g. data for the grid was reloaded).
        this.filter(this.attr('searchTerms'), rows);
        return rows;
      }
    },

    /**
     * When passed from template it could be either a comma separated list of strings or an array:
     * Default value is a list of property names of the 1st row.
     */
    columns: {
      set: function(val){
        if (val && typeof val === 'string'){
          val = val.split(',');
        }
        return val;
      },
      get: function(val){
        // excludeColumns will be removed from columns.
        var excludeColumns = typeof this.attr('excludeColumns') === 'string' ? this.attr('excludeColumns').split(',') : [];
        if (!val || !val.length) {
          val = this.attr('rows.0') && Object.keys(this.attr('rows.0').attr());
        }
        val = _.difference(val, excludeColumns);
        return val;
      }
    }
  },

  /**
   * Specify columns (attributes) to ignore on the filter.  Pass them as a comma-separated string:
   * @example <grid-filter rows="{rows}" search-terms="{searchTerms}" columns="" exclude-columns="region,period"></grid-filter>
   */
  excludeColumns: '',

  /**
   * Input element holder
   */
  searchInput: null,

  /**
   * suggestions is used by our implementation of the jquery.tokeninput plugin to store
   * previously-entered search terms.
   * @type {Array}
   */
  suggestions: [],

  // There seems to be a bug with binding lists in CanJS.  Binding a list to another list
  // will result in the setter being called twice.  This boolean buffer is used in the
  // filter function, below, to keep the filter from running twice due to this bug.
  searchTermsLast: null,

  /**
   * Uses the searchTerms to create a filter function that is passed to filter.
   * @type {function}
   */
  filter: function(searchTerms, rows){
    rows = rows || this.attr('rows');
    if (!rows || !rows.length){
      return;
    }

    var self = this,
      columns = this.attr('columns'),
      childrenProp = this.attr('childrenProp');

    searchTerms = searchTerms || this.attr('searchTerms');

    can.batch.start();
    _.map(rows, function(row){
      var isVisible = self.containsMatch(searchTerms, row, columns, childrenProp);
      row.attr('isVisible', isVisible);
    });
    can.batch.stop();
  },


  /**
   * A function that uses isFoundOne to determine if a row or its children contains
   * a match for the provided searchTerms.
   *
   * @param  {Array} searchText  The term that's being matched against row data.
   * @param  {row} row  A row of data from the grid.
   * @param  {Array} columns  The columns attr is passed in so it doesn't have to be
   *                          re-created with every this.attr('columns') read.
   * @param  {String} childrenProp The property name that contains child rows. Default 'children'.
   * @return {Boolean} true is returned if at least one of the attributes of the row
   *                   contained a match.
   */
  containsMatch: function(searchTerms, row, columns, childrenProp='children'){
    var self = this;
    if(!searchTerms || !searchTerms.length) return true;
    var result = this.isFoundOne(searchTerms, row, columns) || !!row[childrenProp] && !!row[childrenProp].length && Array.prototype.reduce.call(row[childrenProp], function(acc, child){
        return acc || self.isFoundOne(searchTerms, child, columns);
      }, false);

    console.log('[containsMatch] %s: terms=%s; columns=%s; childrenProp=%s', result, searchTerms.join(','), columns.join(','), childrenProp, row);

    return result;
  },

  /**
   * Determines if any attribute of a row contains a match for the provided searchTerms
   *
   * @param  {Array} searchText  The term that's being matched against row data.
   * @param  {row} row  A row of data from the grid.
   * @param  {Array} columns  The columns attr is passed in so it doesn't have to be
   *                          re-created with every this.attr('columns') read.
   * @return {Boolean} true is returned if at least one of the attributes of the row
   *                   contained a match.
   */
  isFoundOne: function(searchTerms, row, columns){
    row = (typeof row === 'function') ? row() : row;
    var found = false;
    columns = columns || Object.keys(row.attr());
    if(searchTerms.length === 0){
      found = true;
    }
    for (var len = 0; len < searchTerms.length; len++){
      var searchString = searchTerms[len].toLowerCase();
      for (var columnlen = 0; columnlen < columns.length; columnlen++){
        var columStr = row.attr(columns[columnlen]);
        if (columStr !== undefined && columStr !== '' && columStr !== null){
          // Convert value of the row cell to string:
          if (typeof columStr === 'number'){
            columStr = columStr.toFixed(3);
          } else {
            columStr = columStr.toString().toLowerCase();
          }
          if (columStr.indexOf(searchString) > -1){
            found = true;
            break;
          } else {
            found = false;
          }
        }
      }
      // if current term is not found we can break the loop since we have AND logic:
      if(!found)
        break;
    }

    return found;
  }
});