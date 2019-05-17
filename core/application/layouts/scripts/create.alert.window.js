function createAlertWindow() {
   var postData = {};
   var options = {
         type: 'info', //info - danger - warning - sucess
         text: '',
         content: '',
         title: '',
         close: true,
         tagsRebuild: '',
         translate: true,
         autoClose: true,
         idName: 'alertWindowContent',
         buttons: [ { text:'Ok', click: function(){$('#alert-window').close();} } ]
   }
   
   //************ function declaration to render alert window
   performAlert = function(text) {
      if (options.type == 'none') 
           var type = '';
      else var type = options.type;

      if (typeof options.confirmation === 'object') {
         swal({
            text: '<div '+classData+' '+idData+'>'+text+'</div>',
            html: true,
            title: options.title,
            type: type,
            className: classData,
            showCancelButton: !!options.confirmation.cancel,
            confirmButtonColor: (options.confirmation.confirmColor)?options.confirmation.confirmColor:false,
            confirmButtonText: (!!options.confirmation.confirm)?options.confirmation.confirm:"Yes, delete it!",
            cancelButtonText: (!!options.confirmation.cancel)?options.confirmation.cancel:"No, cancel pls!",
            closeOnConfirm: false,
            closeOnCancel: false
         },
         function(confirmed) {
            if (typeof options.confirmation.confirmCb === 'function') {
               if (confirmed) { 
                  options.confirmation.confirmCb();
               }
               else {
                  if (typeof options.confirmation.cancelCb === 'function')
                       options.confirmation.cancelCb();
                  else return false;
               }
            }
         });
      }
      else {
         swal({
            text: '<div '+classData+' '+idData+'>'+text+'</div>',
            html: true,
            title: options.title,
            type: type,
            className: classData
         });
      }
   }
   //********** end function
   var callback = false;

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

   var classData = (options.className!='' && options.className!=null && options.className!=undefined) ? 'class="'+options.className+'"':'';
   var idData = (options.idName!='' && options.idName!=null && options.idName!=undefined) ? 'id="'+options.idName+'"':'';
   
   if (options.translate) {
      options.text.translate(function(translated) {
         if (options.tagsRebuild)
              var text = tagsRebuild(translated, options.tagsRebuild);
         else var text = translated;

         performAlert(text);
      }); 
   }
   else {
      performAlert(options.text);
   }

   if (typeof callback === 'function')
   callback();
}
