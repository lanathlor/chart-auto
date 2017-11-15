import React, { Component } from 'react';
import Liner from './line';
import Doughnut from './doughnut';
import Bar from './bar';
import Bubble from './bubble'
import Progress from './progress';

var forker = {
	donut: Doughnut,
	bubble: Bubble,
	line: Liner,
	bar: Bar,
	progress: Progress
}

class forking extends Component{

	render(){
		var self = this
		var GoTo = forker[this.props.chart];
		return (
			<GoTo
				taille={this.props.taille}
				data={this.props.data}
				color={this.props.color}
				front={this.props.front}
				scale={this.props.scale}
				title={this.props.title}
				chartClicked = {()=> self.props.chartClicked()}
			/>
		)
	}
}

export default forking;
