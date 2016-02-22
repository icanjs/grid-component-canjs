/**
 * @module rin.components.grid-component.chart-modal Chart Modal
 * @parent rin.components.grid-component 2
 * @description Modal dialog to show chart.
 * @body
 */

import can from 'can/';
import viewModel from './view-model';
import template from './template.stache!';
import './styles.less!';
import 'jquery-ui';

can.Component.extend({
  tag:'chart-modal',
  viewModel:viewModel,
  template:template,
  events: {
    // If the escape key is pressed, close the modal.
    '{document} keyup' : function(el, ev){
      if (ev.keyCode === 27){
        this.viewModel.closeModal();
      }
    }
  }
});