// Reference - https://stackoverflow.com/questions/11418535/how-to-call-an-self-designed-r-function-on-opencpu-via-javascript

define( ["jquery",
			"text!./Qliksense_R_Opencpu_Integration.css",
			"text!./R_code.txt",
		"./jquery-latest"  
		],

	function ( $, cssContent,rcode) {
		'use strict';		
		$( "<style>" ).html( cssContent ).appendTo( "head" );

			return {
			initialProperties: {
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [{
						qWidth: 10,
						qHeight: 1000
					}]
				}
			},
			definition: {
				type: "items",
				component: "accordion",
				items: {
					dimensions: {
						uses: "dimensions",
						min: 1,
						max:5
					},
					measures: {
						uses: "measures",
						min: 0,
						max:0
					},
					sorting: {
						uses: "sorting"
					},
					settings: {
						uses: "settings",
						items: {
							
						}
					}
				}
			},
			support: {
				snapshot: true,
				export: true,
				exportData: true
			},
			paint: function ( $element, layout ) {
				
			console.log($element);
			console.log(layout); 
						
			var width = $element.width();  
            var height = $element.height();  
			
			// Html 
			
			var html ="<h1>Set of R Commands</h1>";
				html+='<textarea rows="8" cols="80" id="txtRCommands">' + rcode + '</textarea>';
				html+="<br />";
				html+='<input type="button" value="Run code" id="cmdGoR" />';
				html+='<div id="results" style="border-style: groove;">' + '<br> <div id="statResults">  </div> <br> <img id="chartResults" >' + '</div>';
			
			// Div for Opencpu
			
			var id = "container_" + layout.qInfo.qId;  
			if (document.getElementById(id)) {  
                $("#" + id).empty();  
            }  
            else {  
                $element.append($('<div />;').attr("id", id).width(width).height(height));  				
            } 
			
			$("#"+id).append(html);
						   			
			var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;  
        	
			var qlikdata = qMatrix.map(function(d) {  
                    return {  
					    "Dim1":d[0].qNum,
						"Dim2":d[1].qNum
						                    }  
					
         }); 
		 		
          // Print Console				
		 // console.log(qMatrix);
		  console.log(qlikdata);
	 		 
		 /* Button Action Script*/
		   $("#cmdGoR").click(function () {
              var resultsUrlPrefix = "http://public.opencpu.org",
                  url = resultsUrlPrefix + "/ocpu/library/base/R/identity/save";
				  
				  
              var rCommands = $("#txtRCommands").val(); // Capture R Commands from UI / External file
			  var kpi1 = qlikdata.map(function(d){return d.Dim1;});  // Get selections from UI
			  var kpi2 = qlikdata.map(function(d){return d.Dim2;}); // Get selections from UI
			  		  
              $.post(url,
              {
                  //x: 'plot(c('+kpi1+'),c('+kpi2+'),pch=16,col="red")'  // For Interactive plotting
				  x: rCommands                      // UI / External R Code
				  
				  
              },

              function (data) {
                
				// Capture API response and assign it to as many variable
				
                var statResultsLink = resultsUrlPrefix + data.toString().match(/.+\/stdout/m),
                    chartLink = resultsUrlPrefix + data.toString().match(/.+\/graphics\/[1]/m);
               
                  //Add statistical (textual) results to results div
				$("#statResults").load(statResultsLink);
               
                  //Add charts results to results div
				$("#chartResults").attr('src', chartLink);
				  
               
              })
              
          });
		 
			}
		};
	} 
	);

