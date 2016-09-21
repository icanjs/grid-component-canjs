import $ from 'jquery';
import can from 'can';
import 'src/grid-component';
import 'src/styles.less!';
import 'src/demo/styles.less!';
import template from './demo-public.stache!';

let VM = {
  rows: _.times(10, i => {
    return {
      region: ['Europe','America'][i % 2],
      country: ['AUT','USA','SWE','CAN'][i % 4],
      amount: [100, 200, 300][i % 3]
    };
  }),
  selectedRow: null
};

$('body').append(template(VM));
