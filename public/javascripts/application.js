// // Put your application scripts here  
 
// window.onload = function(){

//   // http://groups.google.com/group/google-maps-js-api-v3/browse_thread/thread/3a9f3b83b941a2d7/7695b14e1dbc4f1c
//   google.maps.LatLng.prototype.kmTo = function(a){ 
//     var e = Math, ra = e.PI/180; 
//     var b = this.lat() * ra, c = a.lat() * ra, d = b - c; 
//     var g = this.lng() * ra - a.lng() * ra; 
//     var f = 2 * e.asin(e.sqrt(e.pow(e.sin(d/2), 2) + e.cos(b) * e.cos 
// (c) * e.pow(e.sin(g/2), 2))); 
//     return f * 6378.137; 
//   } 

//   google.maps.Polyline.prototype.inKm = function(n){ 
//     var a = this.getPath(n), len = a.getLength(), dist = 0; 
//     for(var i=0; i<len-1; i++){ 
//       dist += a.getAt(i).kmTo(a.getAt(i+1)); 
//     } 
//     return dist; 
//   } 

//   // http://stackoverflow.com/questions/2698112/how-to-add-markers-on-google-maps-polylines-based-on-distance-along-the-line
//   google.maps.Polyline.prototype.Distance = function() {
//     var dist = 0;
//     for (var i=1; i < this.getPath().getLength(); i++) {
//       dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i-1));
//     }
//     return dist;
//   }

//   google.maps.LatLng.prototype.distanceFrom = function(newLatLng) {
//     var R = 6371; // km (change this constant to get miles)
//     //var R = 6378100; // meters
//     var lat1 = this.lat();
//     var lon1 = this.lng();
//     var lat2 = newLatLng.lat();
//     var lon2 = newLatLng.lng();
//     var dLat = (lat2-lat1) * Math.PI / 180;
//     var dLon = (lon2-lon1) * Math.PI / 180;
//     var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//       Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
//       Math.sin(dLon/2) * Math.sin(dLon/2);
//     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     var d = R * c;
//     return d;
//   }

//   // console.info(marathonRoute.length);
//   //26.2
//   console.info("Number of markers per mile: " + Math.round(marathonRoute.length / 26.2));

//   //Complete Route
//   var plotMarathonRoute = [];
//   $(marathonRoute).each(function(){
//     plotMarathonRoute.push(
//       new google.maps.LatLng(this[0],this[1])
//     )
//   });

//   //Completed Route
//   for(point in marathonRoute){

//   }

//   var lineOpts = { 
//     path: plotMarathonRoute,
//     map: map,
//     strokeColor: "#FFFFFF",
//     strokeOpacity: 0.5,
//     strokeWeight: 10
//   };

//   // Plot the complete route
//   var fundLine = new google.maps.Polyline(lineOpts);
  
//   console.info(fundLine.inKm());
//   console.info(fundLine.Distance());
// }


$(document).ready(function(){
  // Get the fund raising data from JG
  var efforts = $.parseJSON($.ajax({
      url: "/fundraising_status.json",
      global: false,
      type: "GET",
      dataType: "json",
      async:false,
      success: function(msg){
         //alert(msg);
      }
    }
  ).responseText);

  // Determine the percentage
  efforts['percentage'] = Math.round((efforts['raised_clean']/efforts['target_clean'])*100) ;
  console.info(efforts['percentage']);

  var current_location = Math.round(marathonRoute.length / efforts['percentage']);
  console.info(current_location);

  // Create a new map
  var london = new google.maps.LatLng(51.527382,-0.098662);
  //http://maps.google.co.uk/maps?q=london&ie=UTF8&hq=&hnear=Westminster,+London,+United+Kingdom&gl=uk&ll=&spn=0.247276,0.451126&z=12&iwloc=A

  var purpleStyle = [
    {
      featureType: "administrative",
      elementType: "all",
      stylers: [
        { visibility: 'simplified'},
        { hue: "#604878" },
        { gamma: 1 },
        {lightness: -20},
        { saturation: 100 }
      ]
    },{
      featureType: "landscape",
      elementType: "all",
      stylers: [
        { hue: "#604878" },
        { gamma: 1 },
        {lightness: -20},
        { saturation: 100 }
      ]
    },{
      featureType: "landscape",
      elementType: "labels",
      stylers: [
        { visibility: 'off'}
      ]
    },{
      featureType: "poi",
      elementType: "all",
      stylers: [
        { visibility: 'simplified'},
        { hue: "#483078" },
        { gamma: 1 },
        {lightness: -20},
        { saturation: 100 }
      ]
    },{
      featureType: "road",
      elementType: "all",
      stylers: [
        { gamma: 0.56 },
        { saturation: 100 },
        { lightness: -10 },
        { hue: "#6e00ff" }
      ]
    },{
      featureType: "road.local",
      elementType: "all",
      stylers: [
        { visibility: 'simplified'},
        { gamma: 0.5 }
      ]
    },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: 'off'}
      ]
    },{
      featureType: "transit",
      elementType: "all",
      stylers: [
        { hue: '#604878' },
        { gamma: 0.9 },
        {lightness: -20},
        { saturation: 100 }
      ]
    },{
      featureType: "transit",
      elementType: "labels",
      stylers: [
        { visibility: 'off'}
      ]
    },{
      featureType: "water",
      elementType: "all",
      stylers: [
        { hue: '#001848' },
        { gamma: 1 },
        {lightness: -70},
        { saturation: 100 }
      ]
    },{
      featureType: "water",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];
 
  var mapOptions = {
    zoom: 15,
    center: london,
    mapTypeControlOptions: {
       mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'neonwalk']
    }
  };
   
  var map = new google.maps.Map(document.getElementById("map_canvas"),
      mapOptions);
      
  var styledMapOptions = {
    name: "Neon Walk"
  };
 
  var nightWalkMap = new google.maps.StyledMapType(
      purpleStyle, styledMapOptions);
 
  map.mapTypes.set('neonwalk', nightWalkMap);
  map.setMapTypeId('neonwalk');

  // Plot the complete Route
  var plotMarathonRoute = [];
  $(marathonRoute).each(function(){
    plotMarathonRoute.push(
      new google.maps.LatLng(this[0],this[1])
    )
  });

  var lineOpts = { 
    path: plotMarathonRoute,
    map: map,
    strokeColor: "#FFFFFF",
    strokeOpacity: 0.5,
    strokeWeight: 10
  };

  // Plot the complete route
  var completeRoute = new google.maps.Polyline(lineOpts);

  // Set the maps center to be the current percentage
  map.setCenter(new google.maps.LatLng(marathonRoute[current_location][0],marathonRoute[current_location][1]));
});