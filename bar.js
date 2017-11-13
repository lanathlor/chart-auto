import React, { Component } from 'react';
import {Bar} from 'react-chartjs-2';
import moment from 'moment';

var base_colors= {
	green: 'rgba(75,192,75,0.4)',
	red: 'rgba(200,80,80,0.4)',
	blue: 'rgba(80,80,230,0.4)'
}

var options = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			yAxes: [{
				ticks: {
					beginAtZero:true
				},
				scaleLabel: {
					display: true,
					labelString: 'probability'
				}
			}],
			xAxes: [{
				type: "time",
				stacked: true,
				time: {
					unit:"day",
					displayFormats:{
						millisecond: "h:mm:ss.SSS a"
					}
				}
			}]
		},
		tooltips: {
			callbacks: {
				title: function(label,data){
					var indice = moment(label[0].xLabel).format('DD/MM/YY -- HH:mm');					
					return (indice);
				}
			}
		},
		title:{
			display: true,
			text: ""
		}
	}

class LineModal extends Component {
constructor(props) {
	super(props);
	this.state = {activeItem:0};

}

setupData(data, color, front){
	var process_data = {datasets: []};
	var i = 0;
	var j = 0;

	i = front["labels"].length;
	while (front["labels"].length < data[0].length){
		front["labels"][i] = front["labels"][0] + " err";
		i++;
	}
	i = 0;
	process_data["labels"] = front["labels"];
	while (data[i]){
		process_data["datasets"][i] = {};
		process_data["datasets"][i]["borderWidth"] = 1;
		process_data["datasets"][i]["data"] = data[i];
		if (color[i]) {
			process_data["datasets"][i]["backgroundColor"] = base_colors[color[i]];
			j = i;
		}
		else
			process_data["datasets"][i]["backgroundColor"] = base_colors[color[i % j]];
		if (front["sets_label"][i]){
			process_data["datasets"][i]["label"] = front["sets_label"][i];
			j = i;
		} else
			process_data["datasets"][i]["label"] = front["sets_label"][j] + i;
		i++;
	}
	return (process_data);
}

render(){
	options["scales"]["xAxes"][0]["time"]["unit"] = this.props.scale;
	options["title"]["text"] = this.props.title;
	options["tooltips"]["callbacks"] = {
		title: function(label, data){
			var indice = "";
			console.log(this.props.scale);
			if (this.props.scale === "day")
				indice = moment(label[0].xLabel).format('DD/MM/YY -- HH');
			else if (this.props.scale === "month")
				indice = moment(label[0].xLabel).format('DD/MM/YY');
			else if (this.props.scale === "year")
				indice = moment(label[0].xLabel).format('MM/YY');
			return (indice);
		}.bind(this)
	}
	if (!options["title"]["text"])
		options["title"]["display"] = false;
	
	return(
		<div>
			<Bar
				data={this.setupData(this.props.data, this.props.color, this.props.front)}
				width={10 * this.props.taille}
				height={50 * this.props.taille}
				options={options}
			/>
		</div>

	)
}
}

export default LineModal