import React, { Component } from 'react';
import Liner from './line';
import Doughnut from './doughnut';
import Bar from './bar';
import Bubble from './bubble'

var forker = {
	donut: Doughnut,
	bubble: Bubble,
	line: Liner,
	bar: Bar
}

class forking extends Component{

	render(){
		var GoTo = forker[this.props.chart];
		return (
			<GoTo
				taille={this.props.taille}
				data={this.props.data}
				color={this.props.color}
				front={this.props.front}
				scale={this.props.scale}
				title={this.props.title}
			/>
		)
	}
}

export default forking;