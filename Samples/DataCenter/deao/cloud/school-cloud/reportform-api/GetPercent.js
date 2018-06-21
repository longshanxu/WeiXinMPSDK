//去重
exports.removeArr =function(arr){
 var res = [];
 var json = {};
 for(var i = 0; i < arr.length; i++){
  if(!json[arr[i]]){
   res.push(arr[i]);
   json[arr[i]] = 1;
  }
 }
 return res;
};




//求百分比
exports.GetPercent = function(num, total){
num = parseFloat(num); 
total = parseFloat(total); 
if (isNaN(num) || isNaN(total)) { 
return "-"; 
} 
return total <= 0 ? "0" :num==0 ? "0": (Math.round(num / total * 10000) / 100.00 + "%");
//return total <= 0 ? "0" : (Math.round(num / total * 10000) / 100.00 + "%"); 
} ;


//求百分比
exports.Percent = function(num, total){
num = parseFloat(num); 
total = parseFloat(total); 
if (isNaN(num) || isNaN(total)) { 
return "-"; 
} 
return total <= 0 ? "0" :num==0 ? "0": (Math.round(num / total * 10000) / 100.00 );
//return total <= 0 ? "0" : (Math.round(num / total * 10000) / 100.00 + "%"); 
} ;

