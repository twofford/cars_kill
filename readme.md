# Cars Kill
![Cars Kill](https://i.imgur.com/X6LEvP1.png)

## Description

Cars Kill is a data visualization project designed to show the deaths and injuries caused by automobiles in New York City. As an avid cyclist, I'm acutely aware of how dangerous cars make our city, and how unnecessary they are for most of our transit needs.

I built Cars Kill with HTML, CSS and JavaScript. DOM manipulation is handled with a combination of vanilla JS and d3.js. Data is sourced from [NYC Open Data](https://opendata.cityofnewyork.us/).

## Technical Challenges

### Big Data

Cars Kill uses d3 to draw a neighbrood map of New York City. To do this, it relies on a geoJSON file of geometry coordinates. [That file](https://data.cityofnewyork.us/City-Government/Neighborhood-Tabulation-Areas-NTA-/cpf4-rkhq) is rather large: 4.2 MB of text. My first instict was to import the JSON with a <script> tag in the head. That worked, but it forced the user to wait for the whole file to finish downloading before the DOMContentLoaded event would trigger. To solve this problem, I decided to fetch the JSON file with jQuery and render the map in the success callback. This achieved a minor performance boost, but came with a tradeoff: importing jQuery is slow. But JavsScript has a method for exactly this kind of situation: [fetch()](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch). Here's my code:
  
    fetch("src/data/nyc.json")
      .then(res => res.json())
      .then(data => {
          mapGroup.selectAll("path")
              .data(data.features)
              .enter()
              .append("path")
              .attr("fill", "white")
              .attr("stroke", "black")
              .attr("d", path)

          d3.select("#spinner").attr("style", "display: none");
      });
  
By using fetch, I shaved approximately 200 milliseconds off the time it takes to load the DOM. Nice! As you can see, I also use d3 to hide a spinner in the .then() callback. That spinner is the first thing that loads when the user's browser begins parsing the body, which means there's never any time when the user is staring at a blank page wondering what's supposed to be happening.
