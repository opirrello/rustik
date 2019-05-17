<?php
function inStructure($needed, $matrix) {
   $needSerial = serialize($needed);
   $esta = false;

   foreach($matrix as $content) {
      $contSerial = serialize($content);

      if ($needSerial == $contSerial) {
         $esta = true;
         break;
      }
   }

   return $esta;
}
