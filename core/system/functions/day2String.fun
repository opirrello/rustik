<?php
function day2String($day, $format='dmy/') {
   $frmStruct = str_split($format);
   $dayStruct = explode($frmStruct[3], $day);

   foreach($frmStruct as $idx=>$code) {
      $code = strtolower($code);

      switch($code) {
         case "d": $dia = $dayStruct[$idx]+0; break;
         case "m": $mes = $dayStruct[$idx]+0; break;
         case "y": $anio= $dayStruct[$idx]+0; break;
      }
   }
   
   $daynumber = date('w', strtotime("$anio-$mes-$dia"));

   switch($daynumber) {
      case 0: $dayname = translate('Domingo');   break;
      case 1: $dayname = translate('Lunes');     break;
      case 2: $dayname = translate('Martes');    break;
      case 3: $dayname = translate('Miércoles'); break;
      case 4: $dayname = translate('Jueves');    break;
      case 5: $dayname = translate('Viernes');   break;
      case 6: $dayname = translate('Sábado');    break;
   }

   switch($mes) {
      case  1: $monthname = translate("Enero"); break;
      case  2: $monthname = translate("Febrero"); break;
      case  3: $monthname = translate("Marzo"); break;
      case  4: $monthname = translate("Abril"); break;
      case  5: $monthname = translate("Mayo"); break;
      case  6: $monthname = translate("Junio"); break;
      case  7: $monthname = translate("Julio"); break;
      case  8: $monthname = translate("Agosto"); break;
      case  9: $monthname = translate("Septiembre"); break;
      case 10: $monthname = translate("Octubre"); break;
      case 11: $monthname = translate("Noviembre"); break;
      case 12: $monthname = translate("Diciembre"); break;
   }

   $currLang = (!empty($_SESSION['lang']))?$_SESSION['lang']:RM_LANG_DEFAULT;
  
   return translate('#1, #2 de #3', array($dayname, $dia, $monthname));
}
