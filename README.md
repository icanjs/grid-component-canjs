# Grid Component built with CanJS

[![Build Status](https://travis-ci.org/icanjs/grid-component.svg?branch=master)](https://travis-ci.org/icanjs/grid-component)
[![npm version](https://badge.fury.io/js/grid-component.svg)](https://badge.fury.io/js/grid-component)
[![Join the chat at https://gitter.im/icanjs/grid-component](https://badges.gitter.im/icanjs/grid-component.svg)](https://gitter.im/icanjs/grid-component?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![js-semistandard-style](https://cdn.rawgit.com/Flet/semistandard/master/badge.svg)](https://github.com/Flet/semistandard)


A template based grid component that supports sorting, row selection, paged rendering and checkboxes. Built with CanJS.

Feel free to [open an issue](https://github.com/icanjs/grid-component/issues) or chat with us [on gitter](https://gitter.im/icanjs/grid-component).

![Grid Demo](./assets/demo.png)

## Installation

```
npm install grid-component --save
```

To check out the demo:
- install dependencies;
- run http server on the root of the project;
- load the demo file in browser _(src/demo/demo.html)_.

## Use

```html
<can-import from="grid-filter" />

<grid-component {(rows)}="items">

  <div class="grid-tools">
    <grid-filter {(rows)}="rows"></grid-filter>
  </div>

  <table>
    <thead>
      <tr>
        <th ($click)="{sortBy 'title'}">Title {{{sortArrow 'title'}}}</th>
        <th ($click)="{sortBy 'amount'}">Amount {{{sortArrow 'amount'}}}</th>
      </tr>
    </thead>

    <tbody>
      {{#each rows}}
        <tr class="{{#if isHidden}}hidden{{/if}}">
          <td>{{title}}</td>
          <td>{{amount}}</td>
        </tr>
      {{/each}}
    </tbody>
  </table>

</grid-component>
```

### Server pagination: total, limit and skip

For a full demo see `src/demo/demo-pagination-server.html`.

Your view model:
```js
import DefineMap from "can-define/map/map";
import DefineList from "can-define/list/list";

let myPageViewModel = DefineMap.extend({
  rows: {
    type: DefineList
  },
  pagination: DefineMap.extend({
    skip: 'number',
    limit: 'number',
    total: 'number'
  }),
  loadPage () {
    let pagination = this.pagination;
    MyModel.getList({skip: pagination.skip, limit: pagination.limit}).then(items => {
      this.rows = items;
    });
  }
});
```

and template:
```html
    <grid-component {(rows)}="rows" {(pagination)}="pagination" (onpage)="loadPage()">
      <table>
        <tbody>
          {{#each rows}}
            <tr>
              <td>{{id}}</td>
              <td>{{title}}</td>
            </tr>
          {{/each}}
        </tbody>
      </table>
      {{#if hasPages}}
      <button ($click)="prev()" {{^if isPrevActive}} disabled {{/if}}>Prev</button>
      <ul>
        {{#each pages}}
          <li class="{{#if isActive}}active{{/if}}" ($click)="changePage(pageNumber)">
            {{pageTitle}}
          </li>
        {{/each}}
      </ul>
      <button ($click)="next()" {{^if isNextActive}} disabled {{/if}}>Next</button>
      {{/if}}
    </grid-component>
```

### Simple local pagination: custom view-model configuration

For how to define grid component with a custom view-model see the section below.

For the full demo see `src/demo/demo-pagination.html`.

```html
    <grid-component {(rows)}="items" pagination="10">
      <table>
        <tbody>
          {{#each pagedRows}}
            <tr>
              <td>{{id}}</td>
              <td>{{title}}</td>
            </tr>
          {{/each}}
        </tbody>
      </table>
      {{#if hasPages}}
      <button ($click)="prev()" {{^if isPrevActive}} disabled {{/if}}>Prev</button>
      <ul>
        {{#each pages}}
          <li class="{{#if isActive}}active{{/if}}" ($click)="changePage(pageNumber)">
            {{pageTitle}}
          </li>
        {{/each}}
      </ul>
      <button ($click)="next()" {{^if isNextActive}} disabled {{/if}}>Next</button>
      {{/if}}
    </grid-component>
```

### Custom view-model:

To customize grid's view model you can choose any of the available mixins as well as and provide your own
to override them.

E.g. if you need only sorting and local pagination (all rows will be given to the grid)
you can do:

```
import VM from 'grid-component/src/view-model';
import mixinSort, { mixinSortHelpers } from 'grid-component/src/mixins/sort';
import mixinPagination from 'grid-component/src/mixins/pagination';

let MyCustomVM = DefineMap.extend({seal: false}, mixin(VM, mixinSort, mixinPagination));

Component.extend({
   tag: 'my-grid-component',
   viewModel: MyCustomVM,
   helpers: Object.assign({}, mixinSortHelpers)
});
```

Note: can.Component allows to declare a tag only one time, so make sure you either do not import the default
`grid-component` or name your new tag differently (e.g. `my-grid-component`).


## Features
- **Sorting**. *Mixin, by default is on*.
- **Simple pagination**. *Mixin, by default is on*. Includes `pagination` numeric config property of how many rows are shown per page, methods: `next`, `prev`, `changePage`.
- Row selection.
- Checkbox row selection. *Mixin, by default is on*.
- Expandable child rows. *Mixin, by default is on*.
- **Filtering** (with external grid-filter component)
- Scroll-near-bottom events. To use for loading/showing more rows on scroll.
- **Paged rendering**. A performance enhancement for cases when there are a lot of rows (n x 10K), when grid renders
the specified amount of rows (renderPageSize) and adds a new render page when uses scrolls close to the bottom.
Works well with sorting and filtering.

## API:
- **rows** Data source of the rows.

### Configuration:
- **renderPageSize** How many pages grid should render. To use with a lot of rows. Default 200.
- **loadOnScroll** If ON grid will emit _scrollEventName_ when user scrolls close to the bottom.
- **scrollThrottleInterval**
- **scrollBottomDistance**
- **scrollEventName** Event name. Default _grid-should-load-more_.
- **pagination** How many rows show per page.

### Read API:
- Derived lists:
 - **visibleRows** A derived list with rows that are not hidden by filter (row's isHidden is false).
 - **renderedRows** List of rendered rows (to be used with renderPageSize).
 - visibleEnabledRows
 - **checkedRows** List of checked rows
 - checkedVisibleRows
 - checkedVisibleEnabledRows
- Sorting mixin:
 - **sortColumnName** Indicates what column the rows are sorted by.
 - **sortAsc** &lt;Boolean&gt;, TRUE for ascending, FALSE for descending.
- **selectedRow** The row selected by clicking.
- Checkbox mixin:
 - **isHeaderChecked** To be used for the header "master" checkbox.
 - areAllVisibleChecked.
- Simple pagination mixin:
 - **pagedRows** List of rows to show for the current page.
 - *currentPage* &lt;Number&gt; Number of the current page (starts with 0).
 - *hasPages* &lt;Boolean&gt; Indicates whether there are pages.

### Template helpers and methods:
- **selectRow** Method for row selection
- **sortArrow** Helper to show a sort arrow.
Pagination:
- **next** Method to go to the next page.
- **prev** Method to go to the previous page.
- **changePage** Method to set page to a particular number.

## Changelog

- 0.9.0 Added `pagination-server` mixin to handle server-side pagination based on `total`, `limit` and `skip` params.
  - set `pagination-server` as a default mixin (instead of local `pagination`).
- 0.8.0 Upgraded to CanJS v3 and Steal v1.
  - switched to Semistandard.
- 0.7.2 Added changePage, hasPages.
- 0.7.0 Added simple pagination support with helpers: next(), prev(), pages object. Provide `pagination` config option with a number of how many rows to show per page. Use `pagedRows` derived list.