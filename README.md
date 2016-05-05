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