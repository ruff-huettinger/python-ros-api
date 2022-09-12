function Vector(_x, _y){
	this.x = _x;
	this.y = _y;
}

//static class
function VectorMath(){}

VectorMath.add = function( _v1, _v2){
	return new Vector(_v1.x + _v2.x, _v1.y + _v2.y);
}

VectorMath.subtract = function( _v1, _v2){
	return new Vector(_v1.x - _v2.x, _v1.y - _v2.y);
}

VectorMath.getPerpendicular = function(_v1){
	return new Vector( _v1.y, -(_v1.x) );
}

VectorMath.multiply = function(_v1, _scalar){
	return new Vector(_v1.x * _scalar, _v1.y * _scalar);
}

VectorMath.getMagnitude = function(_v1){
	return Math.sqrt((_v1.x * _v1.x) + (_v1.y * _v1.y));
}


