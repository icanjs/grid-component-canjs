import can from 'can';

/**
 * Toggle child rows.
 *
 * ```
 *    <grid-component>
 *      <table>
 *        <thead>
 *          <tr class="{{#if allChildrenVisible}}open{{/if}}">
 *            <th class="expandable-parent" ($click)="toggleAllChildrenVisible(rows)">
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
  define: {
    /**
     * Determine if all child rows should be visible or not.
     * Changes all rows to match the set value.
     * @type {Boolean}
     */
    allChildrenVisible: {
      value: false,
      set: function(value){
        var rows = this.attr('rows');
        if (rows && rows.length) {
          can.batch.start();
          rows.each(function(row){
            if (row && row.attr) {
              row.attr('childrenVisible', value);
            }
          });
          can.batch.stop();
        }
        return value;
      }
    }
  },

  /**
   * Toggles child rows visibility.
   */
  toggleAllChildrenVisible: function(){
    this.attr('allChildrenVisible', !this.attr('allChildrenVisible'));
  },

  /**
   * Toggles visibility of an individual row:
   * @param row
   */
  toggleChildrenVisible: function(row){
    row.attr('childrenVisible', !row.attr('childrenVisible'));
  }
};