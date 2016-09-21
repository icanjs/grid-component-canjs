import can from 'can';
import 'can/map/define/';

import VM from './view-model';
import mixin from './mixins/mixin-util';
import mixinSort from './mixins/sort';
import { mixinSortHelpers } from './mixins/sort';
import mixinCheckbox from './mixins/checkbox';
import mixinChildRows from './mixins/child-rows';

/**
 * @page grid-component.grid-component Grid Component
 * @parent grid-component 0
 * @description Grid component.
 * @body
 */
can.Component.extend({
  tag: 'grid-component',
  viewModel: mixin(VM, mixinSort, mixinCheckbox, mixinChildRows),
  //viewModel: can.Map.extend(VM),
  events: {
    'inserted': function(){
      var self = this,
        tbody = this.element.find('.grid-wrapper tbody');

      // Trigger 'grid-should-load-more' EVENT on scroll when scroll position is close to the bottom (1/4 of the body height).
      if (this.viewModel.loadOnScroll){
        var scrollThrottleInterval = parseInt(this.viewModel.attr('scrollThrottleInterval')),
          scrollBottomDistance = parseFloat(this.viewModel.attr('scrollBottomDistance')),
          eventName = this.viewModel.attr('scrollEventName');

        // TODO: should we put the following logic here: stop triggering grid-should-load-more if after the last event rows were not added. ?
        // We should always throttle scroll events.
        tbody.on('scroll', _.throttle(function(ev){
          var tbodyEl = ev.target;
          var distanceFromTop = tbodyEl.scrollTop + tbodyEl.clientHeight;
          var shouldLoadMore = distanceFromTop >= Math.min(tbodyEl.scrollHeight/2, tbodyEl.scrollHeight * (1 - scrollBottomDistance));
          if (shouldLoadMore){
            self.element.trigger(eventName);
            self.viewModel.increaseEndIndex();
          }
        }, scrollThrottleInterval));
      }
    }
  },
  helpers: Object.assign({}, mixinSortHelpers)
});
