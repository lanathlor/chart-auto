import React, {Component} from 'react';
import Fork from './forker';
import {Grid,Modal} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import firebase from 'firebase';
import Btn from './btn';
import getTime from './timeGetter';
import Moment from 'moment';
import Tuile from './tuile';
import ButtonsBlock from '../block/buttonsblock';

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
	if (labeliser) {
		labeliser = labeliser.split(',')
		for (var key in data){
			ret[i] = data[key]['timestamp'];
			i++;
		}
	} else {
		for (var key in data){
			ret[i] = parseInt(key)
			i++;
		}
	}
	return (ret);
}

function getDonutData(value, data){
	var i = 0;
	var ret = [];

	for (var key in value){

		ret[i] = data[value[key]];
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
			tim_lim = data[key]['timestamp'] + splitTime;
			newStamp = tim_lim - (splitTime / 2);
			ret[newStamp] = {};
			ret[newStamp]['timestamp'] = newStamp;
		}
		while (data[key]['timestamp'] >= tim_lim){
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
				if (key2 !== 'timestamp' && data[key][key2]){
					if (!ret[newStamp][key2])
						ret[newStamp][key2] = 0;
					ret[newStamp][key2] += data[key][key2];
					i[key2]++;
				} else
					ret[newStamp]['timestamp'] = newStamp;
			}
		}
	}
	if (agrega["agreg"] === "="){
		for (var key_agr in ret[newStamp]){
			if (key_agr !== 'timestamp'){
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
		this.ok = false;
		this.handleFunction = this.handleFunction.bind(this)
	}




	componentWillMount() {
		if (this.props.setter["type"] === "line" || this.props.setter["type"] === "bar"){
			this.getLineData();
		} else if (this.props.setter["type"] === "donut" || this.props.setter["type"] === "progress") {
			this.getDonutDataTest()
		}
	}

	componentWillUpdate(){
	}

	getDonutDataTest() {
		var tmp = {};
		var data = {};
		var front = {};
		var complementNode = this.props.setter['complementNode']? ('/' + this.props[this.props.setter['complementNode']]) : '';

		firebase.database().ref(this.props.setter["query"]+complementNode).orderByKey().limitToLast(1).on("child_added", function(sp){
			var val = sp.val();
			data = getDonutData(this.props.setter["value"].split(','), val);
			if (data === -1)
				return ("ERROR : bad format of the value field");
			front["labels"] = this.props.setter["labels"].split(',');
			front["sets_label"] = this.props.setter["labels"].split(',');
			this.setState({data:data, limit:0,front:front});
		}.bind(this));
	}
	getLineData(btn){
		var data = {};
	  var front = {};
		var setter = this.props.setter;
		var complementNode = setter['complementNode']? ('/' + this.props[setter['complementNode']]) : '';
		var startAt = (typeof btn !== 'undefined') ? Moment().subtract(btn.time.value , btn.time.key).valueOf().toString() : Moment().subtract(setter.time.value , setter.time.key).valueOf().toString();

		firebase.database().ref(setter["query"]+complementNode).orderByKey().startAt(startAt).once("value", function(sp){

			var val = sp.val();
			for (var key in val){
				if (typeof(val[key]) === "object")
					if (typeof setter['label'] !== 'undefined') // label is defined within the val
					data[val[key][setter["label"]]] = val[key]
					else // lets use the node value instead (must be a timestamp)
					data[key] = val[key]
			}
			var tmp = data;
			if ((btn && btn.agreg) || this.props.setter["agreg"]){
				var agrega = (typeof btn !== 'undefined') ? btn : this.props.setter
				tmp = agregate(data, agrega);
			}

			data = getAllDataDouble(this.props.setter["value"].split(','), tmp);
			if (data === -1)
				return ("ERROR : bad format of the value field");
			front["labels"] = getLabels(this.props.setter["label"], tmp);
			front["sets_label"] = this.props.setter["labels"].split(',');

			this.setState({data:data, limit:0,front:front});
		}.bind(this));
	}


	handleFunction(e){
    switch (e.key) {
      case 'changeScale':
			this.getLineData(e)
       break;
    }
  }

	render(){
		if (!this.state.data || !this.state.front) return null;
		var data = this.state.data;
		var front = this.state.front;
		var type = this.props.setter["type"];
		var color = this.props.setter["color"].split(';');
		var btn = [];
		var border = "";
		var b = 0;
		var size = "twelve";
		var self = this;
		for (var key in this.props.setter["button"]){
			btn[b] = this.props.setter["button"][key];
			b++;
		}

		if (this.props.border === 1)
			border = "one wide grey column ui";

		if (!this.props.setter["button"])
			size = "sixteen";

		return(
			<Grid style={{
									backgroundColor:'white',
									boxShadow: '0 1px 2px 0 rgba(34,36,38,.15)',
									borderRadius: '.28571429rem',
									border: '1px solid rgba(34,36,38,.15)'
								}}>
				<Grid.Row >
					<Grid.Column width={'13'}>
						<Fork taille={this.props.setter["column"]}
							data={data}
							color={color}
							front={front}
							chart={type}
							scale={this.scale_chart} // scaling du temps sur l'axe X
							limit={this.state.limit}
							title={this.props.setter["title"]}
							chartClicked = {() => self.props.chartClicked(this.props.setter.modal)}
						/>
					</Grid.Column>

					<ButtonsBlock
						fluid = {true}
						textAlign='center'
						width={'3'}
						circular = {true}
						adminType = {'president'}
						path={'dash/averageCotis/default'}
						handleFunction = {this.handleFunction}
						handleModal = {this.handleModal}/>
				</Grid.Row>
			</Grid>
		)
	}
}

export default tuile;
