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
      canvas.setAttribute("width", c.width);
      canvas.setAttribute("height", c.height);
      if( canvas ){
        if( canvas.getContext ){
          ctx = canvas.getContext("2d");
        }else{
          ERROR(l.noctx);
        };
      }else{
        ERROR(l.nocanvas);
      };
      
      currentCtx = ctx;
    }, false);
  }(conf, lang));
  
  
  
  
  /* Common inside methods */
  
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
  //Elements interfaces
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
  var LoopAllElements = function(callback, g){
      if( g ){
        g = g.toLowerCase().split(" ");
        
        for( var groups = 0; groups < g.length; groups++ ){
          for( var grel = 0; grel < STACK.Groups[g[groups]].length; grel++ ){
            callback(STACK.Groups[g[groups]][grel]);
          };
        };
      }else{
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
  };
  
  //Draw element
  var DrawElement = function(e){
    currentCtx.save();
    currentCtx.beginPath();
    ElementStyles(e);
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
    if( e.fill ) currentCtx.fill();
    currentCtx.stroke();
    currentCtx.restore();
  };
  
  //Element styles
  var ElementStyles = function(o){
    if( o.style ){
      for( var prop in o.style ){
        if( currentCtx[prop] ){
          currentCtx[prop] = o.style[prop];
        }else{
          o.style[prop] = o.style[prop].toString();
          switch(prop){
            case "color":
              currentCtx.strokeStyle = o.style[prop]; break;
          };
        };
      };
    };
  };
  
  //Draw line method
  var DrawLine = function(o){
    currentCtx.moveTo(o.x, o.y);
    currentCtx.lineTo(o.toX, o.toY);
  };
  
  //Draw rectangle method
  var DrawRect = function(o){
    currentCtx.moveTo(o.x, o.y);
    currentCtx.lineTo(o.x + o.wd, o.y);
    currentCtx.lineTo(o.x + o.wd, o.y + o.hg);
    currentCtx.lineTo(o.x, o.y + o.hg);
    currentCtx.lineTo(o.x, o.y);
  };
  
  //Draw circle method
  var DrawCircle = function(o){
    if( o.pos && o.pos == "corner" ){
      o.x += o.radius;
      o.y += o.radius;
    };
    currentCtx.arc(o.x, o.y, o.radius, 0, 2*Math.PI);
  };
  
  //Draw triangle method
  var DrawTriangle = function(o){
    currentCtx.moveTo(o.x, o.y);
    currentCtx.lineTo(o.x - (o.wd / 2), o.y + o.hg);
    currentCtx.lineTo(o.x + (o.wd / 2), o.y + o.hg);
    currentCtx.lineTo(o.x, o.y);
  };
  
  
  
  
  
  
  
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
        /**
         * Render all groups of elements
         */
        All: function(){ 
          LoopAllElements(function(el){
            DrawElement(el);
          }); 
        },
        /**
         * Render list of elements groups
         * @param g Name or names of groups
         */
        Group: function(g){
          LoopAllElements(function(el){
            DrawElement(el);
          }, g); 
        }
      },
      
      Clear: {
        All: function(){},
        Area: function(){}
      }
  };
  
}(_J_Config, _J_Lang));