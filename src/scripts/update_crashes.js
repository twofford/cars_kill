updateCrashes = () => {

    //format user borough input for API call
    const boroughChoice = document.getElementById("borough-dropdown").value;

    // format user date input for API call
    let crashDate = document.getElementById("crash-date-input").value;
    const today = new Date();
    const todayYear = today.getFullYear();
    let todayMonth = today.getMonth();
    todayMonth < 10 ? todayMonth = "0" + todayMonth : todayMonth;
    const todayDate = today.getDate();
    const todayFullDate = todayYear + "-" + todayMonth + "-" + todayDate;
    
    if (!crashDate) {
        crashDate = todayFullDate;
    }

    document.getElementById("crash-date-input").value = crashDate;

    const displayDate = new Date(crashDate).toDateString();
    crashDate = new Date(crashDate).toISOString();
    crashDate = crashDate.slice(0, crashDate.length - 1);
    crashDate = `crash_date="${crashDate}"`;

    // show spinner when api call begins
    d3.select("#spinner").attr("style", "display: block");

    // api call
    $.ajax({
        url: "https://data.cityofnewyork.us/resource/h9gi-nx95.geojson",
        type: "GET",
        data: {
            "$$app_token": "GeazDF3xhBoHQv3NWt30dElQb",
            "$limit": 5000,
            "$where": `${crashDate}` + "AND (number_of_persons_injured > 0 OR number_of_persons_killed > 0)" + boroughChoice
        }
    }).done(res => {

        // hide spinner when api call ends
        d3.select("#spinner").attr("style", "display: none");

        //if the call returns crashes
        if (res.features.length > 0) {

            // create data object for barchart
            let contributingFactorsForBarchart = {};

            for (let index = 0; index < res.features.length; index++) {

                const crash = res.features[index];

                if (crash.properties.contributing_factor_vehicle_1) {
                    contributingFactorsForBarchart[crash.properties.contributing_factor_vehicle_1] ? contributingFactorsForBarchart[crash.properties.contributing_factor_vehicle_1] += 1 : contributingFactorsForBarchart[crash.properties.contributing_factor_vehicle_1] = 1;
                };

                if (crash.properties.contributing_factor_vehicle_2) {
                    contributingFactorsForBarchart[crash.properties.contributing_factor_vehicle_2] ? contributingFactorsForBarchart[crash.properties.contributing_factor_vehicle_2] += 1 : contributingFactorsForBarchart[crash.properties.contributing_factor_vehicle_2] = 1;
                };

                if (crash.properties.contributing_factor_vehicle_3) {
                    contributingFactorsForBarchart[crash.properties.contributing_factor_vehicle_3] ? contributingFactorsForBarchart[crash.properties.contributing_factor_vehicle_3] += 1 : contributingFactorsForBarchart[crash.properties.contributing_factor_vehicle_3] = 1;
                };

                if (crash.properties.contributing_factor_vehicle_4) {
                    contributingFactorsForBarchart[crash.properties.contributing_factor_vehicle_4] ? contributingFactorsForBarchart[crash.properties.contributing_factor_vehicle_4] += 1 : contributingFactorsForBarchart[crash.properties.contributing_factor_vehicle_4] = 1;
                };

                if (crash.properties.contributing_factor_vehicle_5) {
                    contributingFactorsForBarchart[crash.properties.contributing_factor_vehicle_5] ? contributingFactorsForBarchart[crash.properties.contributing_factor_vehicle_5] += 1 : contributingFactorsForBarchart[crash.properties.contributing_factor_vehicle_5] = 1;
                };

            }

            // create data array for barchart
            let contributingFactorsArray = [];

            const contributingFactorsKeys = Object.keys(contributingFactorsForBarchart);
            const contributingFactorsValues = Object.values(contributingFactorsForBarchart);
            const contributingFactorsLength = contributingFactorsKeys.length;

            for (let i = 0; i < contributingFactorsLength; i++) {
                const key = contributingFactorsKeys[i];
                const value = contributingFactorsValues[i];
                const factor = {
                    name: key,
                    value: value
                }
                contributingFactorsArray.push(factor);
            }

            contributingFactorsArray = contributingFactorsArray.sort((a, b) => {
                return b.value - a.value
            })

            contributingFactorsArray[0].name === 'Unspecified' ? contributingFactorsArray = contributingFactorsArray.slice(1, 6) : contributingFactorsArray = contributingFactorsArray.slice(0, 5);

            // create window for tooltips
            const infoWindow = d3.select("#infowindow")

            // find number of crashes
            let numCrashes = res.features.length;

            // draw barchart
            d3.select("#barchart")
                .style("display", "block")

            const x = d3.scaleLinear()
                .domain([0, d3.max(contributingFactorsArray, d => d.value)])
                .range([margin.left, barchartWidth - margin.right]);

            const y = d3.scaleBand()
                .domain(d3.range(contributingFactorsArray.length))
                .rangeRound([margin.top, barchartHeight - margin.bottom])
                .padding(0.1);

            const format = x.tickFormat(20, contributingFactorsArray.format);

            const xAxis = g => g
                .attr("transform", `translate(0,${margin.top})`)
                .call(d3.axisTop(x).ticks(barchartWidth / 80, contributingFactorsArray.format))
                .call(g => g.select(".domain").remove());

            const yAxis = g => g
                .attr("transform", `translate(${margin.left},0)`)
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

            d3.select("#date-display").html(displayDate);

            // draw crashes

            mapGroup.selectAll("path.crash")
                .remove("path.crash")

            mapGroup.selectAll("path.crash")

                .data(res.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("class", "crash")
                .on("mouseover", function (d) {

                    // format crash time
                    const crashTime = d.properties.crash_time.split(":")
                    const amPm = crashTime[0] >= 12 ? "AM" : "PM";
                    let crashHours = crashTime[0];
                    let crashMinutes = crashTime[1];
                    crashHours = crashHours % 12;
                    crashHours = crashHours ? crashHours : 12;
                    const crashTimeString = crashHours + ":" + crashMinutes + " " + amPm;

                    // format contributing factors
                    let contributingFactors = [];
                    if (d.properties.contributing_factor_vehicle_1 && d.properties.contributing_factor_vehicle_1 != "Unspecified") {
                        contributingFactors.push(d.properties.contributing_factor_vehicle_1);
                    }
                    if (d.properties.contributing_factor_vehicle_2 && d.properties.contributing_factor_vehicle_2 != "Unspecified") {
                        contributingFactors.push(d.properties.contributing_factor_vehicle_2);
                    }
                    if (d.properties.contributing_factor_vehicle_3 && d.properties.contributing_factor_vehicle_3 != "Unspecified") {
                        contributingFactors.push(d.properties.contributing_factor_vehicle_3);
                    }
                    if (d.properties.contributing_factor_vehicle_4 && d.properties.contributing_factor_vehicle_4 != "Unspecified") {
                        contributingFactors.push(d.properties.contributing_factor_vehicle_4);
                    }
                    if (d.properties.contributing_factor_vehicle_5 && d.properties.contributing_factor_vehicle_5 != "Unspecified") {
                        contributingFactors.push(d.properties.contributing_factor_vehicle_5);
                    }
                    if (contributingFactors.length === 0) {
                        contributingFactors.push("Unspecified")
                    }
                    let uniqueFactors = [...new Set(contributingFactors)];
                    uniqueFactors = uniqueFactors.join(", ");

                    // format vehicles involved
                    let vehiclesInvolved = 0;
                    if (d.properties.contributing_factor_vehicle_1) {
                        vehiclesInvolved += 1;
                    }
                    if (d.properties.contributing_factor_vehicle_2) {
                        vehiclesInvolved += 1;
                    }
                    if (d.properties.contributing_factor_vehicle_3) {
                        vehiclesInvolved += 1;
                    }
                    if (d.properties.contributing_factor_vehicle_4) {
                        vehiclesInvolved += 1;
                    }
                    if (d.properties.contributing_factor_vehicle_5) {
                        vehiclesInvolved += 1;
                    }

                    // show infowindow
                    infoWindow.transition()
                        .duration(200)
                        .style("display", "block")
                        .style("left", (d3.event.pageX + 10) + "px")
                        .style("top", (d3.event.pageY + 10) + "px");

                    // display crash data
                    d3.select("#time").html(`Time: ${crashTimeString}</i>`)
                    d3.select("#injuries").html(`Injuries: ${d.properties.number_of_persons_injured}</i>`)
                    d3.select("#deaths").html(`Deaths: ${d.properties.number_of_persons_killed}</i>`);
                    d3.select("#vehicles-involved").text(`Vehicles Involved: ${vehiclesInvolved}`);
                    d3.select("#contributing-factors").text(`Contributing Factors: ${uniqueFactors}`);
                    d3.select(this).attr("class", "crash hover");
                })

                .on("mouseout", function (d) {

                    // hide infowindow
                    infoWindow.transition()
                        .duration(200)
                        .style("display", "none");
                })
        } else {
            const modal4 = document.getElementById("modal-4");

            // const btn2 = document.getElementById("modal-btn-2");

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
    })
}