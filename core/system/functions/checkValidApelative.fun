<?php
function checkValidApelative($apelative) {
   global $regexPatterns;

   if (isset($regexPatterns) && is_array($regexPatterns) && !empty($regexPatterns['apelative']))
        $pattern = $regexPatterns['apelative'];
   else $pattern = '/^[a-zA-Z áãâäàéêëèíîïìóõôöòúûüùçÁÃÂÄÀÉÊËÈÍÎÏÌÓÕÔÖÒÚÛÜÙÇ]+$/';

   $result  = preg_match($pattern, $apelative);

   if (!$result)
        return false;
   else return true;
}
