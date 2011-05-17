// Put your application scripts here  
 
window.onload = function(){
  var map;
  var london = new google.maps.LatLng(51.527382,-0.098662);
  //http://maps.google.co.uk/maps?q=london&ie=UTF8&hq=&hnear=Westminster,+London,+United+Kingdom&gl=uk&ll=&spn=0.247276,0.451126&z=12&iwloc=A

  var greyStyle = [
    {
      featureType: "administrative",
      elementType: "all",
      stylers: [
        { saturation: -100 }
      ]
    },{
      featureType: "landscape",
      elementType: "all",
      stylers: [
        { saturation: -100 }
      ]
    },{
      featureType: "poi",
      elementType: "all",
      stylers: [
        { saturation: -100 }
      ]
    },{
      featureType: "road",
      elementType: "all",
      stylers: [
        { saturation: -100 }
      ]
    },{
      featureType: "transit",
      elementType: "all",
      stylers: [
        { saturation: -100 }
      ]
    },{
      featureType: "water",
      elementType: "all",
      stylers: [
        { saturation: -100 }
      ]
    }
  ];

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
   
  map = new google.maps.Map(document.getElementById("map_canvas"),
      mapOptions);
      
  var styledMapOptions = {
    name: "Neon Walk"
  };
 
  var nightWalkMap = new google.maps.StyledMapType(
      purpleStyle, styledMapOptions);
 
  map.mapTypes.set('neonwalk', nightWalkMap);
  map.setMapTypeId('neonwalk');


  //Plot the Route
  // var lineCoords = [
  //   new google.maps.LatLng(51.525666114871676,-0.08752636818849169),
  //   new google.maps.LatLng(51.52481169462598,-0.09336285500489794),
  //   new google.maps.LatLng(51.523316420617064,-0.09859852700196825),
  //   new google.maps.LatLng(51.52246195628093,-0.10186009316407763),
  //   new google.maps.LatLng(51.52262216956523,-0.10349087624513231),
  //   new google.maps.LatLng(51.52203471810045,-0.10709576516114794),
  //   new google.maps.LatLng(51.52347663089519,-0.10838322548829638),
  //   new google.maps.LatLng(51.52620011938361,-0.11233143715821825),
  //   new google.maps.LatLng(51.52780209534304,-0.1154213419433745)
  // ];

  // console.info(marathonRoute.length);

  var plotMarathonRoute = [];

  $(marathonRoute).each(function(){
    plotMarathonRoute.push(
      new google.maps.LatLng(this[0],this[1])
    )
  });

  var lineOpts = { 
    path: plotMarathonRoute,
    map: map,
    strokeColor: "#FFFF00",
    strokeOpacity: 1.0,
    strokeWeight: 10
  };

  // var courseCoords = [
  //   new google.maps.LatLng(51.525666114871676,-0.08752636818849169),
  //   new google.maps.LatLng(51.52481169462598,-0.09336285500489794),
  //   new google.maps.LatLng(51.523316420617064,-0.09859852700196825),
  //   new google.maps.LatLng(51.52246195628093,-0.10186009316407763),
  //   new google.maps.LatLng(51.52262216956523,-0.10349087624513231),
  //   new google.maps.LatLng(51.52203471810045,-0.10709576516114794),
  //   new google.maps.LatLng(51.52347663089519,-0.10838322548829638),
  //   new google.maps.LatLng(51.52620011938361,-0.11233143715821825),
  //   new google.maps.LatLng(51.52780209534304,-0.1154213419433745),
  //   new google.maps.LatLng(51.52977778806741,-0.11585049538575731),
  //   new google.maps.LatLng(51.53143303218039,-0.11413388161622606),
  //   new google.maps.LatLng(51.53073890487953,-0.12220196633302294),
  //   new google.maps.LatLng(51.52785549357099,-0.12924008278810106)
  // ];
  // var courseOpts = { 
  //   path: courseCoords,
  //   map: map,
  //   strokeColor: "#000",
  //   strokeOpacity: 0.5,
  //   strokeWeight: 8
  // };

  // var courseLine = new google.maps.Polyline(courseOpts);
  var fundLine = new google.maps.Polyline(lineOpts);
}