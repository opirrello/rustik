function isValidDate(sFecha){
   var arrFecha = new Array();
       arrFecha = sFecha.split(/\//);
	
   if (arrFecha.length != 3) return false;

   if (isNaN(arrFecha[0])) return false;
   if (isNaN(arrFecha[1])) return false;
   if (isNaN(arrFecha[2])) return false;

   var dia1 = arrFecha[0] - 0;
   var mes1 = arrFecha[1] - 1;
   var ano1 = arrFecha[2] - 0;

   if (ano1.length < 4) return false;
   if (ano1.length > 4) return false;

   if (dia1 == "29" && mes1 == 1)
      if ( (ano1/4) == parseInt(ano1/4) )
         if ( (ano1/100) == parseInt(ano1/100) )
            if ( (ano1/1000) == parseInt(ano1/1000) ) error = 0;
            else error = 1;
         else error = 0;
      else error = 1;
   else{
      date1 = new Date(ano1,mes1,dia1);

      var ano2 = date1.getFullYear();
      var mes2 = date1.getMonth();
      var dia2 = date1.getDate();

      ano1 = ano1.toString();
      ano2 = ano2.toString();

      if (ano1.length == 4) ano1 = ano1.substring(2,ano1.length);
      if (ano2.length == 4) ano2 = ano2.substring(2,ano2.length);

      var s1 = dia1+"/"+(mes1+1)+"/"+ano1;
      var s2 = dia2+"/"+(mes2+1)+"/"+ano2;

      if (s1 != s2) error = 1;
      else error = 0;
   }

   if (error == 0) return true
   else            return false;
}
