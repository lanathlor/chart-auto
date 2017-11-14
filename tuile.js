import React, {Component} from 'react';
import Fork from './forker';
import {Grid} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import firebase from 'firebase';
import Btn from './btn';
import getTime from './timeGetter';
import Moment from 'moment';
var config = {
	apiKey: "AIzaSyCLVpmJeXOD2_q3XedlpEaGGpSog0kQjBM",
	authDomain: "monkeymoneyfrance.firebaseapp.com",
	databaseURL: "https://monkeymoneyfrance.firebaseio.com",
	projectId: "monkeymoneyfrance",
	storageBucket: "monkeymoneyfrance.appspot.com",
	messagingSenderId: "451894989456"
};
firebase.initializeApp(config);

/*var IntoNb = {
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
*/
var time_base = {
	millisecond: 1,
	second: 1000,
	minute: 60 * 1000,
	hour: 60 * 60 * 1000,
	day: 24 * 60 * 60 * 1000,
	week: 7 * 24 * 60 * 60 * 1000,
	month: 30 * 24 * 60 * 60 * 1000,
	year: 365 * 24 * 60 * 60 * 1000
}

var newAgreg = 0;

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

	if (newAgreg)
		agrega["agreg_time"] = newAgreg;
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
						if (!i[key_ag] || i[key_ag] === 0)
							i[key_ag] = 1;
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
	if (agrega["agreg"] === "="){
		for (var key_agr in ret[newStamp]){
			if (key_agr !== agrega["label"]){
				if (!i[key_agr] || i[key_agr] === 0)
					i[key_agr] = 1;
				ret[newStamp][key_agr] /= i[key_agr];
				i[key_agr] = 0;
			}
		}
	}
	return (ret);
}

class tuile extends Component{
	constructor(props) {
		super(props);
		this.scale_chart = this.props.setter["scale"];
		this.state = {};
		this.save_data = {};
		this.ok = false;
	}

	changeData(time, agrega, scaler){
		var new_data = [];
		var i = 0;

		for (var key in this.state.save_data){
			new_data[i] = this.state.save_data[key];
			i++;
		}
		new_data = getTime(new_data, time);
		if (!new_data)
			new_data = [];
		newAgreg = agrega;
		this.scale_chart = scaler;
		this.setState({data:new_data});
	}

	componentWillMount() {
		this.getData();
	}

	componentWillUpdate(){
	}

	getData(){
		var tmp = [];
		var data = {};
		var i = 0;
		var self = this;
		var setter = this.props.setter;
		var complementNode = setter['complementNode']? ('/' + this.props[setter['complementNode']]) : '';

		firebase.database().ref(setter["query"]+complementNode).orderByChild(setter["label"]).on("value", function(sp){
			var val = sp.val();
			for (var key in val){
				if (typeof(val[key]) === "object")
					tmp.push(val[key]);
			}
			tmp.sort(function(a, b){
				return (a[setter["label"]] < b[setter["label"]] ? -1 : (a[setter["label"]] > b[setter["label"]] ? 1 : 0));
			})
			tmp.sort();
			tmp.sort();
			while (tmp[i]){
				data[tmp[i][setter["label"]]] = tmp[i];
				i++;
			}
			this.setState({data:data, save_data:data, limit:0});
		}.bind(this));
	}

	render(){
		var data = this.state.data;
		var front = {};
		var type = this.props.setter["type"];
		var color = this.props.setter["color"].split(',');
		var tmp = data;
		var btn = [];
		var border = "";
		var b = 0;
		var size = "twelve";

		for (var key in this.props.setter["button"]){
			btn[b] = this.props.setter["button"][key];
			b++;
		}

		if (this.props.setter["agreg"]){
			tmp = agregate(data, this.props.setter);
		}
		if (this.props.setter["type"] === "line" || this.props.setter["type"] === "bar"){

			data = getAllDataDouble(this.props.setter["value"].split(','), tmp);
			if (data === -1)
				return ("ERROR : bad format of the value field");
			front["labels"] = getLabels(this.props.setter["label"].split(','), tmp);
			front["sets_label"] = this.props.setter["labels"].split(',');
		} else if (this.props.setter["type"] === "donut" || this.props.setter["type"] === "progress") {
			data = getDonutData(this.props.setter["value"], tmp);
			if (data === -1)
				return ("ERROR : bad format of the value field");
			front["labels"] = this.props.setter["labels"].split(',');
			front["sets_label"] = this.props.setter["labels"].split(',');
		}
		if (this.props.border === 1)
			border = "one wide grey column ui";

		if (!this.props.setter["button"])
			size = "sixteen";
		return(
			<Grid>
				<div className={"row"}>
					<div className={size + " wide column ui"}>
						<Fork taille={this.props.setter["column"]}
							data={data}
							color={color}
							front={front}
							chart={type}
							scale={this.scale_chart} // scaling du temps sur l'axe X
							limit={this.state.limit}
							title={this.props.setter["title"]}
						/>
					</div>
					<div className={"three wide column ui"}>
						{Object.keys(btn).map(i =>{
							var act_btn = btn[i]; // bouton a charger.
							var j = 0;
							if (!act_btn)
								return (null);
							if (j < 7){
								j++;
								return (<Btn name={act_btn["name"]} 
											key={act_btn["name"] + i} 
											ftn={() => this.changeData(act_btn["time"], 
																	act_btn["agrega"], 
																	act_btn["scale"])}/>);
							}
							else
								return (null);
						})}
					</div>
					<div className={border}>
					</div>
				</div>
			</Grid>
		)
	}
}

export default tuile;
