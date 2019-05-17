<?php
function checkValidTextOnly($text) {
   global $regexPatterns;

   if (isset($regexPatterns) && is_array($regexPatterns) && !empty($regexPatterns['textonly']))
        $pattern = $regexPatterns['textonly'];
   else $pattern = '/^[^<>]+$/';

   $result  = preg_match($pattern, $text);

   if (!$result)
        return false;
   else return true;
}
