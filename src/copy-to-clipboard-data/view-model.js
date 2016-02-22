import can from 'can/';
import 'can/map/define/';

var VM = can.Map.extend({
  define: {
    modalVisible: {
      value: false
    },

    data: {
      set(value){
        if (!value.length) {
          this.attr('errorMessage', {
            text: 'No Data Available',
            success: true
          });
        } else {
          this.attr('modalVisible', true);
        }
        return value;
      }
    }
  }
});

export default VM;