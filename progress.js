import React, { Component } from 'react';
import { Progress } from 'semantic-ui-react';

class prog extends Component{
	constructor(props){
		super(props);
	}
	render(){
		var data = this.props.data;
		var label = this.props.front["labels"];
		var obj = [];
		var i = 0;
		
		console.log(this.props);
		//console.log(this.props.front);
		while (data[i]){
			obj[i] = {};
			obj[i]["data"] = data[i];
			if (label[i])
				obj[i]["label"] = label[i];
			else
				obj[i]["label"] = "";
			i++;
		}
		obj.sort(function(a, b){
				return a["data"] < b["data"];
		})
		console.log(obj);
		var i = 0;
		return (
			<div>
				{Object.keys(obj).map(key => {
					i++;
					if (i < 6)
						return (
							<Progress value={obj[key]["data"]} total={obj[0]["data"]} progress='percent' key={i} precision={0} label={obj[key]["label"]}/>
						)
				})}
			</div>
		)
	}
}

export default prog;