<?php
function multiexplode($delimiters, $string) {
   if (empty($string))
   return $string;

   if (is_array($delimiters)) {
      foreach($delimiters as $delim) {
         if (is_array($string)) {
            foreach ($string as $sub) {
               $aux[] = multiexplode($delim, $sub);
            }

            $string = $aux;
         }
         else $string = explode($delim, $string);
      }
   }
   else {
      if (is_array($string)) {
         foreach ($string as $sub) {
            $aux[] = multiexplode($delimiters, $sub);
         }

         $string = $aux;
      }
      else $string = explode($delimiters, $string);
   }

   return $string;
}
