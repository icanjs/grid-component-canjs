import can from 'can';
import _ from 'lodash';

/**
 * Pagination controls. Adds a new derived list `pagedRows` and helpers to manipulate current page.
 * @param pagination <Number> How many rows should be shown per page.
 *
 *
 * ```
 *    <grid-component {(rows)}="items" pagination="10">
 *      <table>
 *        <tbody>
 *          {{#each rows}}
 *            <tr>
 *              <td>{{id}}</td>
 *              <td>{{title}}</td>
 *            </tr>
 *          {{/each}}
 *        </tbody>
 *      </table>
 *      <button ($click)="prev()">Prev</button>
 *      <ul>
 *        {{#each pages}}
 *          <li class="{{#if isActive}}active{{/if}}">{{pageNumber}}</li>
 *        {{/each}}
 *      </ul>
 *      <button ($click)="next()">Next</button>
 *    </grid-component>
 *
 * ```
 */

export default {
  define: {
    /**
     * How many rows to show per page. Config option.
     */
    pagination: {
      value: 0
    },
    /**
     * How many rows to show per page. Actual parameter.
     */
    rowsPerPage: {
      get(){
        return this.attr('pagination') || this.attr('rows.length');
      }
    },
    /**
     * @param currentPage <Number> Current page number.
     */
    currentPage: {
      value: 0
    },
    /**
     * @param totalPages <Number> How many pages we have.
     */
    totalPages: {
      get(){
        return Math.ceil(this.attr('rows.length') / this.attr('rowsPerPage'));
      }
    },
    /**
     * If there are more than 1 pages
     */
    hasPages: {
      get(){
        return this.attr('totalPages') > 1;
      }
    },
    /**
     * @param pagedRows <can.List> A derived list of rows that has only rows belong to current page.
     */
    pagedRows: {
      get(){
        return this.attr('rows').filter((row, index) => {
          return index < this.attr('rowsPerPage') * (this.attr('currentPage') + 1)
            && index > (this.attr('rowsPerPage') * this.attr('currentPage') - 1);
        })
      }
    },
    /**
     * @param isNextActive <Boolean> Indicates if the Next button should be shown/active.
     */
    isNextActive: {
      get(){
        return this.attr('currentPage') < this.attr('totalPages') - 1;
      }
    },
    /**
     * @param isPrevActive <Boolean> Indicates if the Prev button should be shown/active.
     */
    isPrevActive: {
      get(){
        return this.attr('currentPage') > 0;
      }
    },
    /**
     * @param pages <can.List> Array of page objects with page numbers and isActive flag showing what page is current.
     */
    pages: {
      get(){
        let currentPage = this.attr('currentPage');
        return new can.List(_.times(this.attr('totalPages'), i => {
          return {
            pageNumber: i,
            pageTitle: i + 1,
            isActive: i === currentPage
          }
        }));
      }
    }
  },

  /**
   * @method next Increases `currentPage` by one if there is a next one.
   */
  next(){
    if (this.attr('isNextActive')){
      this.attr('currentPage', this.attr('currentPage') + 1);
    }
    return false;
  },

  /**
   * @method prev Decreases `currentPage` by one if there is a previous one.
   */
  prev(){
    if (this.attr('isPrevActive')){
      this.attr('currentPage', this.attr('currentPage') - 1);
    }
    return false;
  },

  /**
   * @method change `currentPage` to correct pagenumber
   */
  changePage(pageNumber){
    this.attr('currentPage', pageNumber);
    return false;
  }
};