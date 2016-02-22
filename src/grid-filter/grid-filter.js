/**
 * @module rin.components.grid-component.grid-filter Grid Filter
 * @parent rin.components.grid-component 1
 * @description Input field to filter grid rows.
 * @body
 */

import VM from './view-model';
import template from './template.stache!';
import './styles.less!';
import 'rins_cutom_plugin/tokenInput/jquery.tokeninput';
import './jquery.tokeninput-styles/token-input-facebook.css!';

can.Component.extend({
    tag: 'grid-filter',
    viewModel: VM,
    template: template,
    events: {
      
      /**
       * Run the jQuery.tokenizer plugin when the templated is inserted.
       * When the input updates, the tokenizer will update the searchTerms
       * in the viewModel.
       */
      'inserted': function(el){
        var self = this;
        var $input = $('input.tokenSearch', el);
        var suggestions = new can.List([]);
        this.viewModel.attr('searchInput', $input);

        // http://loopj.com/jquery-tokeninput/
        $input.tokenInput(suggestions, {
          theme: 'facebook',
          placeholder:'Search...',
          preventDuplicates: true,
          allowFreeTagging:true,
          tokenLimit:3,
          allowTabOut:false,

          /**
           * onResult is used to pre-process suggestions.
           * In our case we want to show current item if there is no results.
           */
          onResult: function (item) {
            if($.isEmptyObject(item)){
              var tempObj={ id: $('input:first', el).val(), name: $('input:first', el).val()};
              return [tempObj];
            }else{
              return item;
            }
          },

          /**
           * onAdd is used to maintain the suggestion dropdown box and the searchTerms in the scope. 
           * It is called internally by the jquery.tokenInput plugin when either the enter key 
           * is pressed in the input box or a selection is made in the suggestions dropdown.
           */
          onAdd: function (item) {
            // Check if it already exists in the suggestions list.  Duplicates aren't allowed.
            var exists = false;
            for(var j = 0; j < suggestions.length; j++){
              if(suggestions[j].attr('name').toLowerCase() === item.name.toLowerCase()){
                exists=true;
                break;
              }
            }
            // If it didn't exist, add it to the list of suggestions and the searchTerms.
            if(!exists){
              suggestions.push(item);
            }

            // We are using searchTerms's setter to execute the filter, so have to set the property (not just update):
            var searchTerms = self.viewModel.attr('searchTerms').attr().concat(item.name);
            self.viewModel.attr('searchTerms', searchTerms);
          },
          
          /**
           * onDelete is used to remove items from searchTerms in the scope. It is called internally 
           * by the jquery.tokenInput plugin when a tag gets removed from the input box.
           */
          onDelete: function (item) {
            var searchTerms = self.viewModel.attr('searchTerms').attr(),
              searchTerm = item && (item.id || item.name || item);
            searchTerms.splice(searchTerms.indexOf(searchTerm), 1);
            // We are using searchTerms's setter to execute the filter, so have to set the property (not just update):
            self.viewModel.attr('searchTerms', searchTerms);
          }
        });
      },

      /**
       * Teardown the token-input plugin when this component gets removed.
       */
      removed: function(){
        $('input.tokenSearch', this.element).tokenInput('destroy');
      },

      // Run the filter if new items were added to the rows:
      '{rows} length': function(){
        this.viewModel.filter(this.viewModel.attr('searchTerms'), this.viewModel.attr('rows'));
      }
    }
});