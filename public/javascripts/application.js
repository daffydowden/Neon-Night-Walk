  // http://groups.google.com/group/google-maps-js-api-v3/browse_thread/thread/3a9f3b83b941a2d7/7695b14e1dbc4f1c
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

$(document).ready(function(){

  // Extend google maps with distance funcitons
  // http://stackoverflow.com/questions/2698112/how-to-add-markers-on-google-maps-polylines-based-on-distance-along-the-line
  google.maps.Polyline.prototype.Distance = function() {
    var dist = 0;
    for (var i=1; i < this.getPath().getLength(); i++) {
      dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i-1));
    }
    return dist;
  }

  google.maps.LatLng.prototype.distanceFrom = function(newLatLng) {
    var R = 6371; // km (change this constant to get miles)
    //var R = 6378100; // meters
    var lat1 = this.lat();
    var lon1 = this.lng();
    var lat2 = newLatLng.lat();
    var lon2 = newLatLng.lng();
    var dLat = (lat2-lat1) * Math.PI / 180;
    var dLon = (lon2-lon1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
  }

  // Create a point every 10%
  google.maps.Polyline.prototype.PercentMarkers = function() {
    var dist = 0;
    var distance_per_percent = (this.Distance() / 100);
    var markers = [];
    for (var i=1; i < this.getPath().getLength(); i++) {
      dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i-1));

      if(dist >= (distance_per_percent*10)){
        markers.push(this.getPath().getAt(i));
        dist = 0;
      }
    }
    return markers;
  }

  // Get the fund raising data from JG via our server
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

  // Set the current total
  $('#current').html(efforts['raised']);
  $('#target').html(efforts['target']);

  // Determine the percentage
  efforts['percentage'] = Math.round((efforts['raised_clean']/efforts['target_clean'])*100) ;
  //console.info("Percent complete: " + efforts['percentage']);

  var current_location = Math.round((marathonRoute.length / 100) * efforts['percentage']);
  //console.info('Current point ' + current_location);

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
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'neonwalk'],
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    },
    streetViewControl: false,
    navigationControl: true,
    navigationControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT,
      style: google.maps.NavigationControlStyle.SMALL
    }
  };
      
  var styledMapOptions = {
    name: "Neon Walk"
  };
 
  var nightWalkMap = new google.maps.StyledMapType(
      purpleStyle, styledMapOptions);
 
  var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

  map.mapTypes.set('neonwalk', nightWalkMap);
  map.setMapTypeId('neonwalk');

  // Plot the complete Route
  var plotMarathonRoute = [];
  $(marathonRoute).each(function(){
    plotMarathonRoute.push(
      new google.maps.LatLng(this[0],this[1])
    );
  });

  var marathonRouteLineOpts = { 
    path: plotMarathonRoute,
    map: map,
    strokeColor: "#FFFFFF",
    strokeOpacity: 0.5,
    strokeWeight: 10
  };

  // Plot the complete route
  var completeRoute = new google.maps.Polyline(marathonRouteLineOpts);

  // Create the completed route
  var completedRoute = [];
  for(var i=0;i<current_location;i++){
    completedRoute.push(
      new google.maps.LatLng(marathonRoute[i][0],marathonRoute[i][1])
    );
  }
  
  var completedRouteLineOpts = { 
    path: completedRoute,
    map: map,
    strokeColor: "#FFFF00",
    strokeOpacity: 1.0,
    strokeWeight: 10
  };
  // Plot the complete route
  var completedRoute = new google.maps.Polyline(completedRouteLineOpts);
  var completedDistance = completedRoute.Distance();

  // Marker sprite positions
  var marker_off_origins = [new google.maps.Point(6,86),new google.maps.Point(66,86),new google.maps.Point(126,86),new google.maps.Point(186,86),new google.maps.Point(246,86),new google.maps.Point(306,86),new google.maps.Point(366,86),new google.maps.Point(426,86),new google.maps.Point(486,86)];
  var marker_on_origins = [new google.maps.Point(6,6),new google.maps.Point(66,6),new google.maps.Point(126,6),new google.maps.Point(186,6),new google.maps.Point(246,6),new google.maps.Point(306,6),new google.maps.Point(366,6),new google.maps.Point(426,6),new google.maps.Point(486,6)];

  // Add % markers to the map
  $(completeRoute.PercentMarkers()).each(function(index,value){
    if(index+1 >= (efforts['percentage']/10)){
      // future marker
      var marker_image = new google.maps.MarkerImage(
        'images/neonMapMarkers_sprite.png',
        new google.maps.Size(43,68), // Size
        marker_off_origins[index], // Origin
        new google.maps.Point(22,65) // Anchor
      );

      var marker = new google.maps.Marker({
        position: value,
        map: map,
        icon: marker_image
      });
    } else {
      // past marker
      var marker_image = new google.maps.MarkerImage(
        'images/neonMapMarkers_sprite.png',
        new google.maps.Size(43,68),
        marker_on_origins[index], 
        new google.maps.Point(22,65)
      );

      var marker = new google.maps.Marker({
        position: value,
        map: map,
        icon: marker_image
      });
    }
  });

  // Add current position marker to map
  var current_position_marker_image = new google.maps.MarkerImage(
    'images/neonMapMarkers_sprite.png',
    new google.maps.Size(73,100), // Size
    new google.maps.Point(644,6), // Origin
    new google.maps.Point(37,94) // Anchor
  );
  var current_position_marker = new google.maps.Marker({
    position: new google.maps.LatLng(marathonRoute[current_location][0],marathonRoute[current_location][1]),
    map: map,
    icon: current_position_marker_image
  });

  // Finish Marker
  var finish_marker_origin = (efforts['percentage'] >= 100) ? new google.maps.Point(554,6) : new google.maps.Point(554,106);
  var finish_marker_image = new google.maps.MarkerImage(
    'images/neonMapMarkers_sprite.png',
    new google.maps.Size(73,100), // Size
    finish_marker_origin, // Origin
    new google.maps.Point(37,94) // Anchor
  );
  var finish_marker = new google.maps.Marker({
    position: new google.maps.LatLng(marathonRoute[marathonRoute.length-1][0],marathonRoute[marathonRoute.length-1][1]),
    map: map,
    icon: finish_marker_image
  });

  // TEST Markers
  // $(completeRoute.PercentMarkers()).each(function(index,value){
  //   var test_marker = new google.maps.Marker({
  //       position: value,
  //       map: map
  //     });
  // });

  // Set the maps center to be the current percentage
  map.setCenter(new google.maps.LatLng(marathonRoute[current_location][0],marathonRoute[current_location][1]));

});