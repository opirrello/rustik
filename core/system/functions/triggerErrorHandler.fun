<?php
function triggerErrorHandler($errno, $errstr, $errfile, $errline) {
         if (!(error_reporting() && $errno)) {
             // Este código de error no está incluido en error_reporting
             return;
         }

         switch ($errno) {
         case E_USER_ERROR:
              $errorCode = 400;
              //echo "<b>Mi ERROR</b> [$errno] $errstr<br />\n";
              //echo "  Error fatal en la línea $errline en el archivo $errfile";
              //echo ", PHP " . PHP_VERSION . " (" . PHP_OS . ")<br />\n";
              //echo "Abortando...<br />\n";
              break;
   
         case E_USER_WARNING:
              $errorCode = 400;
              //$this->showError('E400');
              //echo "<b>Mi WARNING</b> [$errno] $errstr<br />\n";
              break;
      
         case E_USER_NOTICE:
              $errorCode = 400;
              //echo "<b>Mi NOTICE</b> [$errno] $errstr<br />\n";
              break;
   
         default:
              $errorCode = 100;
              //echo "Tipo de error desconocido: [$errno] $errstr<br />\n";
              break;
         }

         /* No ejecutar el gestor de errores interno de PHP */
         header('Location:'.SYS_SITEROOT.'/error/'.$errorCode.'.html');
         //exit(1);
         return true;
}

