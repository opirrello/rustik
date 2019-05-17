 (function($) {
	String.prototype.translate = function() {
      var language = callback = params = paramErr = postData = false;
      var sentence = this;

      _replaceParams = function(sentence, params) {
         if (params && typeof params == 'array') {
            for(var i=0; i<params.length; i++) {
               var parnum = i + 1;
               sentence = sentence.replace('#'+parnum, params[i]);
            }
         }

         return sentence;
      }

      if (arguments.length > 0) {
         if (arguments.length == 1) {
            if (typeof arguments[0] == 'function') { callback = arguments[0]; }
            else if (typeof arguments[0] == 'array') { params = arguments[0]; }
            else if (typeof arguments[0] == 'string') { language = arguments[0]; }
            else paramErr = true;
         }
         else if (arguments.length == 2) {
            /// check if first param is de language code
            if (typeof arguments[0] == 'string') {
               language = arguments[0];

               if (typeof arguments[1] == 'array') { params = arguments[1]; }
               else if (typeof arguments[1] == 'function') { callback = arguments[1]; }
               else paramErr = true;
            }
            else if (typeof arguments[0] == 'array') {
               if (typeof arguments[1] == 'function')
                    callback = arguments[1];
               else paramErr = true;
            }
            else paramErr = true;
         }
         else if (arguments.length == 3) {
            language = typeof arguments[0] == 'string' ? arguments[0] : false;
            params   = typeof arguments[1] == 'array' ? arguments[0] : false;
            callback = typeof arguments[2] == 'function' ? arguments[1] : false;

            if (language == false || params == false || callback == false) {
               paramErr = true;
            }
         }
         else paramErr = true;

         if (paramErr) {
            console.error("Los parametros de translate no corresponden a los valores permitidos");
            return false;
         }
      } 

      /***** si se especifica lenguaje, se limpia el diccionario y se agrega filtro por lenguaje *****/
      if (language) {
         dictionary = false;
         postsData = {language:language};
      }

      /***** si el diccionario esta en blanco, se recarga *****/
      if (typeof dictionary == 'undefined' || !dictionary.length) {
         $.ajax({  
            type: 'post',
            async: false,
            data: postData,
            url: '/services/get_dictionary.html',
            dataType: 'json',
            success: function (response) {
               if (response.status != 'ERROR') {
                  dictionary = response;

                  if (typeof dictionary.sentences[sentence] == 'undefined')
                       var sentence_translated = sentence;
                  else var sentence_translated = dictionary.sentences[sentence];

                   if (callback) 
                        callback(sentence);
                   else return sentence;
               }
            }
         });
      }
      else {
         if (callback) 
              callback(dictionary.sentences[sentence]);
         else return dictionary.sentences[sentence];
      }

      /***** si hay parametros de reemplazo asignados, se reemplaza en el texto *****/
      if (params) {
         sentence = _replaceParams(params, sentence);
      }
   }
 })(jQuery);
