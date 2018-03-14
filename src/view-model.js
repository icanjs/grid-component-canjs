import queues from "can-queues";

/**
 * Grid View Model
 */
var GridVM = {

  /**
   * Listen to scroll event on tbody and trigger scrollEventName event when scroll position is close to the bottom (scrollBottomDistance of the body height).
   * We throttle scroll events on scrollThrottleInterval ms.
   */
  loadOnScroll: {
    value: false
  },
  scrollThrottleInterval: {
    value: 300
  },
  scrollEventName: {
    value: 'grid-should-load-more'
  },
  scrollBottomDistance: {
    value: 0.25
  },

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
    value: function () {
      return this.renderPageSize;
    },
    type: 'number'
  },

  rows: {
    value: function () {
      return [];
    }
  },

  visibleRows: {
    get: function () {
      if (this.rows) {
        return this.rows.filter(function (row) {
          return !row.isHidden;
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
    get: function () {
      return this.visibleRows.filter((item, i) => {
        return i < this.endIndex;
      });
    }
  },

  visibleEnabledRows: {
    get: function () {
      return this.visibleRows.filter(function (row) {
        return !row.isDisabled;
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
    set1: function (val) {
      var currentRow = this.selectedRow;
      if (currentRow) {
        currentRow.selected = '';
      }
      if (val) {
        val.selected = 'selected';
      }
      return val;
    }
  },

  /**
   * Holds tbody DOM element (e.g. for resetScroll).
   */
  tbody: {
    type: '*'
  },

  /**
   * Set the selectedRow to the clicked tr element.
   */
  selectRow: function (row, el, ev) {
    var target = ev.target.className;
    if (target !== 'expandable-parent' && target !== 'open-toggle' && ev.target.nodeName !== 'INPUT') {
      queues.batch.start();

      var index = el['parent-id'];
      if (index !== undefined) {
        this.selectedParentRow = this.rows[index];
      } else {
        this.selectedParentRow = row;
      }

      if (this.selectedRow) {
        this.selectedRow.selected = '';
      }
      row.selected = 'selected';
      queues.batch.stop();

      this.selectedRow = row;
    }
  },

  /**
   * Increases _endIndex_ by _renderPageSize_ (on scroll near bottom event).
   */
  increaseEndIndex () {
    let self = this;
    this.isLoading = true;
    if (this.endIndex < this.visibleRows.length + this.renderPageSize) {
      setTimeout(function () {
        self.endIndex = self.endIndex + self.renderPageSize;
        console.log('new endIndex %s', self.endIndex);
        self.isLoading = false;
      }, 10);
    } else {
      self.isLoading = false;
    }
  },

  /**
   * Resets the value of _endIndex_ to the default (e.g. on filter) and
   * scrolls to the top of the grid.
   */
  resetEndIndex () {
    this.scrollToTop();
    this.endIndex = this.renderPageSize;
  },

  /**
   * Scrolls grid body to the very top.
   */
  scrollToTop: function () {
    if (this.tbody) {
      this.tbody.scrollTop = 0;
    }
  }
};

export default GridVM;
