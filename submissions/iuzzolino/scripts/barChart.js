/* 
  Under Part Two in index.html, create a bar chart using the x-values (labelled x) for one of the four datasets (your choice of which one). 
  The height of the bar should correspond to the x-value of the data, the order of the bars should correspond to either their natural order 
  in the dataset or to the relative x-value (e.g., the position the datapoint would be in if we sorted all of the datapoints according to 
  their x-value).

  Your barchart should have both an x- and y-axis, and the data should be scaled according to the maximum x-value in the dataset. 
  Please use the d3.max function to create this scale rather than hard-coding a specific value. 
  Look at the in-class tutorial for an example of how to do this. 
  Note that you will need to load the dataset you’re using prior to building the visualization.
*/
function partTwo(dataset_id, dataset_name)
{
  var global_data;

  var barChart_height = 400;
  var barChart_width = 600;  
  var barChart_background = "#f2f2f2";

  var bar_color = "#9999ff";
  var barChartPlot_height = 300;
  var barChartPlot_width = 400;

  
  var BC_tooltip_background = "#ffffff";
  var BC_tooltip_height = 20;
  var BC_tooltip_width = 40;



  var barChartPlot_background  = "#f2f2ff";
  var BCx_xScale, BCx_yScale;
  var BCy_xScale, BCy_yScale;
  var barChartMargins = {"left": 50, "right": 50, "top": 50, "bottom": 50};
  var barChartPlotMargins = {"left": 20, "right": 20, "top": 20, "bottom": 10};

  var BCx_data_dictionary, BCy_data_dictionary;
  var BCx_sorted_data = false;
  var BCy_sorted_data = false;



  function initializeBarChartScales(data_x, data_y)
  { 
    
    var BCx_xAxis, BCx_yAxis, BCy_xAxis, BCy_yAxis;

    BCx_xScale = d3.scaleLinear()
                .domain([0, data_x.length-1])
                .range([0+barChartPlotMargins.left, barChartPlot_width-barChartPlotMargins.right]);

    BCx_yScale = d3.scaleLinear()
                .domain([0, d3.max(data_x)])
                .range([0, barChartPlot_height-barChartPlotMargins.top]);
    
    

    BCy_yScale = d3.scaleLinear()
                .domain([0, d3.max(data_y)])
                .range([0, barChartPlot_height-barChartPlotMargins.top]);
    
    

    BC_yAxisScale = d3.scaleLinear()
                .domain([0, d3.max(data_x)])
                .range([barChartPlot_height, 0+barChartPlotMargins.top]);

    BCx_xAxis = d3.axisBottom(BCx_xScale);
    BCx_yAxis = d3.axisLeft(BC_yAxisScale);
    
    BCy_xAxis = d3.axisBottom(BCx_xScale);
    BCy_yAxis = d3.axisLeft(BC_yAxisScale);



    
    var barChartGroupX = d3.select("#barchart_group_x")
    var barChartGroupY = d3.select("#barchart_group_y")
    
    // Add X Axis on x chart
    barChartGroupX.append("g")
                    .attr("class", "axes")
                    .style("opacity", 1)
                    .attr("transform", "translate(0, "+barChartPlot_height+")")
                    .call(BCx_xAxis);
    
    
    // Add X Axis on y chart
    barChartGroupY.append("g")
                    .attr("class", "axes")
                    .style("opacity", 1)
                    .attr("transform", "translate(0, "+barChartPlot_height+")")
                    .call(BCy_xAxis);



    // Add Y Axis on x chart
    barChartGroupX.append("g")
                .attr("class", "axes")
                .style("opacity", 1)  
                .call(BCx_yAxis);
    
    
    // Add Y Axis on y chart
    barChartGroupY.append("g")
                .attr("class", "axes")
                .style("opacity", 1)  
                .call(BCy_yAxis);
    
    
    


    // Add X axis text on x chart
    barChartGroupX.append("text")
                  .attr("x", barChartPlot_width*.4)
                  .attr("y", barChartPlot_height*1.105)
                  .text("Dataset Index");

    // Add T axis text on x chart
    barChartGroupX.append("text")
                  .attr("x", -180)
                  .attr("y", -30)
                  .attr("transform", "translate(0, 0) rotate(-90)")
                  .text("x value");
    
    
    
    
    // Add X axis text on x chart
    barChartGroupY.append("text")
                  .attr("x", barChartPlot_width*.4)
                  .attr("y", barChartPlot_height*1.105)
                  .text("Dataset Index");

    // Add T axis text on x chart
    barChartGroupY.append("text")
                  .attr("x", -180)
                  .attr("y", -30)
                  .attr("transform", "translate(0, 0) rotate(-90)")
                  .text("y value");
    
  }

  function initializeBarChartContainer(value)
  {
    // Initialize svg container for bar chart
    var barChartContainer = d3.select("#barchart").append("g").attr("id", "barchart_container_group_"+value)
                          .append("svg")
                            .attr("id", "barchart_container_"+value)
                            .attr("height", barChart_height)
                            .attr("width", barChart_width);

    // Create background
    barChartContainer.append("rect")
                       .attr("id", "bar_chart_container_background_"+value)
                       .attr("height", barChart_height)
                       .attr("width", barChart_width)
                       .style("fill", barChart_background)
                       .style("stroke", "black")
                       .style("stroke-width", "4px");


    // Create header for chart
    barChartContainer.append("text")
                  .attr("x", barChart_width*.15)
                  .attr("y", barChart_height*0.1)
                  .text(dataset_name + ": " + value + " plot")
                  .style("font-size", "30px");

    // Create group for container
    
    var barChartGroup = barChartContainer.append("g")
                                        .attr("id", "barchart_group_"+value)
                                        .attr("transform", "translate("+barChartMargins.left+", "+barChartMargins.top+")");

    // Create background for plot
    barChartGroup.append("rect")
                       .attr("id", "bar_chart_background_"+value)
                       .attr("height", barChartPlot_height)
                       .attr("width", barChartPlot_width)
                       .style("fill", barChartPlot_background)
                       .style("stroke", "grey");




    // Create sort/unsort button
    var sort_button = barChartContainer.append("g")
                            .attr("id", "sort_button_"+value)
                            .attr("transform", function()
                            {
                              var x_trans = barChart_width*0.8;
                              var y_trans = barChart_height*0.2;
                              return "translate("+x_trans+", "+y_trans+")";
                            })
                            .on("mouseover", function()
                            {
                              d3.select(this)
                                  .transition()
                                  .duration(250)
                                  .style("stroke-width", "3px");
                              d3.select("#sort_button_background_"+value)
                                  .transition()
                                  .duration(250)
                                  .style("fill", "#f2e6ff");

                              d3.select("#button_text_"+value)
                                  .transition()
                                  .duration(250)
                                  .style("font-size", "18px");
                            })
                            .on("mouseout", function()
                            {
                              d3.select(this)
                                  .transition()
                                  .duration(250)
                                  .style("stroke-width", "1px");

                              d3.select("#sort_button_background_"+value)
                                  .transition()
                                  .duration(250)
                                  .style("fill", "white");

                              d3.select("#button_text_"+value)
                                  .transition()
                                  .duration(250)
                                  .style("font-size", "16px");
                            })
                            .on("click", function(d)
                            {
                              update_BC_Button(value);
                              update_BC_Plot(value);
                            });

    // Add background
    sort_button.append("rect")
                 .attr("id", "sort_button_background_"+value)
                 .attr("height", 40)
                 .attr("width", 100)
                 .style("fill", "white")
                 .style("stroke", "grey");


    sort_button.append("text")
                .attr("id", "button_text_"+value)
                .attr("transform", "translate(22,25)")
                .text(function()
                { 
                  return (BCx_sorted_data) ? "Sorted" : "Original";
                });
  }

  function update_BC_Button(value)
  {
    var current_data;
    if (value == "x")
    {
      BCx_sorted_data = !BCx_sorted_data;
      current_data = BCx_sorted_data;
    }
    else
    {
      BCy_sorted_data = !BCy_sorted_data;
      current_data = BCy_sorted_data;
    }
    
    d3.select("#button_text_"+value).text(function()
                              { 
                                return (current_data) ? "Sorted" : "Original";
                              })
                            .attr("transform", function()
                            {
                              var x_trans = (current_data) ? 30 : 22;
                              var y_trans = 25;
                              return "translate("+x_trans+","+y_trans+")";
                            });
  }

  function update_BC_Plot(value)
  {
    var new_dataset;
    if (value == "x")
    {
      new_dataset = (BCx_sorted_data) ? BCx_data_dictionary.sorted : BCx_data_dictionary.original;
    }
    else
    {
      new_dataset = (BCy_sorted_data) ? BCy_data_dictionary.sorted : BCy_data_dictionary.original;
    }
    

    d3.select("#barchart_group_"+value).selectAll("rect.bars")
                  .transition()
                  .duration(300)
                  .attr("y", function(d, i)
                  {
                    var new_data = new_dataset[i];
                    if (value == "x")
                    {
                      return barChartPlot_height - BCx_yScale(new_data); 
                    }
                    else
                    {
                      return barChartPlot_height - BCy_yScale(new_data);
                    }
                    
                  })
                  .attr("height", function(d, i)
                  {
                    var new_data = new_dataset[i];
                    if (value == "x")
                    {
                      return BCx_yScale(new_data);  
                    }
                    else
                    {
                      return BCy_yScale(new_data);    
                    }
                    
                  });

  }

  function plot_BC_Data(data_points, value)
  {  
    var self;
    var bar_width = 20;
    var barChartGroup = d3.select("#barchart_group_"+value);
    barChartGroup.selectAll("rect.bars")
                    .data(data_points).enter()
                    .append("rect").attr("class", "bars")
                      .attr("id", function(d, i)
                      {
                        return value+"_bars_"+i;
                      })
                      .attr("x", function(d, i) 
                      { 
                        if (value == "x")
                        {
                          return BCx_xScale(i)-bar_width/2;  
                        }
                        else
                        {
                          return BCx_xScale(i)-bar_width/2;
                        }
                        
                      })
                      .attr("y", function(d)
                      {
                        if (value == "x")
                        {
                          return barChartPlot_height - BCx_yScale(d); 
                        }
                        else
                        {
                          return barChartPlot_height - BCy_yScale(d);
                        }
                      })
                      .attr("height", function(d) 
                      { 
                        if (value == "x")
                        {
                          return BCx_yScale(d); 
                        }
                        else
                        {
                          return BCy_yScale(d);
                        }
                      })
                      .attr("width", bar_width)
                      .style("fill", bar_color)
                      .style("stroke", "black")
                      .on("mouseover", function(d, i)
                      { 
                        self = d3.select(this);
                        changeBar(self, i, value, true);
                      })
                      .on("mouseout", function(d, i)
                      {
                        self = d3.select(this);
                        changeBar(self, i, value, false);
                      });
  }
  
  


  function createBarChartToolTip(value="x")
  {
    // Create tooltip
    var barChartToolTip = d3.select("#barchart_group_"+value).append("g")
                            .attr("id", "barChartToolTipGroup_"+value)
                            .style("opacity", 0);
    


    // Set Text
    barChartToolTip.append("text")
              .attr("x", BC_tooltip_width*0.1)
              .attr("y", BC_tooltip_height*.8);
  }



  function updateBCTooltip(self, data, i, value)
  {
    var barChartToolTip = d3.select("#barChartToolTipGroup_"+value);
    
    barChartToolTip.select("text")
              .text("(i: " + i + ", " + value + ": " + data + ")")
    barChartToolTip.attr("transform", function()
            {
              var x_trans = 400;
              var y_trans = d3.event.pageY - 350;
              return "translate("+x_trans+", "+y_trans+")";
            });
  }

  function findOtherIndex(other_data, other_dict)
  {
    for (j=0; j < other_dict.length; j++)
    {
      if (other_dict[j] == other_data)
      {
        return j;
      }
    }
  }
  
  function findOtherData(data, value, other_value)
  {
    for (j=0; j < global_data.length; j++)
    {
      var pair = global_data[j];
      
      if (global_data[j][value] == data)
      {
        return global_data[j][other_value];
      }
    }
  }
  
  function changeBar(self, index, value, expand)
  {
    var other_value = (value == "x") ? "y" : "x";
    
    var barChartToolTip = d3.select("#barChartToolTipGroup_"+value);
    var otherBarChartToolTip = d3.select("#barChartToolTipGroup_"+other_value);
    var other_dict, other_data, other_index;
    
    
    if (value == "x")
    {
      if (BCx_sorted_data)
      {
        data = BCx_data_dictionary.sorted[index];
        if (BCy_sorted_data)
        {
          other_dict = BCy_data_dictionary.sorted;
          other_data = findOtherData(data, value, other_value);
          other_index = findOtherIndex(other_data, other_dict);
        }
        else
        {
          other_dict = BCy_data_dictionary.original;
          other_data = findOtherData(data, value, other_value);
          other_index = findOtherIndex(other_data, other_dict);
        }
      }
      else if (!BCx_sorted_data)
      {
        data = BCx_data_dictionary.original[index];
        if (BCy_sorted_data)
        {
          other_dict = BCy_data_dictionary.sorted;
          other_data = findOtherData(data, value, other_value);
          other_index = findOtherIndex(other_data, other_dict);
        }
        else
        {
          other_dict = BCy_data_dictionary.original;
          other_data = findOtherData(data, value, other_value);
          other_index = findOtherIndex(other_data, other_dict);
        }
      }
    }
    else if (value == "y")
    {
      if (BCy_sorted_data)
      {
        data = BCy_data_dictionary.sorted[index];
        if (BCx_sorted_data)
        {
          other_dict = BCx_data_dictionary.sorted;
          other_data = findOtherData(data, value, other_value);
          other_index = findOtherIndex(other_data, other_dict);
        }
        else
        {
          other_dict = BCx_data_dictionary.original;
          other_data = findOtherData(data, value, other_value);
          other_index = findOtherIndex(other_data, other_dict);
        }
      }
      else if (!BCy_sorted_data)
      {
        data = BCy_data_dictionary.original[index];
        if (BCx_sorted_data)
        {
          other_dict = BCx_data_dictionary.sorted;
          other_data = findOtherData(data, value, other_value);
          other_index = findOtherIndex(other_data, other_dict);
        }
        else
        {
          other_dict = BCx_data_dictionary.original;
          other_data = findOtherData(data, value, other_value);
          other_index = findOtherIndex(other_data, other_dict);
        }
      }
    }
    
    
    
    // Find proper index
  
    var other = (value == "x") ? d3.select("#y_bars_"+other_index) : d3.select("#x_bars_"+other_index);
    
    if (expand)
    {
      updateBCTooltip(self, data, index, value);
      updateBCTooltip(other, other_data, other_index, other_value);
      barChartToolTip.transition().duration(400).style("opacity", 1);
      otherBarChartToolTip.transition().duration(400).style("opacity", 1);
      self.transition().duration(300).style("fill", "#ff8080");
      other.transition().duration(300).style("fill", "#ff8080");
    }
    else
    {
      barChartToolTip.transition().duration(400).style("opacity", 0);
      otherBarChartToolTip.transition().duration(400).style("opacity", 0);
      self.transition().duration(400).style("fill", bar_color);
      other.transition().duration(400).style("fill", bar_color);
    }
  }

    

  
  
  function start()
  {
    d3.csv("data/"+dataset_id+".csv")
        .row(function(data, i)
        { 
          var new_data_dict = {x: Number(data.x.trim()), y: Number(data.y.trim())};
          return new_data_dict;
        })
        .get(function(data)
        {
          var sorted_x_data_init, sorted_y_data_init;
          var x_data, y_data;
          x_data = [];
          y_data = [];
          for (var i=0; i < data.length; i++)
          {
            x_data.push(data[i].x);
            y_data.push(data[i].y);
          }
        
          global_data = data;
      
          sorted_x_data_init = x_data.slice(0);
          sorted_y_data_init = y_data.slice(0);

          BCx_data_dictionary = {"original" : x_data,
                                 "sorted" : sorted_x_data_init.sort(function(a, b) { return a-b; })};
        
          BCy_data_dictionary = {"original" : y_data,
                                 "sorted" : sorted_y_data_init.sort(function(a, b) { return a-b; })};
      
          initializeBarChartContainer("x");
          initializeBarChartContainer("y");
      
          initializeBarChartScales(x_data, y_data);
          plot_BC_Data(x_data, "x");
          plot_BC_Data(y_data, "y");
      
          createBarChartToolTip("x");
          createBarChartToolTip("y");
        });
  }
  
  start();
}
