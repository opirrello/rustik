<?php
function checkValidEmail($mail) {
   global $regexPatterns;

   if (isset($regexPatterns) && is_array($regexPatterns) && !empty($regexPatterns['email']))
        $pattern = $regexPatterns['email'];
   else $pattern = '/^[a-zA-Z][\w-]+([\.\w-]+)*@[a-zA-Z][\w-]+(\.[\w-]+)*(\.[a-zA-Z]{2,4}){1,2}$/';

   $result  = preg_match($pattern, $mail);

   if (!$result)
        return false;
   else return true;
}
