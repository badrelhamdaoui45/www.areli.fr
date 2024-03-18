(function(){var $m=mxn.util.$m;var init=function(){this.invoker.go("init",[this.currentElement,this.api]);this.applyOptions()};var Mapstraction=mxn.Mapstraction=function(element,api,debug){if(!api){api=mxn.util.getAvailableProviders()[0]}this.api=api;this.maps={};this.currentElement=$m(element);this.eventListeners=[];this.tileLayers=[];this.markers=[];this.polylines=[];this.images=[];this.controls=[];this.loaded={};this.onload={};this.onload[api]=[];this.element=element;this.options={enableScrollWheelZoom:false,enableDragging:true};this.addControlsArgs={};this.invoker=new mxn.Invoker(this,"Mapstraction",function(){return this.api});mxn.addEvents(this,["load","click","endPan","changeZoom","markerAdded","markerRemoved","polylineAdded","polylineRemoved"]);init.apply(this)};Mapstraction.ROAD=1;Mapstraction.SATELLITE=2;Mapstraction.HYBRID=3;Mapstraction.PHYSICAL=4;mxn.addProxyMethods(Mapstraction,["addLargeControls","addMapTypeControls","addOverlay","addSmallControls","applyOptions","getBounds","getCenter","getMapType","getPixelRatio","getZoom","getZoomLevelForBoundingBox","mousePosition","resizeTo","setBounds","setCenter","setCenterAndZoom","setMapType","setZoom","toggleTileLayer"]);Mapstraction.prototype.setOptions=function(oOpts){mxn.util.merge(this.options,oOpts);this.applyOptions()};Mapstraction.prototype.setOption=function(sOptName,vVal){this.options[sOptName]=vVal;this.applyOptions()};Mapstraction.prototype.enableScrollWheelZoom=function(){this.setOption("enableScrollWheelZoom",true)};Mapstraction.prototype.dragging=function(on){this.setOption("enableDragging",on)};Mapstraction.prototype.swap=function(element,api){if(this.api===api){return}var center=this.getCenter();var zoom=this.getZoom();this.currentElement.style.visibility="hidden";this.currentElement.style.display="none";this.currentElement=$m(element);this.currentElement.style.visibility="visible";this.currentElement.style.display="block";this.api=api;this.onload[api]=[];init.apply(this);for(var i=0;i<this.markers.length;i++){this.addMarker(this.markers[i],true)}for(var j=0;j<this.polylines.length;j++){this.addPolyline(this.polylines[j],true)}this.setCenterAndZoom(center,zoom);this.addControls(this.addControlsArgs)};Mapstraction.prototype.isLoaded=function(api){if(api===null){api=this.api}return this.loaded[api]};Mapstraction.prototype.setDebug=function(debug){if(debug!==null){this.debug=debug}return this.debug};Mapstraction.prototype.setDefer=function(deferred){this.loaded[this.api]=!deferred};Mapstraction.prototype.runDeferred=function(){while(this.onload[this.api].length>0){this.onload[this.api].shift().apply(this)}};Mapstraction.prototype.clickHandler=function(lat,lon,me){this.callEventListeners("click",{location:new LatLonPoint(lat,lon)})};Mapstraction.prototype.moveendHandler=function(me){this.callEventListeners("moveend",{})};Mapstraction.prototype.addEventListener=function(){var listener={};listener.event_type=arguments[0];listener.callback_function=arguments[1];if(arguments.length==3){listener.back_compat_mode=false;listener.callback_object=arguments[2]}else{listener.back_compat_mode=true;listener.callback_object=null}this.eventListeners.push(listener)};Mapstraction.prototype.callEventListeners=function(sEventType,oEventArgs){oEventArgs.source=this;for(var i=0;i<this.eventListeners.length;i++){var evLi=this.eventListeners[i];if(evLi.event_type==sEventType){if(evLi.back_compat_mode){if(evLi.event_type=="click"){evLi.callback_function(oEventArgs.location)}else{evLi.callback_function()}}else{var scope=evLi.callback_object||this;evLi.callback_function.call(scope,oEventArgs)}}}};Mapstraction.prototype.addControls=function(args){this.addControlsArgs=args;this.invoker.go("addControls",arguments)};Mapstraction.prototype.addMarker=function(marker,old){marker.mapstraction=this;marker.api=this.api;marker.location.api=this.api;marker.map=this.maps[this.api];var propMarker=this.invoker.go("addMarker",arguments);marker.setChild(propMarker);if(!old){this.markers.push(marker)}this.markerAdded.fire({marker:marker})};Mapstraction.prototype.addMarkerWithData=function(marker,data){marker.addData(data);this.addMarker(marker)};Mapstraction.prototype.addPolylineWithData=function(polyline,data){polyline.addData(data);this.addPolyline(polyline)};Mapstraction.prototype.removeMarker=function(marker){var current_marker;for(var i=0;i<this.markers.length;i++){current_marker=this.markers[i];if(marker==current_marker){marker.closeBubble();this.invoker.go("removeMarker",arguments);marker.onmap=false;this.markers.splice(i,1);this.markerRemoved.fire({marker:marker});break}}};Mapstraction.prototype.removeAllMarkers=function(){var current_marker;while(this.markers.length>0){current_marker=this.markers.pop();this.invoker.go("removeMarker",[current_marker])}};Mapstraction.prototype.declutterMarkers=function(opts){if(this.loaded[this.api]===false){var me=this;this.onload[this.api].push(function(){me.declutterMarkers(opts)});return}var map=this.maps[this.api];switch(this.api){case"multimap":map.declutterGroup(opts.groupName);break;case"  dummy":break;default:if(this.debug){throw new Error(this.api+" not supported by Mapstraction.declutterMarkers")}}};Mapstraction.prototype.addPolyline=function(polyline,old){polyline.api=this.api;polyline.map=this.maps[this.api];var propPoly=this.invoker.go("addPolyline",arguments);polyline.setChild(propPoly);if(!old){this.polylines.push(polyline)}this.polylineAdded.fire({polyline:polyline})};var removePolylineImpl=function(polyline){this.invoker.go("removePolyline",arguments);polyline.onmap=false;this.polylineRemoved.fire({polyline:polyline})};Mapstraction.prototype.removePolyline=function(polyline){var current_polyline;for(var i=0;i<this.polylines.length;i++){current_polyline=this.polylines[i];if(polyline==current_polyline){this.polylines.splice(i,1);removePolylineImpl.call(this,polyline);break}}};Mapstraction.prototype.removeAllPolylines=function(){var current_polyline;while(this.polylines.length>0){current_polyline=this.polylines.pop();removePolylineImpl.call(this,current_polyline)}};var collectPoints=function(bMarkers,bPolylines,predicate){var points=[];if(bMarkers){for(var i=0;i<this.markers.length;i++){var mark=this.markers[i];if(!predicate||predicate(mark)){points.push(mark.location)}}}if(bPolylines){for(i=0;i<this.polylines.length;i++){var poly=this.polylines[i];if(!predicate||predicate(poly)){for(var j=0;j<poly.points.length;j++){points.push(poly.points[j])}}}}return points};Mapstraction.prototype.autoCenterAndZoom=function(){var points=collectPoints.call(this,true,true);this.centerAndZoomOnPoints(points)};Mapstraction.prototype.centerAndZoomOnPoints=function(points){var bounds=new BoundingBox(90,180,-90,-180);for(var i=0,len=points.length;i<len;i++){bounds.extend(points[i])}this.setBounds(bounds)};Mapstraction.prototype.visibleCenterAndZoom=function(){var predicate=function(obj){return obj.getAttribute("visible")};var points=collectPoints.call(this,true,true,predicate);this.centerAndZoomOnPoints(points)};Mapstraction.prototype.polylineCenterAndZoom=function(padding){padding=padding||0;var points=collectPoints.call(this,false,true);if(padding>0){var padPoints=[];for(var i=0;i<points.length;i++){var point=points[i];var kmInOneDegreeLat=point.latConv();var kmInOneDegreeLon=point.lonConv();var latPad=padding/kmInOneDegreeLat;var lonPad=padding/kmInOneDegreeLon;var ne=new LatLonPoint(point.lat+latPad,point.lon+lonPad);var sw=new LatLonPoint(point.lat-latPad,point.lon-lonPad);padPoints.push(ne,sw)}points=points.concat(padPoints)}this.centerAndZoomOnPoints(points)};Mapstraction.prototype.addImageOverlay=function(id,src,opacity,west,south,east,north){var b=document.createElement("img");b.style.display="block";b.setAttribute("id",id);b.setAttribute("src",src);b.style.position="absolute";b.style.zIndex=1;b.setAttribute("west",west);b.setAttribute("south",south);b.setAttribute("east",east);b.setAttribute("north",north);var oContext={imgElm:b};this.invoker.go("addImageOverlay",arguments,{context:oContext})};Mapstraction.prototype.setImageOpacity=function(id,opacity){if(opacity<0){opacity=0}if(opacity>=100){opacity=100}var c=opacity/100;var d=document.getElementById(id);if(typeof d.style.filter=="string"){d.style.filter="alpha(opacity:"+opacity+")"}if(typeof d.style.KHTMLOpacity=="string"){d.style.KHTMLOpacity=c}if(typeof d.style.MozOpacity=="string"){d.style.MozOpacity=c}if(typeof d.style.opacity=="string"){d.style.opacity=c}};Mapstraction.prototype.setImagePosition=function(id){var imgElement=document.getElementById(id);var oContext={latLng:{top:imgElement.getAttribute("north"),left:imgElement.getAttribute("west"),bottom:imgElement.getAttribute("south"),right:imgElement.getAttribute("east")},pixels:{top:0,right:0,bottom:0,left:0}};this.invoker.go("setImagePosition",arguments,{context:oContext});imgElement.style.top=oContext.pixels.top.toString()+"px";imgElement.style.left=oContext.pixels.left.toString()+"px";imgElement.style.width=(oContext.pixels.right-oContext.pixels.left).toString()+"px";imgElement.style.height=(oContext.pixels.bottom-oContext.pixels.top).toString()+"px"};Mapstraction.prototype.addJSON=function(json){var features;if(typeof json=="string"){if(window.JSON&&window.JSON.parse){features=window.JSON.parse(json)}else{features=eval("("+json+")")}}else{features=json}features=features.features;var map=this.maps[this.api];var html="";var item;var polyline;var marker;var markers=[];if(features.type=="FeatureCollection"){this.addJSON(features.features)}for(var i=0;i<features.length;i++){item=features[i];switch(item.geometry.type){case"Point":html="<strong>"+item.title+"</strong><p>"+item.description+"</p>";marker=new Marker(new LatLonPoint(item.geometry.coordinates[1],item.geometry.coordinates[0]));markers.push(marker);this.addMarkerWithData(marker,{infoBubble:html,label:item.title,date:'new Date("'+item.date+'")',iconShadow:item.icon_shadow,marker:item.id,iconShadowSize:item.icon_shadow_size,icon:item.icon,iconSize:item.icon_size,category:item.source_id,draggable:false,hover:false});break;case"Polygon":var points=[];for(var j=0;j<item.geometry.coordinates[0].length;j++){points.push(new LatLonPoint(item.geometry.coordinates[0][j][1],item.geometry.coordinates[0][j][0]))}polyline=new Polyline(points);this.addPolylineWithData(polyline,{fillColor:item.poly_color,date:'new Date("'+item.date+'")',category:item.source_id,width:item.line_width,opacity:item.line_opacity,color:item.line_color,closed:points[points.length-1].equals(points[0])});markers.push(polyline);break;default:}}return markers};Mapstraction.prototype.addTileLayer=function(tile_url,opacity,label,attribution,min_zoom,max_zoom,map_type,subdomains){if(!tile_url){return}opacity=opacity||.6;label=label||"Mapstraction";attribution=attribution||"Mapstraction";min_zoom=min_zoom||1;max_zoom=max_zoom||18;map_type=map_type||false;return this.invoker.go("addTileLayer",[tile_url,opacity,label,attribution,min_zoom,max_zoom,map_type,subdomains])};Mapstraction.prototype.addFilter=function(field,operator,value){if(!this.filters){this.filters=[]}this.filters.push([field,operator,value])};Mapstraction.prototype.removeFilter=function(field,operator,value){if(!this.filters){return}var del;for(var f=0;f<this.filters.length;f++){if(this.filters[f][0]==field&&(!operator||this.filters[f][1]==operator&&this.filters[f][2]==value)){this.filters.splice(f,1);f--}}};Mapstraction.prototype.toggleFilter=function(field,operator,value){if(!this.filters){this.filters=[]}var found=false;for(var f=0;f<this.filters.length;f++){if(this.filters[f][0]==field&&this.filters[f][1]==operator&&this.filters[f][2]==value){this.filters.splice(f,1);f--;found=true}}if(!found){this.addFilter(field,operator,value)}};Mapstraction.prototype.removeAllFilters=function(){this.filters=[]};Mapstraction.prototype.doFilter=function(showCallback,hideCallback){var map=this.maps[this.api];var visibleCount=0;var f;if(this.filters){switch(this.api){case"multimap":var mmfilters=[];for(f=0;f<this.filters.length;f++){mmfilters.push(new MMSearchFilter(this.filters[f][0],this.filters[f][1],this.filters[f][2]))}map.setMarkerFilters(mmfilters);map.redrawMap();break;case"  dummy":break;default:var vis;for(var m=0;m<this.markers.length;m++){vis=true;for(f=0;f<this.filters.length;f++){if(!this.applyFilter(this.markers[m],this.filters[f])){vis=false}}if(vis){visibleCount++;if(showCallback){showCallback(this.markers[m])}else{this.markers[m].show()}}else{if(hideCallback){hideCallback(this.markers[m])}else{this.markers[m].hide()}}this.markers[m].setAttribute("visible",vis)}break}}return visibleCount};Mapstraction.prototype.applyFilter=function(o,f){var vis=true;switch(f[1]){case"ge":if(o.getAttribute(f[0])<f[2]){vis=false}break;case"le":if(o.getAttribute(f[0])>f[2]){vis=false}break;case"eq":if(o.getAttribute(f[0])!=f[2]){vis=false}break;case"in":if(typeof o.getAttribute(f[0])=="undefined"){vis=false}else if(o.getAttribute(f[0]).indexOf(f[2])==-1){vis=false}break}return vis};Mapstraction.prototype.getAttributeExtremes=function(field){var min;var max;for(var m=0;m<this.markers.length;m++){if(!min||min>this.markers[m].getAttribute(field)){min=this.markers[m].getAttribute(field)}if(!max||max<this.markers[m].getAttribute(field)){max=this.markers[m].getAttribute(field)}}for(var p=0;m<this.polylines.length;m++){if(!min||min>this.polylines[p].getAttribute(field)){min=this.polylines[p].getAttribute(field)}if(!max||max<this.polylines[p].getAttribute(field)){max=this.polylines[p].getAttribute(field)}}return[min,max]};Mapstraction.prototype.getMap=function(){return this.maps[this.api]};var LatLonPoint=mxn.LatLonPoint=function(lat,lon){this.lat=Number(lat);this.lon=Number(lon);this.lng=this.lon;this.invoker=new mxn.Invoker(this,"LatLonPoint")};mxn.addProxyMethods(LatLonPoint,["fromProprietary","toProprietary"],true);LatLonPoint.prototype.toString=function(places){if(typeof places!=="undefined"){return this.lat.toFixed(places)+", "+this.lon.toFixed(places)}else{return this.lat+", "+this.lon}};LatLonPoint.prototype.distance=function(otherPoint){var rads=Math.PI/180;var diffLat=(this.lat-otherPoint.lat)*rads;var diffLon=(this.lon-otherPoint.lon)*rads;var a=Math.sin(diffLat/2)*Math.sin(diffLat/2)+Math.cos(this.lat*rads)*Math.cos(otherPoint.lat*rads)*Math.sin(diffLon/2)*Math.sin(diffLon/2);return 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))*6371};LatLonPoint.prototype.equals=function(otherPoint){return this.lat==otherPoint.lat&&this.lon==otherPoint.lon};LatLonPoint.prototype.latConv=function(){return this.distance(new LatLonPoint(this.lat+.1,this.lon))*10};LatLonPoint.prototype.lonConv=function(){return this.distance(new LatLonPoint(this.lat,this.lon+.1))*10};var BoundingBox=mxn.BoundingBox=function(swlat,swlon,nelat,nelon){this.sw=new LatLonPoint(swlat,swlon);this.ne=new LatLonPoint(nelat,nelon);this.se=new LatLonPoint(swlat,nelon);this.nw=new LatLonPoint(nelat,swlon)};BoundingBox.prototype.getSouthWest=function(){return this.sw};BoundingBox.prototype.getSouthEast=function(){return this.se};BoundingBox.prototype.getNorthWest=function(){return this.nw};BoundingBox.prototype.getNorthEast=function(){return this.ne};BoundingBox.prototype.isEmpty=function(){return this.ne==this.sw};BoundingBox.prototype.contains=function(point){return point.lat>=this.sw.lat&&point.lat<=this.ne.lat&&(this.sw.lon<=this.ne.lon&&point.lon>=this.sw.lon&&point.lon<=this.ne.lon||this.sw.lon>this.ne.lon&&(point.lon>=this.sw.lon||point.lon<=this.ne.lon))};BoundingBox.prototype.toSpan=function(){return new LatLonPoint(Math.abs(this.sw.lat-this.ne.lat),Math.abs(this.sw.lon-this.ne.lon))};BoundingBox.prototype.toString=function(places){var sw;var ne;if(typeof places!=="undefined"){sw=this.sw.toString(places);ne=this.ne.toString(places)}else{sw=this.sw;ne=this.ne}return"SW: "+sw+", NE: "+ne};BoundingBox.prototype.extend=function(point){var extended=false;if(this.sw.lat>point.lat){this.sw.lat=point.lat;extended=true}if(this.sw.lon>point.lon){this.sw.lon=point.lon;extended=true}if(this.ne.lat<point.lat){this.ne.lat=point.lat;extended=true}if(this.ne.lon<point.lon){this.ne.lon=point.lon;extended=true}if(extended){this.se=new LatLonPoint(this.sw.lat,this.ne.lon);this.nw=new LatLonPoint(this.ne.lat,this.sw.lon)}return};BoundingBox.prototype.intersects=function(other){return this.sw.lat<=other.ne.lat&&this.ne.lat>=other.sw.lat&&(this.sw.lon<=this.ne.lon&&other.sw.lon<=other.ne.lon&&this.sw.lon<=other.ne.lon&&this.ne.lon>=other.sw.lon||this.sw.lon>this.ne.lon&&other.sw.lon>other.ne.lon||this.sw.lon>this.ne.lon&&other.sw.lon<=other.ne.lon&&(this.sw.lon<=other.ne.lon||this.ne.lon>=other.sw.lon)||this.sw.lon<=this.ne.lon&&other.sw.lon>other.ne.lon&&(this.ne.lon>=other.sw.lon||this.sw.lon<=other.ne.lon))};var Marker=mxn.Marker=function(point){this.api=null;this.location=point;this.onmap=false;this.proprietary_marker=false;this.attributes=[];this.invoker=new mxn.Invoker(this,"Marker",function(){return this.api});mxn.addEvents(this,["openInfoBubble","closeInfoBubble","click"])};mxn.addProxyMethods(Marker,["fromProprietary","hide","openBubble","closeBubble","show","toProprietary","update"]);Marker.prototype.setChild=function(childMarker){this.proprietary_marker=childMarker;childMarker.mapstraction_marker=this;this.onmap=true};Marker.prototype.setLabel=function(labelText){this.labelText=labelText};Marker.prototype.addData=function(options){for(var sOptKey in options){if(options.hasOwnProperty(sOptKey)){switch(sOptKey){case"label":this.setLabel(options.label);break;case"infoBubble":this.setInfoBubble(options.infoBubble);break;case"icon":if(options.iconSize&&options.iconAnchor){this.setIcon(options.icon,options.iconSize,options.iconAnchor)}else if(options.iconSize){this.setIcon(options.icon,options.iconSize)}else{this.setIcon(options.icon)}break;case"iconShadow":if(options.iconShadowSize){this.setShadowIcon(options.iconShadow,[options.iconShadowSize[0],options.iconShadowSize[1]])}else{this.setIcon(options.iconShadow)}break;case"infoDiv":this.setInfoDiv(options.infoDiv[0],options.infoDiv[1]);break;case"draggable":this.setDraggable(options.draggable);break;case"hover":this.setHover(options.hover);break;case"hoverIcon":this.setHoverIcon(options.hoverIcon);break;case"openBubble":this.openBubble();break;case"closeBubble":this.closeBubble();break;case"groupName":this.setGroupName(options.groupName);break;default:this.setAttribute(sOptKey,options[sOptKey]);break}}}};Marker.prototype.setInfoBubble=function(infoBubble){this.infoBubble=infoBubble};Marker.prototype.setInfoDiv=function(infoDiv,div){this.infoDiv=infoDiv;this.div=div};Marker.prototype.setIcon=function(iconUrl,iconSize,iconAnchor){this.iconUrl=iconUrl;if(iconSize){this.iconSize=iconSize}if(iconAnchor){this.iconAnchor=iconAnchor}};Marker.prototype.setIconSize=function(iconSize){if(iconSize){this.iconSize=iconSize}};Marker.prototype.setIconAnchor=function(iconAnchor){if(iconAnchor){this.iconAnchor=iconAnchor}};Marker.prototype.setShadowIcon=function(iconShadowUrl,iconShadowSize){this.iconShadowUrl=iconShadowUrl;if(iconShadowSize){this.iconShadowSize=iconShadowSize}};Marker.prototype.setHoverIcon=function(hoverIconUrl){this.hoverIconUrl=hoverIconUrl};Marker.prototype.setDraggable=function(draggable){this.draggable=draggable};Marker.prototype.setHover=function(hover){this.hover=hover};Marker.prototype.setGroupName=function(groupName){this.groupName=groupName};Marker.prototype.setAttribute=function(key,value){this.attributes[key]=value};Marker.prototype.getAttribute=function(key){return this.attributes[key]};var Polyline=mxn.Polyline=function(points){this.api=null;this.points=points;this.attributes=[];this.onmap=false;this.proprietary_polyline=false;this.pllID="mspll-"+(new Date).getTime()+"-"+Math.floor(Math.random()*Math.pow(2,16));this.invoker=new mxn.Invoker(this,"Polyline",function(){return this.api});this.color="#000000";this.width=3;this.opacity=.5;this.closed=false;this.fillColor="#808080"};mxn.addProxyMethods(Polyline,["fromProprietary","hide","show","toProprietary","update"]);Polyline.prototype.addData=function(options){for(var sOpt in options){if(options.hasOwnProperty(sOpt)){switch(sOpt){case"color":this.setColor(options.color);break;case"width":this.setWidth(options.width);break;case"opacity":this.setOpacity(options.opacity);break;case"closed":this.setClosed(options.closed);break;case"fillColor":this.setFillColor(options.fillColor);break;default:this.setAttribute(sOpt,options[sOpt]);break}}}};Polyline.prototype.setChild=function(childPolyline){this.proprietary_polyline=childPolyline;this.onmap=true};Polyline.prototype.setColor=function(color){this.color=color.length==7&&color[0]=="#"?color.toUpperCase():color};Polyline.prototype.setWidth=function(width){this.width=width};Polyline.prototype.setOpacity=function(opacity){this.opacity=opacity};Polyline.prototype.setClosed=function(closed){this.closed=closed};Polyline.prototype.setFillColor=function(fillColor){this.fillColor=fillColor};Polyline.prototype.setAttribute=function(key,value){this.attributes[key]=value};Polyline.prototype.getAttribute=function(key){return this.attributes[key]};Polyline.prototype.simplify=function(tolerance){var reduced=[];reduced[0]=this.points[0];var markerPoint=0;for(var i=1;i<this.points.length-1;i++){if(this.points[i].distance(this.points[markerPoint])>=tolerance){reduced[reduced.length]=this.points[i];markerPoint=i}}reduced[reduced.length]=this.points[this.points.length-1];this.points=reduced};var Radius=mxn.Radius=function(center,quality){this.center=center;var latConv=center.latConv();var lonConv=center.lonConv();var rad=Math.PI/180;this.calcs=[];for(var i=0;i<360;i+=quality){this.calcs.push([Math.cos(i*rad)/latConv,Math.sin(i*rad)/lonConv])}};Radius.prototype.getPolyline=function(radius,color){var points=[];for(var i=0;i<this.calcs.length;i++){var point=new LatLonPoint(this.center.lat+radius*this.calcs[i][0],this.center.lon+radius*this.calcs[i][1]);points.push(point)}points.push(points[0]);var line=new Polyline(points);line.setColor(color);return line}})();
