import queues from 'can-queues';

/**
 * Toggle child rows.
 *
 * ```
 *    <grid-component>
 *      <table>
 *        <thead>
 *          <tr class="{{#if allChildrenVisible}}open{{/if}}">
 *            <th class="expandable-parent" on:click="toggleAllChildrenVisible(rows)">
 *              <span class="open-toggle"></span>
 *            </th>
 *          </tr>
 *        </thead>
 *        <tbody>
 *          {{#each rows}}
 *          <td class="col-expand expandable-parent no-print" can-click="toggleChildrenVisible ."><span class="open-toggle"></span></td>
 *            <tr>
 *              <td>{{title}}</td>
 *            </tr>
 *            {{#if childrenVisible}}
 *              {{#each children}}
 *                <tr>
 *                  <td>{{title}}
 *                </tr>
 *              {{/each}}
 *            {{/if}}
 *          {{/each}}
 *        </tbody>
 *      </table>
 *    </grid-component>
 *
 * ```
 */

export default {
  /**
   * Determine if all child rows should be visible or not.
   * Changes all rows to match the set value.
   * @type {Boolean}
   */
  allChildrenVisible: {
    default: false,
    set: function (value) {
      var rows = this.rows;
      if (rows && rows.length) {
        queues.batch.start();
        rows.forEach(function (row) {
          if (row) {
            row.childrenVisible = value;
          }
        });
        queues.batch.stop();
      }
      return value;
    }
  },

  /**
   * Toggles child rows visibility.
   */
  toggleAllChildrenVisible: function () {
    this.allChildrenVisible = !this.allChildrenVisible;
  },

  /**
   * Toggles visibility of an individual row:
   * @param row
   */
  toggleChildrenVisible: function (row) {
    row.childrenVisible = !row.childrenVisible;
  }
};
