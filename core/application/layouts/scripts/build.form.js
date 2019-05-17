/*********************************************
  BuildForm plugin
  Rustic framework plugin v1.0

  main initialization: line 363

*********************************************/
(function ($) {
    $.buildForm = $.fn.buildForm = function() {
      var spinner = false;
      var callback = false;
      var currElem = $(this);
      var options = {
         name: '',
         parameters:false,
         modal:false,
         ignore:'',
         submission: { method: 'POST', action:window.location.href, async: false },
         loadingTarget: $('body'),
         contentWrapper: $('body'),
         //loadingOptions: {color:'#333',width:4,corners:0, radius:20},
         requiredMark: 'after',
         responseMessage: {title:'', description:''}
      };

      //---------- PREVIOUS CONFIGURATION BEFORE MAIN PROCESS (initialize) ----------//
      /// extending options
      if (arguments.length < 1) return false;
      else if (arguments.length >= 1) {
         if (arguments.length == 1) {
            if (typeof arguments[0] === 'object') $.extend(options, arguments[0]);
            else if (typeof arguments[0] === 'function') callback = arguments[0];
         }
         else {
            if (typeof arguments[0] === 'object') $.extend(options, arguments[0]);
            if (typeof arguments[1] === 'function') callback = arguments[1];
         }
      }

      /// overwriting container deppends on the visual mode
      if (options.modal)
           var containerObj = $('#cboxLoadedContent');
      else var containerObj = currElem;

      /// control/set target form
      /// If options has not 'target' option, the form 'id' property it's used as 'target'
      if (!options.target) {
         if ($(this).has('form')) {
            //options.target = $(this).first('form');
            var form = $(this).find('form:first');
       
            if (typeof form.attr("id") != "undefined" && form.attr("id").length > 0) {
               options.target = form.attr('id');
            }
            else {
               throw 'no hay formulario con un id definido';
               return false;
            }
         }
         else {
            throw 'no hay formulario para asociar a buildForm';
            return false;
         }
      }

      //------- ADITIONAL FUNCTIONALITY USED BY CONSTRUCTOR ---------//
      var handleMessage = function (stat, response) {
         var responseStatus = stat;
         var summary = $('#'+options.target+' .buildform-messagebox');
         summary.empty();

         if (response.message) {
            if (Array.isArray(response.message.description))
                 var description = '<p>'+response.message.description.join('</p><p>')+'</p>';
            else var description = response.message.description;

            if (response.message.mode == 'fixed') {
               if (response.message.title)
                    var title = '<strong>'+response.message.title+'</strong> ';
               else var title = '';

               summary.append('<div class="alert alert-'+responseStatus+'">'+title+description+'<span class="close">×</span></div>');
               summary.on('click','.alert .close',function(e) {
                  e.preventDefault();
                  $(this).parent().remove();
               });
            }
            else {
               if (response.message.title)
                    var errorCont = '<h1>'+response.message.title+'</h1><p>'+description+'</p>';  
               else var errorCont = description;

               createAlertWindow({type:responseStatus, content:errorCont});
            }
         }
      }

      var initSpin = function () {
         if (!options.loadingTarget) {
            return false;
         }

         if (options.modal && $('.jsonform.modal #cboxLoadedContent').length)
         options.loadingTarget = $('.jsonform.modal #cboxLoadedContent');

         if (options.loadingOptions && typeof options.loadingOptions === 'object')
              $(options.loadingTarget).startSpin(options.loadingOptions);
         else $(options.loadingTarget).startSpin();
      }

      var endSpin = function () {
         $(options.loadingTarget).stopSpin();
      }

      purgeRules = function (rulesObj) {
         for (var idx in rulesObj) {
            if (typeof rulesObj[idx] === 'object') {
               rulesObj[idx] = purgeRules(rulesObj[idx]);
            }
            else {
               if ( typeof rulesObj[idx] === 'string' && rulesObj[idx].indexOf('function') != -1 ) {
                  var sentence = rulesObj[idx].split('%%');
                  sentence = sentence[1];

                  rulesObj[idx] = new Function('element', sentence);
               }
            }
         }

         return rulesObj;
      }

      verifyRule = function (selector, rule) {
	      var sheet = document.styleSheets[0];
         var rules = sheet.cssRules;
         var haveRule = false;

         for (var i=0; i<rules.length; i++) {
            if (rules[i].selectorText && rules[i].cssText && rules[i].selectorText == selector) {
               var cleanRule = rule.replace(/\s/g,'');
               var cleanCss  = rules[i].cssText.replace(/\s/g,'');
               var cssRules  = cleanCss.match(/{.*}/)[0];

               if (cssRules) {
                  cssRules = cssRules.replace(/{/g,'');
                  cssRules = cssRules.replace(/}/g,'');
                  cssRules = cssRules.split(';');
                
                  for (var j in cssRules) {
                     if (cleanRule == cssRules[j]) {
                        haveRule = true;
                        break;
                     }
                  }
               }
            }
         }

         return haveRule;
      }
      
      var changeRule = function (selector, rule) {
	      var sheet = document.styleSheets[0];

         selector = selector.replace(":","::");

         if (! verifyRule(selector, rule)) {
	         try{ sheet.insertRule(""+selector+" { "+rule+" }", sheet.cssRules.length); }
            catch(msie) {
	            try{ sheet.addRule(selector, rule); }
               catch(err) { console.log("Error - changeRule / " + err) }
	         }
	      }

         return false;
      }

      var toggleSubmit = function() {
         if (options.bindSubmit)
              var buttonSubmit = $(options.bindSubmit);
         else var buttonSubmit = $('#'+options.target+' input[type=submit]');

         if (options.jsondata.validation) {
            if (!$('#'+options.target).validate().checkForm())
                 buttonSubmit.attr('disabled','disabled');
            else buttonSubmit.removeAttr('disabled');
         }

         return false;
      }

      var adjustError = function(ele) {
         //// Fixing error pointer position
         var aria_invalid = ele.attr('aria-invalid');
         var error = ele.next('span.error');
         var margin = 15;
         var currId = ele.attr('id');

         $('span.error').each(function() {
            //console.log($(this).find('label').attr('id') + ' /// ' + currId+'-error');
            if ($(this).find('label').attr('id') != currId+'-error') {
               $(this).hide();
            }
         });

         if (aria_invalid == undefined || aria_invalid == "false") {
            ele.next('span.error').remove();
         }
         else {
            var w = ele.width();
            var error = ele.next('span.error').find('label');
            
            if (error) {
               //// Fixing error message box position

               var elementCoords= ele.offset();
               var formWidth    = $('#'+options.target).width();
               var formCoords   = $('#'+options.target).offset();
               var errorWidth   = ele.parent().find('span.error').width();

               var errorEndXPos = elementCoords.left + errorWidth;
               var formEndXPos  = formCoords.left + formWidth;

               //changeRule('#'+ele.attr('id')+' + span.error label i', 'left:unset');

               //// adjustment for left alignment 
               if (error.parent().hasClass('left')) {
                  var errWidth = error.parent().width();
                  var arrWidth = error.parent().find('i').outerWidth();

                  error.parent().css('left','-'+ (errWidth + arrWidth) +'px');
               }

               if (errorEndXPos > formEndXPos) {  /// check if error ends beyond form limit
                  error.parent().removeClass('left');
                  error.parent().removeClass('right');
                  error.parent().addClass('top');
                  //changeRule('#'+ele.attr('id')+' + span.error label i', 'margin-left:-20px');
                  //changeRule('#'+ele.attr('id')+' + span.error', 'right:1px');
               }
               else {
                  //changeRule('#'+ele.attr('id')+' + span.error label i', 'margin-left:-'+ (errorWidth - margin) + 'px');
               }
               
               //// adjustment for arrow box 
               if (error.parent().hasClass('top')) {
                  var eleWidth = ele.outerWidth();

                  if (eleWidth < errorWidth) {
                     console.log(error);
                     error.parent().find('i').css('left', (eleWidth / 2) +'px');
                  }

                  console.log(eleWidth);
                  console.log(ele);
               }
            }
         }
      };

      var processTags = function(jsonData) {
         if (arguments.length == 1)
              var tagsObj = jsonData.tagsrebuild;
         else var tagsObj = arguments[1];

         for(property in jsonData) {
            if (typeof jsonData[property] == 'object') {
               jsonData[property] = processTags(jsonData[property], tagsObj);
            }
            else if (typeof jsonData[property] == 'string') {
               jsonData[property] = tagsRebuild(jsonData[property], tagsObj);
            }
         }

         return jsonData;
      };

      //------- FORM CONSTRUCTOR ---------//
      var buildForm = function(options) {
         var prefix = options.jsondata.prefix || '';

         $('#'+options.target).jsonForm({schema:options.jsondata.schema, form:options.jsondata.form, prefix:prefix});
         $('#'+options.target).prepend('<div class="buildform-messagebox"></div>');
         $('#'+options.target+' input[type=submit]').attr('disabled','disabled');

         $('#'+options.target+' .control-group').each(function() {
            if ( $(this).hasClass('jsonform-required') && !$(this).find('.control-label').length ) {
               if (options.requiredMark != 'none') {
                  switch (options.requiredMark) {
                     case 'after': $(this).append('<span class="required-mark after"></span>'); break;
                     case 'before': $(this).append('<span class="required-mark before"></span>'); break;
                  }

                  $(this).find('.help-inline').appendTo($(this));
               }
            }
         });

         //$('#'+options.target+' .control-group input,select,textarea').focusin(function() { $(this).valid(); adjustError($(this)); });
         $('#'+options.target+' .control-group input,select,textarea').focusout(function() {$(this).valid(); adjustError($(this)); });
         $('#'+options.target+' .control-group input:radio, input:checkbox').click(function() { $(this).valid(); adjustError($(this)); });

         if (options.jsondata.validation) {
            ///// check for some function element
            options.jsondata.validation.rules = purgeRules(options.jsondata.validation.rules);

            $('#'+options.target).validate({
                  ignore: options.ignore,
                  onkeyup: function(element, event) {
                        if (event.which !== 9) {
                           $(element).valid(); 
                           adjustError($(element));
                        }
                  },
                  rules:options.jsondata.validation.rules,
                  messages:options.jsondata.validation.messages,
                  wrapper: "span",
                  submitHandler: function (form) {
                     if (options.submission) {
                        //---------- AJAX SUBMISSION ------------
                        if (options.submission.hasOwnProperty('async') && options.submission.async) {
                           if (options.submission.hasOwnProperty('method'))
                                var method = options.submission.method;
                           else var method = 'POST';

                           if (options.submission.hasOwnProperty('action'))
                                var action = options.submission.action;
                           else var action = '';

                           var validator= this;

                           var enctype = $('#'+options.target).attr('enctype');
                           enctype = (enctype == undefined || enctype == "false") ? false:enctype;

                           if (enctype) {
                              var formData = new FormData();

                              $.each($('#'+options.target).find("input[type='file']"), function(i, tag) {
                                    $.each($(tag)[0].files, function(i, file) {
                                          formData.append(tag.name, file);
                                    });
                              });

                              var params = $('#'+options.target).serializeArray();
                              $.each(params, function (i, val) {
                                    formData.append(val.name, val.value);
                              });
                              var processData = false;
                              var contentType = false;
                           }
                           else {
                              var formData = $('#'+options.target).serialize();
                              var processData = true;
                              var contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
                           }

                           $.ajax({  
                              type: method,
                              url: action,
                              data: formData,
                              enctype: enctype,
                              contentType: contentType,
                              processData: processData,
                              dataType: 'json',
                              beforeSend: function() {
                                 initSpin();

                                 if (options.submission.before && typeof options.submission.before === 'function') {
                                    var frmData = options.submission.before(containerObj, $('#'+options.target));

                                    if (typeof frmData === 'object') {
                                       for (var pair of frmData.entries()) {
                                          formData.append(pair[0], pair[1]);
                                       }
                                    }
                                 }
                              },
                              error: function(jqXHR) {
                                 if (jqXHR.responseJSON){
                                    var response = jqXHR.responseJSON;
                                    var requestStatus = {code:jqXHR.status, text:jqXHR.statusText};

                                    if (response.errorList) {
                                       validator.showErrors(response.errorList);
                                    }

                                    handleMessage('danger', response);
                                 
                                    if (options.submission.after && typeof options.submission.after === 'function') {
                                       if (response.toCallBack) {
                                          options.submission.after(containerObj, $('#'+options.target), response.toCallBack, requestStatus, function() {
                                             endSpin();
                                          });
                                       }
                                       else {
                                          options.submission.after(containerObj, $('#'+options.target), false, requestStatus, function() {
                                             endSpin();
                                          });
                                       }
                                    }
                                    else endSpin();
                                 }
                                 else endSpin();
                              },
                              success: function(response,textStatus, jqXHR) {
                                 var requestStatus = {code:jqXHR.status, text:jqXHR.statusText};

                                 if (response){
                                    handleMessage('success', response);

                                    if (options.submission.after && typeof options.submission.after === 'function') {
                                       if (response.toCallBack) {
                                          options.submission.after(containerObj, $('#'+options.target), response.toCallBack, requestStatus, function() {
                                              endSpin();
                                          });
                                       }
                                       else {
                                          options.submission.after(containerObj, $('#'+options.target), false, requestStatus, function() {
                                              endSpin();
                                          });
                                       }
                                    }
                                    else endSpin();
                                 }
                                 else endSpin();

                                 toggleSubmit();
                              }
                           });
                        }
                        //---------- NORMAL SUBMISSION ------------
                        else {
                           if (options.submission.before && typeof options.submission.before === 'function') {
                              var beforeResult = options.submission.before(containerObj, $('#'+options.target));
                           }

                           this.currentForm.action = options.submission.action;
                           this.currentForm.method = options.submission.method;
                           this.currentForm.submit();
                        }
                     }
                  }, 
                  errorPlacement: function(error, element) {
                     if (options.jsondata.validation.hasOwnProperty('pointer') &&
                         options.jsondata.validation.pointer.hasOwnProperty(element.attr('name'))) {

                        error.addClass(options.jsondata.validation.pointer[element.attr('name')]);
                     }
                     else {
                        error.addClass('top');
                     }

                     error.addClass('error');
                     error.find('label').css('white-space','nowrap');
                     error.append('<i></i>');

                     if (element.context.type == 'radio')
                          error.insertAfter(element.parent().parent());
                     else
                     if (element.context.type == 'checkbox')
                          error.insertAfter(element.parent());
                     else error.insertAfter(element);
                  },
                  showErrors: function() {
                     this.defaultShowErrors();
                     toggleSubmit();
                  },
                  focusCleanup: true
            });
         }

         toggleSubmit();

         if (options.modal) {
            var width = (options.width)?options.width:"100%";
            var transition = (options.transition)?options.transition:"fade";

            $.colorbox({
               href: '#'+options.target,
               inline: true,
               title: options.jsondata.toptitle,
               width: width,
               transition: transition,
   	         close: "×",
               className: 'jsonform modal '+options.target,
               onCleanup: function () {
                  ///si hay datepicker asociado se devuelve al padre original
                   $('#'+options.target).find('#ui-datepicker-div').appendTo('body');
               },
               onClosed: function() {
                   $('#'+options.target).remove();
               },
               onComplete : function() {
                   //apend your content to cboxTitle
                   var title = $('#cboxTitle').html();
  
                   $('#cboxTitle').html('');
                   $('#cboxTitle').append('<div></div><label>'+title+'</label>');
                   if (typeof callback == 'function')
                   callback();
               }
            });
         }
         else {
            if (typeof callback == 'function')
            callback();
         }

         return false;
      }

      /*********** ADDING ADITIONAL RULES *****************/
      $.validator.methods.apelative = function( value, element ) {
         if (options.jsondata && options.jsondata.regex.apelative)
              var regexPattern = new RegExp(options.jsondata.regex.apelative.replace(/\//g, ''));
         else var regexPattern = /^[a-zA-Z ñÑáãâäàéêëèíîïìóõôöòúûüùçÁÃÂÄÀÉÊËÈÍÎÏÌÓÕÔÖÒÚÛÜÙÇ]+$/;

         return this.optional( element ) || regexPattern.test( value );
      };

      $.validator.methods.email = function( value, element ) {
         if (options.jsondata && options.jsondata.regex.email)
              var regexPattern = new RegExp(options.jsondata.regex.email.replace(/\//g, ''));
         else var regexPattern = /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

         return this.optional( element ) || regexPattern.test( value );
      };

      $.validator.methods.useralias = function( value, element ) {
         if (options.jsondata && options.jsondata.regex.useralias)
              var regexPattern = new RegExp(options.jsondata.regex.useralias.replace(/\//g, ''));
         else var regexPattern = /^[a-zA-Z0-9_-]{8,10}$/;

         return this.optional( element ) || regexPattern.test(value);
      };

      $.validator.methods.money = function( value, element ) {
         if (options.jsondata && options.jsondata.regex.money)
              var regexPattern = new RegExp(options.jsondata.regex.money.replace(/\//g, ''));
         else var regexPattern = /\d+(\.\d+)?/;

         return this.optional( element ) || regexPattern.test(value);
      };

      $.validator.methods.ranking = function( value, element ) {
         if (options.jsondata && options.jsondata.regex.calendar)
              var regexPattern = new RegExp(options.jsondata.regex.useralias.replace(/\//g, ''));
         else var regexPattern = /^[a-zA-Z0-9_-]{8,10}$/;

         return this.optional( element ) || regexPattern.test(value);
      };

      $.validator.methods.password = function( value, element ) {
         if (options.jsondata && options.jsondata.regex.password)
              var regexPattern = new RegExp(options.jsondata.regex.password.replace(/\//g, ''));
         else var regexPattern = /^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).{8,10}$/;

         return this.optional( element ) || regexPattern.test(value);
      };

	  $.validator.methods.textonly = function( value, element ) {
         if (options.jsondata && options.jsondata.regex.textonly)
              var regexPattern = new RegExp(options.jsondata.regex.textonly.replace(/\//g, ''));
         else var regexPattern = /^[^<>]+$/;

         return this.optional( element ) || regexPattern.test( value );
      };

      /*********** ADDING CUSTOM RULES *****************/
      if (options.customValidation) {
         for (methodName in options.customValidation) {
            $.validator.addMethod(methodName, options.customValidation[methodName]);
         }
      }


      //---------- MAIN PROCESSING - using the constructor ----------//
      // Form present in the HTML 
      if (options.jsondata) {
         options.jsondata = processTags(options.jsondata);

         if (!$('#'+options.target).length) {
            if (options.modal) {
                 options.contentWrapper.append($('<form id="'+options.target+'" style="margin:0px 20px 20px"></form>'));
            }
            else {
               $(this).append($('<form id="'+options.target+'" style="margin:0px 20px 20px"></form>'));
               $(this).addClass('jsonform fixed '+options.target);
            }
         }
         else {
            $('#'+options.target).parent().addClass('jsonform fixed '+options.target);
         }

         buildForm(options);
      }
      // Form dinamically loaded by AJAX 
      else {
         var postData = {};
      
         postData['formname'] = options.target;
         postData['parameters'] = (options.parameters) ? options.parameters:null;

         $.ajax({
            context: this,
            data: postData,
            method: 'post',
            beforeSend: function() { 
               initSpin();
            },
            url:RM_DOMAIN+'/services/get_json_schema.html',
            dataType:'json',
            error: function(jqXHR) {
               endSpin();

               var response = jqXHR.responseJSON;
               handleMessage('danger', response);
            },
            success: function (response, textStatus, jqXHR) {
               endSpin();

               if (response == '')
               return false;
   
               // If form doesn't exists, is dynamically created
               if (!$('#'+options.target).length) {
                  if (options.modal)
                       $('#content-wrapper').append($('<form id="'+options.target+'" style="margin:0px 20px 20px"></form>'));
                  else {
                     $(this).append($('<form id="'+options.target+'" style="margin:0px 20px 20px"></form>'));
                     $(this).addClass('jsonform fixed '+options.target);
                  }
               }
               else {
                  $('#'+options.target).parent().addClass('jsonform fixed '+options.target);
               }
   
               options.jsondata = response;

               if (options.jsondata.regex) {
                  for (var rule in options.jsondata.regex) {
                     options.jsondata.regex[rule] = options.jsondata.regex[rule].replace(/\\\\/g,"\\"); 
                  }
               }

               buildForm(options);
            }
         });
      }

      return false;
    }
})(jQuery);

