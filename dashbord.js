import React, { Component } from 'react';
import Tuile from './tuile';
import firebase from 'firebase';
import Bandeau from './bandeau';
import {Grid} from 'semantic-ui-react';

var IntoNb = { // convertion pour les column semantic
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

function getSplitName(split, name){
	var i = 0;

	while (split[i]){
		if (split[i][1] === name)
			return (split[i][0]);
		i++;
	}
	return (null);
}

class dash extends Component{
	constructor(props) {
		super(props);
		this.snap = 0;
		this.state = {
			ok:false
		}
	}
	componentWillMount(){

		this.snap = [{}];
		firebase.database().ref(this.props.node).on("value", function(snap){ // chargement des données et mise en forme
			var i = 0;
			var tmp = snap.val();
			var splitOrder = tmp["order"].split(";");
			var splitSetting = tmp["setting"].split("/");
			var split2 = [];

			while (splitSetting[i]){
				splitSetting[i] = splitSetting[i].split(":");
				i++;
			}
			i = 0;
			this.snap["bandeau"] = tmp["bandeau"];
			while (splitOrder[i]){
				split2[i] = splitOrder[i].split(":");
				i++;
			}
			i = 0;
			while (split2[i]){
				var lastSplit = split2[i][1].split(",");
				var j = 0;
				this.snap[split2[i][0] * 1] = {};
				while (lastSplit[j]){
					this.snap[split2[i][0] * 1][lastSplit[j]] = tmp[getSplitName(splitSetting, lastSplit[j])];
					j++;
				}
				i++;
			}
			this.setState({ok:true, order:tmp["order"]});
		}.bind(this));
	}
	render(){
		var i = 0;
		if (this.state.ok === true){
			var split1 = this.state.order.split(";");
			var split2 = [];
			while (split1[i]){
				split2[i] = split1[i].split(":");
				i++;
			}
			return (
				<Grid className="relaxed padded grid">
					{<div className={"row centered"}>
						<Bandeau node={this.snap["bandeau"]}/>
					</div>}
					{Object.keys(split2).map(key => {
						var split3 = split2[key][1].split(",");
						var line = split2[key][0];
						return (
							<div className={"row centered"} key={key} style={{justifyContent: "space-between"}}>
								{Object.keys(split3).map(j => {
									var bd = 0;
									var col = split3[j];
									var set_comp = this.snap[line][col]; // composant a renderer
									if (!set_comp)
										return (null);
									if (set_comp && set_comp["row"] === 8 && j * 1 !== split3.length - 1)
										bd = 0; // 0 to disable the border
									return (
										<div className={IntoNb[set_comp["row"]] + " wide column ui"} style={{backgroundColor:"white",color:"white"}} key={key+j}>
											<Tuile setter={set_comp} border={bd}/>
										</div>
									)
								})}
							</div>
						);
					})}
				</Grid>
			)
		} else
			return (null);
	}
}

export default dash;