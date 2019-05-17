function isGreaterDate(fecha1, fecha2){
console.log(fecha1+ '///'+ fecha2);
   var arrFecha = new Array();
	
   ///////////////////////////////////////////
   //   fecha2 debe ser la mayor de las dos //
   ///////////////////////////////////////////

   if (!isValidDate(fecha1)) return false;
   if (!isValidDate(fecha2)) return false;


   ///// fecha 1 /////
   arrFecha = fecha1.split(/\//);

   var dia1 = arrFecha[0] - 0;
   var mes1 = arrFecha[1] - 1;
   var ano1 = arrFecha[2] - 0;

   ///// fecha 2 /////
   arrFecha = fecha2.split(/\//);

   var dia2 = arrFecha[0] - 0;
   var mes2 = arrFecha[1] - 1;
   var ano2 = arrFecha[2] - 0;

   if (ano2 < ano1) return false;
   else if (ano2 > ano1) return true;
        else if (mes2 < mes1) return false;
             else if (mes2 > mes1) return true;
                  else if (dia2 < dia1) return false;
                       else if (dia2 >= dia1) return true;

return false;
}
