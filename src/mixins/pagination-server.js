/**
 * @module grid/mixin/pagination-server Server pagination
 * @parent mixin
 *
 * VM properties and methods to support server pagination.
 *
 * @signature '<grid-component {(rows)}="rows" {(pagination)}="pagination" (on-page-click)="loadPage()" />'
 *
 *  After mixing in the functionality you get access to grid VM event `on-page-click` as well as updated
 *  `pagination.skip` property. Grid will do the calculations for the page number and update `skip` property
 *  of the `pagination` accordingly.
 *
 *  @param {can.Map} pagination Contains properties: `skip`, `limit`, `total`.
 *
 *  ```
 *  <grid-component {(rows)}="items" {(pagination)}="pagination" (on-page-click)="loadPage()">
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
 *  </grid-component>
 *  ```
 */
import DefineList from 'can-define/list/list';
import _ from 'lodash';

export default {
  /**
   * How many rows to show per page. Config option.
   */
  pagination: {
    type: '*'
  },
  /**
   * How many rows to show per page. Actual parameter.
   */
  rowsPerPage: {
    get () {
      return this.pagination.limit;
    }
  },
  /**
   * @param {Number} currentPage Current page number, starting with `0`. Relies on `limit` and `skip`, and not `total`.
   */
  currentPage: {
    get () {
      let pagination = this.pagination;
      return Math.floor(pagination.skip / pagination.limit);
    }
  },
  /**
   * @param totalPages <Number> How many pages we have.
   */
  totalPages: {
    get () {
      return Math.ceil(this.pagination.total / this.pagination.limit);
    }
  },
  /**
   * If there are more than 1 pages
   */
  hasPages: {
    get () {
      return this.totalPages > 1;
    }
  },
  /**
   * @param isNextActive <Boolean> Indicates if the Next button should be shown/active.
   */
  isNextActive: {
    get () {
      return this.currentPage < this.totalPages - 1;
    }
  },
  /**
   * @param isPrevActive <Boolean> Indicates if the Prev button should be shown/active.
   */
  isPrevActive: {
    get () {
      return this.currentPage > 0;
    }
  },
  /**
   * @param pages <can.List> Array of page objects with page numbers and isActive flag showing what page is current.
   */
  pages: {
    get () {
      let currentPage = this.currentPage;
      return new DefineList(_.times(this.totalPages, i => {
        return {
          pageNumber: i,
          pageTitle: i + 1,
          isActive: i === currentPage
        };
      }));
    }
  },

  /**
   * @function next Increases `currentPage` by one if there is a next one.
   */
  next () {
    if (this.isNextActive) {
      this.pagination.skip = this.pagination.skip + this.pagination.limit;
    }
    return false;
  },

  /**
   * @function prev Decreases `currentPage` by one if there is a previous one.
   */
  prev () {
    if (this.isPrevActive) {
      this.pagination.skip = this.pagination.skip - this.pagination.limit;
    }
    return false;
  },

  /**
   * @function changes `pagination.skip` according to `pageNumber`
   */
  changePage (pageNumber) {
    this.pagination.skip = pageNumber * this.pagination.limit;
    return false;
  }
};
