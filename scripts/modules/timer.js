/**
 *
 * Timer Module
 * This timer can be used for animations and any dynamic actions
 * @return object API: start, remove, stop methods
 * 
 */
SmartJ.Timer = (function(){
  
  "use strict";
  
  var stack = [],
      timer = null,
      tm    = this;
      
  //Define requestAnimFrame method
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame
  })();

  //Clear requestAnimFrame loop
  window.cancelRequestAnimFrame = (function(id) {
      return  window.cancelAnimationFrame           ||
              window.webkitCancelRequestAnimationFrame ||
              window.mozCancelRequestAnimationFrame    ||
              window.oCancelRequestAnimationFrame      ||
              window.msCancelRequestAnimationFrame
  })(timer);

  /**
   * Start method - add new action to stack
   * @param object Object with params:
   * action  - callback function;
   * name    - timer object ID
   * destroy - callback on object destroy
   */
  this.start = function(object){
    var match = 0,
        ln    = stack.length;
    
    if( ln == 0 ) stack.push(object);

    for( var i = 0; i < ln; i++ ){
      if( stack[i].name == object.name ) match = 1;
      
      if( i == ln - 1 && match == 0 ) {
        stack.push(object);
      };
    };

    if( timer == null ) {
      animate();
    };
  };

  /**
   * Animation mathod - loop which check stack and call functions from them
   */
  var animate = function(){
    var ln = null,
        i  = 0;
    
    function animation(){
      ln = stack.length;
      i  = 0;

      if( ln == 0 ) tm.stop(); 

      while( i < ln ){
        if( stack[i].action() == false ) {
          if( !!stack[i].destroy ) stack[i].destroy();
          stack.splice(i,1);
          break;
        };
        i++;
      };
    };
    
    if( !window.requestAnimFrame ){
      timer = setInterval(function(){
        animation();
      }, 20);
    }else{
      (function Loop(){
        timer = requestAnimFrame(Loop);
        animation();
      })();
    };
  };

  /**
   * Remove action from stack
   * @param object Object with name
   */
  this.remove = function(object){
    var ln = stack.length;
    
    for( var i = 0; i < ln; i++ ){
      if( stack[i].name == object ) {
        stack.splice(i,1);
        break;
      };
    };
  };

  /**
   * Stop animation timer
   */
  this.stop = function(){
    !window.requestAnimFrame ? clearInterval(timer) : cancelRequestAnimFrame(timer);
    timer = null;
  };
  
  return this;
});



