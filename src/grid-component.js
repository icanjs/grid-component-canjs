import Component from 'can-component';
import DefineMap from 'can-define/map/map';

import VM from './view-model';
import mixin from './mixins/mixin-util';
import mixinSort, { mixinSortHelpers } from './mixins/sort';
import mixinCheckbox from './mixins/checkbox';
import mixinChildRows from './mixins/child-rows';
import mixinPagination from './mixins/pagination';
import mixinPaginationServer from './mixins/pagination-server';
import { events as mixinLoadOnScrollEvents } from './mixins/load-on-scroll';

/**
 * @page grid-component.grid-component Grid Component
 * @parent grid-component 0
 * @description Grid component.
 * @body
 */
Component.extend({
  tag: 'grid-component',
  viewModel: DefineMap.extend({seal: false}, mixin(VM, mixinSort, mixinCheckbox, mixinChildRows, mixinPaginationServer)),
  events: Object.assign({}, mixinLoadOnScrollEvents),
  helpers: Object.assign({}, mixinSortHelpers)
});
