//pulls user input from the page and invokes formatQueryString, passing in date and borough user input
const getUserInput = () => {

    toggleSpinner();

    const boroughChoice = document.getElementById("borough-dropdown").value;
    let crashDate = document.getElementById("crash-date-input").value;
    const today = new Date();
    let todayMonth = today.getMonth();
    todayMonth < 10 ? todayMonth = "0" + todayMonth : todayMonth;
    const todayFullDate = today.getFullYear() + "-" + todayMonth + "-" + today.getDate();

    if (!crashDate) {
        crashDate = todayFullDate;
    }

    document.getElementById("crash-date-input").value = crashDate;

    crashDate = new Date(crashDate).toISOString();
    crashDate = crashDate.slice(0, crashDate.length - 1);
    crashDate = `crash_date="${crashDate}"`;

    formatQueryString(crashDate, boroughChoice);
}

//takes in user input, formats it into query string and calls makeAPICall with the string
const formatQueryString = (crashDate, boroughChoice) => {

    const url = new URL("https://data.cityofnewyork.us/resource/h9gi-nx95.geojson")

    const params = {
        $$app_token: "GeazDF3xhBoHQv3NWt30dElQb",
        $limit: 5000,
        $where: crashDate + "AND (number_of_persons_injured > 0 OR number_of_persons_killed > 0)" + boroughChoice
    }

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    makeAPICall(url);

}

//makes the api call and invokes createContributingFactorsObject with the fetched json
const makeAPICall = queryString => {

    // show spinner when api call begins
    // d3.select("#spinner").attr("style", "display: block");

    fetch(queryString)
        .then(res => res.json())
        .then(res => createContributingFactorsObject(res));
}

//takes in the response from the API call and formats it as a POJO or calls showModal if there is no data
const createContributingFactorsObject = res => {

    const resLength = res.features.length;

    //if the call returned crashes
    if (resLength > 0) {

        // create data object for barchart
        let contributingFactorsForBarchart = {};

        for (let i = 0; i < resLength; i++) {

            const crash = res.features[i];

            for (let j = 1; j < 5; j++) {

                const key = `contributing_factor_vehicle_${j}`;

                if (crash.properties[key]) {
                    contributingFactorsForBarchart[crash.properties[key]] ?
                        contributingFactorsForBarchart[crash.properties[key]] += 1 :
                        contributingFactorsForBarchart[crash.properties[key]] = 1;
                }
            }
        }

        createContributingFactorsArray(contributingFactorsForBarchart, res);

    } else {

        showModal();

    }
}

const showModal = () => {

    toggleSpinner();

    const modal4 = document.getElementById("modal-4");

    const span4 = document.getElementById("close-4");

    modal4.style.display = "block";

    span4.onclick = function () {
        modal4.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal4) {
            modal4.style.display = "none";
        }
    }
}

//takes in the contributing factors POJO and the JSON response, coverts it to an array, sorts it and calls draw
const createContributingFactorsArray = (contributingFactorsObject, res) => {

    let contributingFactorsArray = [];

    const contributingFactorsKeys = Object.keys(contributingFactorsObject);
    const contributingFactorsValues = Object.values(contributingFactorsObject);
    const contributingFactorsLength = contributingFactorsKeys.length;

    for (let i = 0; i < contributingFactorsLength; i++) {
        const key = contributingFactorsKeys[i];
        const value = contributingFactorsValues[i];
        const factor = {name: key, value: value}
        contributingFactorsArray.push(factor);
    }

    contributingFactorsArray = contributingFactorsArray.sort((a, b) => {
        return b.value - a.value
    })

    contributingFactorsArray[0].name === 'Unspecified' ? contributingFactorsArray = contributingFactorsArray.slice(1,6) : contributingFactorsArray = contributingFactorsArray.slice(0,5);

    draw(contributingFactorsArray, res);
}

