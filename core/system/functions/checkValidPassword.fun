<?php
function checkValidPassword($pass) {
   global $regexPatterns;

   if (isset($regexPatterns) && is_array($regexPatterns) && !empty($regexPatterns['password']))
        $pattern = $regexPatterns['password'];
   else $pattern = '/^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).{8,10}$/';

   $result  = preg_match($pattern, $pass);

   if (!$result)
        return false;
   else return true;
}
