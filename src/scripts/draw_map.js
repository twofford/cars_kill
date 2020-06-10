// create map svg
const mapSvg = d3.select("#map")
    .append("svg")
    .attr("width", 750)
    .attr("height", 750);

const mapGroup = mapSvg.append("g");

const projection = d3.geoAlbers()
    .scale(100000)
    .rotate([73.9, 0])
    .center([0, 40.775])

const path = d3.geoPath()
    .projection(projection);

// get nyc json, then draw map
$.getJSON("src/data/nyc.json", (data) => {
    mapGroup.selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("d", path)
})