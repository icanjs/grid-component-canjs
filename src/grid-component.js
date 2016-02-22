import can from 'can/';
import 'can/map/define/';
import './styles.less!';
import 'helpers/no-binding';
import accounting from 'accounting';
import moment from 'moment';
import fileManager from 'utils/fileManager/';
import utils from 'utils/periodWidgetHelpers';
import 'attrs/tooltip/';

import VM from './view-model';


// TODO: Implement better scrolling table styles found at this link:
// http://tjvantoll.com/2012/11/10/creating-cross-browser-scrollable-tbody/

/**
 * @page rin.components.grid-component.grid-component Grid Component
 * @parent rin.components.grid-component 0
 * @description Grid component.
 * @body
 *
 * This is the new `grid-component`.  It handles two different implementations.
 *  1. A static grid format, where the columns are statically coded into the template.
 *  2. A dynamic grid format, where the server sends a column definition attribute
 *     along with the data for the grid.
 * Refer to the `[rin.page-sample page-sample]` component for examples of the two implementations.
 */
can.Component.extend({
  tag: 'grid-component',
  viewModel: VM,
  /**
   * Notice that no delegated events were necessary for the grid-component.  The
   * click handlers are instead put as can-EVENTs like can-click="functionName"
   * inside the stache template.  In general, for almost any component, there  are
   * few exceptions where it is better to put an event here.  One of those is when
   * you are listening to events outside of a component's template.  You can see
   * an example of this in the `page-sample` component's main .js file.
   */
  events: {
    'inserted': function(){
      var self = this,
        tbody = this.element.find('.grid-wrapper tbody');

      // Trigger 'grid-should-load-more' EVENT on scroll when scroll position is close to the bottom (1/4 of the body height).
      if (this.viewModel.loadOnScroll){
        var scrollThrottleInterval = parseInt(this.viewModel.attr('scrollThrottleInterval')),
          scrollBottomDistance = parseFloat(this.viewModel.attr('scrollBottomDistance')),
          eventName = this.viewModel.attr('scrollEventName');

        // TODO: should we put the following logic here: stop triggering grid-should-load-more if after the last event rows were not added. ?
        // We should always throttle scroll events.
        tbody.on('scroll', _.throttle(function(ev){
          var tbodyEl = ev.target;
          var distanceFromTop = tbodyEl.scrollTop + tbodyEl.clientHeight;
          var shouldLoadMore = distanceFromTop >= Math.min(tbodyEl.scrollHeight/2, tbodyEl.scrollHeight * (1 - scrollBottomDistance));
          if (shouldLoadMore){
            self.element.trigger(eventName);
          }
        }, scrollThrottleInterval));
      }
    }
  },
  helpers: {
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
    },

    /**
     * The `column` helper is used to render a each cell for the dynamic grid implementation.
     * @param row
     * @param {object} column Column definition (e.g. {title: 'Title', attrName: 'itemTitle', ...})
     *                        _column.attrName_ can point to an object, e.g. 'fileDetails.fileName'.
     * @param {string} rowType For footer the value is 'footerHeader'
     * @returns {string}
     */
    column: function(row, column, rowType) {
      // http://canjs.com/docs/can.stache.helpers.helper.html ("two way binding helpers"):
      // "If an argument key value is a can.Map property, the Observe's property is converted to a getter/setter can.compute."
      // We pass "row" as a can.Map thus its converted to a computed, so have to call row().
      // For now the argument 'column' is passed as a plain object, thus its converted to a can.Map (no need to call column() here,
      // but just for consistency check if its a compute).

      column = typeof column === 'function' ? column() : column;
      row = typeof row === 'function' ? row() : row;
      // TODO: review how to retrieve values like row.fileDetails.fileName
      // jsbin: map -> compute -> use attr()?
      row = new can.Map(row);

      /**
       * @option {string} attrName  Property name in data to get value for the cell content.
       * @option {string} uiType    To indicate any specific view of the cell content.
       *                            Possible values: "", "Number", "Date", "Download", "Custom", "Filesize".
       */
      // Column config contains info for both table body and footer,
      // e.g. _attrName_ is used for tbody, _attrNameFooter_ - for footer.
      var attrSuffix = (rowType === 'footer' || rowType === 'footerHeader' ? 'Footer' : ''),
        uiType = 'uiType' + attrSuffix,
        attrName = 'attrName' + attrSuffix,
        // Final result string to be rendered on the cell:
        result = '';

      if (rowType === 'footerHeader' && column.titleFooter){
        result = column.titleFooter;
      } else if (column[attrName]){
        result = row.attr(column[attrName]);
      }

      // TODO: move this to the Model layer.
      // Normalize uiType:
      if (column[attrName] === 'fileSize'){
        column[uiType] = 'Filesize';
      }

      /**
       * We format any numbers and currency amount like: "1,234,456.00". Percentage sign can be added using option _after_.
       * Since some rows can have custom value for the number of decimals we check row.attr('numberOfDecimals') first.
       * @option {number} decimals Number of decimals
       */
      if (column[uiType] === 'Number' && column[attrName] !== ''){
        if (result === null || result === undefined) {
          result = '';
        } else {
          var decimals = typeof row.attr('numberOfDecimals') !== 'undefined' ? row.attr('numberOfDecimals') :
            (typeof column.decimals === 'undefined' ? (result === 0 ? 0 : 2) : parseInt(column.decimals));
          result = accounting.formatMoney(result, '', decimals);
        }
      }

      /**
       * Filesize uiType: for values less that 1Mb show "< 1Mb" and a tooltip with a value in bytes.
       * NB: if using stache here becomes a performance issue then refactor to pure CSS.
       */
      if (column[uiType] === 'Filesize'){
        result = result < 1 ? can.stache('<span tooltip="' + (Math.round(result * 1000) + ' KBytes') + '">&lt; 1Mb</span>')() : accounting.formatMoney(result, '', 2);
      }

      /**
       * Date format
       */
      if (result && column[uiType] === 'Date' && column.format) {
        result = moment(result).format(column.format);
      }

      /**
       * For download format we receive {fileName: <string>, fileId: <number>, fileType: <string>}
       * The download link is build based on file type and file id.
       * @option {string} fileName
       * @option {number} fileId
       * @option {string} fileType Bound type of file: "OUTBOUND"
       */
      if (result && column[uiType] === 'Download' && row.attr(column[attrName])) {
        var fileName = row.attr(column[attrName]),
          fileId = row.attr('fileId'),
          fileType = row.attr('fileType'),
          fileSize = row.attr('fileSize');
        if (fileId && fileType){
          var downloadUrl = fileManager.getDownloadUrl(fileId, fileType);
          result = '<a href="' + downloadUrl + '" data-file-size="' + fileSize + '">' + fileName + '</a>';
        }
      }

      if (column[attrName] === 'period'){
        result = row.attr('periodDisplay') || utils.getDisplayPeriod(row.attr('period'), (row.attr('periodType') || 'P'));
      }

      /**
       * @option {string} before A string to be added before the value
       */
      if (column.before){
        result = column.before + result;
      }

      /**
       * @option {string} after A string to be added after the value (e.g. percent sign)
       */
      if (column.after){
        result = result + column.after;
      }

      return result;
    },

    /**
     * Column definition contains _length_ as number of characters for the column. We us it as _min-width_.
     * @param {number} length Max number of characters for current column.
     * @returns {string} Style with min width as length multiplied by character width (7px).
     */
    //TODO: review. Maybe use dynamic inline style block with attrName as className and define min-width per class.
    minWidth: function(length){
      length = typeof length === 'function' ? length() : length;
      var width = parseInt(length) * 7;
      return 'min-width:' + width + 'px';
    }

  }
});
