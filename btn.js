import React, {Component} from 'react';
import 'semantic-ui-css/semantic.min.css';

class btn extends Component{
	render(){
		return (
			<div className={"row"}>
				<button className={"mini ui fluid primary button"} onClick={this.props.ftn}>{this.props.name}</button>
			</div>
		)
	}
}

export default btn;