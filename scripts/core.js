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
      currentCtx       = null,
      STACK            = {
        "Common": [],
        "Groups": {}
      },
      PREDEFINE_EVENTS = ["click"],
      STAGES           = {},
      MOUSE            = {width:5, height:5, x:0, y:0},
      IMAGES           = {};
  
  
  
  //Resources loader
  var ResourcesLoader = function(){
    var img,
        ln      = Object.keys(SmartJ_Config.images).length,
        counter = 0;
        
    for( var i in SmartJ_Config.images ){
      img = new Image();
      img.onload = (function(i){
        ;(function(i, img){
          var checker = setInterval(function(){
            if( img.width > 0 ){
              counter++;
              IMAGES[i] = img;
              if( counter == ln ) {
                AddEventOnObject(SmartJ, "load", {"stages": STAGES, "images": IMAGES, "elements": STACK});
              };
              clearInterval(checker);
            };
          },10);
        }(i, img));
      }(i));
      img.src = SmartJ_Config.images[i];
    };
  };
  
  //Get element
  var GetElement = function(s){
    if( s.substr(0, 1) == "#" ){
      return document.getElementById(s.substr(1, s.length - 1));
    };
  };
  
  //Create new canvas stage
  var CreateStage = function(o){
    if( !STAGES[o.id] ){
      STAGES[o.id] = {};
      
      var c = document.createElement("canvas");
      c.setAttribute("width", o.width);
      c.setAttribute("height", o.height);
      c.setAttribute("id", o.id);
      c.setAttribute("style", "width:"+o.width+"px; height:"+o.height+"px");

      !o.parent ? document.body.appendChild(c) : GetElement(o.parent).appendChild(c);
      
      var cCtx = c.getContext("2d");
      STAGES[o.id].canvas = c;
      STAGES[o.id].ctx = cCtx;
      
      return STAGES[o.id];
    };
  };
  
  //Stage creator
  var LoadStages = function(){
    var s;
    
    for( var i in SmartJ_Config.stages ){
      s = SmartJ_Config.stages;  
      CreateStage({
        width: s[i].width,
        height: s[i].height,
        id: i,
        parent: s[i].to
      });
    };
  };
  
  
  
  /**
   * Canvas initialization point
   */
  ;(function(){
    window.addEventListener("load", function(){
      
      //Create buffer
      CreateBuffer();
      
      //On stages load
      LoadStages();

      //Set mouse data
      MouseData();
      
      //Load all resources
      ResourcesLoader();
      
    }, false);  
  }(conf, lang));
  
  
  
  
  
  
  /* Common inside methods */
  //Create MOUSE data
  var MouseData = function(){
    if( bufferCtx ){
      var d = bufferCtx.createImageData(MOUSE.width, MOUSE.height);
      for( var i = 0; i < d.data.length; i++ ){
        d.data[i] = 255;
      };
      MOUSE.data = d;
    };
  };
  
  //Set MOUSE coordinates
  var SetMousePosition = function(e){
    MOUSE.x = e.pageX - e.target.offsetLeft;
    MOUSE.y = e.pageY - e.target.offsetTop;
  };
  
  //Add object to stack object
  var AddObjectToStack = function(t, o, g){
    t = t.toLowerCase();
    g = g ? g.toLowerCase() : null;
    o.type = t;
    
    if( g ){
      if( !STACK.Groups[g] ){
        STACK.Groups[g] = [];
      };
      STACK.Groups[g].push(o);
    }else{
      STACK.Common.push(o);  
    };
    
    return o;
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
      
      //Get max params for buffer
      var w = 0,
          h = 0;
      for( var i in SmartJ_Config.stages ){
        if( SmartJ_Config.stages[i].width > w ) w = SmartJ_Config.stages[i].width;
        if( SmartJ_Config.stages[i].height > h ) h = SmartJ_Config.stages[i].height;
      };
      
      buffer = document.createElement("canvas");
      buffer.setAttribute("width", w);
      buffer.setAttribute("height", h);
      buffer.id = "buffer";
      bufferCtx = buffer.getContext("2d");
    };
  };
  

  
  //Draw element
  var DrawElement = function(e){    
    if( e.stage ){
      
      //Change to buffer
      currentCtx = bufferCtx;

      currentCtx.save();
      
      //Only for system drawing
      if( e.type != "frame" || e.type != "image" ){
        currentCtx.beginPath();
        ElementStyles(e);
      };
      
      switch(e.type){
        case "line":
          DrawLine(e); break;
        case "rect":
          DrawRect(e); break;
        case "circle":
          DrawCircle(e); break;
        case "triangle":
          DrawTriangle(e); break;
        case "image":
          DrawImage(e); break;
        case "frame":
          DrawFrame(e); break;
      };
      
      //Only for system drawing
      if( e.type != "frame" || e.type != "image" ){
        if( e.fill ) currentCtx.fill();
        currentCtx.stroke();
        currentCtx.restore();
      };

      currentCtx = STAGES[e.stage].ctx;
      
      //Link DX with X
      if( e.dx || e.dy ){
        e.dx = e.x;
        e.dy = e.y;
      };
      
      if( e.data !== null ){
        e.data = bufferCtx.getImageData(e.x || e.dx || 0, e.y || e.dy || 0, e.width || e.toX - e.x || e.radius*2 || e.sWidth, e.height || e.toY - e.y || e.radius*2 || e.sHeight );
      };
      
      //Draw and clear buffer
      currentCtx.drawImage(buffer, 0, 0);
      
      buffer.width = buffer.width;
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
  
  //Draw image
  var DrawImage = function(o){
    currentCtx.drawImage(IMAGES[o.src], o.x, o.y);
  };
  
  //Draw image frame
  var DrawFrame = function(o){
    currentCtx.drawImage(IMAGES[o.src], o.sx, o.sy, o.sWidth, o.sHeight, o.dx, o.dy, o.dWidth, o.dHeight)
  };
  
  
  //Clear some area method
  var ClearArea = function(o){
    if( !o ){
      for( var i in STAGES ){
        STAGES[i].ctx.clearRect(0, 0, STAGES[i].canvas.offsetWidth, STAGES[i].canvas.offsetHeight);
      };
      if( ctx ) ctx.clearRect(0, 0, conf.width, conf.height);
    }else{
      
      //Clear All on next groups
      if( o.groups ){
        o.groups = o.groups.split(" ");
        for( var i = 0; i < o.groups.length; i++ ){
          if( o.size ){
            STAGES[o.groups[i]].ctx.clearRect(o.size.x, o.size.y, o.size.width, o.size.height);
          }else{
            STAGES[o.groups[i]].ctx.clearRect(0, 0, STAGES[o.groups[i]].canvas.offsetWidth, STAGES[o.groups[i]].canvas.offsetHeight);
          };
        };
      }
      //Clear Area
      else{
        for( var i in STAGES ){
          STAGES[i].ctx.clearRect(o.size.x, o.size.y, o.size.width, o.size.height);
        };
      };
    };
    
    bufferCtx.clearRect(0, 0, conf.width, conf.height);
  };
 
  //Add trigget to element
  var AddEventOnObject = function(o, e, data){
    e = e.split(" ");
    
    for( var i = 0; i < e.length; i++ ){
      if( o.events ){
        for( var j = 0; j < o.events[e[i]].length; j++){
          o.events[e[i]][j](data);
        };
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
        document.body.addEventListener(e, function(event){
          if( event.target.nodeName.toLowerCase() === "canvas" ){
            SetMousePosition(event);
            if( SmartJ.ObjectsCollision({element: MOUSE, toObject: o}) ) callback(event, o);
          };
        }, false);
        
        break;
    };
  };
  
  //Get element from global container
  var GetObjectsArray = function(name){
    var elements = [];
    
    if( name ){
      elements = STACK.Groups[name];
    }else{
      for( var i in STACK ){
        if( STACK[i].constructor === Array ){
          elements = elements.concat(STACK[i]);
        }else{
          for( var j in STACK[i] ){
            elements = elements.concat(STACK[i][j]);
          };
        };
      };
    };
    
    return elements;
  };

 

  
  
  /**
   * Return library API
   */
  return {
      /**
       * All resources
       */
      Resources: {
        Images: IMAGES,
        Stages: STAGES,
        Elements: STACK
      },
      
      Create: {
        /**
         * Add object to stack of elements
         * @param type Name of the element
         * @param object List of element params
         * @return object
         */
        Object: function(type, object, group){ return AddObjectToStack(type, object, group); }
      },
      
      Get: {
        /**
         * Get elements from global objects container
         */
        All: function(){ return GetObjectsArray(); },
        Group: function(name){ return GetObjectsArray(name); }
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
         * Clear stages
         * @param o Object with list of groups o size parameters
         * o: groups, size;
         */
        Stage: function(o){ ClearArea(o); },
        /**
         * Clear BUFFER
         */
        Buffer: function(){ buffer.width = buffer.width; }
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