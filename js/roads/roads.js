$('#myTab a').click(function(e) {
  e.preventDefault();
  $(this).tab('show');
});

function showDiv(div){
  $('#mapTab').hide();
  $('#graphTab').hide();
  $('#mapTab').removeClass('hide');
  $('#mapLi').removeClass('active');
  $('#graphLi').removeClass('active');
  $('#'+div+'Tab').show();
  $('#'+div+'Li').addClass('active');

}

var map = L.map('map').setView([-19.959059, -44.339733], 13);

L.tileLayer('http://{s}.tile.cloudmade.com/49374c92cad2486790607f57cf29552a/997/256/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
    maxZoom: 18
}).addTo(map);

// Juatuba
var juatuba = L.polygon([
    [-19.957214, -44.348387],
    [-19.964959, -44.335169],
    [-19.986094, -44.389500],
    [-19.977866, -44.395422]
],{
  color: 'green'
}).addTo(map);


// Mateus Leme
var mateus2 = L.polygon([
    [-19.977866, -44.395422],
    [-19.986094, -44.389500],
    [-19.992224, -44.409155],
    [-19.982625, -44.415506]
],{
  color: 'red'
}).addTo(map);

var mateus3 = L.polygon([
    [-19.992224, -44.409155],
    [-19.982625, -44.415506],
    [-19.984642, -44.417824],
    [-19.992627, -44.412846]
],{
  color: 'orange'
}).addTo(map);


var mateus4 = L.polygon([
    [-19.984642, -44.417824],
    [-19.992627, -44.412846],
    [-19.993353, -44.415936],
    [-19.985045, -44.421515]
],{
  color: 'yellow',
  fillOpacity: 0.8
}).addTo(map);


var mateus5 = L.polygon([
    [-19.993353, -44.415936],
    [-19.985045, -44.421515],
    [-20.012549, -44.500321],
    [-20.026581, -44.498604]
],{
  color: 'orange'
}).addTo(map);

juatuba.bindPopup("Nível de Serivço - A");
mateus2.bindPopup("Nível de Serviço - E");
mateus3.bindPopup("Nível de Serviço - D");
mateus4.bindPopup("Nível de Serviço - C");
mateus5.bindPopup("Nível de Serviço - D");




// Graph
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var color = d3.scale.ordinal()
    .range(["#A2CD5A", "#CAFF70", "#FFD700", "#FFA500", "#CD3700"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var svg = d3.select("#graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("/js/roads/road_cross.csv", function(error, data) {
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "State"; }));

  data.forEach(function(d) {
    var y0 = 0;
    d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.ages[d.ages.length - 1].y1;
  });

  data.sort(function(a, b) { return b.total - a.total; });

  x.domain(data.map(function(d) { return d.State; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Nível de Serviço");

  var state = svg.selectAll(".state")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x(d.State) + ",0)"; });

  state.selectAll("rect")
      .data(function(d) { return d.ages; })
    .enter().append("rect")
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.y1); })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .style("fill", function(d) { return color(d.name); });

  var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});
