var _J_ = (function(c, l){
  
  
  "use strict";
  
  
  /**
   * Private variables and methods
   */
  var conf       = c,
      lang       = l,
      canvas     = null,
      ctx        = null,
      currentCtx = null,      //Current canvas ( plot || buffer )
      STACK      = {
        "Common": [],
        "Groups": {}
      };
  
  
  
  /**
   * ERROR message
   */
  var ERROR = function(e){console.log(e);};
  
  
  /**
   * Canvas initialization point
   */
  ;(function(c, l){
    window.addEventListener("load", function(){
      canvas = document.getElementById(c.canvasId);
      if( canvas ){
        if( canvas.getContext ){
          ctx = canvas.getContext("2d");
        }else{
          ERROR(l.noctx);
        };
      }else{
        ERROR(l.nocanvas);
      };
    }, false);
  }(conf, lang));
  
  
  
  
  //Add object to stack object
  var AddObjectToStack = function(t, o, g){
    t = t.toLowerCase();
    g = g ? g.toLowerCase() : null;
    o.type = t;
    
    if( g ){
      if( !STACK.Groups[g] ){
        STACK.Groups[g] = [];
      };
      CheckObjectParams(t, o) ? STACK.Groups[g].push(o) : ERROR(lang.icorrect_params);
    }else{
      CheckObjectParams(t, o) ? STACK.Common.push(o) : ERROR(lang.icorrect_params);  
    };
  };
  
  //Check on correct parameters
  var CheckObjectParams = function(t, o){
    switch(t){
      case "line":
        if( o.x && o.y && o.toX && o.toY ) return 1; break;
      case "rect":
        if( o.x && o.y && o.wd && o.hg ) return 1; break;
      case "triangle":
        if( o.x && o.y && o.wd && o.hg ) return 1; break;
      case "circle":
        if( o.x && o.y && o.radius ) return 1; break;  
    };
  };
  
  //Get each element in loop
  var LoopAllElements = function(callback){
    for( var i in STACK ){
      if( STACK[i].constructor === Array ){
        for( var j = 0; j < STACK[i].length; j++ ){
          callback(STACK[i][j]);
        };
      }else if( STACK[i].constructor === Object ){
        for( var prop in STACK[i] ){
          for( var k = 0; k < STACK[i][prop].length; k++ ){
            callback(STACK[i][prop][k]);
          };
        };
      };
    };
  };
  
  //Draw element
  var DrawElement = function(e){
    switch(e.type){
      case "line":
        DrawLine(e); break;
      case "rect":
        DrawRect(e); break;
      case "circle":
        DrawCircle(e); break;
      case "triangle":
        DrawTriangle(e); break;
    };
  };
  
  //Draw line method
  var DrawLine = function(){};
  
  //Draw rectangle method
  var DrawRect = function(){};
  
  //Draw circle method
  var DrawCircle = function(){};
  
  //Draw triangle method
  var DrawTriangle = function(){};
  
  
  
  
  
  
  /**
   * Return library API
   */
  return {
      Create: {
        /**
         * Add object to stack of elements
         * @param type Name of the element
         * @param object List of element params
         */
        Object: function(type, object, group){AddObjectToStack(type, object, group);}
      },
      
      Render: {
        All: function(){ 
          LoopAllElements(function(el){
            DrawElement(el);
          }); 
        },
        Group: function(g){
          LoopAllElements(g, function(el){
            DrawElement(el);
          }); 
        }
      },
      
      Clear: {
        All: function(){},
        Area: function(){}
      }
  };
  
}(_J_Config, _J_Lang));