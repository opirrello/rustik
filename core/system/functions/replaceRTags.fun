<?php
function replaceRTags($elem, $paramlist=false) {
   if (is_array($elem)) {
      foreach($elem as $key=>$val) {
         $elem[$key] = replaceRTags($val, $paramlist);
      }
   }
   else {
      //// aplicar sustitucion de variables para todas las etiquetas '%v%'
      preg_match_all('/%v%[a-zA-Z0-9_]+%v%/', $elem, $variables);

      if (is_array($variables) && sizeof($variables) > 0) {
         foreach($variables[0] as $variable) {
            $real_var = str_replace('%v%','', $variable);

            if (!empty($paramlist) && $paramlist != 'false') {
               foreach ($paramlist as $paramId=>$paramValue) {
                  if ($paramId == $real_var) {
                     $elem = str_replace($variable, $paramValue, $elem);
                  }
                  //else throw new Exception(__FILE__.": Falta valor para variable $real_var."); 
               }
            }
            else {
               throw new Exception(__FILE__.": Faltan valores para las parametros a pasar como variable."); 
               die;
            }
         }
      }

      //// aplicar sustitucion de constantes para todas las etiquetas '%C%'
      preg_match_all('/%C%[A-Z_]+%C%/', $elem, $constantes);

      if (is_array($constantes) && sizeof($constantes) > 0) {
         foreach($constantes[0] as $constante) {
            $real_const = str_replace('%C%','', $constante);

            if (defined($real_const)) {
               $newf = constant($real_const);
            }

            if (mb_detect_encoding($newf) != 'UTF-8') {
               $newf = utf8_encode($newf);
            }

            $elem = str_replace($constante, $newf, $elem);
         }
      }

      //// aplicar translate para todas las etiquetas '%t%'
      //

      preg_match_all('/%t%[\(\)\d\/#\:àâãáèêéïíôõöóúñÿýçÀÂÃÁÈÊÉÏÍÔÕÖÓÚÑŸÝÇ¿\w-,;\.\s!¡\+\-\_\?]+%t%/', $elem, $frases);

      if (is_array($frases) && sizeof($frases) > 0) {
         foreach($frases[0] as $frase) {
            $newf = translate(str_replace('%t%','',$frase), $paramlist);

            if (mb_detect_encoding($newf) != 'UTF-8') {
               $newf = utf8_encode($newf);
            }

            $elem = str_replace($frase, $newf, $elem);
         }
      }

      //// aplicar informacion de modelo de datos para todas las etiquetas '%m%'
      preg_match_all('/%[m|c]%[\w\:\,\-\s]+%[m|c]%/', $elem, $contenidos);

      if (is_array($contenidos) && sizeof($contenidos) > 0) {
         $paramValues = false;
        
         foreach($contenidos[0] as $contenido) {
            if (strpos($contenido,'%m%') !== false)
                 $objType = 'Model';
            else $objType = 'Controller';

            if ($objType == 'Model')
                 $objectStr = str_replace('%m%','',$contenido);
            else $objectStr = str_replace('%c%','',$contenido);

            list($object, $method, $paramIds) = explode(':',$objectStr);

            if (!empty($object) && !empty($method)) {
               $object = formatCamelCase($object);
               $object = $object.$objType;
               $obj_object = new $object;

               if (!empty($paramIds)) {
                  $paramIds = explode(',', $paramIds);

                  if (!empty($paramlist) && $paramlist != 'false') {
                     foreach($paramlist as $pId=>$pVal) {
                        if (in_array($pId, $paramIds)) {
                           $paramValues[] = $pVal;
                        }
                     }
                  }
                  else {
                     throw new Exception(__FILE__.": Faltan valores para los parametros a pasar al metodo $method."); 
                     die;
                  }
               }
               else $paramValues = array();
               
               if (method_exists($object,$method)) {
                  $str_result = call_user_func_array(array($obj_object,$method), $paramValues);

                  //$newc = utf8_encode(str_replace('%m%','',$contenido));
                  if (is_array($str_result) && sizeof($str_result) > 1) {
                     $elem = $str_result;
                  }
                  else $elem = str_replace($contenido, $str_result, $elem);
               }
               else {
                  throw new Exception(__FILE__.": Metodo $method inexistente para $objType $object."); 
                  die;
               }
            }
         }
      }
   }

   return $elem;
}
