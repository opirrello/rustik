(function ($) {
   $(document).ready(function() {

      var moveProgress = function(cantStep, dir) {
         var totStep  = $('.steps-container > div').length;
         var currPerc = $('.progressline').attr('data-now-value');
         var currPerc = (typeof currPerc !== 'undefined') ? currPerc * 1 : 0;
         var isTotStep= !(cantStep % 1 > 0);

         if (dir == 'fwd') { /// forward
            var newSize = currPerc + (cantStep * 100 / totStep); 
            var nextStep= $('.steps-container > div.active').next();
         }
         else if (dir == 'bwd') { /// backward
            var newSize = currPerc - (cantStep * 100 / totStep);
            var nextStep= $('.steps-container > div.active').prev();
         }

         if (isTotStep) {
            if (dir == 'fwd')
                 $('.steps-container > div.active').addClass('complete').removeClass('active');
            else $('.steps-container > div.active').removeClass('active');

            nextStep.removeClass('complete').addClass('active');
         }

         $('.progress-container .progressline').css('width', newSize +'%');
         $('.progress-container .progressline').attr('data-now-value', newSize);
      }

      if ($('#signup-form-container').length) {
         //$("#signup").alpaca(signup);

         $('#signup-form-container').buildForm({
            target: 'signup',
            jsondata: signup,
            customValidation: {
               swiftcode: function( value, element ) {
                  var regexPattern = /^[a-zA-Z0-9_-]{8,11}$/;
                  return this.optional( element ) || regexPattern.test( value );
               }
            },
            formError: {title: '', description: ''},
            formSuccess: {title: '', description: ''},
            modal:false,
            submission: {
               method:'POST', action:'/affiliates/signup', async:true,
               before: function(cont, form) {
                  var upls = JSON.parse(localStorage.getItem("filesToUpload"));
                  var frm  = document.querySelector('#signup');
                  var data = new FormData();

                  if (upls && upls.length) {
                     localStorage.removeItem("filesToUpload");

                     for(var idx in upls) {
                        var elemObj = upls[idx];

                        for (var idx2 in elemObj.files) {
                           var file64 = $('#'+elemObj.files[idx2].filecode).find('img').attr('src');
                           
                           if (typeof file64 !== 'undefined' && file64 != '')
                           data.append(elemObj.element+'[]', dataURIToBlob(file64), elemObj.files[idx2].filename); 
                        }
                     }
                  }

                  return data;
               },
               after:function(cont, form, pars, stat, spinCloser) {
                  if (pars.created) {
                     cont.parent().find('h5').text(pars.title);
                     cont.parent().append(pars.info);
                     cont.parent().removeClass('transparent');
                     //cont.find('.buildform-messagebox').prependTo(cont.parent().find('#signup-container p').eq(-1));
                     cont.remove();
                  }
                  else {
                     console.log(stat);
                     grecaptcha.reset();
                  }
                  //else form[0].reset();

                  moveProgress(1, 'fwd');
                  $("html, body").animate({ scrollTop: 0 }, "fast");
                  $('.progressline').css('width','100%');
                  spinCloser();
               }
            }
         },function() {  //// callback function to be executed after the jsonform is rendered
            $('#accept-group').appendTo($('#additional-questions'));
            $('.g-recaptcha').appendTo($('#buttons-group'));

            $('#basic-info').addClass('active-step');       
            $('#basic-info').fadeIn('slow');       
            $('#basic-info').attr('rel','st1');
            $('#billing-info').attr('rel','st2');
            $('#additional-questions').attr('rel','st3');

            $('#welcome-video').modal();

            $('#signup-elt-next').removeAttr('disabled');
            $('.steps-container .st1').addClass('active');
            moveProgress(0.5, 'fwd');

            //// traping next button clicked
            $('#signup-elt-next').on('click', function(e) {
               e.preventDefault();

               var curr_fieldset = $('fieldset.active-step');
               var valid_step = true;

               //// validation
               curr_fieldset.find('input[type="text"], input[type="password"], textarea').each(function() {
                  if ( $(this).not(':hidden').length ) {
                     if ( !$(this).valid() ) {
                        valid_step = false;
                     }
                  }
               });

               //// change active fieldset
               if (valid_step) {
                  var nextElem = curr_fieldset.next();

                  //// before hide current fieldset, check if next element is a fieldset too
                  if (nextElem.is('fieldset')) {
                     curr_fieldset.animateCss('zoomOutLeft', function(elem) {
                        // change icon
                        // move progress bar
                        moveProgress(1, 'fwd'); /// move 1 step forward

                        //// if next element is the last step (last fieldset to complete)...
                        if (!elem.next().next().is('fieldset')) {
                           $('#signup-elt-next').hide();
                           $('#signup-elt-register').css({'float':'right', 'margin-left':'15px'});
                        }

                        elem.hide();
                        elem.removeClass('active-step');
                        elem.next().animateCss('zoomInLeft');
                        elem.next().show();
                        elem.next().addClass('active-step');
                        $('#signup-elt-prev').removeAttr('disabled');
                     });
/*
                     curr_fieldset.fadeOut(400, function() {
                        // change icon
                        // move progress bar
                        moveProgress(1, 'fwd'); /// move 1 step forward

                        //// if next element is the last step (last fieldset to complete)...
                        if (!$(this).next().next().is('fieldset')) {
                           $('#signup-elt-next').hide();
                           $('#signup-elt-register').css({'float':'right', 'margin-left':'15px'});
                        }

                        $(this).next().fadeIn();
                        $(this).next().addClass('active-step');
                        $(this).removeClass('active-step');
                        $('#signup-elt-prev').removeAttr('disabled');
                     });*/
                  }
               }
            });

            $('#signup-elt-register').on('click', function(e) {
               e.preventDefault();
               initCaptcha();
            });

            //// traping prev button clicked
            $('#signup-elt-prev').on('click', function(e) {
               e.preventDefault();

               var curr_fieldset = $('fieldset.active-step');
               var prevElem = curr_fieldset.prev();

               if (prevElem.is('fieldset')) {
                  curr_fieldset.animateCss('zoomOutLeft', function(elem) {
                     moveProgress(1, 'bwd'); /// move 1 step backward

                     if (!elem.prev().prev().is('fieldset'))
                     $('#signup-elt-prev').attr('disabled','disabled');

                     elem.hide();
                     elem.removeClass('active-step');
                     elem.prev().addClass('active-step');
                     elem.prev().animateCss('zoomInLeft');
                     elem.prev().addClass('active-step');
                     elem.prev().show();
                     $('#signup-elt-register').removeAttr('style');
                     $('#signup-elt-next').show();
                  });
/*
                  curr_fieldset.fadeOut(400, function() {
                     moveProgress(1, 'bwd'); /// move 1 step backward

                     if (!$(this).prev().prev().is('fieldset'))
                     $('#signup-elt-prev').attr('disabled','disabled');

                     $(this).prev().fadeIn();
                     $(this).prev().addClass('active-step');
                     $(this).removeClass('active-step');
                     $('#signup-elt-register').removeAttr('style');
                     $('#signup-elt-next').show();
                  });*/
               }
            });
         });
      }

      $('#signup-elt-qtn8-k-cpanet_files').on('fileclear', function(event) {
         cleanFromStorage('qtn8-k-cpanet_files');
      });
      
      $('#signup-elt-qtn8-k-cpanet_files').on('filecleared', function(event) {
         cleanFromStorage('qtn8-k-cpanet_files');
      });

      $('#signup-elt-qtn8-k-cpanet_files').on('fileremoved', function(event, id, index) {
         cleanFromStorage('qtn8-k-cpanet_files', id);
      });

      $('#signup-elt-qtn8-k-cpanet_files').fileinput(defaultMultiUploadImg).on('filebatchselected', function(event, files) {
         insertIntoStorage($(this));
      });

      $('#signup-elt-qtn7-k-revenue_files').fileinput(defaultMultiUploadImg).on('filebatchselected', function(event, files) {
         insertIntoStorage($(this));
      });
      
      var insertIntoStorage = function(elem) {
         var rawdata  = localStorage.getItem('filesToUpload');
         var elemsArr = (rawdata) ? JSON.parse(rawdata):[];
         var filesArr = [];
         var elemEsta = false;

         $('.jsonform-error-'+elem.attr('name')+' .file-preview-thumbnails .kv-preview-thumb').each(function() {
            var fileObj = { 'filecode' : $(this).attr('id'), 'filename' : $(this).find('img').attr('alt') };
            filesArr.push(fileObj);

            $(this).attr('input-id', elem.attr('name'));
         });

         ///// if file was selected avoid to load it
         for(var idx in elemsArr) {
            var currEl = elemsArr[idx];

            var loadName = currEl.element;
            var currName = elem.attr('name');
            if (loadName == currName) {
               elemEsta = true;
               break;
            }
         }

         var filesList = {'element':elem.attr('name'), 'files':filesArr};

         if (elemEsta)
              elemsArr[idx] = filesList;
         else elemsArr.push(filesList);

         localStorage.setItem('filesToUpload', JSON.stringify(elemsArr));
      };

      var cleanFromStorage = function(inputCode) {
         var rawdata  = localStorage.getItem('filesToUpload');
         var elemsArr = (rawdata) ? JSON.parse(rawdata):[];
         var newArr   = [];

         if (arguments.length > 1)
              var fileCode = arguments[1];
         else var fileCode = false;

         for(var idx in elemsArr) {
            var storedElem = elemsArr[idx];
            var storedCode = storedElem.element;

            if (storedCode == inputCode) {
               if (fileCode) {
                  var newFilesArr = [];

                  for(var idx2 in storedElem.files) {
                     var storedFile = storedElem.files[idx2];

                     if (storedFile.filecode != fileCode) {
                        /// borrar entrada del file code
                        newFilesArr.push( storedFile );
                     }
                  }

                  if (newFilesArr.length < 1) {
                     elemsArr.splice(idx,1);
                  }
                  else {
                     storedElem.files = newFilesArr;
                     elemsArr[idx] = storedElem;
                  }
               }
               else {
                  /// borrar entrada del input code
                  elemsArr.splice(idx,1);
               }
            }
         }

         localStorage.setItem('filesToUpload', JSON.stringify(elemsArr));
      };
   });
})(jQuery);
