import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import _ from 'lodash';

import VM from './view-model';
import mixin from './mixins/mixin-util';
import mixinSort, { mixinSortHelpers } from './mixins/sort';
import mixinCheckbox from './mixins/checkbox';
import mixinChildRows from './mixins/child-rows';
import mixinPagination from './mixins/pagination';

/**
 * @page grid-component.grid-component Grid Component
 * @parent grid-component 0
 * @description Grid component.
 * @body
 */
Component.extend({
  tag: 'grid-component',
  viewModel: DefineMap.extend({seal: false}, mixin(VM, mixinSort, mixinCheckbox, mixinChildRows, mixinPagination)),
  events: {
    'inserted': function (element) {
      const self = this;
      const tbody = element.querySelector('.grid-wrapper tbody');

      // Trigger 'grid-should-load-more' EVENT on scroll when scroll position is close to the bottom (1/4 of the body height).
      if (this.viewModel.loadOnScroll) {
        const scrollThrottleInterval = parseInt(this.viewModel.attr('scrollThrottleInterval'));
        const scrollBottomDistance = parseFloat(this.viewModel.attr('scrollBottomDistance'));
          // eventName = this.viewModel.attr('scrollEventName');

        // TODO: should we put the following logic here: stop triggering grid-should-load-more if after the last event rows were not added. ?
        // We should always throttle scroll events.
        tbody.on('scroll', _.throttle(function (ev) {
          var tbodyEl = ev.target;
          var distanceFromTop = tbodyEl.scrollTop + tbodyEl.clientHeight;
          var shouldLoadMore = distanceFromTop >= Math.min(tbodyEl.scrollHeight / 2, tbodyEl.scrollHeight * (1 - scrollBottomDistance));
          if (shouldLoadMore) {
            // TODO: there is no jquery wrapped element anymore.
            // element.trigger(eventName);
            self.viewModel.increaseEndIndex();
          }
        }, scrollThrottleInterval));
      }
    }
  },
  helpers: Object.assign({}, mixinSortHelpers)
});
