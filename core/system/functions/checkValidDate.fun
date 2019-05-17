<?php
function checkValidDate($orig_date, $orig_format='dmy') {
   /*
   $orig_format { dmY/Ymd/ymd}
    * */

   $dateStruct = explode(' ',$orig_date);
   $dateStruct = $dateStruct[0];

   $ori_formStruct = str_split($orig_format);
   $des_formStruct = str_split($format);

   if (strpos($dateStruct,'-') !== false) {
      $dateStruct = explode('-', $dateStruct);
   }
   elseif(strpos($dateStruct,'/') !== false) {
      $dateStruct = explode('/', $dateStruct);
   }

   switch ($orig_format) {
      case 'mdy':
         $dia = $dateStruct[1];
         $mes = $dateStruct[0];
         $anio= $dateStruct[2];
         break;

      case 'ymd':
         $dia = $dateStruct[2];
         $mes = $dateStruct[1];
         $anio= $dateStruct[0];
         break;

      case 'dmy':
      default:
         $dia = $dateStruct[0];
         $mes = $dateStruct[1];
         $anio= $dateStruct[2];
         break;
   }

   return checkdate($mes, $dia, $anio);
} 
