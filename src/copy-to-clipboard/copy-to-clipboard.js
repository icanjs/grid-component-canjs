import can from 'can/';
import VM from './view-model';
import template from './template.stache!';

import './ctc-modal/';

/**
 * Components takes an html content to be used for copy-to-clipboard.
 * Content will be cloned, cleaned up and shown in a regular table (fixed columns).
 * Any table elements that have "no-print" class will be stripped off (e.g. checkbox, expand toggles, etc).
 */
can.Component.extend({
  tag:'copy-to-clipboard',
  viewModel:VM,
  template:template
});