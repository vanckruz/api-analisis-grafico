var app = angular.module("timeWear", ['ngVis']);

app.controller("main",[
	"$rootScope",
	"$scope",
	"$http", 
	function($rootScope, $scope, $http, $location, $timeout, VisDataSet){
	
	$scope.results = false;
	$scope.loading = false;
	$scope.msg = false;

	$scope.analyze = function(){

        if($("#SignalProcessingForm input[name='file']").val() != ""){
        	$scope.loading = true;
			$scope.msg = false;        	

			var formData = new FormData(document.getElementById("SignalProcessingForm"));
			var config = {
	            transformRequest: angular.identity,
	            headers: {'Content-Type': undefined}
	        };
        	$("#SignalProcessingForm input[name='file']").removeClass("input-alert");
            $http.post('http://52.73.68.246:8080/signalProcessing', formData, config)
            .success(function (data){

		        	$scope.loading = false;
					$scope.results = true;        	
				    var groups = new vis.DataSet();

				    groups.add({
				        id: 0,
				        content: "bpm",
				        options: {
				            drawPoints: false,
				            shaded: {
				                orientation: 'bottom' // top, bottom
				            }
				        }});

					angular.forEach(data.graphics.bpm, function(value, key) {
						value.x = (new Date( (value.x * 1000) + Date.now() )).toISOString();
						// console.log((new Date(value.x)).toISOString());
						value.group = 0;  
					});

				    var items = data.graphics.bpm;
				    $scope.data = {items: new vis.DataSet(items), groups: groups};

				    $scope.options = {
				        dataAxis: {
		                  showMajorLabels: false,
		                },
		                // configure: function (option, path) {
		                //   return option === 'format' || path.indexOf('format') !== -1;
		                // }, 
				        format: {
							  minorLabels: {
								// millisecond:'SSS',
								second:     'hh:mm:ss',
							    minute:     'HH:mm'
							  },
							  majorLabels: {
							    // millisecond:'SSS [ms]',
							    second:'MM-DD-YYYY HH:mm',
							    minute:'MM-DD-YYYY HH:mm'
							  }
						},
				        legend: {left: {position:"bottom-left"} },
				        // start: data.graphics.bpm[0].x,
				        start: parseInt( Date.now().toString() ),
				        // end: data.graphics.bpm[data.graphics.bpm.length - 1].x,
				        end:  parseInt( Date.now().toString() ) + 600000,
				        // zoomMax: 6000000,
				        zoomMin: 10,
				        timeAxis: {scale: 'minute', step: 1},
				        showCurrentTime: false
				    };//end vis

					// console.log(items);
            		$('html, body').animate({ scrollTop : $("#result").offset().top }, 2500);

            })
            .error(function (data){  
                // console.log(data);
            });  
        }else{
			$scope.msg = true;        	
			$("#SignalProcessingForm input[name='file']").addClass("input-alert");
        }
       	
	}//analizy

}]);
