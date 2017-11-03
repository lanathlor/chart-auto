import React, {Component} from 'react';
import Fork from './forker';
import {Grid} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
/*
var setter = {
	label:"timestamp",
	value:["data1", "data2"],
	labels:["value1", "value2"],
	color:["blue", "red", "green"],
	type: "line"
}

var data = {
	clee1: {timestamp:1509367224223, data1: 1, data2: 2},
	clee2: {timestamp:1509377224223, data1: 5, data2: 10},
	clee3: {timestamp:1509387224223, data1: 10, data2: 15},
	clee4: {timestamp:1509397224223, data1: 15, data2: 20},
	clee5: {timestamp:1509407224223, data1: 20, data2: 25},
}
*/

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
	10:"ten"
}

var time_base = {
	millisecond: 1,
	second: 1000,
	minute: 60 * 1000,
	hour: 60 * 60 * 1000,
	day: 24 * 60 * 60 * 1000,
	week: 7 * 24 * 60 * 60 * 1000,
	mounth: 30 * 24 * 60 * 60 * 1000,
	year: 365 * 24 * 60 * 60 * 1000
}

function getAllDataDouble(value, data){
	var i = 0;
	var ret = [[]];

	if (typeof(value) !== "object")
		return (-1);
	for (var key in data){
		while (value[i]){
			if (!ret[i])
				ret[i] = [];
			ret[i].push(data[key][value[i]]);
			i++;
		}
		i = 0;
	}
	return (ret);
}

function getLabels(labeliser, data){
	var i = 0;
	var ret = [];

	for (var key in data){
		ret[i] = data[key][labeliser];
		i++;
	}
	return (ret);
}

function getDonutData(value, data){
	var i = 0;
	var ret = [];

	if (typeof(value) !== "string")
		return (-1);
	for (var key in data){
		ret[i] = data[key][value];
		i++;
	}
	return (ret);
}

function getSplitTime(timeJSON){
	var time = 0;

	for (var key in time_base){
		if (timeJSON[key])
			time += time_base[key] * timeJSON[key];
	}
	return (time);
}

function agregate(data, agrega){
	var ret = {};
	var i = {};
	var tim_lim = 0;
	var newStamp = 0;
	var splitTime = getSplitTime(agrega["agreg_time"]);

	for (var key in data){
		if (tim_lim === 0){
			tim_lim = data[key][agrega["label"]] + splitTime;
			newStamp = tim_lim - (splitTime / 2);
			ret[newStamp] = {};
			ret[newStamp][agrega["label"]] = newStamp;
		}
		while (data[key][agrega["label"]] >= tim_lim){
			if (agrega["agreg"] === "="){
				for (var key_ag in ret[newStamp]){
					if (key_ag !== agrega["label"]){
						ret[newStamp][key_ag] /= i[key_ag];
						i[key_ag] = 0;
					}
				}
			}
			tim_lim += splitTime;
			newStamp = tim_lim - (splitTime / 2);
		}
		if (agrega["agreg"] === "+" || agrega["agreg"] === "="){
			if (!ret[newStamp])
				ret[newStamp] = {};
			for (var key2 in data[key]){
				if (!i[key2])
					i[key2] = 0;
				if (key2 !== agrega["label"] && data[key][key2]){
					if (!ret[newStamp][key2])
						ret[newStamp][key2] = 0;
					ret[newStamp][key2] += data[key][key2];
					i[key2]++;
				} else 
					ret[newStamp][agrega["label"]] = newStamp;			
			}
		}
	}
	return (ret);
}

class tuile extends Component{
	render(){
		var data = this.props.data;
		var front = {};
		var type = this.props.setter["type"];
		var color = this.props.setter["color"];
		var tmp = data;

		if (this.props.setter["agreg"]){
			tmp = agregate(data, this.props.setter);
		}
		if (this.props.setter["type"] === "line" || this.props.setter["type"] === "bar"){
			data = getAllDataDouble(this.props.setter["value"], tmp);
			if (data === -1)
				return ("ERROR : bad format of the value field");
			front["labels"] = getLabels(this.props.setter["label"], tmp);
			front["sets_label"] = this.props.setter["labels"];
		} else if (this.props.setter["type"] === "donut") {
			data = getDonutData(this.props.setter["value"], tmp);
			if (data === -1)
				return ("ERROR : bad format of the value field");
			front["labels"] = this.props.setter["labels"];
			front["sets_label"] = this.props.setter["labels"];
		}
		return(
			<Grid>
				<div className={"row"}>
					<div className={IntoNb[this.props.setter["row"]] + " wide column ui"}>
						<Fork taille={this.props.setter["column"]} data={data} color={color} front={front} chart={type} />
					</div>
				</div>
			</Grid>
		)
	}
}

export default tuile;