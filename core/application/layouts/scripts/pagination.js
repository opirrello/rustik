/*********************************************
  BuildForm plugin
  Rustic framework plugin v1.0

  main initialization: line 363

*********************************************/
(function ($) {
   $.fn.pagination = $.fn.pagination = function(opt) {
      var $this = this;
      var options = {
         url: false,
         spin: false,
         pageLayout: false,
         itemBuilder: false,
         afterPaging: false,
         beforePaging: false,
         offStyle: 'off',
         getFiltering: function() { return false },
         queryElement: false,
         orderElement: false,
         orientElement: false,
         orientSelectedClass: 'selected'
      };

      $.extend(options, opt);

      var currClass = $(this).attr('class');

      if (!options.itemBuilder)
      return false;

      var list_container = this;
      var searchElt = (options.queryElement) ? options.queryElement : this.find('.'+currClass+'-search');
      //var headerElt = this.find('.'+currClass+'-controls');
      var orienElt  = (options.orientElement) ? options.orientElement : this.find('.orientation');
      var ordbyElt  = (options.orderElement) ? options.orderElement : false;
      var listElt   = (options.listElement) ? options.listElement : this.find('.'+currClass+'-list');
      var pagesElt  = this.find('.'+currClass+'-pages');

      /// defining orderby elements and handling method
      if (ordbyElt.length) {
         var eltObj  = ordbyElt;
         var eltType = eltObj.length ? eltObj.get(0).tagName : '';
      }
      else {
         var eltObj  = list_container.find('.orderby');
         var eltType = eltObj.length ? eltObj.get(0).tagName : '';
         //var lstType = listElt.get(0).tagName;
      }

      if (eltType == 'SELECT') {
         this.find('.orderby').change(function() {
            handleOrderBy(eltObj.find(':selected'));
         });
      }
      else if (eltType == 'INPUT' && eltObj.attr('type') == 'radio') {
         this.find('.orderby').change(function() {
            handleOrderBy(list_container.find('.orderby:checked'));
         });
      }
      else {
         this.find('.ord').click(function() {
            handleOrderBy($(this));
         });
      }

      handleOrderBy = function(el) {
         if (orienElt.length && !el.hasClass(options.orientSelectedClass)) {
            return;
         }

         /// if orientation is handled in other element...
         if (orienElt.length) {
            var orderby = getOrderBy();
            var orient = orienElt.find('.' + options.orientSelectedClass).attr('rel');
         }
         else {
            var ordori = el.attr('rel').split(':');
            var orderby = ordori[0];
            var orient = ordori[1];
         }

         $('.ord.selected').removeClass('selected');
         el.addClass('selected');

         var page = pagesElt.find('.page.current').text();

         getResults(page, orderby, orient);
      }

      var getOrderBy = function(el) {
         var eltValue= false;

         if (eltType == 'SELECT') {
            var eltValue = eltObj.find(':selected').val();
         }
         else if (eltType == 'INPUT' && eltObj.attr('type') == 'radio') {
            var eltValue = list_container.find('.orderby:checked').val();
         }
         else if (eltType == 'LI') {
            var eltValue = list_container.find('.orderby.selected').attr('rel');
         }
         else var eltValue = eltObj.text();

         return eltValue;
      }

      function getResults(page, orderby, orient) {
         var filters = options.getFiltering();

         var queryObj = searchElt.find('.query');
         var queryTyp = queryObj.get(0).tagName;

         if (arguments.length > 3)
              var callback = arguments[3];
         else var callback = false;

         if (queryTyp == 'INPUT')
              var query = queryObj.val();
         else var query = queryObj.text();

         $.ajax({
            type: 'post',
            dataType: 'json',
            url:options.url,
            data:{query:query, orderby:orderby, orient:orient, page:page, filters:filters, get_as:'json'},
            beforeSend: function() { $('body').startSpin(options.spin); },
            success: function(response) {
               if (options.beforePaging) {
                  options.beforePaging(response);
               }

               if (response.results && response.results.length) {
                  var list = listElt.find('rows-container');
                  var filt = (response.filtering !== null);

                  if (!list.length) 
                  list = listElt;

                  /// cleaning current list and rendering new results
                  list.empty();

                  for (var i in response.results) {
                     var it = options.itemBuilder(response.results[i], filt, response);
                     list.append(it);
                  }
               }

               if (options.afterPaging) {
                  options.afterPaging(response);
               }

               if (response.pagination)
               encodePgnData(response.pagination);

               resetShortcuts(page);

               $('body').stopSpin();
               
               if (callback)
               callback(response);
            },
            error: function(xhr, stat, error) { $('body').stopSpin(); }
         });
      }

      function encodePgnData(arrData) {
         var pgSerial = 'nr:' + arrData.num_rows + '::' +
                        'np:' + arrData.num_pages + '::' +
                        'rpp:'+ arrData.rows_per_page + '::' +
                        'ppg:'+ arrData.pages_per_group + '::' +
                        'cp:' + arrData.curr_page + '::' +
                        'fp:' + arrData.first_page;

         pagesElt.attr('rel',pgSerial);
      }

      function parsePgnData(strData) {
         var dataArr = strData.split('::');
         var dataObj = {};

         for(var i=0; i<dataArr.length; i++) {
            var itemArr = dataArr[i].split(':');
            dataObj[itemArr[0]] = itemArr[1];
         }

         return dataObj;
      }

      function resetShortcuts(page) {
         if (!pagesElt.length)
         return false;

         var nextBtn = pagesElt.find('.shortcut.next');
         var lastBtn = pagesElt.find('.shortcut.last');
         var firstBtn= pagesElt.find('.shortcut.first');
         var prevBtn = pagesElt.find('.shortcut.prev');

         var pgdata = parsePgnData(pagesElt.attr('rel'));
         var currp  = pagesElt.find('.page.current').text();
         var currg  = Math.ceil(currp / pgdata.ppg); 

         var gotop  = page;
         var gotog  = Math.ceil(gotop / pgdata.ppg);
         var cantg  = Math.ceil(pgdata.np / pgdata.ppg);
         
         ////// try to identify current page container (li, a, label, etc.)
         //var pagLayout = pagesElt.find('.page').get(0).tagName.toLowerCase();
         var pagClone  = pagesElt.find('.page').first().clone().removeClass('current');
         var pagGroup  = pagesElt.find('.page');
         var pagParent = pagGroup.parent();

         /// changing group of pages (new values)
         var indic = gotog * pgdata.ppg;
         var limit = (indic > pgdata.np) ? pgdata.ppg - (indic - pgdata.np) : pgdata.ppg;

         /// cleaning current page container
         pagGroup.remove();

         for (var i=0; i < limit; i++) {
            var pag = (pgdata.ppg * gotog) - (pgdata.ppg - 1) + i;
            var act = (pag == gotop) ? 'current':'';
            var obj = pagClone.clone();
            
            obj.text(pag);
            obj.attr('rel', pag);
            obj.addClass(act);

            pagParent.append(obj);
         }

         /// setting first/prev buttons
         if (gotog != 1) {
            firstBtn.attr('rel', pgdata.fp);
            prevBtn.attr ('rel', (gotog - 2) * pgdata.ppg + 1);
            firstBtn.removeClass(options.offStyle);
            prevBtn.removeClass(options.offStyle);
         }
         else {
            firstBtn.attr('rel','');
            prevBtn.attr ('rel','');
            firstBtn.addClass(options.offStyle);
            prevBtn.addClass(options.offStyle);
         }

         /// setting next/last buttons
         if (gotog != cantg) {
            lastBtn.attr('rel', pgdata.np);
            nextBtn.attr('rel', (gotog * pgdata.ppg) + 1);
            lastBtn.removeClass(options.offStyle);
            nextBtn.removeClass(options.offStyle);
         }
         else {
            lastBtn.attr('rel','');
            nextBtn.attr ('rel','');
            lastBtn.addClass(options.offStyle);
            nextBtn.addClass(options.offStyle);
         }
      }

      //// Get results by page
      ////only handle shortcut without 'disabled' style
      pagesElt.find('.shortcut').click(function() {
         if ($(this).hasClass(options.offStyle))
         return false;

         if (orienElt.length) {
            var orient = orienElt.find('.' + options.orientSelectedClass).attr('rel');
            var orderby = getOrderBy();
         }
         else {
            var ordori = $('.ord.selected').attr('rel').split(':');
            var orderby = ordori[0];
            var orient = ordori[1];
         }

         getResults($(this).attr('rel'), orderby, orient);
      });
      
      //// Get results by page
      pagesElt.on('click','.page',function() {
         if (!$(this).hasClass('current')) {

            if (orienElt.length) {
               var orient = orienElt.find('.' + options.orientSelectedClass).attr('rel');
               var orderby = getOrderBy();
            }
            else {
               var ordori = $('.ord.selected').attr('rel').split(':');
               var orderby = ordori[0];
               var orient = ordori[1];
            }

            var query  = searchElt.find('.query').text();
            var filters= options.getFiltering();
            var curr   = pagesElt.find('.page.current').text();
            var page   = $(this).text();

            pagesElt.find('.page.current').removeClass('current');
            $(this).addClass('current');

            getResults(page, orderby, orient);
         }
      });

      //// Get results by orientation
      orienElt.find('li').click(function() {
         if (!$(this).hasClass(options.orientSelectedClass)) {
            var orient = $(this).attr('rel');
            var orderby= getOrderBy();
            var page   = pagesElt.find('.page.current').text();

            $('.orientation li').removeClass(options.orientSelectedClass);
            $(this).addClass(options.orientSelectedClass);

            getResults(page, orderby, orient);
         }
      });

      $this.paginate = function(page) {
         if (orienElt.length) {
            var orient = orienElt.find('.' + options.orientSelectedClass).attr('rel');
            var orderby = getOrderBy();
         }
         else {
            var ordori = $('.ord.selected').attr('rel').split(':');
            var orderby = ordori[0];
            var orient = ordori[1];
         }

         pagesElt.find('.page').each(function() {
            if (!$(this).hasClass('current')) {
               if (options.pageLayout) {
                  //-- used to identify html object if some layout for page is defined
                  var auxHtml = $(options.pageLayout);
                  var auxType = auxHtml.get(0).tagName.toLowerCase();
                  var seen    = $(this).find(auxType).text();
               }
               else {
                  var seen = $(this).text();
               }

               var curr = pagesElt.find('.page.current').text();

               if (seen == page) {
                  pagesElt.find('.page.current').text('');
                  pagesElt.find('.page.current').append( ((options.pageLayout)?options.pageLayout.replace('%1',page):page) );
                  pagesElt.find('.page.current').removeClass('current');

                  $(this).html(page);
                  $(this).addClass('current');
               }
            }
         });

         if (arguments.length > 1)
              getResults(page, orderby, orient, arguments[1]);
         else getResults(page, orderby, orient);
      };

      return $this;
   }
})(jQuery);
