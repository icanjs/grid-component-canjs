import can from 'can/';
import 'can/map/define/';
import 'can/list/sort/';
import _ from 'lodash';

/**
 * Grid View Model
 */
var GridVM = {

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
     * Page size controlling the amount of rendered page of data.
     */
    renderPageSize: {
      value: 200,
      type: 'number'
    },

    /**
     * Controls how many rows are rendered.
     * @type {Object}
     */
    endIndex: {
      value: function(){
        return this.attr('renderPageSize');
      },
      type: 'number'
    },

    rows: {
      value: []
    },

    visibleRows: {
      get: function(){
        if (this.attr('rows')) {
          return this.attr('rows').filter(function(row){
            return !row.attr('isHidden');
          });          
        } else {
          return null;
        }
      }
    },

    /**
     * Derived list of rows limited by _endIndex_.
     * @type {Object}
     */
    renderedRows: {
      get: function() {
        return this.attr('visibleRows').filter((item, i) => {
          return i < this.attr('endIndex');
        });
      }
    },

    visibleEnabledRows: {
      get: function(){
        return this.attr('visibleRows').filter(function(row){
          return !row.attr('isDisabled');
        });
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
      // TODO: check: cant use setter here due to a bug in canjs: https://github.com/canjs/canjs/issues/2191
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
  }
};

export default GridVM;
