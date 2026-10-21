/* Small, deterministic rendering policy; no device benchmark or model guess required. */
(function(root){'use strict';
function profile(setting,touch,count,slow){
  var automatic=['low','balanced','high'].indexOf(setting)<0;
  var quality=automatic?(touch||count>3||slow?'low':'balanced'):setting;
  var width=quality==='high'?768:quality==='balanced'?512:384;
  if(automatic&&(count>3||slow))width=256;
  return {quality:quality,width:width,fps:automatic&&slow?16:quality==='low'?20:24,automatic:automatic};
}
root.HauntPerformance={profile:profile};
if(typeof module!=='undefined')module.exports=root.HauntPerformance;
})(typeof window!=='undefined'?window:globalThis);
