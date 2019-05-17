<?php
function dump($var){
   $html = vuelco($var);
   $callers = debug_backtrace();

    foreach($callers as $call) {
       $trace[] = $call['class'] . '->' . $call['function'];
    }

   TemplateHandler::getInstance()->setDump($html, $trace);
}

function vuelco($var){
   $aux  = (array) $var;

   $var_type = gettype($var);

   if ($var_type == 'object') {
      $var_data = $var_type.'#'.get_class($var);
   }
   elseif ($var_type == 'array') {
      $var_data = $var_type.' ('.sizeof($var).')';
   }
   else {
      $var_data = $var_type;
   }

   if (func_num_args() > 1){ 
      $txtvar = func_get_arg(1).' - '.$var_data;
   }
   else{
      $txtvar = $var_data;
   }

   $html = "\n<table class='dump' cellspacing=0 cellpadding=0>\n".
           "<tr><td class='detail' colspan=2><i><font>$txtvar</font></i></td></tr>\n";

   while ($cell = each($aux)){
      $html .= "<tr>\n";
      $html .= "<td class='cell-name'><b><font>".$cell['key']."</font></b></td>\n";
  
      $html .= "<td class='cell-value'><font>\n";   
      if ((is_array ($cell['value']))||
          (is_object($cell['value']))){
         $xx    = $cell['value'];
         $html .= vuelco($xx,$cell['key']);
      }
      else $html .= $cell['value'];

      $html .= "</font></td>\n";
      $html .= "</tr>\n";
   }
   $html .= "</table>\n";

   return $html;
}
