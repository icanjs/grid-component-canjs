import can from 'can/';

var VM = can.Map.extend({
  
  content:'', // Passed in.

  copyToClipboardTagName: 'copy-to-clipboard',
    
  // Close the modal
  closeModal: function(){
    this.attr('modalVisible', false);
  },
  
  selectAll: function(scope, el) {
    var tagName = this.attr('copyToClipboardTagName'),
      node = el.parents(tagName).find('.ctc-content')[0];

    var range;
    if ( document.selection ) {
      range = document.body.createTextRange();
      range.moveToElementText( node  );
      range.select();
    } else if ( window.getSelection ) {
      range = document.createRange();
      range.selectNodeContents( node );
      window.getSelection().removeAllRanges();
      window.getSelection().addRange( range );
    }
  }
});

export default VM;