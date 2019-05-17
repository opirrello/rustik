<?php
function unformatCamelCase($string, $lower = true) {
   // Split up the string into an array according to the uppercase characters
   $array = preg_split('/([A-Z][^A-Z]*)/', $string, -1, PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE);
 
   // Convert all the array elements to lowercase if desired
   if ($lower) {
      $array = array_map(strtolower, $array);
   }
 
   // Return the resulting array
   return implode('_',$array);
}

