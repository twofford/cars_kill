# Cars Kill
![Cars Kill](https://i.imgur.com/X6LEvP1.png)

## Description

Cars Kill is a data visualization project designed to show the deaths and injuries caused by automobiles in New York City. As an avid cyclist, I'm acutely aware of how dangerous cars make our city, and how unnecessary they are for most of our transit needs.

I built Cars Kill with HTML, CSS and JavaScript. DOM manipulation is handled with a combination of vanilla JS and d3.js. Data is sourced from [NYC Open Data](https://opendata.cityofnewyork.us/).

## Technical Challenges

### Big Data

Cars Kill uses d3 to draw a neighbrood map of New York City. To do this, it relies on a geoJSON file of geometry coordinates. [That file](https://data.cityofnewyork.us/City-Government/Neighborhood-Tabulation-Areas-NTA-/cpf4-rkhq) is rather large: 4.2 MB of text. My first instict was to import the JSON with a <script> tag in the head of index.html. However, this forced the user to wait for the whole file to finish downloading before the DOMContentLoaded event would trigger.
