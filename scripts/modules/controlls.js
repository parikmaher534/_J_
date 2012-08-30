/**
 * 
 * Controlls module
 * User can easy use keys events.
 * Standart UP,DOWN,LEFT,RIGHT and all other chars
 * 
 */
SmartJ.Controlls = (function(){
  
  "use strict";
  
  //Check on predefine UP,DOWN,LEFT,RIGHT events
  var KeySet = function(key, e, callback){
      switch(key.toLowerCase()){
        case "up":
          key = 38; break;
        case "down":
          key = 40; break;
        case "right":
          key = 39; break;
        case "left":
          key = 37; break;
      };
      if( key == e.keyCode || String(key).toLowerCase() == String.fromCharCode(e.keyCode).toLowerCase()) callback(key, e);
  };
  
  //Key down event
  var Down = function(key, callback){
    document.addEventListener("keydown", function(e){ KeySet(key, e, callback); });
  };
  
  //Key up event
  var Up = function(key, callback){
    document.addEventListener("keyup", function(e){ KeySet(key, e, callback); });
  };
  
  //Key press event
  var Press = function(key, callback){
    document.addEventListener("keypress", function(e){ KeySet(key, e, callback); });
  };
  
  return {
    /**
     * On key down event
     * @param key Key event name
     * @param callback Callback function
     */
    KeyDown: function(key, callback){ Down(key, callback); },
    /**
     * On key up event
     * @param key Key event name
     * @param callback Callback function
     */
    KeyUp: function(key, callback){ Up(key, callback); },
    /**
     * On key press event
     * @param key Key event name
     * @param callback Callback function
     */
    KeyPress: function(key, callback){ Press(key, callback); }
  };
});


