(function ($) {
   $(document).ready(function() {
      $('#put-left').click(function(){
        $('#alin').css({'float':'left'});
      });
      $('#put-right').click(function(){
        $('#alin').css({'float':'right'});
      });
      $('#get-info').click(function(){
        $('#info').toggle();
      });
      $('#show-hide').click(function(){
        if ($('#alin table').is(':visible')){
           $('#alin table').hide();
           $(this).text('+');
        } 
        else{
           $('#alin table').show();
           $(this).text('-');
        }
      });
    });
})(jQuery);
