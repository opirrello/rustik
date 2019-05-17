function createAlertLabel(type, container, message) {
   if (Array.isArray(message.description))
        var description = '<p>'+message.description.join('</p><p>')+'</p>';
   else var description = message.description;

   if (message.title)
        var title = '<strong>'+message.title+'</strong> ';
   else var title = '';

   container.append('<div class="alert alert-'+type+'">'+title+description+'<span class="close">×</span></div>');
   container.on('click','.alert .close',function(e) {
      e.preventDefault();
      $(this).parent().remove();
   });
}
