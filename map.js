var map=L.map('main',{
	center:[39.9788,116.30226],
	zoom:13,
	attributionControl:false,//隐藏右下角的leaflet字样
	zoomControl:false,//隐藏缩放+-按钮,通过L.control.zoom自己生成
});
var map_drawLayers=[];//自定义绘制完成的e.layer的数组
(function(){
	// 关闭双击放大地图
	map.doubleClickZoom.disable();


	// 自定义可控缩放按钮
	L.control.zoom({
		zoomInText:'+',
		zoomInTitle:'放大',
		zoomOutText:'-',
		zoomOutTitle:'缩小',
		position:'bottomright',//位置
	}).addTo(map);


	// tileLayer设置地图
	// L.tileLayer('http://{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',{
	// 	minZoom : 1,
	// 	maxZoom : 19,
	// 	subdomains : [ "server", "services" ],
	// 	attribution : "USGS, NOAA",
	// 	attributionUrl : "https://static.arcgis.com/attribution/World_Street_Map"
	// }).addTo(map);
	// 使用thirdProvider.js提供的砖层设置地图,
	L.tileLayer.thirdProvider('GaoDe.Normal.Map',{
	    maxZoom:18,
	    minZoom:5
	}).addTo(map);


	// 比例尺
	L.control.scale().addTo(map);


	// 可以用来渲染初始数据
	// bindTooltip('html')与bindPopup('html')方法可以对任意地图上添加的图层使用
	L.marker([39.9788,116.30226]).addTo(map).bindTooltip('<strong>提示框，鼠标移入显示，移出隐藏</strong>').bindPopup('<strong>弹框，点击显示或隐藏。openPopup()打开，closePopup()关闭</strong>');
	L.circle([39.99,116.32],500,{
		color:'#f00',
		weight:'2',
		fillColor:'#00f',
		fillOpacity:0.5
	}).addTo(map).bindTooltip('圆形空域');
	var polygon=L.polygon([[39.9788,116.30226],[39.9888,116.28226],[39.9688,116.31226]],{color:'#f00'}).addTo(map);
	polygon.bindTooltip('polygon');
	// setLatLng()方法中传入的参数可以为数组[lat值,lng值],也可以为对象{lat:lat值,lng:lng值}
	var popup=L.popup().setLatLng([39.9888,116.29888]).setContent('我是popup').openOn(map);
	// map.on('click',function(e){
	// 	console.log(e.latlng);//结果为{lat:...,lng:...}
	// 	L.popup().setLatLng(e.latlng).setContent('我是popup').openOn(map);
	// });


	// var a=latLngToLayerPoint([39.9788,116.31226]);


	// 绘制工具leaflet.draw-src.js
	// shapeOptions:{
	// 	stroke:true,
	// 	color:'#f00',//线颜色
	// 	weight:4,
	// 	opacity:0.5,
	// 	fill:true,
	// 	fillColor:'#f00',//不写则默认同color
	// 	fillOpacity:0.2,
	// 	showArea:boolean,
	// 	clickable:boolean,
	// 	editable:boolean
	// }
	var drawnItems=new L.FeatureGroup();
	map.addLayer(drawnItems);
	var overlay=new L.Control.Draw({
		position:'bottomright',
		edit:{
			featureGroup:drawnItems//是否开启编辑及删除按钮组,无关乎前面的drawnItems
		},
		draw:{
			polygon:{
				allowIntersection:true,//是否允许交叉
				shapeOptions:{
					showArea:true,
					editable:true,
				}
			},
			rectangle:{
				shapeOptions:{
					clickable:false,
					editable:true,
				}
			},
			circle:{
				shapeOptions:{
					editable:true,
				}
			},
			polyline:{
				shapeOptions:{
					color:'#f357a1',
					editable:true,
				}
			},
			marker:{
				shapeOptions:{
					editable:true,
				}
				// icon:new MyCustomMarker()
			},
			circlemarker:false
		}
	}).addTo(map);

	// 方法,用于删除之前绘制的e.layer(polygon,circle,marker……)
	function clearLayers(aLayers){
		var len=aLayers.length;
		if(len){
			for(var i=0;i<len;i++){
				aLayers[i].remove();
			}
			aLayers=[];
		}
	}

	map.on('draw:created',function(e){
		clearLayers(map_drawLayers);
		var layer=e.layer;
		map_drawLayers.push(layer);
		drawnItems.addLayer(layer);//绘制完成后显示当前的绘制
	});

	map.on('draw:deleted',function(e){
		var layers=e.layers;
		layers.eachLayer(function(item){
			console.log(item);
		});
	});
})();
