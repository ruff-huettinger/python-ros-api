#include <lib/areagraph_1_3.js>

function CircleCounter(){
	var q_Count		= 15;
	var totalTimeMS	= 10000; // ms
	var fullTime    = 60000; // ms
	var nopresstimeout = 5000;
	var radius 			= 75;
	var pg 			= 0;
	var fnCallback	= null;
	var circle		= 0;

	var fg_polygon  = "fg_polygon";

	var updateTimer = 0;
	var instance	= this;
	var gtime		= 0;
	var startTime   = 0;
	var startTimeToTotalTimeMs = 0;
	var endTime     = totalTimeMS;
	var endTimeToTotalTimeMs = 0;
	var theta		= 0;
	var directionIsClockWise   = true;
	var intervalBase = 20;
	var interval     = intervalBase;
	var startAngle   = 0;
	var endAngle     = 360;

	var isPaused     = false;
	var isRunning 	 = false;

	var _element	= 0;

	var width 		= 0;
	var height 		= 0;
	var xPos		= 0;
	var yPos 		= 0;

	this.init = function( _pg, _callback){
		pg 			= _pg;
		fnCallback	= _callback;
	}

	this.setParent = function(_parent){
		if(pg[bg_polygon1]) pg[bg_polygon1].SetParent(_parent);
		if(pg[bg_polygon2]) pg[bg_polygon2].SetParent(_parent);
		if(pg[fg_polygon])	pg[fg_polygon].SetParent(_parent);
	}

	this.createGraph = function(_id, _x, _y, _w, _h, _color){
		fg_polygon =  _id;
		
		radius = _w * 0.5;

		xPos = _x;
		yPos = _y;
		width = _w;
		height = _h;
		
		circle = new AreaGraph();
		circle.init(pg);
		circle.createGraph(fg_polygon, xPos, yPos, _w, _h);
		circle.setThickness(3);
		circle.setColor(_color);

		updateTimer		= 	SetInterval(interval, this.update, instance );
		updateTimer.Stop();
	}

	this.createStaticGraph = function(_id, _x, _y, _w, _h, _color){
		this.createGraph(_id, _x, _y, _w, _h, _color);

		for(var i = 0; i < 360; i++){
			var x = radius + (radius * Math.cos(i * Math.PI / 180));
			var y = radius + (radius * Math.sin(i * Math.PI / 180));
			circle.addPoint(x, y);
		}
	}

	this.setDuration = function( _time_ms ){
		totalTimeMS = _time_ms;
		endTimeToTotalTimeMs = totalTimeMS;
	}

	this.setStartTime = function(_time_sec){
		startTime = _time_sec * 1000;
		startTimeToTotalTimeMs = totalTimeMS * startTime / 60000;
		Log("================================================================================================================")
		Log("set startTime of CircleCounter to "+_time_sec+" sec. ("+startTimeToTotalTimeMs+" of totalTimeMS "+totalTimeMS+") on angle "+startAngle+"°");
		Log("================================================================================================================")
		gtime = 0;
		startAngle = startTimeToTotalTimeMs / totalTimeMS * 360;
		endTimeToTotalTimeMs = totalTimeMS;

		if (updateTimer != null)
			updateTimer.Stop();
	}

	this.setEndTime = function(_time_sec){
		endTime = _time_sec * 1000;
		endTimeToTotalTimeMs = totalTimeMS * endTime / 60000; // Relativ zu einer Minute
		endAngle = endTimeToTotalTimeMs / totalTimeMS * 360;
		Log("================================================================================================================")
		Log("set endtime of CircleCounter to "+_time_sec+" sec. ("+endTimeToTotalTimeMs+" of totalTimeMS "+totalTimeMS+") on angle "+endAngle+"°");
		Log("================================================================================================================")
		if (endTimeToTotalTimeMs > totalTimeMS)
			endTimeToTotalTimeMs = totalTimeMS;
	}

	this.setStartAngle = function(_angle){
		startAngle = _angle;
	}

	this.setEndAngle = function(_angle){
		endAngle = _angle;
	}

	this.setPos = function(_x, _y){
		xPos = _x;
		yPos = _y;
		circle.setPos(xPos, yPos, width, height);
	}

	this.setSize = function(_width, _height){
		radius = _width;
	}

	this.setThickness = function( _thickness){
		circle.setThickness(_thickness);
	}

	this.start = function(){
		circle.reset();
		isRunning = true;
		
		if (updateTimer != null){
			updateTimer.Stop();
		}
	
		circle.addPoint(radius, radius);
		
		if (updateTimer == null){
			updateTimer		= 	SetInterval(interval, this.update, instance);
		}
		
		updateTimer.Start();
	}

	this.setDirection = function(_directionIsClockWise){
		directionIsClockWise = _directionIsClockWise;
		pg[fg_polygon].Rotate(180);
	}

	this.update = function( _timer, _dt, _obj){
		gtime += (_dt * ((endAngle - startAngle)/360));

		if (directionIsClockWise){
			theta = (endAngle * ((gtime - _dt) / (endTimeToTotalTimeMs))) + startAngle;
			var x = radius + (radius * Math.cos((Math.PI * -0.5) + theta * Math.PI / 180));
			var y = radius + (radius * Math.sin((Math.PI * -0.5) + theta * Math.PI / 180));
		}
		else{
			theta = endAngle * ((endTimeToTotalTimeMs - gtime) / endTimeToTotalTimeMs);
			var x = radius - (radius * Math.cos((Math.PI * -0.5) + theta * Math.PI / 180));
			var y = radius + (radius * Math.sin((Math.PI * 0.5) + theta * Math.PI / 180));
		}
		//Log("gtime "+gtime+" startTime "+startTimeToTotalTimeMs+" endTime "+endTimeToTotalTimeMs+" "+endTime);
		//Log("x: "+x+" y: "+y+" theta: "+theta);
		circle.addPoint( x, y );
		
		if (gtime > (endTimeToTotalTimeMs - startTimeToTotalTimeMs + _dt)){
			isRunning = false;
			_timer.Stop();
			instance.finished();
			gtime = 0;
		}
	}

	this.setAngle = function(angle){
		if (directionIsClockWise){
			theta = angle;
			var x = radius + (radius * Math.cos((Math.PI * -0.5) + theta * Math.PI / 180));
			var y = radius + (radius * Math.sin((Math.PI * -0.5) + theta * Math.PI / 180));
		}
		else{
			theta = angle;
			var x = radius - (radius * Math.cos((Math.PI * -0.5) + theta * Math.PI / 180));
			var y = radius + (radius * Math.sin((Math.PI * 0.5) + theta * Math.PI / 180));
		}
		circle.addPoint( x, y );
	}

	this.getMaxPoints = function(){
		var pointcount = circle.getPointsCount();
		return pointcount;
	}

	this.decreaseTimer = function(){
		circle.removePoint();
	}


	this.pause = function(  ){
		isPaused = true;
		updateTimer.Stop();
	}
	
	this.resume = function(  ){
		isPaused = false;
		updateTimer.Start();
	}

	this.getPoint = function(){
		return point;
	}

	this.skip = function(){
		updateTimer.Stop();
		_timer.Stop();
		gtime = 0;
		instance.finished();
	}

	this.fadeIn = function( _ms ){
		pg[fg_polygon].FadeIn( _ms );
	}

	this.fadeOut = function( _ms ){
		pg[fg_polygon].FadeOut( _ms );
	}

	this.reset = function(){
		if (updateTimer != null)
			updateTimer.Stop();
		point		= 0;
		gtime 		= 0;
		theta		= 0;
		interval 	= intervalBase;
		isPaused 	= false;
		isRunning 	= false;
		this.resetStartEndTime();
		circle.reset();
	}

	this.resetStartEndTime = function(){
		startTime   			= 0;
		startTimeToTotalTimeMs 	= 0;
		endTime 				= 0;
		endTimeToTotalTimeMs	= totalTimeMS;
	}

	this.restart = function(){
		if(fnCallback != null)
			fnCallback( pg, true, gtime );
	}

	this.finished = function(){
		if(fnCallback != null)
			fnCallback( pg, false, gtime );
	}

	this.getId = function(){
		return fg_polygon;
	}

	this.getIsPaused = function(){
		return isPaused;
	}

	this.getIsRunning = function(){
		return isRunning;
	}
}
