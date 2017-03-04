// ======================
// Variables
// ======================
var svgWidth = 700,
    svgHeight = 460,
    margin = {top: 30, right: 0, bottom: 30, left: 60},
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

// Get the JSON file with the data
d3.csv("datasets/nombres.csv", function (error, data) {
    if (error) throw error;

    // ======================
    // Dataset
    // ======================
    var all = data
        .sort(function(a, b) {
            return b['REPETICIONES'] - a['REPETICIONES'];
        }).map(function(item) {
            item['REPETICIONES'] = parseInt(item['REPETICIONES'], 10);
            return item;
        }).slice(0, 10);

    // ======================
    // Scales
    // ======================

    // X's Scale
    var x = d3.scale.ordinal()
        .domain(all.map(function(d) {
            return d['NOMBRE'];
        }))
        .rangeRoundBands([0, width], 0.2);

    // Y's Scale
    var y = d3.scale.linear()
        .domain([0, d3.max(all, function(d) {
            return d['REPETICIONES'];
        })])
        .range([height, 0]);

    // ======================
    // Layout
    // ======================

    // Select the SVG container
    var svg = d3.select(".viz");

    // Generates a group where the to put the viz
    var svgViewport = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // ======================
    // Bars
    // ======================
    var bar = svgViewport.selectAll(".bar")
        .data(all)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return x(d['NOMBRE']);
        })
        .attr("y", height)
        .attr("width", x.rangeBand())
        .attr("height", 0)
        .style("fill", function(d){
            return (d['GENERO'] === 'HOMBRE') ? '#2196F3' : '#FF4081';
        });

    // Animate in cascade each rectangle
    bar.transition()
        .delay(function(d, i) { return i * 100; })
        .attr("y", function(d){return y(d['REPETICIONES']);})
        .attr("height", function(d){ return height - y(d['REPETICIONES']); });


    // ======================
    // Axis
    // ======================

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // Append the x axis
    svgViewport.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Append the y axis
    svgViewport.append("g")
        .attr("class", "y axis")
        .call(yAxis).append("text")
        .attr("class", "x-axis-title")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 4)
        .attr("y", -60)
        .attr("dy", ".70em")
        .style("text-anchor", "end")
        .text("Repeticiones");

});