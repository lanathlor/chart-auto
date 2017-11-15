import firebase from 'firebase';
/*var config = {
	apiKey: "AIzaSyCLVpmJeXOD2_q3XedlpEaGGpSog0kQjBM",
	authDomain: "monkeymoneyfrance.firebaseapp.com",
	databaseURL: "https://monkeymoneyfrance.firebaseio.com",
	projectId: "monkeymoneyfrance",
	storageBucket: "monkeymoneyfrance.appspot.com",
	messagingSenderId: "451894989456"
};
firebase.initializeApp(config);*/

function getArray(str){
	var i = 0;
	var j = 0;
	var ret = [];
	ret[0] = "";

	while(str[i]){
		if ((str[i] >= 'a' && str[i] <= 'z') || (str[i] >= 'A' && str[i] <= 'Z') || (str[i] >= '0' && str[i] <= '9')){
			ret[j] += str[i];
		} else if (str[i] === ','){
			j++;
			ret[j] = "";
		}
		i++;
	}
	return (ret);
}

function loadSetterChart(node, callback){
	var tmp = [];
	var data = {};
	var i = 0;

	firebase.database().ref(node).once("value", function(snap){
		var setter = {};
		for (var key in snap.val()){
			if (snap.val()[key][0] === '[')
				setter[key] = getArray(snap.val()[key]);
			else
				setter[key] = snap.val()[key];
		}
		firebase.database().ref(setter["query"]).once("value").then(function(sp){
			for (var key in sp.val()){
				tmp.push(sp.val()[key]);
			}
			tmp.sort(function(a, b){
				return a[setter["label"]] > b[setter["label"]];
			})
			tmp.sort();
			while (tmp[i]){
				data[tmp[i][setter["label"]]] = tmp[i];
				i++;
			}
			callback(setter, data);
		});
	})
}

export default loadSetterChart;