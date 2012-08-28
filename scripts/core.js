var _J_ = (function(c, l){
  
  
  "use strict";
  
  
  /**
   * Private variables and methods
   */
  var conf         = c,
      lang         = l,
      canvas       = null,
      buffer       = null,
      ctx          = null,
      bufferCtx    = null,
      bufferGroups = [],
      currentCtx   = null,      //Current canvas ( plot || buffer )
      STACK        = {
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
    
    return o;
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
        var b;
        g = g.toLowerCase().split(" ");
        
        for( var groups = 0; groups < g.length; groups++ ){
          for( var grel = 0; grel < STACK.Groups[g[groups]].length; grel++ ){
            bufferGroups.indexOf(g[groups]) != -1 ? b = {} : b = false;
            if( grel == 0 ) b.start = true;
            if( grel == STACK.Groups[g[groups]].length - 1 ) b.end = true;
            callback(STACK.Groups[g[groups]][grel], b);
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
  var DrawElement = function(e, b){

    //If we draw element in buffer
    if( typeof b === "object" ){
      currentCtx = bufferCtx;
    };
    
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

    //End draw in buffer
    if( b.end ){
      currentCtx = ctx;
      currentCtx.drawImage(buffer, 0, 0);
    };
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
  
  //Clear some area method
  var ClearArea = function(o){
    if( o ){
      currentCtx.clearRect(o.x, o.y, o.width, o.height);
    }else{
      currentCtx.clearRect(0, 0, conf.width, conf.height);
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
  
  //Add to buffer group
  var AddBufferGroup = function(g){
     var groups = g.split(" ");
     for( var i = 0; i < groups.length; i++ ){
       if(bufferGroups.indexOf(groups[i]) == -1){
         bufferGroups.push(groups[i]);
       };
     };
  };
 
  //Add trigget to element
  var AddEventOnObject = function(o, e){
    e = e.split(" ");
    for( var i = 0; i < e.length; i++ ){
      for( var j = 0; j < o.events[e[i]].length; j++){
        o.events[e[i]][j]();
      };
    };
  };
  
  //Add listener to element
  var AddObjectListener = function(e, o, callback){
    if( !o.events ) o.events = {};
    e = e.split(" ");
    for( var i = 0; i < e.length; i++ ){
      if( !o.events[e[i]] ) o.events[e[i]] = [];
      o.events[e[i]].push(callback);
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
          LoopAllElements(function(el, b){
            DrawElement(el, b);
          }); 
        },
        /**
         * Render list of elements groups
         * @param g Name or names of groups
         */
        Group: function(g){
          LoopAllElements(function(el, b){
            DrawElement(el, b);
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
      
      Buffer: {
        /**
         * Draw in buffer current group(s)
         * @param g Name(s) of group(s)
         */
        Group: function(g){ CreateBuffer(); AddBufferGroup(g); }
      },
      
      Event: {
        /**
         * Trigger event on object
         * @param o Object wich on trigger the event
         * @param e Event name
         */
        Trigger: function(o, e){ AddEventOnObject(o, e); },
        /**
         * Add event listener to object
         * @param e Event name
         * @param o Object
         * @param callback Listener callback function
         */
        On: function(e, o, callback){ AddObjectListener(e, o, callback); }
      }
  };
  
}(_J_Config, _J_Lang));