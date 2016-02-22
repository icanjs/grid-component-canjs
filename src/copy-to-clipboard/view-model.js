import can from 'can/';

/**
 * ViewModel
 * The component will remove columns with class "no-print" before printing them to the output. E.g. checkbox, expandable toggles, etc.
 */

var VM = can.Map.extend({
    
  modalVisible: false,
  
  content:null,

  /**
   * You can pass in a boolean value bound to a grid's footer being expanded
   * to have this component expand the footer before copying the content.
   */
  footerExpanded: null,

  /**
   * First, expands the grid's footerExpanded if it's not null.  Null would mean 
   * that no value has been provided for it.
   * Next, it pulls table data from the grid-component's main table (DOM).
   * Sets it up on content attr.  
   * Opens the modal. Closing is done in the modal's component.
   */
  openModal: function(scope, el){
    if (this.attr('footerExpanded') !== null) {
      this.attr('footerExpanded', true);
    }
    var $grid = el.parents('grid-component');
    if ($grid.find('grid-empty').length) {
      this.attr('errorMessage', {
        text: 'No Data Available.',
        success: true
      });
    } else {
      var $table = $grid.find('.grid-wrapper table:not(.hidden)');
      $table = $table.clone();
      this.attr('footerExpanded', false);
      // Remove columns marked as "no-print":
      $table.find('.no-print').remove();
      // remove checkbox cells:
      $table.find('.cell-checkbox').remove();
      this.attr('content', $table[0].outerHTML);
      
      this.attr('modalVisible', true);
    }

    
  }
});

export default VM;