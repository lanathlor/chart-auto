import React, { Component } from 'react';
import { Progress, Header } from 'semantic-ui-react';

class prog extends Component{

	render(){
		var data = this.props.data;
		var label = this.props.front["labels"];
		var obj = [];
		var i = 0;
		
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
		i = 0;
		return (
			<div>
				<Header className={"centered"} as={"h3"}> {this.props.title} </Header>
				{Object.keys(obj).map(key => {
					i++;
					if (i < 6){
						return (
							<Progress color={"blue"} value={obj[key]["data"]} total={obj[0]["data"]} progress='percent' key={i} precision={0} label={obj[key]["label"]}/>
						)
					} else {
						return (null);
					}
				})}
			</div>
		)
	}
}

export default prog;