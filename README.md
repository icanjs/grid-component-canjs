[![Build Status](https://travis-ci.org/icanjs/grid-component.svg?branch=master)](https://travis-ci.org/icanjs/grid-component)
[![npm version](https://badge.fury.io/js/grid-component.svg)](https://badge.fury.io/js/grid-component)
[![Join the chat at https://gitter.im/icanjs/grid-component](https://badges.gitter.im/icanjs/grid-component.svg)](https://gitter.im/icanjs/grid-component?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# Grid Component built with CanJS

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

### Simple pagination
See `src/demo/demo-pagination.html` for a full example.
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

- 0.7.2 Added changePage, hasPages.
- 0.7.0 Added simple pagination support with helpers: next(), prev(), pages object. Provide `pagination` config option with a number of how many rows to show per page. Use `pagedRows` derived list.