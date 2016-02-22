import can from 'can';
import './styles.less!';
import template from './template.stache!';

can.Component.extend({
  tag: 'grid-loading',
  template: template
});