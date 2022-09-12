function AreaGraph()
{
	var element	= 0;
	var polygon	= 0;
	var canvas	= 0;
	var pg		= 0;
	
	this.init = function(_pg){
		pg			= _pg;
	}
	
	this.createGraph		= function(_id, _x, _y, _w, _h, _pg){
		var x = _x;//|| 0;
		var y = _y;//|| 0;
		var w = _w;//|| 720;
		var h = _h;//|| 420;

		pg = _pg || pg;
		canvas = pg.CreateDrawCanvas( _id , ElementPos(x, y, -1, -1), w, h, null, null, null);
		element = pg[_id];
		polygon = canvas.StartPolygon();	
		canvas.DrawPolygon( polygon, 5, "#000000", "#000000" );
		canvas.SetStartLineCap(polygon, 0);
		element.Refresh();
	}

	this.setPos 			= function(_x, _y, _w, _h){
		element.SetPos(ElementPos(_x, _y, -1,-1), _w, _h);
		element.Refresh();
	}
		
	this.setThickness 	= function( _val ) {
        polygon.StrokeThickness = _val;
		element.Refresh();
    }
		
	this.setColor 			= function( _val ) {
        polygon.Fill	= canvas.GetStrokeColor( _val );
		polygon.Stroke	= canvas.GetStrokeColor( _val );

		element.Refresh();
    } 
		
	this.setOpacity			= function( _val ){
		element.SetOpacity( _val );
		element.Refresh();
	}
	
	this.getPointsCount = function(){
		return polygon.Points.Count;
	}	
		
		
	this.addPoint			= function( _x, _y)
	{
		canvas.AddPointToPolygon( _x, _y, polygon);
	}
	
	this.addPointAtIndex 	= function( _x, _y , _index)
	{
		canvas.AddPointToPolygonAtIndex( _x, _y, _index, polygon);
	}
	
    this.removePoint 		= function()
    {
		//Log(polygon.Points.Count);
        if( polygon.Points.Count > 0)
        {
            var endpointIndex = parseInt( ( polygon.Points.Count - 1 ));
           polygon.Points.RemoveAt( endpointIndex );
        }
    }

	this.removeLastPoint 	= function()
	{
		if( polygon.Points.Count > 0)
		{
			var endpointIndex = parseInt( ( polygon.Points.Count / 2 ));
			if( endpointIndex > 0) polygon.Points.RemoveAt( endpointIndex );
			if( endpointIndex > 0) polygon.Points.RemoveAt( (polygon.Points.Count - endpointIndex) - 1 );
		}
	}
	
	this.removePointAtIndex = function( _index )
    {
        if( polygon.Points.Count > 0)
        {
           polygon.Points.RemoveAt( _index );
        }
    }
	
	this.getPoints 			= function()
	{
		return polygon.Points;
	}
	
	this.clear 				= function()
	{
		polygon.Points.Clear();
	}

	this.reset				= function(){
		polygon.Points.Clear();
	}

}