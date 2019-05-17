<?php
function sanitizeRequest($REQ=false) {
   if ($REQ == false) {
      $REQ = $_REQUEST;
   }

   foreach ($REQ as $key=>$data) {
      if (is_array($data)) {
         $data = sanitizeRequest($data);
         $REQ[$key] = $data;
      }
      else {
         $REQ[$key] = strip_tags($data);
      }
   }

   return $REQ;
}
