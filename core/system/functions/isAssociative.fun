<?php
function isAssociative($array) {
      $xx = array_keys($array);
   
      foreach($xx as $idx) {
         if (is_numeric($idx)) return false;
         break;
      }

      return true;
}

