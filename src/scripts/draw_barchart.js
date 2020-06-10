// create barchart svg
const barchartSvg = d3.select("#barchart")
    .append("svg")
    .attr("width", 500)
    .attr("height", 250)

const barchartGroup = barchartSvg.append("g");