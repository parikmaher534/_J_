/**
 * Sprite creation module
 * Module use Timer module
 */
SmartJ.Sprite = (function(o, g){
  
  "use strict";
  
  var lib  = SmartJ,
      name = "sprite_" + new Date().getTime(),
      step = 0,
      obj  = {
        src: o.src, 
        sx: o.sx, 
        sy: o.sy, 
        sWidth: o.width, 
        sHeight: o.height, 
        dx: o.x,
        dy: o.y, 
        dWidth: o.width, 
        dHeight: o.height,
        stage: o.stage,
        
        //Additional
        frames: o.frames,
        speed: o.speed,
        vector: o.vector,
        x: o.x,
        y: o.y,
        width: o.width,
        height: o.height
      },
      sprite = lib.Create.Object("frame", obj, g);
  
  
  var CalcFrames = function(sprite, s, g){
    if( sprite[s] == sprite[g] * (sprite.frames - 1) ) {
      sprite[s] = 0;
      step = 0;
    };
    if( step >= sprite[g] ){
      sprite[s] += sprite[g];
      step = 0;
    };
  };
  
  
  //Add sprite to timer stack
  lib.Timer().start({
    name: name,
    action: function(){
      
      //Change frames by speed
      step += sprite.speed;

      //Set sprite animation vector
      sprite.vector == "gorizontal" ? CalcFrames(sprite, "sx", "dWidth") : CalcFrames(sprite, "sy", "dHeight");
    }
  });
  
  return obj;
});

