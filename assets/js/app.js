// Set dimensions and margins for scatter boundaries
var margin = {
    top: 30,
    right: 50,
    bottom: 30,
    left: 60
    };

var svgWidth = 900 - margin.left - margin.right;
var svgHeight = 600 - margin.top - margin.bottom;

// Create SVG wrapper, append SVG group to hold chart and shift by left and top margins
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Set initial Params
var chosenXAxis = "income";
var chosenYAxis = "smokes";

// Functions for updating x-scale var upon click on axis label
function xScale(csvData, chosenXAxis, svgWidth) {

    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(csvData, d => d[chosenXAxis]) * .8,
            d3.max(csvData, d => d[chosenXAxis]) * 1.2])
        .range([0,svgWidth]);
    return xLinearScale;
}

// Function used for updating xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {

    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
}

// Function used for updating y-scale var upon click on axis label
function yScale(csvData, chosenYAxis, svgHeight) {

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(csvData, d => d[chosenYAxis]) *.8,
            d3.max(csvData, d=> d[chosenYAxis]) * 1.2])
        .range([svgHeight,0]);
    return yLinearScale;
}

// Function used for upating yAxis var upon click on axis label
function renderYAxis(newYScale, yAxis) {

    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
}

// Function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
}

// Function used for updating circle text with a transition to new circles
function renderText(textGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    textGroup.transition()
        .duration(1000)
        .attr("tx", d => newXScale(d[chosenXAxis]))
        .attr("ty", d => newYScale(d[chosenYAxis]));
    return textGroup;
}

// Function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {

    var xlabel;

    if (chosenXAxis === "poverty") {
        xlabel = "Poverty:";
    } else if (chosenXAxis === "age") {
        xlabel = "Median Age:";
    } else {
        xlabel = "Median Household Income:";
    }

    var ylabel;

    if (chosenYAxis === "healthcare") {
        ylabel = "Healthcare (%):";
    } else if (chosenYAxis === "obesity") {
        ylabel = "Obesity (%):";
    } else {
        ylabel = "Smoker (%):";
    }

    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
        return (`${d.state}<br>${xLabel}: ${d[chosenXAxis]}<br>${yLabel}: ${d[chosenYAxis]}`);
    });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })

    // On mouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    textGroup.call(toolTip);

    textGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })

    // On mouseout event
    .on("moseout", function(data, index) {
        toolTip.hide(data);
    })
    return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv").then(function(csvData, err) {
    if(err) throw err;

    // Parse data from csv file
    csvData.forEach(function(dataitem) {
        dataitem.poverty = +dataitem.poverty;
        dataitem.age = +dataitem.age;
        dataitem.income = +dataitem.income;
        dataitem.healthcare = +dataitem.healthcare;
        dataitem.obesity = +dataitem.obesity;
        dataitem.smokes = +dataitem.smokes;
    });

    // X and Y LinearScale function above csv import
    var xLinearScale = xScale(csvData, chosenXAxis, svgWidth);
    var yLinearScale = yScale(csvData, chosenYAxis, svgHeight);

    // Create inital axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append X axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transofrm", `translate(0, ${height})`)
        .call(bottomAxis);
    
    // Append Y Axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis);
    
    
  
})