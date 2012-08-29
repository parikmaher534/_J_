var SmartJ = (function(c, l){
  
  "use strict";
  
  /**
   * Private variables and methods
   */
  var conf             = c,
      lang             = l,
      canvas           = null,
      buffer           = null,
      ctx              = null,
      bufferCtx        = null,
      bufferGroups     = [],
      currentCtx       = null,      //Current canvas ( plot || buffer )
      STACK            = {
        "Common": [],
        "Groups": {}
      },
      PREDEFINE_EVENTS = ["click"],
      MOUSE            = {width:10, height:20, x:0, y:0};
  
  
  
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
      
      CreateBuffer();
      
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
    
    return o;
  };
  
  //Check on correct parameters
  //Elements interfaces
  var CheckObjectParams = function(t, o){
    switch(t){
      case "line":
        if( o.x && o.y && o.toX && o.toY ) return 1; break;
      case "rect":
        if( o.x && o.y && o.width && o.height ) return 1; break;
      case "triangle":
        if( o.x && o.y && o.width && o.height ) return 1; break;
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
  
  //Create canvas buffer
  var CreateBuffer = function(){
    if( !buffer ){
      buffer = document.createElement("canvas");
      buffer.setAttribute("width", conf.width);
      buffer.setAttribute("height", conf.height);
      bufferCtx = buffer.getContext("2d");
    };
  };
  
  //Draw element
  var DrawElement = function(e){
    
    //Change to buffer
    currentCtx = bufferCtx;
    
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

    currentCtx = ctx;
    currentCtx.drawImage(buffer, 0, 0);
    
    e.data = currentCtx.getImageData(e.x, e.y, e.width || e.toX - e.x || e.radius*2, e.height || e.toY - e.y || e.radius*2 )
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
    o.width = o.toX - o.x;
    o.height = o.toY - o.y;
  };
  
  //Draw rectangle method
  var DrawRect = function(o){
    currentCtx.moveTo(o.x, o.y);
    currentCtx.lineTo(o.x + o.width, o.y);
    currentCtx.lineTo(o.x + o.width, o.y + o.height);
    currentCtx.lineTo(o.x, o.y + o.height);
    currentCtx.lineTo(o.x, o.y);
  };
  
  //Draw circle method
  var DrawCircle = function(o){
    if( o.pos && o.pos == "corner" ){
      o.x += o.radius;
      o.y += o.radius;
    };
    o.width  = o.radius*2;
    o.height = o.radius*2;
    currentCtx.arc(o.x, o.y, o.radius, 0, 2*Math.PI);
  };
  
  //Draw triangle method
  var DrawTriangle = function(o){
    currentCtx.moveTo(o.x, o.y);
    currentCtx.lineTo(o.x - (o.width / 2), o.y + o.height);
    currentCtx.lineTo(o.x + (o.width / 2), o.y + o.height);
    currentCtx.lineTo(o.x, o.y);
  };
  
  //Clear some area method
  var ClearArea = function(o){
    if( o ){
      currentCtx.clearRect(o.x, o.y, o.width, o.height);
    }else{
      currentCtx.clearRect(0, 0, conf.width, conf.height);
    };
  };
 
  //Add trigget to element
  var AddEventOnObject = function(o, e, data){
    e = e.split(" ");
    for( var i = 0; i < e.length; i++ ){
      for( var j = 0; j < o.events[e[i]].length; j++){
        o.events[e[i]][j](data);
      };
    };
  };
  
  //Add listener to element
  var AddObjectListener = function(e, o, callback){
    if( !o.events ) o.events = {};
    e = e.toLowerCase().split(" ");
    for( var i = 0; i < e.length; i++ ){
      if( PREDEFINE_EVENTS.indexOf(e[i]) != -1 ){
        DefaultEvent(e[i], o, callback);
      }else{
        if( !o.events[e[i]] ) o.events[e[i]] = [];
        o.events[e[i]].push(callback);
      };
    };
  };
 
  //Default events handler
  var DefaultEvent = function(e, o, callback){
    switch(e){
      case "click":
        canvas.addEventListener(e, function(event){}, false);
        break;
    };
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
         * @return object
         */
        Object: function(type, object, group){ return AddObjectToStack(type, object, group); }
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
        /**
         * Clear all canvas
         */
        All: function(){ ClearArea(); },
        /**
         * Clear special area
         * @param o Object with x,y,width,height parameters
         */
        Area: function(o){ ClearArea(o); }
      },
      
      Event: {
        /**
         * Trigger event on object
         * @param o Object wich on trigger the event
         * @param e Event name
         */
        Trigger: function(o, e, data){ AddEventOnObject(o, e, data); },
        /**
         * Add event listener to object
         * @param e Event name
         * @param o Object
         * @param callback Listener callback function
         */
        On: function(e, o, callback){ AddObjectListener(e, o, callback); }
      }
  };
  
}(SmartJ_Config, SmartJ_Lang));