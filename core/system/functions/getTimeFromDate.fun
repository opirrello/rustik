<?php
function getTimeFromDate($datetime,$range='hms') {
   $aux_date = explode(' ',$datetime);
   $aux_time = explode(':',$aux_date[1]);

   switch($range){
      case 'hms':
         return $aux_date[1];
         break;
      case 'hm':
         return "$aux_time[0]:$aux_time[1]";
         break;
      case 'ms':
         return "$aux_time[1]:$aux_time[2]";
         break;
      case 'h':
         return $aux_time[0];
         break;
      case 'm':
         return $aux_time[1];
         break;
      case 's':
         return $aux_time[2];
         break;
      default:
         return false;
   }
}
