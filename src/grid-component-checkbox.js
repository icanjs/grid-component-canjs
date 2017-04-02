import can from 'can';
import 'can/map/define/';
import './styles.less!';
import 'helpers/no-binding';
import VM from './view-model';

/**
 * Use this component only if you need a hash map of checked rows and you want to iterate over it.
 * See demo/demo-checkbox.html for details.
 */

can.Component.extend({
  tag: 'grid-component-checkbox',
  viewModel: VM,
  events: {
    'td.cell-checkbox input click': function (el, ev) {
      var row = el.data.row;
      console.log('TD.cell-checkbox input click', row);
      this.viewModel.checkRow(row);
    },
    'th.cell-checkbox input click': function (el, ev) {
      console.log('TH.cell-checkbox input click');
      this.viewModel.checkRows();
    }
  }
});
