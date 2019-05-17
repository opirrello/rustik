<?php
function formatCamelCase($string) {
   // Split up the string into an array according to the uppercase characters
   $array = preg_split('/([-_][^-_]*)/', $string, -1, PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE);

   foreach($array as $word) {
      $word = str_replace('_','', $word);
      $word = str_replace('-','', $word);
      $aux[]= $word;
   }

   $array = array_map(ucfirst, $aux);
 
   // Return the resulting array
   return implode('',$array);
}

