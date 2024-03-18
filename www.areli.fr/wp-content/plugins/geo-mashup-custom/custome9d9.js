// console.log(GeoMashup);

var inMarkerArray = [];

GeoMashup.addAction( 'loadedMap', function( properties, mxn_map ) {
  // var list_element, header_element, list_html, list_items, list_titles, list_count = 0;
  // list_html = ['<ul class="gm-visible-list">'];
  //     list_items = [];
  //     list_titles = [];
  // GeoMashup.forEach( GeoMashup.objects, function (object_id, obj) {
  //   console.log(obj);
  // if ( GeoMashup.isObjectOn( obj ) ) {
  //   var list_item = [];
  //   list_item.push('<li><img src="');
  //   list_item.push(obj.icon.image);
  //   list_item.push('" alt="');
  //   list_item.push(obj.title);
  //   list_item.push('" />');
  //   list_item.push(GeoMashup.objectLinkHtml(object_id));
  //   list_item.push('</li>');
  //   list_count += 1;
  //   list_items[obj.title] = list_item.join('');
  //   list_titles.push(obj.title);
  // }
  // });
  // console.log(list_items);


  GeoMashup.forEach( GeoMashup.objects, function(object_id, obj) {
    // console.log(object_id);
    inMarkerArray[object_id] = obj;

  });


  var custom_styles =
  [{
    "stylers": [
      { "hue": "#ffa200" },
      { "saturation": -70 }
    ]
  },{
    "featureType": "water",
    "stylers": [
      { "hue": "#00fff7" }
    ]
  },{
    "featureType": "road",
    "stylers": [
      { "hue": "#f6ff00" },
      { "lightness": 80 },
      { "saturation": -70 }
    ]
  },{
    "featureType": "poi",
    "stylers": [
      { "hue": "#00ff22" },
      { "lightness": 35 },
      { "saturation": 15 }
    ]
  }];

  // var map_type = new google.maps.StyledMapType( custom_styles, { name: 'custom' } );
  // var google_map = mxn_map.getMap();
  // google_map.mapTypes.set( 'custom', map_type );
  // google_map.setMapTypeId( 'custom' );
  //
  // google_map.zoomControlOptions = {
  //   position: google.maps.ControlPosition.LEFT_TOP
  // };


  // google.maps.event.addListener(marker, 'mouseover', function() {
  //   console.log('a');
  // });

});

GeoMashup.addAction( 'singleMarkerOptions', function ( properties, options ) {
  options.icon = 'wp-content/themes/in-skin/web/img/marker-orange.png';
  options.image = 'wp-content/themes/in-skin/web/img/marker-orange.png';
} );


GeoMashup.addAction( 'objectIcon', function( properties, object ) {
  object.icon.image = 'wp-content/themes/in-skin/web/img/marker-orange.png';
  // object.icon.iconSize = [48,48];
});

GeoMashup.addAction( 'glowMarkerIcon', function( properties, glow_options ) {
  glow_options.icon = 'wp-content/themes/in-skin/web/img/marker-noir.png';
  // glow_options.iconSize = [ 22, 30 ];
  // glow_options.iconAnchor = [ 11, 27 ];
} );

GeoMashup.addAction( 'markerClustererOptions', function( properties) {
  for(i=0; i < properties.styles.length; i++){
    properties.styles[i].url = 'wp-content/themes/in-skin/web/img/cluster.png'
  }
});
