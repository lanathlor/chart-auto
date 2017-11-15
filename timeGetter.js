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

function GetTimeOff(time_data){
	var time_off = 0;

	if (typeof(time_data) === "object"){
		for (var key in time_data){
			time_off += time_data[key] * time_base[key];
		}
		time_off = Date.now() - time_off;
	} else if (typeof(time_data) === "number"){
		time_off = time_data;
	} else {
		return (-1);
	}

	return (time_off);
}

function getDeepness(data, deep, ret, time){
	var i = 0;
	var j = 0;
	var i_tmp = 0;

	if (typeof(data[0]) === "undefined"){ // bottom
		return (-1);
	}
	ret = [];

	while (data[i]){
		ret[j] = getDeepness(data[i], deep + 1, ret[i], time); // recursive call
		if (ret[j] === -1){ // we hit the bot
			ret[j] = {};
			if (data[i]["timestamp"] && data[i]["timestamp"] >= time){
				ret[j] = data[i];
				j++;
			}
			else if (!data[i]["timestamp"]){
				ret[j] = data[i];
				j++;
			}
		} else if (!ret[j]){
		} else {
			j++;
		}
		i++;
	}
	if (j === 0)
		return;
	var tmp = [];
	while (ret[i_tmp]){
		tmp[i_tmp] = ret[i_tmp];
		i_tmp++;
	}
	ret = tmp;
	return (ret);
}



function getTime(data, time_scale)
{
	var ret;
	var time = GetTimeOff(time_scale);

	if (time === -1){
		return (-1);
	}

	ret = getDeepness(data, 0, ret, time);
	return (ret);
}

export default getTime;
