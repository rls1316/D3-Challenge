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
function updatetoolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {

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
        return (`${d.state}<br>${xlabel}: ${d[chosenXAxis]}<br>${ylabel}: ${d[chosenYAxis]}`);
    });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })

    // On mouseout event
    .on("mouseout", function(data) {
        toolTip.hide(data);
    });

    textGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })

    // On mouseout event
    .on("moseout", function(data) {
        toolTip.hide(data);
    });
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
        .attr("transform", `translate(0, ${0, svgHeight})`)
        .call(bottomAxis);
    
    // Append Y Axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis);
    
    // Append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(csvData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("fill", "blue")
        .attr("opacity", ".5");

    // Append text for circles
    var textGroup = circlesGroup.append('text')
        .text(d => d.abbr)
        .attr("class", "stateText")
        .attr("tx", d => xLinearScale(d[chosenXAxis]))
        .attr("ty", d => yLinearScale(d[chosenYAxis]));
    
    // Create group for x-axis labesls
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${svgWidth / 2}, ${svgHeight + 20})`);
    
    var labelPoverty = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .attr("fill", "black")
        .classed("active", true)
        .text("Poverty");
    
    var labelAge = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .attr("fill", "black")
        .classed("active", false)
        .text("Median Age");
    
    var labelIncome = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .attr("fill", "black")
        .classed("active", false)
        .text("Median Household Income");

    // Create group for y-axis labels
    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    var labelHealthcare = ylabelsGroup.append("text")
        .attr("x", 0 - (svgHeight / 2))
        .attr("y", 40 - margin.left)
        .attr("ty", "1em")
        .attr("value", "healthcare")
        .attr("fill", "black")
        .classed("active", true)
        .text("Healthcare (%)");
    
    var labelObesity = ylabelsGroup.append("text")
        .attr("x", 0 - (svgHeight / 2))
        .attr("y", 20 - margin.left)
        .attr("ty", "1em")
        .attr("value", "obesity")
        .attr("fill", "black")
        .classed("active", false)
        .text("Obesity (%)");
    
    var labelSmokes = ylabelsGroup.append("text")
        .attr("x", 0 - (svgHeight / 2))
        .attr("y", 0 - margin.left)
        .attr("ty", "1em")
        .attr("value", "smokes")
        .attr("fill", "black")
        .classed("active", false)
        .text("Smoker (%)");
    
    // Update ToolTip function above csv import
    var circlesGroup = updatetoolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // X axis labels event listener
    xlabelsGroup.selectAll("text")
        .on("click", function() {

            // Get value of seletion
            var xvalue = d3.select(this).attr("value");
                if (xvalue !== chosenXAxis) {

                // Replaces chosenXAxis with value
                chosenXAxis = xvalue;            
                };

                // Updates X scale for new data
                xLinearScale = xScale(csvData, chosenXAxis);

                // Updates X Axis with transition
                xAxis = renderXAxis(xLinearScale, xAxis);

                // Change classes to change bold text
                if (chosenXAxis === "poverty") {
                    labelPoverty
                        .classed("active", true)
                        .classed("inactive", false);
                    labelAge 
                        .classed("active", false)
                        .classed("iactive", true);
                    labelIncome
                        .classed("active", false)
                        .classed("inactive", true);
                } 
                
                else if (chosenXAxis === "age") {
                    labelPoverty
                        .classed("active", false)
                        .classed("inactive", true);
                    labelAge 
                        .classed("active", true)
                        .classed("iactive", false);
                    labelIncome
                        .classed("active", false)
                        .classed("inactive", true);
                }
                
                else {
                    labelPoverty
                        .classed("active", false)
                        .classed("inactive", true);
                    labelAge 
                        .classed("active", false)
                        .classed("iactive", true);
                    labelIncome
                        .classed("active", true)
                        .classed("inactive", false);
                }

                // Update circles with new X and Y values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // Update text with new X and Y values
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // Update ToolTips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        });

}).catch(function(error) {
    console.log(error);
});
