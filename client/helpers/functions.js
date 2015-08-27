createMarker = function(map, point, name) {
	if(name === undefined) {
		var marker = new google.maps.Marker({
			position: point,
			map: map
		});
	}
	else {
		var marker = new google.maps.Marker({
	    position: point,
	    map: map,
	    title: name
	  });
	}
}

getDateTime = function(){
  var now     = new Date(); 
  var year    = now.getFullYear();
  var month   = now.getMonth()+1; 
  var day     = now.getDate();
  var hour    = now.getHours();
  var minute  = now.getMinutes();
  var second  = now.getSeconds(); 
  if(month.toString().length == 1) {
    var month = '0'+month;
  }
  if(day.toString().length == 1) {
    var day = '0'+day;
  }   
  if(hour.toString().length == 1) {
    var hour = '0'+hour;
  }
  if(minute.toString().length == 1) {
    var minute = '0'+minute;
  }
  if(second.toString().length == 1) {
    var second = '0'+second;
  }   
  var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
  return dateTime;
}