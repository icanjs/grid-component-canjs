import can from 'can/';
import viewModel from './view-model';
import './styles.less!';
import template from './template.stache!';

can.Component.extend({
  tag:'excel-export',
  viewModel:viewModel,
  template:template
});