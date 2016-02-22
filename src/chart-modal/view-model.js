import $ from 'jquery';
import _ from 'lodash';
import can from 'can/';
import UserReq from 'utils/request/';
import highcharts from 'highcharts';

var VM = can.Map.extend({
  define:{

  },

  // These three params are passed to the line chart.
  periods: [],
  series: {},
  graphTitle: null,

  modalVisible: false,

  model: null, // The model to be used to find data.

  selectedRowOptions: null, // Passed in.

  /**
   * The error message that shows when no options are passed can be
   * customized by passing it in on this value.
   * @type {String}
   */
  optionsMissingError: null, // Passed in.

  /**
   * Allows us to send error messages to the page.
   * Can set errors as object {text:'Error Message', success:boolean}
   * @type {Object}
   */
  errorMessage: null, // Passed in.

  toggleChartType:function(){
    if (this.attr('chartType') === 'Amount') {
      this.attr('chartType', 'Rate');
    } else {
      this.attr('chartType', 'Amount');
    }
  },

  /**
   * Checks if query options have been passed in before either making the query
   * or displaying an error.
   */
  openModal: function(){
    var selectedRowOptions = this.attr('selectedRowOptions') && this.attr('selectedRowOptions').attr();
    if (!can.isEmptyObject(selectedRowOptions)) {
      this.getChartData();
    } else {
      this.attr('errorMessage', {
        text: this.attr('optionsMissingError') || 'Please select a row before opening the chart.',
        success: false
      });
    }
  },

  /**
   * Closes the modal
   */
  closeModal: function(){
    this.attr('modalVisible', false);
  },

  /**
   * Use the passed-in Model to find data for the chart.  The Model must implement findOne.
   */
  getChartData:function(){
    var self = this;

    // Add Auth params
    var options = UserReq.formRequestDetails(this.attr('selectedRowOptions').attr());

    this.attr('model').findOne(options, function(data){
      if (data.status === 'FAILURE'){
        self.attr('modalVisible', false);
        self.attr('errorMessage', 'Error: ' + data.responseText);
        return;
      }

      // Catch when there's no graphData or the page will freeze up.
      if (!data.series || !data.periods || can.isEmptyObject(data.series.attr())) {
        self.attr('errorMessage', {
          text: data.responseText,
          success: false
        });
        return;
      }

      self.attr('periods', data.periods);
      self.attr('series', data.series);
      self.attr('graphTitle', data.graphTitle);
      self.attr('modalVisible', true);

    // Request fails or no data found.
    }, function(err){
      console.error(err);

      // No JavaScript error should be shown (show only ajax errors).
      // Parse method of the model throws an error in case of an invalid data (or unknown data structure).
      if (err instanceof Error){
        self.attr('errorMessage', 'ERROR: Invalid data received.');
        return;
      }

      self.attr('errorMessage', 'ERROR: '+ (err.message ? err.message :
        'cannot fetch data. ' + (err.status ? 'Status ' + err.status + ': ' + err.statusText : ''))
      );
    });


  }
});

export default VM;