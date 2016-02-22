import can from 'can';
import 'can/map/define/';

let VM = can.Map.extend({
  loading: false
});

export default VM;