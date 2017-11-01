import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Fork from './forker';
import TimeGet from './timeGetter'

var time_data = [[
	{timestamp: 1509367224223, value: 5},
	{timestamp: 1509367224224, value: 10},
	{timestamp: 1509367224225, value: 15}
	],[
	{timestamp: 1509367224223, value: 5},
	{timestamp: 1509367224224, value: 10},
	{timestamp: 1509367224225, value: 15}
	]
]

var test_time = {
	day:2
}

var test_tab = [
	[[[{timestamp:1509367224223, value:1}]]],
	[[{timestamp:1509367224224, value:5}],[{timestamp:1509367224223, value:10}]],
	[{timestamp:1509367224224, value:1}],[{timestamp:1509367224223, value:0}],
	[[[{timestamp:1509367224223}], [[{timestamp:1509367224223}]]]],
]

console.log(TimeGet(test_tab, 1509367224224, test_tab));

var data = [
	[5, 10, 15, 20, 25],
	[30, 25, 20, 15, 10],
	[5, 5, 35, 35, 5]
]

var data_doughnut = [5, 10, 15]

var data_bubble = [
	{x:1, y:2, r:50},
	{x:5, y:5, r:20},
	{x:0, y:0, r:10}
]

var color = [
	"blue", "red", "green"
]

var front = {
	labels:["Q1", "Q2", "Q3", "Q4", "Q5"],
	sets_label:['# of blue votes', '# of red votes', '# of green votes']
}

/*ReactDOM.render(<Bar taille={10} data={data} color={color} front={front} />, document.getElementById('root'));
ReactDOM.render(<Line taille={10} data={data} color={color} front={front} />, document.getElementById('line'));
ReactDOM.render(<Doughnut taille={10} data={data_doughnut} color={color} front={front} />, document.getElementById('dough'));
ReactDOM.render(<Bubble taille={10} data={data_bubble} color={color} front={front} />, document.getElementById('bubble'));*/
ReactDOM.render(<Fork taille={10} data={data_doughnut} color={color} front={front} chart={"donut"} />, document.getElementById('fork'))
registerServiceWorker();
