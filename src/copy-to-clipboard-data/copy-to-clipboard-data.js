import can from 'can/';
import VM from './view-model';
import template from './template.stache!';

import '../copy-to-clipboard/ctc-modal/';

can.Component.extend({
  tag: 'copy-to-clipboard-data',
  viewModel: VM,
  template: template
});