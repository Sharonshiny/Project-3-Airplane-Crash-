
function buildMetadata(operator) {
    // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var metadataURL = "/metadata/" + operator;
    var metadata =d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    metadata.html("");
    
    // Use `Object.entries` to add each key and value pair to the panel
    d3.json(metadataURL).then(function (data){
      console.log(data.results);
      Object.entries(data.results[0]).forEach(([key,value])=>
      {
        metadata.append("h6").text(`${key}:${value}`)
      });
});
}

function buildSummaryChart(operator) {
  var oper = d3.select("#op_name");
  oper.text(operator);
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var chartsURL = "/crashCount/" + operator;
     d3.json(chartsURL).then(function (data){
      console.log(data);
//       // @TODO: Build a Line Chart using the sample data
      console.log(chartsURL);
      xvalue=[];
      yvalue=[];
      for (var i = 0, len = data.length; i < len; i++) {
        var year = data[i].year;
        xvalue.push("Y"+year);
        yvalue.push(data[i].Fatalities)
      };
      var bartype = "line";
      if(xvalue.length<3) bartype = "bar";
      console.log(bartype); 
      console.log(xvalue);
      var trace1 = {
        x: xvalue,
        y: yvalue,
        type: bartype,
        //text: data.year,
        marker: {
          color: 'red',
          colorscale: "Earth"
        }
      };
      var chartData = [trace1];
      var layout = {
        title:"Fatality count vs Year ",
        showlegend: false,
        height: 600,
        width: 900,
        xaxis: {
          title: 'Year',
          titlefont: {
            family: 'Arial, sans-serif',
            size: 18,
            color: 'Black'
          }
        },
        yaxis: {
          title: 'Fatality_Count',
          titlefont: {
            family: 'Arial, sans-serif',
            size: 18,
            color: 'Black'
          }
        }
      };
      Plotly.newPlot('countChart', chartData, layout);
  })
}

function buildCrashByMonthChart() {
  var months = {
    1 : "Jan", 2 : "Feb", 3 : "Mar", 4 : "Apr", 5 : "May", 6 : "Jun",
    7 : "Jul", 8 : "Aug", 9 : "Sep", 10 : "Oct", 11 : "Nov", 12 : "Dec"
  };
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var chartsURL = "/crashByMonth";
     d3.json(chartsURL).then(function (data){
      console.log(data);
      console.log(chartsURL);
      xvalue=[];
      yvalue=[];
      for (var i = 0, len = data.length; i < len; i++) {
        var month = data[i]._id;
        xvalue.push(months[month]);
        yvalue.push(data[i].sum)
      };
      console.log(xvalue);
      console.log(yvalue);
      var trace1 = {
        x: xvalue,
        y: yvalue,
        type: "bar",
        //text: data.year,
        marker: {
          colorscale: "Earth"
        }
      };
      var chartData = [trace1];
      var layout = {
        title:"Crashes by month",
        showlegend: false,
        height: 600,
        width: 900,
        xaxis: {
          title: 'Month',
          titlefont: {
            family: 'Arial, sans-serif',
            size: 18,
            color: 'Black'
          }
        },
        yaxis: {
          title: 'Crashes',
          titlefont: {
            family: 'Arial, sans-serif',
            size: 18,
            color: 'Black'
          }
        }
        
      };
      Plotly.newPlot('crashByMonthChart', chartData, layout);
  })
}

function buildAirlineTypeChart() {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var chartsURL = "/Operator_name";
  mCount = 0;
  pCount = 0;
  d3.json("/Operator_name").then((airlineNames) => {
    airlineNames.forEach((names) => {
      if(names.includes("Military")) {
        mCount++; 
      } else {
        pCount++;
      }
    });
    var data = [{
      values: [mCount, pCount],
      labels: ["Military", "Passenger"],
      type: 'pie'
    }];
    
    var layout = {
      height: 400,
      width: 500
    };
    
    Plotly.newPlot('airlineType', data, layout); 
});
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  console.log(selector);
  // Use the list of sample names to populate the select options
  d3.json("/Operator_name").then((airlineNames) => {
    airlineNames.forEach((names) => {
      selector
        .append("option")
        .text(names)
        .property("value", names);
    });
    // Use the first sample from the list to build the initial plots
    const firstSample = airlineNames[0];
    console.log(firstSample);
    buildSummaryChart(firstSample);
    buildMetadata(firstSample);
  });
  
  buildCrashByMonthChart();
  buildAirlineTypeChart();
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  //buildCharts(newSample);
  buildSummaryChart(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
