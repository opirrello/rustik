(function ($) {
    $.buildSpin = $.fn.startSpin = function() {
      var options = {
         lines: 12, // The number of lines to draw
         length: 25, // The length of each line
         width: 10, // The line thickness
         radius: 25, // The radius of the inner circle
         opacity: 0.25,
         top:'50%',
         left:'50%',
         color: '#000', // #rbg or #rrggbb
         speed: 1, // Rounds per second
         trail: 50, // Afterglow percentage
         shadow: false, // Whether to render a shadow
         position: 'fixed'
      };

      var withOpt = false;
      var callback= false;
        
      if (arguments.length > 3) return false;
      else if (arguments.length == 1) {
         if (typeof arguments[0] === 'object') {
            $.extend(options, arguments[0]);
            withOpt = true;
         }
         else if (typeof arguments[0] === 'function') {
            callback = arguments[0];
         }
      }
      else if (arguments.length >= 2) {
         if (typeof arguments[1] === 'object') {
            $.extend(options, arguments[1]);
            withOpt = true;

            if (arguments.length == 3) {
               if (arguments[2] === 'function')
               callback = arguments[2];
            }
         }
         else if (typeof arguments[1] === 'function') {
            callback = arguments[1];
         }
      }

      if (!withOpt && defaultSpinOptions && typeof defaultSpinOptions === 'object') $.extend(options, defaultSpinOptions);

      if (arguments.length == 2) 
           var target = arguments[0];
      else var target = $(this);

      //------------------ check spinner exists for this element ---------------//
      if (target.find('.spinner-container').length) { return; }

      spinner = new Spinner(options).spin();

      target.append('<div class="spinner-container"></div>');
      target.append('<div class="spinner-overlay"></div>');

      target.find('.spinner-overlay').fadeIn(200, function(){
        target.find('.spinner-container').append(spinner.el);
      });
    };

    $.stopSpin = $.fn.stopSpin = function() {
      var callback= false;

      if (arguments.length > 2) return false;
      else if (arguments.length >= 1) {
         if (typeof arguments[0] === 'object') {
            var target = arguments[0];

            if (arguments.length == 2) {
               if (arguments[1] === 'function')
               callback = arguments[1];
            }
         }
         else if (typeof arguments[0] === 'function') {
            var target = $(this);
            callback = arguments[0];
         }
      }
      else var target = $(this);

      if (arguments.length > 2) return false;
      else if (arguments.length >= 1 && typeof arguments[0] === 'object')
              var target = arguments[0];
         else var target = $(this);

      //------------- check spinner don't exists for this element ------------//
      if (!target.find('.spinner-container').length) { return; }

      if (typeof spinner == 'object')
      spinner.stop();

      target.find('.spinner-overlay').fadeOut(400, function(){
         target.find('.spinner-container').remove();
         target.find('.spinner-overlay').remove();
         spinner = false;
         
         if (callback)
         callback();
         //delete spinner;
      });
    };
})(jQuery);

