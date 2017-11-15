import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

class Mapper extends Component{
	constructor(props){
		super(props);
		this.state = {
			position: false
		}
		this.position = false;
	}
	componentWillMount(){
		navigator.geolocation.getCurrentPosition(function(pos){
			this.position = [pos["coords"].latitude, pos["coords"].longitude];
			this.setState({position:true});
		}.bind(this));
	}
	render(){
		if (!this.state.position)
			return (null);
		var pos = [];
		pos[0] = this.position[0];
		pos[1] = this.position[1];
		pos[0] += 0.005;
		console.log(this.position);
		console.log(pos);
		return (
			<Map center={this.position} zoom={13}>
				<TileLayer
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
		 			attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				/>
				<Marker position={this.position}>
					<Popup>
						<span>A pretty CSS3 popup.<br/>Easily customizable.</span>
					</Popup>
				</Marker>
				<Marker position={pos}>
					<Popup>
						<span>second<br/>popup</span>
					</Popup>
				</Marker>
			</Map>
		);
	}
}

export default Mapper;