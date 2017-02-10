//
///* 
//  part 3: scatterplot
//  Under Part Three in index.html, visualize the same dataset you used in Part 2 using a scatterplot. 
//  Map x to the x-axis and y to the y-axis. 
//  As with the barchart, you should include axes and scale your visualization to fit the maximum values in the data.
//
//  part 4: interaction
//  Update your scatterplot code to be interactive. 
//  When you click on a point, change the paragraph with the id scatterLabel to print out the x and y values of that point. 
//  When you hover over a point, change it’s color (and change it back when you mouse out!).
//*/

function scatterPlot(partThree)
{
  var dataset_names = ["Anscombe I", "Anscombe II", "Anscombe III", "Anscombe IV"]
  var dataset_name_to_id = {"Anscombe I": "anscombe_I",
                            "Anscombe II": "anscombe_II", 
                            "Anscombe III" : "anscombe_III",
                            "Anscombe IV" : "anscombe_IV"}
  
  var div_binder;
  var scatterPlotContainer, scatterPlotGroup;
  var scatterPlot_height = 400;
  var scatterPlot_width = 600;  
  var scatterPlot_background = "#f2f2f2";

  var dot_color = "#9999ff";
  var scatterPlot_plot_height = 300;
  var scatterPlot_plot_width = 400;

//  var toolTip;
  var tooltip_background = "#ffffff";
  var tooltip_height = 20;
  var tooltip_width = 40;

  var circ_selected = false;
  var circ_r = 10;
  
  
  var menu_button_height = 40;
  var menu_button_width = 100;
  var menu_button_color_default = "#e6ffff";
  var menu_button_color_selected = "#b3ffb3";
  var menu_button_color_hover = "#ccffe6";
  var menu_button_active_color = "#66ffb3";
  
  var last_active;
  
  var scatterPlot_plot_background  = "#f2f2ff";
  var SP_xScale, SP_yScale;
  if (partThree)
  {
    var scatterPlotMargins = {"left": 50, "right": 50, "top": 50, "bottom": 50};  
  }
  else
  {
    var scatterPlotMargins = {"left": 100, "right": 50, "top": 50, "bottom": 50};
  }
  
  var scatterPlot_plot_Margins = {"left": 20, "right": 20, "top": 20, "bottom": 10};

  var full_dataset;

  var selected_circle_id = undefined;


  function initializeScatterPlotScales(data, data_id="0")
  {
    
    
    if (partThree) 
    { 
      d3.selectAll(".SP_axes_0").transition().duration(350).style("opacity", 0);
      d3.selectAll(".axes_text_0").transition().duration(350).style("opacity", 0); 
      d3.selectAll(".SP_axes_0").remove();
      d3.selectAll(".axes_text_0").remove();
    }
    var SP_xAxis, SP_yAxis;

    var x_data = [];
    var y_data = [];
    for (var i=0; i < data.length; i++)
    {
      x_data.push(data[i].x);
      y_data.push(data[i].y);
    }
    
    SP_xScale = d3.scaleLinear()
//                .domain([d3.min(x_data), d3.max(x_data)])
                .domain([0, d3.max(x_data)+4])
      .range([0+scatterPlot_plot_Margins.left, scatterPlot_plot_width-scatterPlot_plot_Margins.right]);

    SP_yScale = d3.scaleLinear()
                .domain([0, d3.max(y_data)+4])
                .range([0, scatterPlot_plot_height-scatterPlot_plot_Margins.top]);

    SP_yAxisScale = d3.scaleLinear()
                .domain([0, d3.max(y_data)+4])
                .range([scatterPlot_plot_height, 0+scatterPlot_plot_Margins.top]);

    SP_xAxis = d3.axisBottom(SP_xScale);
    SP_yAxis = d3.axisLeft(SP_yAxisScale);




    // Add X Axis
    scatterPlotGroup.append("g")
                .attr("class", "SP_axes_"+data_id)
                .style("opacity", 0)
                .attr("transform", "translate(0, "+scatterPlot_plot_height+")")
                .call(SP_xAxis);


    // Add Y Axis
    scatterPlotGroup.append("g")
                .attr("class", "SP_axes_"+data_id)
                .style("opacity", 0)  
                .call(SP_yAxis);

    
    d3.selectAll(".SP_axes_"+data_id).transition().duration(500).style("opacity", 1);
    
    // Add X axis text
    
    scatterPlotGroup.append("text").attr("class", "axes_text_"+data_id)
                  .attr("x", scatterPlot_plot_width*.4)
                  .attr("y", scatterPlot_plot_height*1.105)
                  .text("x value");

    // Add Y axis text
    scatterPlotGroup.append("text").attr("class", "axes_text_"+data_id)
                  .attr("x", -180)
                  .attr("y", -30)
                  .attr("transform", "translate(0, 0) rotate(-90)")
                  .text("y value");
    
  }

  function initializeScatterPlotContainer(dataset_i)
  {
    
    // Initialize svg container for scatter plot
    scatterPlotContainer = d3.select("#"+div_binder)
                          .append("svg")
                            .attr("id", "scatterplot_container_"+dataset_i)
                            .attr("height", scatterPlot_height)
                            .attr("width", scatterPlot_width);

    // Create background
    scatterPlotContainer.append("rect")
                       .attr("id", "scatter_plot_background_"+dataset_i)
                       .attr("height", scatterPlot_height)
                       .attr("width", scatterPlot_width)
                       .style("fill", scatterPlot_background)
                       .style("stroke", "black")
                       .style("stroke-width", "4px");


    // Create header for chart
    scatterPlotContainer.append("text").attr("id", "plot_header").attr("class", "plot_text")
                  .attr("x", scatterPlot_width*.175)
                  .attr("y", scatterPlot_height*0.1)
                  .text(function()
                  {
                    var dataset_name = (dataset_i == 0) ? dataset_names[dataset_i] : dataset_names[dataset_i-1];
                    return dataset_name + ": Y vs. X";
                  })
                  .style("font-size", "30px");

    // Create group for container
    scatterPlotGroup = scatterPlotContainer.append("g")
                                        .attr("id", "scatter_plot_group_"+dataset_i)
                                        .attr("transform", "translate("+scatterPlotMargins.left+", "+scatterPlotMargins.top+")");

    // Create background for plot
    scatterPlotGroup.append("rect")
                       .attr("id", "scatter_plot_background_"+dataset_i)
                       .attr("height", scatterPlot_plot_height)
                       .attr("width", scatterPlot_plot_width)
                       .style("fill", scatterPlot_plot_background)
                       .style("stroke", "grey");
    
  }

  


  function updateCircle(self, d, clicked)
  {
    if (clicked)
    {
      d3.select("#scatterLabel")
          .html(function() 
          { 
            return "x: " + d.x + ", y: " + d.y;
          });


      self.transition().duration(250)
          .style("stroke", "#1aff1a")
          .style("stroke-width", "3px")
          .attr("r", circ_r*2)
          .style("fill", "#1aff1a");
    }
    else
    {
      selected_circle_id = undefined;

      d3.select("#scatterLabel")
          .html(function() 
          { 
            return "x: --" + ", y: --";
          });
      self.transition().duration(250)
          .style("stroke", "black")
          .style("stroke-width", "1px")
          .attr("r", circ_r)
          .style("fill", dot_color);
    }
  }
  
  
  function replot_SP_Data(data_points)
  {
    
    for (var i=0; i < data_points.length; i++)
    {
      var new_data_point, new_x, new_y;
      new_data_point = data_points[i];
      new_x = new_data_point.x;
      new_y = new_data_point.y;
      
      d3.select("#circle_"+i).transition().duration(250)
              .attr("cx", SP_xScale(new_x))
              .attr("cy", function() { return scatterPlot_plot_height - SP_yScale(new_y); });
      
    }
  }
  function plot_SP_Data(data_points, data_id_name, data_id, current_dataset)
  {  
    var self;

    scatterPlotGroup.selectAll("circle.circs")
                    .data(data_points).enter()
                    .append("circle").attr("class", "circs")
                      .attr("id", function(d, i) { return "circle_"+i; })
                      .attr("cx", function(d, i) 
                      { 
                        return SP_xScale(d.x);
                      })
                      .attr("cy", function(d)
                      {
                        return scatterPlot_plot_height - SP_yScale(d.y);
                      })
                      .attr("r", circ_r)
                      .style("fill", dot_color)
                      .style("stroke", "black")
                      .on("mouseover", function(d, i)
                      {
                        self = d3.select(this);
                        changeCircle(self, i, data_id, true, current_dataset);
                      })
                      .on("mouseout", function(d, i)
                      {
                        self = d3.select(this);
                        changeCircle(self, i, data_id, false, current_dataset);
                      })
                      .on("click", function(d, i)
                      {
                        var data_;
                        var current_circle_id = "circle_" + i;
                        self = d3.select(this);

                        if (!selected_circle_id)
                        {
                          selected_circle_id = current_circle_id;
                        }
                        else if (current_circle_id != selected_circle_id)
                        {
                          updateCircle(d3.select("#"+selected_circle_id), 0, false);
                          circ_selected = false;
                        }
                        if (!circ_selected)
                        {
                          selected_circle_id = current_circle_id;
                          updateCircle(self, current_dataset[i], true);
                        }
                        else
                        {
                          updateCircle(self, current_dataset[i], false);
                        }
                        circ_selected = !circ_selected;
                      });
    
    // Plot Line of Best fit
    drawLines(data_points, data_id_name, data_id);
  }

  
  function generateLBF(data_id_name)
  {
    
    var data = full_dataset[data_id_name]["data"];
    var m, b, new_b, new_m;
    var grad_m, grad_b;
    var N;
    var x_data, y_data, y_pred;
    
    var learning_rate = 0.01;
    
    N = data.length;
    m = Math.random();
    b = Math.random();
    var epochs = 0;
    var converged = false;
    while (!converged || epochs < 50000)
    {
      grad_b = 0;
      grad_m = 0;
      for (var i=0; i < N; i++)
      {
        y_data = data[i].y;
        x_data = data[i].x;
        y_pred = m*x_data + b;

        grad_b += -2/N*(y_data - y_pred);
        grad_m += -2/N*(y_data - y_pred)*x_data;
      }
      
      new_b = b - learning_rate*grad_b;
      new_m = m - learning_rate*grad_m;
      
      if ((Math.abs(new_b - b) < 0.0000001) && (Math.abs(new_m - m) < 0.0000001))
      {
        converged = true;
      }
      b = new_b;
      m = new_m;
      epochs++;
    }
    
    // Calculate R2
    var y_ave = 0;
    var ss_tot = 0;
    var ss_res = 0;
    for (var i=0; i < N; i++)
    {
      y_data = data[i].y;
      x_data = data[i].x;
      y_pred = m*x_data + b;
      
      y_ave += 1/N * y_data;
      ss_tot += (y_data - y_ave)**2;
      ss_res += (y_data - y_pred)**2;
    }
    var R_2 = 1 - (ss_res / ss_tot);
   
    var x_data = [];
    for (var i=0; i < data.length; i++)
    {
      x_data.push(data[i].x);
    }
    var x1, x2, y1, y2;
    x1 = 0;
    y1 = m*x1 + b;
    x2 = d3.max(x_data)+4;
    y2 = m*x2 + b;
    
    
    var trend_data = [[x1, y1, x2, y2]];
    return [trend_data, b, m, R_2];
  }
    
  function drawLines(data, data_id_name, data_id)
  {
        
    var LineOfBestFit = d3.line()
                            .x(function(d)
                            {
                              return SP_xScale(d.x);
                            })
                            .y(function(d)
                            {
                              return scatterPlot_plot_height - SP_yScale(d.y);
                            });
    var lbf_data, b, m, R_2;
    [lbf_data, b, m, R_2] = generateLBF(data_id_name);
    
    d3.select("#scatter_plot_group_"+data_id)
            .append("g")
              .attr("id", "lbf_SP_group_"+data_id)
              .data(lbf_data)
            .append("line")
            .attr("class", "trendline").attr("id","lbf_line_"+data_id)
            .attr("x1", function(d) { return SP_xScale(d[0]); })
            .attr("y1", function(d) { return scatterPlot_plot_height - SP_yScale(d[1]); })
            .attr("x2", function(d) { return SP_xScale(d[2]); })
            .attr("y2", function(d) { return scatterPlot_plot_height - SP_yScale(d[3]); })
            .attr("stroke", "black").style("opacity", 0)
            .attr("stroke-width", 2);
    
    
    d3.select("#scatter_plot_group_"+data_id)
            .append("text")
              .attr("class", "lbf_line_eq_"+data_id)
              .text("y = " + m.toFixed(1) + "x + " + b.toFixed(1))
              .attr("transform", "translate(410, 50)")
              .style("opacity", 0)
              .style("font-size", "14px");
    
    d3.select("#scatter_plot_group_"+data_id)
            .append("text")
              .attr("class", "lbf_line_eq_"+data_id)
              .text("R2 = " + R_2.toFixed(3))
              .attr("transform", "translate(410, 70)")
              .style("opacity", 0)
              .style("font-size", "14px");


  }


  function create_SP_ToolTip(dataset_i)
  {
    // Create tooltip
    var toolTip = scatterPlotGroup.append("g")
                            .attr("id", "toolTipGroup_"+dataset_i)
                            .style("opacity", 0);
    

    // Set Text
    toolTip.append("text").attr("class", "plot_text")
              .attr("x", tooltip_width*0.1)
              .attr("y", tooltip_height*.8);
  }



  function update_SP_Tooltip(self, data, index)
  {
    
    var toolTip = d3.select("#toolTipGroup_"+index);
    
    toolTip.select("text")
             .text("(x: " + data.x + ", y: " + data.y+")");
    
    toolTip.attr("transform", function()
            {
              var x_trans = 296;
              var y_trans = 278;
              return "translate("+x_trans+", "+y_trans+")";
            });
  }


  function changeCircle(self, index, data_id, expand, current_dataset)
  {
    var toolTip = d3.select("#toolTipGroup_"+data_id);
    
    if (expand)
    {
      update_SP_Tooltip(self, current_dataset[index], data_id);
      toolTip.transition().duration(400).style("opacity", 1);
      self.transition().duration(200)
              .style("fill", "#ff8080")
              .attr("r", circ_r*1.5);
    }
    else
    {
      toolTip.transition().duration(400).style("opacity", 0);
      self.transition().duration(200)
              .style("fill", dot_color)
              .attr("r", circ_r);
    }
  }
  
  
  
  function updateDataSetActivity(d, index)
  {
    
    full_dataset[dataset_name_to_id[last_active]]["active"] = false;
    full_dataset[dataset_name_to_id[d]]["active"] = true;
    last_active = d;
    
    for (var dataset_id_name in full_dataset)
    {
      var data_id = full_dataset[dataset_id_name]["id"];
      var name = dataset_names[Number(data_id-1)];
      changeMenuButton(name, data_id-1, false);
    }
    
    d3.select("#menu_button_"+index).transition()
          .duration(350)
          .style("fill", menu_button_active_color);
  }
  
  function changeMenuButton(d, index, mouse_over)
  {
    var menu_color;
    if (full_dataset[dataset_name_to_id[d]]["active"])
    { 
      
      menu_color = menu_button_active_color;
    }
    else
    {
      menu_color = menu_button_color_default;
    }
    
    if (mouse_over)
    {
      d3.select("#menu_button_"+index).transition()
          .duration(300)
          .style("fill", menu_button_color_hover);
      
      d3.select("#menu_text_"+index).transition()
          .duration(300)
          .style("fill", "black")
          .style("font-size", "17px");
    }
    else
    {
      d3.select("#menu_button_"+index).transition()
          .duration(300)
          .style("fill", menu_color);
      
      d3.select("#menu_text_"+index).transition()
          .duration(300)
          .style("fill", "black")
          .style("font-size", "16px");
    }
    
  }
  
  
  
  
  
  
  
  function updateLBF(self, data_id_name, data_id)
  {
    if (full_dataset[data_id_name]["lbf_active"])
    {
      full_dataset[data_id_name]["lbf_active"] = false;
      self.style("fill", "white");
      d3.select("#lbf_line_"+data_id).transition().duration(250).style("opacity", 0);
      d3.selectAll(".lbf_line_eq_"+data_id).transition().duration(250).style("opacity", 0);
    }
    else
    {
      full_dataset[data_id_name]["lbf_active"] = true;
      self.style("fill", "black");
      d3.select("#lbf_line_"+data_id).transition().duration(450).style("opacity", 1);
      d3.selectAll(".lbf_line_eq_"+data_id).transition().duration(450).style("opacity", 1);
    }
  }
  
  
  function createLineBestFit(data_id_name, data_id)
  {
    var self;
    
    var LBF_Group = scatterPlotContainer.append("g")
                                    .attr("id", "lbf_group")
                                    .attr("transform", "translate(500, 40)");
    
    LBF_Group.append("text")
                .style("font-size", "14px")
                .text("Line of Best Fit");
    
    
    LBF_Group.append("rect").attr("id", "lbf_button_"+data_id)
                .attr("height", 20)
                .attr("width", 20)
                .style("fill", "white")
                .style("stroke", "black")
                .attr("transform", "translate(30, 10)")
                .on("click", function() 
                {
                  self = d3.select(this);
                  updateLBF(self, data_id_name, data_id);
                });
    
  }
  
  
  function createMenu()
  {
    var self;
    
    var menu_group = scatterPlotContainer.append("g")
                                    .attr("id", "menu_group")
                                    .attr("transform", "translate(480, 20)");
    menu_group.append("text")
                .attr("x", 14)
                .attr("y", 20)
                .style("font-size", "22px")
                .text("Datasets");
    menu_group.selectAll("g")
                      .data(dataset_names)
                      .enter()
                      .append("g")
                        .on("mouseover", function(d, i)
                        {
                          self = d3.select(this);
                          changeMenuButton(d, i, true);
                        })
                        .on("mouseout", function(d, i)
                        {
                          self = d3.select(this);
                          changeMenuButton(d, i, false);
                        })
                        .on("click", function(d, i)
                        {
                          changeDataSet(d);
                          updateDataSetActivity(d, i);
                        })
                      .append("rect")
                        .attr("id", function(d, i) { return "menu_button_"+i; })
                        .attr("height", menu_button_height)
                        .attr("width", menu_button_width)
                        .attr("transform", function(d, i)
                        {
                          var y_trans = 30 + i*menu_button_height*1.1
                          return "translate(0, "+y_trans+")"
                        })
                        .style("fill", function(d)
                        {
                          var menu_color;
                          if (full_dataset[dataset_name_to_id[d]]["active"])
                          { 
                            menu_color = menu_button_active_color;
                          }
                          else
                          {
                            menu_color = menu_button_color_default;
                          }
                          return menu_color;
                        })
                        .attr("stroke", "black")
                          
      menu_group.selectAll("g").append("text")
                            .attr("id", function(d, i) { return "menu_text_"+i; })
                            .attr("transform", function(d, i)
                            {
                              var y_trans = 55 + i*menu_button_height*1.1
                              return "translate(6, "+y_trans+")"
                            })
                            .text(function(d, i) 
                            { 
                              return d;
                            });
  }
  
  
  
  function changeDataSet(data_name)
  {
    var data_id_name = dataset_name_to_id[data_name];
    
    var data = full_dataset[data_id_name]["data"];
    var data_id = full_dataset[data_id_name]["id"];
    
    var header = d3.select("#plot_header")
        .text(function()
        {
          return data_name + ": Y vs. X";
        })
        .style("opacity", 0);
    
    header.transition().duration(400).style("opacity", 1);
    
    initializeScatterPlotScales(data);
    replot_SP_Data(data);
    create_SP_ToolTip(data_id);
  }
  
  
  function cleanData(data)
  {
    var new_data = [];
    for (var i=0; i < data.length; i++)
    {
      var object = data[i];
      var new_object = { x: Number(object.x.trim()),
                         y: Number(object.y.trim())};
      new_data.push(new_object);
    }
    return new_data;
  }

  function start()
  {
    
    d3.queue()
        .defer(d3.csv, "data/anscombe_I.csv")
        .defer(d3.csv, "data/anscombe_II.csv")
        .defer(d3.csv, "data/anscombe_III.csv")
        .defer(d3.csv, "data/anscombe_IV.csv")
        .await(function(error, data1, data2, data3, data4)
        {
          data1 = cleanData(data1);
          data2 = cleanData(data2);
          data3 = cleanData(data3);
          data4 = cleanData(data4);
          
          if (partThree)
          {
            full_dataset = {"anscombe_I"   : { "active" : true,  "data" : data1, "id": "1", "lbf_active": false},
                            "anscombe_II"  : { "active" : false, "data" : data2, "id": "2", "lbf_active": false},
                            "anscombe_III" : { "active" : false, "data" : data3, "id": "3", "lbf_active": false},
                            "anscombe_IV"  : { "active" : false, "data" : data4, "id": "4", "lbf_active": false}};
            initialize();
          }
          else
          {
            full_dataset = {"anscombe_I"   : { "active" : true, "data" : data1, "id": "1", "lbf_active": false},
                            "anscombe_II"  : { "active" : true, "data" : data2, "id": "2", "lbf_active": false},
                            "anscombe_III" : { "active" : true, "data" : data3, "id": "3", "lbf_active": false},
                            "anscombe_IV"  : { "active" : true, "data" : data4, "id": "4", "lbf_active": false}};
            
            initializePartFive();
          }
          
        });
  }
  
  
  function initializePartFive()
  {
    for (var data_id_name in full_dataset)
    {
      var data = full_dataset[data_id_name]["data"];
      current_dataset = data;
      var data_id = full_dataset[data_id_name]["id"];
      div_binder = "scatterplotSet";
        
      initializeScatterPlotContainer(data_id);
      initializeScatterPlotScales(data, data_id);
      plot_SP_Data(data, data_id_name, data_id, current_dataset);
      create_SP_ToolTip(data_id);
      createLineBestFit(data_id_name, data_id);
    } 
  }
  
  
  
  function initialize()
  {
    last_active = "Anscombe I";
    div_binder = "scatterplot";
    
    for (var data_id in full_dataset)
    {
      var data = full_dataset[data_id];
      var data_active = data["active"];
      if (data_active)
      {
        current_dataset = data["data"];
        break;
      }
    }
    initializeScatterPlotContainer(0);
    initializeScatterPlotScales(current_dataset);
    plot_SP_Data(current_dataset, "anscombe_I", 0, current_dataset);
    create_SP_ToolTip(0);
    createMenu();
  }

  
  start();

}