var _J_ = (function(){
  
  /**
   * Private variables and methods
   */
  var conf       = _J_Config,
      lang       = _J_Lang,
      canvas     = null,
      ctx        = null,
      currentCtx = null,      //Current canvas ( plot || buffer )
      STACK      = {};
  
  
  
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
  var AddObjectToStack = function(t, o){
    t = t.toLowerCase();
    if( !STACK[t] ) STACK[t] = [];
    CheckObjectParams(t, o) ? STACK[t].push(o) : ERROR(lang.icorrect_params);
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
  
  
  
  
  /**
   * return library API
   */
  return {
      Create: {
        /**
         * Add object to stack of elements
         * @param type Name of the element
         * @param object List of element params
         */
        Object: function(type, object){AddObjectToStack(type, object);}
      },
      
      Render: {
        All: function(){},
        Group: function(){}
      },
      
      Clear: {
        All: function(){},
        Area: function(){}
      }
  };
  
}());