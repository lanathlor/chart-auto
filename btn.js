import React, {Component} from 'react';
import 'semantic-ui-css/semantic.min.css';

class btn extends Component{
	render(){
		return (
			<div className={"row"}>
				<div className={"one wide column ui"}>
					<button className={"mini ui primary basic button"} onClick={this.props.ftn}>{this.props.name}</button>
				</div>
			</div>
		)
	}
}

export default btn;