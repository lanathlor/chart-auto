import React from 'react';
import ReactDOM from 'react-dom';
import Dash from './dashbord';
//import firebase from 'firebase';
import Leat from './map';

/* format of the setter object :
	type: string. the type of chart. line, bar and doughnut implemented.
	label: string. the x value. often "timestamp". need to be ordered.
	labels: for line and bar : array. for doughnut : string. labels on the chart.
	value: array. the value to get from the data object.
	color: array. the color on the chart. the color need to existe in line.js, bar.js and/or doughnut.js with rgba().
	agreg: char. can be + or =. + merge all close data by adding them. = merge all close data by averge.
	agreg_time: object. set the definition of the range the data will merge. the are merge by considering there label value. thinkig to be used with timestamp, other usage may crash
				{millisecond:int, second:int, minute:int, hour:int, day:int, week:int, mounth:int, year:int} specifie the amount of $key to merge data. several key can be used. if some keys are not specified the will be cnsidered as 0
	column: int. set the size of a column.
	row: int, set the size of a row.
	query: the query to retrive data.

	format of the data object :
	{
		key1: {label:
				value1:
				value2:
				.
				.
				.
			}
		key2 : {}
		.
		.
		.
	}
	the key name are ignored.

	usage of the loadSetterChart function in loadChart.js here exported as Setter :
	loadSetterChart(query, callback)
	the callback will receive the setter object and the data object order by setter label key.

	usage of the Tuile component define in tuile.js :
	props: setter, data.
	will draw a chart comforming with the setter and data given.

	usage of the getTime function define in timeGetter.js :
	getTime(data, time_scale)
	receive a data array and either a timestamp or an object like agreg_time.
	will return the data array with all the object that contened timestamp lesser the the time_scale parameter.

	need semantic-react, firebase-react, chart-react in order to work.
*/

/*var i = 0;
var end_time = Date.now()
var hour = (1000 * 60 * 60);
var start_time = end_time - (hour * 24 * 200);

while (start_time + (hour * i) < end_time)
{
	firebase.database().ref("chart/data_test/clee" + i).update({
		timestamp: start_time + (hour * i),
		data1:i,
		data2:i * 2
	});
	i++;
}
*/
// ReactDOM.render(<Dash node={"/chart"}/>, document.getElementById('fork'));
ReactDOM.render(<Leat/>, document.getElementById("map"));
/*
Setter("/chart/test", function(setter, data){
	ReactDOM.render(<Tuile setter={setter}/>, document.getElementById('fork'))
});*/
