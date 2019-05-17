(function ($) {
   $(document).ready(function() {
      $('.rform').each(function() {

         var formObj = $(this);
         var formId = formObj.attr('id');
         var formName = formObj.attr('name');
         var formAcc = (formObj.action)?formObj.action:formObj.name;

         if ( (typeof formId === typeof undefined || formId === false) &&
              (typeof formName === typeof undefined || formName === false) ) {
            throw 'Formulario RFORM sin atributos requeridos (id y/o name)';
         }
         else {
            if (typeof formId !== typeof undefined && formId !== false) 
                 var formKey = formId;
            else var formKey = formName;
         }

         formObj.parent().buildForm({
            target: formKey,
            submission: {action:formAcc}
         });
      });
   });
})(jQuery);

