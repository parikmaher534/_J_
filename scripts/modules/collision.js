/**
 * 
 * Collision detect module
 * @param object Object which will be detect collision
 * @param other Second object with whitch will be detect eht collision
 * @return bool TRUE || FALSE
 * 
 */
SmartJ.ObjectsCollision = (function(objects){
  
  "use strict";
  
  /**
   * Objects interface
   * x - Object X position in px
   * y - Object Y position in px
   * width  Object width in px
   * height Object height in px
   * data Object ImageData
   */
  var Interface = [ "x", "y", "width", "height", "data" ];


  //Interface validation
  for( var i = 0; i < Interface.length; i++ ){
    for( var j in objects ){
      for( var p in objects[j] ){
        if( objects[j][Interface[i]] === undefined ){
          console.log("Incorrect parameters"); return false;
        };
      };
    };
  };
  

  //Method for pixel detection
  this.PixelDetection = function(first, x, y, other, x2, y2, isCentred){
    x  = Math.round( x );
    y  = Math.round( y );
    x2 = Math.round( x2 );
    y2 = Math.round( y2 );

    var w  = first.width,
        h  = first.height,
        w2 = other.width,
        h2 = other.height;

    if ( isCentred ) {
        x  -= ( w/2 + 0.5) << 0
        y  -= ( h/2 + 0.5) << 0
        x2 -= (w2/2 + 0.5) << 0
        y2 -= (h2/2 + 0.5) << 0
    };

    var xMin = Math.max( x, x2 ),
        yMin = Math.max( y, y2 ),
        xMax = Math.min( x+w, x2+w2 ),
        yMax = Math.min( y+h, y2+h2 );

    if( xMin >= xMax || yMin >= yMax ){
        return false;
    };

    var xDiff = xMax - xMin,
        yDiff = yMax - yMin,
        pixels  = first.data,
        pixels2 = other.data;

    if ( xDiff < 4 && yDiff < 4 ) {
        for ( var pixelX = xMin; pixelX < xMax; pixelX++ ) {
            for ( var pixelY = yMin; pixelY < yMax; pixelY++ ) {
                if(
                    ( pixels [ ((pixelX-x ) + (pixelY-y )*w )*4 + 3 ] !== 0 ) &&
                    ( pixels2[ ((pixelX-x2) + (pixelY-y2)*w2)*4 + 3 ] !== 0 )
                ){
                    return true;
                };
            };
        };
    }else{
        var incX = xDiff / 3.0,
            incY = yDiff / 3.0;
        incX = (~~incX === incX) ? incX : (incX+1 | 0);
        incY = (~~incY === incY) ? incY : (incY+1 | 0);

        for ( var offsetY = 0; offsetY < incY; offsetY++ ) {
            for ( var offsetX = 0; offsetX < incX; offsetX++ ) {
                for ( var pixelY = yMin+offsetY; pixelY < yMax; pixelY += incY ) {
                    for ( var pixelX = xMin+offsetX; pixelX < xMax; pixelX += incX ) {
                        if (
                                ( pixels [ ((pixelX-x ) + (pixelY-y )*w )*4 + 3 ] !== 0 ) &&
                                ( pixels2[ ((pixelX-x2) + (pixelY-y2)*w2)*4 + 3 ] !== 0 )
                        ) {
                            return true;
                        };
                    };
                };
            };
        };
    };
    return false;
  };

  
  
  
  //First all objects will be looks like a rectangles for simple detection
  var o1 = objects.element, 
      o2 = objects.toObject;

  if( 
    o1.x + o1.width >= o2.x &&
      o1.x < o2.x + o2.width &&
        o1.y + o1.height > o2.y &&
          o1.y < o2.y + o2.height
  ){
    return this.PixelDetection(o1.data, o1.x, o1.y, o2.data, o2.x, o2.y);
  };
  
  return false;
});


