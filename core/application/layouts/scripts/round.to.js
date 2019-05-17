Number.prototype.roundTo = function(decimals) {
      if (!this || this == '')
      return this;

      var str = this.toString();

      if (isNaN(str))
      return this;

      var arr = str.split('.');

      if (arr.length == 1 || arr[1].length <= decimals) {
         var newVal = parseFloat(str);
         return newVal;
      }

      var parte = arr[1].substring(0,decimals);
      var parte2= arr[1].substring(decimals);
      var decArr = parte2.split('');
      var auxArr = false; //new Array();
      var seFrena = false;
    
      parte = parseInt(parte);
    
      while(!seFrena) {
         if (auxArr.length)
               var recArr = auxArr;
         else var recArr = decArr;
          
         auxArr = new Array();
            var hayCorte = false;
          
         for(i in recArr){
            var digito = parseInt(recArr[i]);
          
            if (digito > 4) {
                  if (auxArr.length) {
                     auxArr[auxArr.length-1]++;
                     hayCorte = true;
                  }
                  break;
            }
            else {
               auxArr.push(digito);
            }
         }
          
         if (!hayCorte)
         seFrena = true;
      }


      if (auxArr.length) {
         var auxStr = arr[0]+'.'+parte.toString()+auxArr.join('');
      }
      else{
         parte++;
         var auxStr = arr[0]+'.'+parte;
      }
    
      var newVal = parseFloat(auxStr);

      return newVal.toFixed(decimals);
}