//takes in the contributing factors array and draws a barchart
const drawBarchart = contributingFactorsArray => {

    d3.select("#barchart")
        .style("display", "block")

    const x = d3.scaleLinear()
        .domain([0, d3.max(contributingFactorsArray, d => d.value)])
        .range([200, 500]);

    const y = d3.scaleBand()
        .domain(d3.range(contributingFactorsArray.length))
        .rangeRound([30, 240])
        .padding(0.1);

    const format = x.tickFormat(20, contributingFactorsArray.format);

    const xAxis = g => g
        .attr("transform", "translate(0,30)")
        .call(d3.axisTop(x).ticks(500 / 80, contributingFactorsArray.format))
        .call(g => g.select(".domain").remove());

    const yAxis = g => g
        .attr("transform", "translate(200,0)")
        .call(d3.axisLeft(y).tickFormat(i => contributingFactorsArray[i].name).tickSizeOuter(0));

    barchartGroup.selectAll("g")
        .remove("g")

    barchartGroup.append("g")
        .attr("fill", "red")
        .selectAll("rect")
        .data(contributingFactorsArray)
        .join("rect")
        .attr("x", x(0))
        .attr("y", (d, i) => y(i))
        .attr("width", d => x(d.value) - x(0))
        .attr("height", y.bandwidth());

    barchartGroup.append("g")
        .attr("fill", "white")
        .attr("text-anchor", "end")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
        .selectAll("text")
        .data(contributingFactorsArray)
        .join("text")
        .attr("x", d => x(d.value) - 4)
        .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text(d => format(d.value));

    barchartGroup.append("g")
        .call(xAxis);

    barchartGroup.append("g")
        .call(yAxis);
}

//takes in the JSON response and draws crashes on the map
const drawCrashes = res => {

    const infoWindow = d3.select("#infowindow")

    mapGroup.selectAll("path.crash")
        .remove("path.crash")

    mapGroup.selectAll("path.crash")

        .data(res.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "crash")
        .on("mouseover", function (d) {

            // show infowindow
            infoWindow.transition()
                .duration(200)
                .style("display", "block")
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY + 10) + "px");

            // display crash data
            d3.select("#time").html(`Time: ${formatCrashTime(d.properties.crash_time)}</i>`)
            d3.select("#injuries").html(`Injuries: ${d.properties.number_of_persons_injured}</i>`)
            d3.select("#deaths").html(`Deaths: ${d.properties.number_of_persons_killed}</i>`);
            d3.select("#vehicles-involved").text(`Vehicles Involved: ${formatCrashVehicles(d.properties)}`);
            d3.select("#contributing-factors").text(`Contributing Factors: ${formatCrashFactors(d.properties)}`);
            d3.select(this).attr("class", "crash hover");
        })

        .on("mouseout", () => {

            // hide infowindow
            infoWindow.transition()
                .duration(200)
                .style("display", "none");
        })

}

//formats the crash time for the user
const formatCrashTime = time => {

    const crashTime = time.split(":")
    const amPm = crashTime[0] >= 12 ? "AM" : "PM";
    let crashHours = crashTime[0];
    let crashMinutes = crashTime[1];
    crashHours = crashHours % 12;
    crashHours = crashHours ? crashHours : 12;
    const crashTimeString = crashHours + ":" + crashMinutes + " " + amPm;
    return crashTimeString;

}

//formats the contributing factors for the user
const formatCrashFactors = factors => {

    let contributingFactors = [];
    
    for (let i = 1; i < 5; i++) {
        const key = `contributing_factor_vehicle_${i}`;
        
        if (factors[key] && factors[key] != "Unspecified") {
            contributingFactors.push(factors[key]);
        }
    }

    if (contributingFactors.length === 0) {
        contributingFactors.push("Unspecified")
    }

    let uniqueFactors = [...new Set(contributingFactors)];

    uniqueFactors = uniqueFactors.join(", ");

    return uniqueFactors;
}

//formats the # of vehicles involved for the user
const formatCrashVehicles = vehicles => {

    let vehiclesInvolved = 0;

    for (let i = 1; i < 5; i++) {
        const key = `contributing_factor_vehicle_${i}`;

        if (vehicles[key]) {
            vehiclesInvolved += 1;
        }
    }

    return vehiclesInvolved;

}

//calls drawBarchart and drawCrashes
const draw = (contributingFactorsArray, res) => {

    drawBarchart(contributingFactorsArray);

    drawCrashes(res);

    toggleSpinner();

}

const toggleSpinner = () => {

    const spinner = document.getElementById("spinner")
    spinner.style.display === "block" ?
    spinner.style.display = "none" :
    spinner.style.display = "block";

}