
/**
 * This example shows how to plot points on a map
 * and how to work with normal geographical data that
 * is not in GeoJSON form
 * 
 * Outline:
 * 1. show how to load multiple files of data 
 * 2. talk about how geoAlbers() is a scaling function
 * 3. show how to plot points with geoAlbers
 */
const m = {
    width: 1000,
    height: 700
}

const svg = d3.select("body").append('svg')
    .attr('width', m.width)
    .attr('height', m.height)

const g = svg.append('g')

// nest data extraction
d3.json('nygeo.json').then(function(data) {
    d3.csv('data.csv').then(function(pointData) {

        const albersProj = d3.geoAlbers()
            .scale(80000)
            .rotate([72, 0])
            .center([0, 42])
            .translate([2450, -1400]);

        const geoPath = d3.geoPath()
        .projection(albersProj)

        g.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
            .attr('fill', 'silver')
            .attr('d', geoPath)

        // plots circles on the nyc map
         g.selectAll('.circle')
             .data(pointData)
             .enter()
             .append('circle')
                 .attr('cx', function(d) { 
                     let scaledPoints = albersProj([d['longitude'], d['latitude']])
                     return scaledPoints[0]
                 })
                 .attr('cy', function(d) {
                     let scaledPoints = albersProj([d['longitude'], d['latitude']])
                     return scaledPoints[1]
                 })
                 .attr('r', 7)
                 .attr('fill', '#FF6666')
                 .attr('stroke', 'black')
                 .on( "click", function(){
                    d3.select(this)
                      .attr("opacity",1)
                      .transition()
                      .duration(0)
                      .attr( "x", m.width * Math.round( Math.random() ) )
                      .attr( "y", m.height * Math.round( Math.random() ) )
                      .attr( "opacity", 0 )
                      .on("end",function(){
                        d3.select(this).remove();
                        console.log("Point removed from SVG")
                      })
                  });

        
    })
  
})