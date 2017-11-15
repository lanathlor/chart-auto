import React, { Component } from 'react';
import Tuile from './tuile';
import firebase from 'firebase';
import Bandeau from './bandeau';
import {Grid,Modal,Header,Segment,Icon} from 'semantic-ui-react';

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
		this.tmp = null;
	}
	componentWillMount(){
		var i = 0;

		this.snap = [{}];
		firebase.database().ref(this.props.node).on("value", function(snap){ // chargement des données et mise en forme
			var tmp = snap.val();
			this.tmp = tmp
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
	renderModal() {
		var self = this
		if (this.state.modal == '' || !this.state.modal ) return null;

			return(
				<Modal dimmer={'blurring'} open closeOnDimmerClick onClose={() => self.setState({modal:''})}>
					<Modal.Header></Modal.Header>
					<Modal.Content >
						<Tuile setter={self.tmp[self.state.modal]} />
					</Modal.Content>
				</Modal>
			)
	}
	render(){
		var i = 0;
		var self = this;
		if (this.state.ok === true){
			var split1 = this.state.order.split(";");
			var split2 = [];
			while (split1[i]){
				split2[i] = split1[i].split(":");
				i++;
			}
			return (
				<Grid style={{padding:'0em 2em 0em 1em'}}>
					<Segment style={{width:'100%',margin:'0.5em 1em'}}>
						<Header as="h1" >
							<Icon circular name='github' size='huge'/>
							Bienvenue sur l'accueil de l'association
						</Header>
					</Segment>

					{this.renderModal()}
					{<div className={"row centered"}>
						<Segment style={{width:'100%',margin:'0em 1em'}}>
							<Bandeau node={this.snap["bandeau"]}/>
						</Segment>

					</div>}
					{Object.keys(split2).map(key => {
						var split3 = split2[key][1].split(",");
						var line = split2[key][0];
						return (
							<Grid.Row columns={Object.keys(split3).length} equals key={key} style={{justifyContent: "space-between",margin:'0em 0em',padding:'1em 0em'}}>
								{Object.keys(split3).map(j => {
									var bd = 0;
									var col = split3[j];
									var set_comp = this.snap[line][col]; // composant a renderer

									return (
										<Grid.Column
											style={{padding: '1em 2em'}}
											key={key+j}>

											<Tuile
												chartClicked = {(e)=> self.setState({modal : e})}
												setter={set_comp}
												border={bd}/>
										</Grid.Column>
									)
								})}
							</Grid.Row>
						);
					})}
				</Grid>
			)
		} else
			return (null);
	}
}

export default dash;
