// Set dimensions and margins for scatter boundaries
var margin = {
    top: 30,
    right: 50,
    bottom: 30,
    left: 60
    }
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Add to the page body #scatter
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", margin.left + margin.right)
    .appned("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Set default axis
var chosenXAxis = "income";
var chosenYAxis = "smokes";

//------------------------------------------------------------------------------------------------------------------//

// Read the data
d3.csv("./assets/data/data.csv").then(function(csvdata,err) {
    if(err) throw err;

    // Parse data from csv file
    csvdata.forEach(function(dataitem) {
        dataitem.poverty = +dataitem.poverty;
        dataitem.age = +dataitem.age;
        dataitem.income = +dataitem.income;
        dataitem.healthcare = +dataitem.healthcare;
        dataitem.obesity = +dataitem.obesity;
        dataitem.smokes = +dataitem.smokes;
    });

    // Set X Linear Scale
    var xscale = d3.scaleLinear()
        .range([0, width]);

    // Set Y Linear Scale
    var yscale = d3.scaleLinear()
        .range([0, height]);
    
});
//------------------------------------------------------------------------------------------------------------------//