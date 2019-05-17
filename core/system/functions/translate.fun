<?php
function translate($textSource, $params=false) {
   $diccModel = new DiccionarioModel();

   if (!empty($params) && !is_array($params)) {
      die(basename(__FILE__).': Parametros de traduccion deben ser pasados como array.');
   }

   $langTo = translate_info();
   $langTo = $langTo['curr'];

   $textArr = $diccModel->selectBy(Array('frase_'.RM_LANG_DEFAULT => $textSource),array('frase_'.$langTo));
   $textArr = $textArr[0];

   $textDest = (is_array($textArr) && !empty($textArr))?$textArr['frase_'.$langTo]:$textSource;

   if (!empty($params) && is_array($params)) {
      foreach($params as $key=>$par) {
         $parnum = $key + 1;
         $textDest = str_replace("#$parnum", $par, $textDest);
      }
   }

   return $textDest;
}

function translate_info() {
   if (SecurityHandler::getInstance()->sessionExists()) {
      $authInfo = SecurityHandler::getInstance()->getFromSession('authInfo');
      $authInfo = unserialize($authInfo);

      if (isset($authInfo['codigo_idioma'])) {
         $currLang = $authInfo['codigo_idioma'];
      }
   }
   elseif (defined('RM_LANG_COOKIE') && isset($_COOKIE[RM_LANG_COOKIE])) {
      $currLang = $_COOKIE[RM_LANG_COOKIE];
   }

   if (empty($currLang)) {
      if (defined('RM_LANG_DEFAULT'))
           $currLang = RM_LANG_DEFAULT;
      else $currLang = 'es';
   }

   return array('curr'=>$currLang);
}
