import can from 'can/';
import VM from './view-model';
import './styles.less!';
import template from './template.stache!';

can.Component.extend({
  tag:'ctc-modal',
  viewModel:VM,
  template:template,
  events:{
    
    // Auto-selects the table contents.
    'inserted': function(element){
      this.viewModel.selectAll(null, element);

      // TODO: Remove this jQuery call and figure out a different solution to the problem,
      // which is that in the normal grid, table cells with a col-span attribute still require
      // extra empty cells to be inserted afterwards.  (This is probably due to the css hack 
      // that we're doing on the table in order to make the tbody element scrollable.)  But,
      // when we copy the table over, the col-span attribute doesn't work the same and needs
      // to have the extra table cells removed from the ui.
      $('.ctc-hidden', element).hide();
    },
    
    // If the escape key is pressed, close the modal.
    '{document} keyup' : function(el, ev){
      if (ev.keyCode === 27){
        this.viewModel.closeModal();
      }
    }
  }
});