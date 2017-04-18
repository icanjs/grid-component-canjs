import Component from 'can-component';
import DefineMap from 'can-define/map/map';

import VM from './view-model';
import mixin from './mixins/mixin-util';
import mixinSort, { mixinSortHelpers } from './mixins/sort';
import mixinCheckbox from './mixins/checkbox';
import mixinChildRows from './mixins/child-rows';
// import mixinPagination from './mixins/pagination';
import mixinPaginationServer from './mixins/pagination-server';
import { events as mixinLoadOnScrollEvents } from './mixins/load-on-scroll';

/**
 * @page grid-component.grid-component Grid Component
 * @parent grid-component 0
 * @description Grid component.
 * @body
 *
 * To customize grid's view model you can choose any of the available mixins as well as and provide your own
 * to override them.
 *
 * E.g. if you need only sorting and local pagination (all rows will be given to the grid)
 * you can do:
 *
 * ```
 * import VM from 'grid-component/src/view-model';
 * import mixinSort, { mixinSortHelpers } from 'grid-component/src/mixins/sort';
 * import mixinPagination from 'grid-component/src/mixins/pagination';
 *
 * let MyCustomVM = DefineMap.extend({seal: false}, mixin(VM, mixinSort, mixinPagination));
 *
 * Component.extend({
 *    tag: 'my-grid-component',
 *    viewModel: MyCustomVM,
 *    helpers: Object.assign({}, mixinSortHelpers)
 * });
 * ```
 *
 * Note: can.Component allows to declare a tag only one time, so make sure you either do not import the default
 * `grid-component` or name your new tag differently (e.g. `my-grid-component`).
 */
Component.extend({
  tag: 'grid-component',
  viewModel: DefineMap.extend({seal: false}, mixin(VM, mixinSort, mixinCheckbox, mixinChildRows, mixinPaginationServer)),
  events: Object.assign({}, mixinLoadOnScrollEvents),
  helpers: Object.assign({}, mixinSortHelpers)
});
