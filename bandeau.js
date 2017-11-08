import React, { Component } from 'react';
import {Grid, Header} from 'semantic-ui-react';
import firebase from 'firebase';

var IntoNb = {
	1:"one",
	2:"two",
	3:"three",
	4:"four",
	5:"five",
	6:"six",
	7:"seven",
	8:"eight",
	9:"nine",
	10:"ten",
	11:"eleven",
	12:"twelve",
	13:"thirteen",
	14:"fourteen",
	15:"fifteen",
	16:"sixteen",
}

class Bandeau extends Component{
	constructor(props){
		super(props);
		this.snap = 0;
	}
	componentWillMount(){
		firebase.database().ref(this.props.node["node"]).once("value", function(snap){
			this.snap = snap.val();
		}.bind(this));
	}
	render(){
		var data = [];
		var label = [];
		var keys = this.props.node["labels"].split("/");
		var i = 0;

		while (keys[i]){
			if (this.snap[keys[i]]){
				data[i] = this.snap[keys[i]]["value"];
				label[i] = this.snap[keys[i]]["label"];
			}
			i++;
		}
		var size = 16 / data.length;
		size = Math.floor(size);
		if (size === 0)
			return (null);
		return (
			<Grid className={"relaxed padded internally celled grid"} style={{justifyContent: "space-between"}}>
				{Object.keys(data).map(key => {
					return (
						<div className={IntoNb[size] + " wide column ui"} key={key} style={{backgroundColor:"white",color:"white"}}>
							<Header className={"centered"} as={"h3"}> {label[key]} : </Header>
							<Header className={"centered"} as={"h1"}>{data[key]}</Header>
						</div>
					)
				})}
			</Grid>
		)
	}
}

export default Bandeau;