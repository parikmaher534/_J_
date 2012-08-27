var _J_ = (function(){
  
  /**
   * Private variables and methods
   */
  var conf   = _J_Config,
      lang   = _J_Lang,
      canvas = null,
      ctx    = null;
  
  
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
  
  
  
  /**
   * return library API
   */
  return {

  };
  
}());