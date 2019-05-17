<?php
function checkValidPhone($phone) {
   global $regexPatterns;

   if (isset($regexPatterns) && is_array($regexPatterns) && !empty($regexPatterns['phone']))
        $pattern = $regexPatterns['phone'];
   else $pattern = '/^(\([0-9]{2,4}\))([0-9]{3,4})([0-9]{4,6})$/';

   $result  = preg_match($pattern, $phone);

   if (!$result)
        return false;
   else return true;
}
