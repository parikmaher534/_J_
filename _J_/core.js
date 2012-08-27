if( WEBGL == undefined ) var WEBGL = {};

WEBGL.canvas = null;
WEBGL.ctx    = null;


/**
 * WEBGL plot initialization
 */
WEBGL.init = function(plotName){
  WEBGL.canvas = document.getElementById(plotName);
  try{
    WEBGL.ctx = WEBGL.canvas.getContext("experimental-webgl");
  }catch(e){
    document.body.innerHTML = "You don't support WEBGL!";
  };
};


/**
 * WEBGL create buffer
 */
WEBGL.buffer = function(){
  var _object_buffer = WEBGL.ctx.createBuffer(),
  vertexes = [
    0.0, 1.0, 0.0,
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0
  ];
  
  WEBGL.ctx.bindBuffer(WEBGL.ctx.ARRAY_BUFFER, _object_buffer);
  WEBGL.ctx.bufferData(WEBGL.ctx.ARRAY_BUFFER, new Float32Array(vertexes), WEBGL.ctx.STATIC_DRAW);
};


/**
 * WEBGL shaders
 */
WEBGL.shader = function(){
  
};


/**
 * WEBGL draw scene
 */
WEBGL.draw = function(){
  
};



window.onload = function(){
  WEBGL.init("canvas");
  WEBGL.buffer();
  
  setInterval(function(){
     WEBGL.draw();
  },100);
};