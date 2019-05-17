<?php
function checkValidUserAlias($useralias) {
   global $regexPatterns;

   if (isset($regexPatterns) && is_array($regexPatterns) && !empty($regexPatterns['useralias']))
        $pattern = $regexPatterns['useralias'];
   else $pattern = '/^[a-zA-Z0-9_-]{8,10}$/';

   $result  = preg_match($pattern, $useralias);

   if (!$result)
        return false;
   else return true;
}
