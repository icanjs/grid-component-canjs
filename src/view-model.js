import canBatch from 'can-event/batch/batch';
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
    },

    /**
     * Holds tbody DOM element (e.g. for resetScroll).
     */
    tbody: {
      type: '*'
    }
  },

  /**
   * Set the selectedRow to the clicked tr element.
   */
  selectRow: function(row, el, ev){
    var target = ev.target.className;
    if (target !== 'expandable-parent' && target !== 'open-toggle' && ev.target.nodeName !== 'INPUT') {
      canBatch.start();

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
      canBatch.stop();

      this.attr('selectedRow', row);
    }
  },

  /**
   * Increases _endIndex_ by _renderPageSize_ (on scroll near bottom event).
   */
  increaseEndIndex(){
    let self = this;
    this.attr('isLoading', true);
    if (this.attr('endIndex') < this.attr('visibleRows.length') + this.attr('renderPageSize')){
      setTimeout(function(){
        self.attr('endIndex', self.attr('endIndex') + self.attr('renderPageSize'));
        console.log('new endIndex %s', self.attr('endIndex'));
        self.attr('isLoading', false);
      }, 10);
    } else {
      self.attr('isLoading', false);
    }
  },

  /**
   * Resets the value of _endIndex_ to the default (e.g. on filter) and
   * scrolls to the top of the grid.
   */
  resetEndIndex(){
    this.scrollToTop();
    this.attr('endIndex', this.attr('renderPageSize'));
  },

  /**
   * Scrolls grid body to the very top.
   */
  scrollToTop: function(){
    if (this.attr('tbody')){
      this.attr('tbody').scrollTop = 0;
    }
  }
};

export default GridVM;
