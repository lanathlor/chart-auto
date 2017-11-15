import React, { Component } from 'react';
import {Doughnut} from 'react-chartjs-2';
import {Modal} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
var base_colors= {
	green: 'rgba(75,192,75,0.4)',
	red: 'rgba(200,80,80,0.4)',
	blue: 'rgba(80,80,230,0.4)'
}

var options = {

		responsive: true,
//		maintainAspectRatio: false,
		title:{
			display: true,
			text: ""
		},
		legend:{
			display:true, //label sur le donut
			position:'bottom'
		}
	}


class LineModal extends Component {
constructor(props) {
	super(props);
	this.state = {activeItem:0};

}

setupData(data, color, front){
	var process_data = {datasets:[]};
	var i = 0;
	var j = 0;
	process_data["labels"] = front["labels"];
	process_data["datasets"][0] = {};
	process_data["datasets"][0]["borderWidth"] = 1;
	process_data["datasets"][0]["data"] = data;
	process_data["datasets"][0]["backgroundColor"] = [];
	while (process_data["datasets"][0]["data"][i]){
		if (color[i]) {
			process_data["datasets"][0]["backgroundColor"][i] = color[i].toString();
		}else {
			process_data["datasets"][0]["backgroundColor"][i] = base_colors[color[j % i]];
			j++;
		}
		i++;
	}
	return (process_data);
}

render(){
	var self = this
	options["title"]["text"] = this.props.title;
	if (!options["title"]["text"])
		options["title"]["display"] = false;
		console.log(this.props.data)
	return(

			<Doughnut
				data={this.setupData(this.props.data, this.props.color, this.props.front)}
				width={20 * this.props.taille}
				height={20 * this.props.taille}
				options = {options}
				onElementsClick = {() => self.props.chartClicked()}

			/>


	)
}
}

export default LineModal
