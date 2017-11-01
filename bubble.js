import React, { Component } from 'react';
import {Bubble} from 'react-chartjs-2';

var base_colors= {
	green: 'rgba(75,192,75,0.4)',
	red: 'rgba(200,80,80,0.4)',
	blue: 'rgba(80,80,230,0.4)'
}

var options = {
		responsive: true,
		maintainAspectRatio: false,
	}


class LineModal extends Component {
constructor(props) {
	super(props);
	this.state = {activeItem:0};

}

setupData(data, color, front){
	var process_data = {datasets:[]};
	var i = 0;

	process_data["labels"] = front["labels"];
	process_data["datasets"][0] = {};
	process_data["datasets"][0]["borderWidth"] = 1;
	process_data["datasets"][0]["data"] = data;
	process_data["datasets"][0]["backgroundColor"] = [];
	while (color[i]){
		process_data["datasets"][0]["backgroundColor"][i] = base_colors[color[i]];
		i++;
	}
	console.log(process_data);
	return (process_data);
}

render(){
	return(
		<div>
				<Bubble
					data={this.setupData(this.props.data, this.props.color, this.props.front)}
					option = {options}
				/>
		</div>

	)
}
}

export default LineModal