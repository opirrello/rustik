<?php
function formatDateOnly($orig_date, $format=false, $orig_format=false) {
   return $final_date = formatDate($orig_date, $format, $orig_format, true);
}

function formatDate($orig_date, $format=false, $orig_format=false, $omit_time=false) {
   /*
   $orig_format { dmY/Ymd/ymd}
    * */

   $dateTimeStruct = explode(' ',$orig_date);
   $dateStruct = $dateTimeStruct[0];

   $ori_formStruct = str_split($orig_format);
   $des_formStruct = str_split($format);

   if (strpos($dateStruct,'-') !== false) {
      $dateStruct = explode('-', $dateStruct);

      if (empty($ori_formStruct[0])) {
         $ori_formStruct = array('y','m','d','-');
      }
      if (empty($des_formStruct[0])) {
         $des_formStruct = array('d','m','y','/');
      }
   }
   elseif(strpos($dateStruct,'/') !== false) {
      $dateStruct = explode('/', $dateStruct);

      if (empty($ori_formStruct[0])) {
         $ori_formStruct = array('d','m','y','/');
      }
      if (empty($des_formStruct[0])) {
         $des_formStruct = array('y','m','d','-');
      }
   }

   foreach ($ori_formStruct as $ori_pos=>$ori_elem) { 
      foreach($des_formStruct as $des_pos=>$des_elem) {
         if ($ori_elem == $des_elem)
         $aux[$des_pos] = $dateStruct[$ori_pos];
      }
   }

   ksort($aux);

   if (sizeof($aux) == 4)
   array_pop($aux);

   $new_date = implode($des_formStruct[3], $aux);
   $dateTimeStruct[0] = $new_date;

   if ($omit_time)
        $final_date = $dateTimeStruct[0];
   else $final_date = implode(' ', $dateTimeStruct);

   return $final_date;
}
