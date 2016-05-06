[![Build Status](https://travis-ci.org/icanjs/grid-component.svg?branch=master)](https://travis-ci.org/icanjs/grid-component)
[![npm version](https://badge.fury.io/js/grid-component.svg)](https://badge.fury.io/js/grid-component)
[![Join the chat at https://gitter.im/icanjs/grid-component](https://badges.gitter.im/icanjs/grid-component.svg)](https://gitter.im/icanjs/grid-component?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# Grid Component built with CanJS

A template based grid component that supports sorting, row selection, paged rendering and checkboxes. Built with CanJS.

Feel free to [open an issue](https://github.com/icanjs/grid-component/issues) or chat with us [on gitter](https://gitter.im/icanjs/grid-component).

![Grid Demo](./dist/demo.png)

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

## Features
- **Sorting**. *Mixin, by default is on*
- Row selection.
- Checkbox row selection. *Mixin, by default is on*
- Expandable child rows. *Mixin, by default is on*
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
 - **sortAsc** Boolean, TRUE for ascending, FALSE for descending.
- **selectedRow** The row selected by clicking.
- Checkbox mixin:
 - **isHeaderChecked** To be used for the header "master" checkbox.
 - areAllVisibleChecked

### Template helpers and methods:
- **selectRow** Method for row selection
- **sortArrow** Helper to show a sort arrow.