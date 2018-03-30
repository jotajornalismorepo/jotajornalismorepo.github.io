var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
        .style("opacity", 0);

	
var apaga_candidato = function(candidato, estado) {
	var candidato_apagar = '.' + candidato.split(" ").join("");
	console.log(candidato_apagar);	
	d3.selectAll(candidato_apagar).transition()
                     .duration(500).style("visibility", estado);
}

var plota_candidato = function(candidato, d, cor) {
    data = d.filter(function(x) {
        if (x['Instituição'] != "NA" && x.Candidato == candidato) return x;
    });
    d = d.filter(function(x) {
        if (x.median != "NA" && x.Candidato == candidato) return x;
    });
    console.log(data);
    console.log(d);
 svg.append("path")
     .data([d])
     .attr("class", "area " + candidato.split(" ").join(""))
     .attr("d", serie_bands)
     .style("fill", cor)
     .style("opacity", 0.2);

 svg.append("path")
     .data([d])
     .attr("class", "line "+ candidato.split(" ").join(""))
     .attr("d", serie_temporal)
     .style("stroke", cor);

 svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("class", candidato.split(" ").join(""))
      .attr("r", 5)
      .attr("cx", function(d) { return x(d.Data); })
      .attr("cy", function(d) { return y(d.Porcentagem); })
      .style("fill", cor)
      .on("mouseover", function(d) {
                    div.transition()
                     .duration(200)
		     .style("color", "white")
                     .style("background", cor)
                     .style("opacity", .78);
                       div.html('<div id="nomecandidato" style="display: inline; font-family: Roboto-Bold; font-size: 13px">' + d.Candidato.toUpperCase() + '</div><br/><div id="restotooltip" style="display: inline; font-family: Roboto-Light; font-size: 11px">Instituto:' + d['Instituição'] + "<br/>Intenção de voto:" + d.Porcentagem + "%<br/>Data:" +  formatTime(d.Data) + "</div>")
                    .style("left", (d3.event.pageX) + "px")
                 .style("top", (d3.event.pageY - 28) + "px");
                                  })
      .on("mouseout", function(d) {
         div.transition()
          .duration(500)
          .style("opacity", 0);
        });

      

}
var formatTime = d3.timeFormat("%d/%m/%Y");
var parseTime = d3.timeParse("%Y-%m-%d");

var x = d3
    .scaleTime()
    .range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var serie_temporal = d3.line()
    .x(function(d) { return x(d.Data); })
    .y(function(d) { return y(d.median); });

var serie_bands = d3.area()
    .x(function(d) { return x(d.Data); })
    .y0(function(d) { return y(d.p95); })
    .y1(function(d) { return y(d.p05); });
    

var svg = d3.select("#box").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")")
	.style("display", "block")
	.style("margin", "auto");


d3.csv('base.csv', function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
        d.Data = parseTime(d.Data);
        d.Porcentagem = d.Porcentagem * 100;
        d.median = d.median * 100;
        d.p95 = d.p95 * 100;
        d.p05 = d.p05 * 100;
  //      d.close = +d.close
     });
      x.domain(d3.extent(data, function(d) { return d.Data; }));
     y.domain([0, 60]);


          svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")));

        plota_candidato('Lula', data, "#E94A34");
        plota_candidato('Jair Bolsonaro', data, "#3FA06B");
        plota_candidato('Geraldo Alckmin', data, "#3399CC");
        plota_candidato('Não sabe/Não respondeu', data, "#9E9C90");
        plota_candidato('Marina Silva', data, "#F48D53");
        plota_candidato('Ciro Gomes', data, "#FFD445");
	apaga_candidato("Ciro Gomes", "hidden");
	apaga_candidato("Marina Silva","hidden");
  
	svg.append("g")
      .call(d3.axisLeft(y));
});




$(':checkbox').change(function() {
	if ( this.checked ) { 
		apaga_candidato(this.name, "visible");
	}
	else {
		apaga_candidato(this.name, "hidden");
	}

});
