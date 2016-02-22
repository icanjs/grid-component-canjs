For the dynamic grid below see the data expected from server. To render columns use grid's column helper.
You can find a detailed example in _components/page-sample_. 

```javascript
var data = {
  "status": "SUCCESS",
  "responseCode": "0000",
  "responseText": "Request processed successfully.",

  //
  "listAttr": "accruals",
  "childListAttr": "accrualDetails",

  /**
   *  uiType determines the template for the cell.
   */
  "columns": [

    // Regular
    {
      "title": "Period",
      "attrName": "period",
      "length": "20", // length in characters
      "before": "",   // Optional
      "after": ""     // Optional
    }, 

    // Date:
    // uiType = Date
    // Result: "2014-01-24 15:25:55"
    {
      "title": "Date",
      "attrName": "Date",
      "uiType": "Date",
      "format": "YYYY-MM-DD, HH:mm:ss" // 2014-01-24 15:25:55 
    }, 

    // Number, currency amount, rate
    // uiType = Number
    // Result: "1,123,456.50"
    {
      "title": "Play Count",
      "attrName": "playCount",
      "length": "20",
      "uiType": "Number",
      "decimals": "2",  // Two decimals: 0.00
      "before": "$",    // for currency if needed
      "after": "%"      // For percentages.
    }, 


    // Link to download a file
    // uiType = Download
    // 
    // Requires data in this format.
    // "fileDetails": {
    //   "fileName": "myfile.txt",
    //   "fileId": "1234",
    //   "fileType": "OUTBOUND"
    // }
    //
    // Result: Urls.INTEGRATION_SERVICE_URL + 'downloadFile/' + params.fileId + '/' + params.fileType
    {
      "colTitle": "File",
      "attrName": "Download",
      "length": "20",
      "uiType": "download"
    }, 

    // Link to an external resource
    // uiType = Link
    // 
    // Requires data in this format.
    // "link": {
    //   "text": "View",
    //   "href": "http://whatever.com"
    // },
    {
      "colTitle": "Link",
      "attrName": "link",   // The attr serves as a text for the link
      "length": "20",
      "uiType": "Link",
      "target": "_blank"
    }, 

    // uiType = Custom 
    // HANDLED BY THE UI TEAM.
    {
      "colTitle": "Pricing Model",
      "attrName": "accrualModel",
      "length": "20",
      "uiType": "Custom"
    }
  ]

  //...

}
```