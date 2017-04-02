import DefineList from 'can-define/list/list';
import DefineMap from 'can-define/map/map';
import 'src/grid-component';
import 'src/styles.less!';
import 'src/demo/styles.less!';
import template from './demo-public.stache';
import _ from 'lodash';

let VM = {
  rows: new DefineList(_.times(10, i => {
    return new DefineMap({
      region: ['Europe', 'America'][i % 2],
      country: ['AUT', 'USA', 'SWE', 'CAN'][i % 4],
      amount: [100, 200, 300][i % 3],
      selected: false,
      isChecked: false
    });
  })),
  selectedRow: null
};

document.body.appendChild(template(VM));
