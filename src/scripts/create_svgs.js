// set barchart dimensions
const margin = ({ top: 30, right: 0, bottom: 10, left: 200 })
const barchartWidth = 500;
const barchartHeight = 250;

// create barchart svg
const barchartSvg = d3.select("#barchart")
    .append("svg")
    .attr("width", barchartWidth)
    .attr("height", barchartHeight)

const barchartGroup = barchartSvg.append("g");

// set map dimensions
const mapWidth = 750;
const mapHeight = 750;

// create map svg
const mapSvg = d3.select("#map")
    .append("svg")
    .attr("width", mapWidth)
    .attr("height", mapHeight);

const mapGroup = mapSvg.append("g");

const projection = d3.geoAlbers()
    .scale(100000)
    .rotate([73.9, 0])
    .center([0, 40.775])

const path = d3.geoPath()
    .projection(projection);

// draw map
mapGroup.selectAll("path")
    .data(nyc.features)
    .enter()
    .append("path")
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("d", path)