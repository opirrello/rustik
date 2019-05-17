(function ($) {
   $(document).ready(function() {
      filterStruct = {};
      offerSetting = {offers_in_row: {2:{css:'col-md-5'}, 3:{css:'col-md-4'}, 4:{css:'col-md-3'}}};
      offerRows    = 0;

      //-------------------------- Handling offer detail --------------------------//
      $('#offerwall-container').on('click','.categs a',function(e) {
         e.preventDefault();

         var catId = $(this).attr('rel');

         //--------- checking current clicked categ in offer panel & unchecking other categs
         $('#categories a').each(function() {
            var currCatId = $(this).attr('rel');

            if (currCatId == catId) {
               $(this).find('i').removeClass('icon-checkbox-unchecked');
               $(this).find('i').addClass('icon-checkbox-checked');
            }
            else {
               $(this).find('i').removeClass('icon-checkbox-checked');
               $(this).find('i').addClass('icon-checkbox-unchecked');
            }
         });

         //--------- cleaning all categories stored in filterStruct & adding only current categ
         filterClear('categories');
         filterAdd('categories', catId, true);

         showResults();
      });

      $('#offerwall-container').on('click','.opers a',function(e) {
         e.preventDefault();

         var opeId = $(this).attr('rel');

         //--------- checking current clicked oper in offer panel & unchecking other opers
         $('#operators').val(opeId);
         $('#operators').trigger('change');
         /*
         $('#operators a').each(function() {
            var currOpeId = $(this).attr('rel');

            if (currOpeId == opeId) {
               $(this).find('i').removeClass('icon-checkbox-unchecked');
               $(this).find('i').addClass('icon-checkbox-checked');
            }
            else {
               $(this).find('i').removeClass('icon-checkbox-checked');
               $(this).find('i').addClass('icon-checkbox-unchecked');
            }
         });*/

         //--------- cleaning all categories stored in filterStruct & adding only current categ
         filterClear('operators');
         filterAdd('operators', opeId, true);

         showResults();
      });

      $('#offerwall-container').on('click','.deviceos a',function(e) {
         e.preventDefault();

         var osId = $(this).attr('rel');

         //--------- checking current clicked operatingsystem in offer panel & unchecking other operatingsystems
         $('#deviceos').val(osId);
         $('#deviceos').trigger('change');
         /*
         $('#operatingsystems a').each(function() {
            var currOsId = $(this).attr('rel');

            if (currOsId == osId) {
               $(this).find('i').removeClass('icon-checkbox-unchecked');
               $(this).find('i').addClass('icon-checkbox-checked');
            }
            else {
               $(this).find('i').removeClass('icon-checkbox-checked');
               $(this).find('i').addClass('icon-checkbox-unchecked');
            }
         });*/

         //--------- cleaning all categories stored in filterStruct & adding only current categ
         filterClear('deviceos');
         filterAdd('deviceos', osId, true);

         showResults();
      });

      $('#offerwall-container').on('click','#close-detail',function(e) {
         e.preventDefault();

         if ($('.content-wrapper').find('.detail').length) {
            $('.content-wrapper').find('.detail').animateCss('fadeOut', function(elem) {
              $('#close-detail').parent().parent().hide();

              $('#offerwall-container').find('.filter-control').attr('data-fab-state','close');
              elem.remove();

              $('.content-wrapper').find('.resultados').animateCss('fadeIn');
              $('.content-wrapper').find('.resultados').show();

              history.pushState(null, "", urlBeforeDetail);
              urlBeforeDetail = false;
            });
         }

         return false;
      });

      //-------------------------- Retriving offer detail --------------------------//
      $('#offerwall-container').on('click','.show-detail',function(e) {
         e.preventDefault();

         var url = $(this).attr('href');
         urlBeforeDetail = window.location.pathname;
         history.pushState(null, "", url);

         $.ajax({  
             type: 'POST',
             url: url,
             dataType:'json',
             beforeSend: function() { $('body').startSpin(); },
             success: function(response) {
                if (response.offer) {
                   pixelData = {};
                   graphdata = JSON.parse(response.offer.graphdata);

                   var detailCont = document.createElement('div');
                   detailCont.setAttribute('class','detail');

                   //------------------ SETTING FLYING CLOSE ICON ----------------
                   /*
                   var closeCont = document.createElement('ul');
                   var closeItem = document.createElement('li');
                   var closeLink = document.createElement('a');
                   var closeIcon = document.createElement('i');
                   closeCont.setAttribute('class','close fab-menu fab-menu-absolute fab-menu-top-right affix-top');
                   closeIcon.setAttribute('class','fab-icon-open icon-arrow-right16');
                   closeLink.setAttribute('class','fab-menu-btn btn bg-blue btn-float btn-rounded btn-icon');
                   closeLink.setAttribute('data-popup','tooltip');
                   closeLink.setAttribute('data-placement','bottom');
                   closeLink.setAttribute('title','Return to Offerwall');
                   closeLink.setAttribute('href','#');
                   closeLink.setAttribute('id','close-detail');

                   closeLink.appendChild(closeIcon);
                   closeItem.appendChild(closeLink);
                   closeCont.appendChild(closeItem);
                   detailCont.appendChild(closeCont);*/
                   
                   //------------------ SETTING MAIN PANEL -----------------------
                   var detPanel= document.createElement('div');
                   var detBody = document.createElement('div');
                   detPanel.setAttribute('class','panel');
                   detBody.setAttribute('class','panel-body');

                   //--- THUMBNAIL & STATS
                   var rowCreat  = document.createElement('div');
                   var creatCol1 = document.createElement('div');
                   var creatCol2 = document.createElement('div');
                   rowCreat.setAttribute('class','main row');
                   creatCol1.setAttribute('class','col-md-4');
                   creatCol2.setAttribute('class','col-md-8');

                   //--- COL 1 (thumb)
                   var thumb = document.createElement('img');
                   thumb.setAttribute('class','offer-thumb img-responsive');
                   thumb.setAttribute('src',  response.offer.thumbnail_url);
                   thumb.setAttribute('alt',  response.offer.name);
                   thumb.setAttribute('title',response.offer.name);
                   creatCol1.appendChild(thumb);
                   rowCreat.appendChild(creatCol1);

                   //--- COL 2 (stats)
                   // stats
                   var extCont = document.createElement('div');
                   var extList = document.createElement('ul');
                   extList.setAttribute('class','extras list-inline content-group');

                   for (var i=0; i<response.offer.extras.length; i++) {
                      var item = document.createElement('li');
                      var link = document.createElement('a');

                      if (response.offer.extras[i].attributes) {
                         for(var x in response.offer.extras[i].attributes) {
                            var attr = response.offer.extras[i].attributes[x].attr;
                            var val  = response.offer.extras[i].attributes[x].value;
                            link.setAttribute(attr, val);
                         }
                      }

                      link.appendChild(document.createTextNode(response.offer.extras[i].name));
                      item.appendChild(link);  
                      extList.appendChild(item);  
                   }

                   extCont.appendChild(extList);

                   // graph
                   var graphCont = document.createElement('div');
                   graphCont.setAttribute('id','barchart-container');

                   creatCol2.appendChild(extCont);
                   creatCol2.appendChild(graphCont);
                   rowCreat.appendChild(creatCol2);
                   detBody.appendChild(rowCreat);   ///// append to main body panel
                   
                   //--- OFFER BASICS & CATEGORIES
                   var rowBasic = document.createElement('div');
                   var infoCont = document.createElement('div');
                   var offTitle = document.createElement('h3');
                   offTitle.setAttribute('class','text-semibold mb-5');
                   rowBasic.setAttribute('class','row');

                   // name
                   offTitle.appendChild(document.createTextNode(response.offer.name));
                   rowBasic.appendChild(offTitle);
                   
                   // id & categs
                   var idCont = document.createElement('span');
                   var catList= document.createElement('ul');
                   catList.setAttribute('class','categs list-inline content-group');

                   idCont.appendChild(document.createTextNode('ID: '+response.offer.cpa_id));

                   for (var i=0; i<response.offer.categories.length; i++) {
                      var item = document.createElement('li');
                      var link = document.createElement('a');

                      link.setAttribute('href','#');
                      link.setAttribute('rel',response.offer.categories[i].id);
                      link.appendChild(document.createTextNode(response.offer.categories[i].name));

                      item.appendChild(link);  
                      catList.appendChild(item);  
                   }

                   infoCont.appendChild(idCont);
                   infoCont.appendChild(catList);
                   rowBasic.appendChild(infoCont);
                   detBody.appendChild(rowBasic);   ///// append to main body panel
                   detPanel.appendChild(detBody);   ///// append to main panel
                   detailCont.appendChild(detPanel);///// append to main container

                   //------------------ SETTING TERMS PANEL -----------------------
                   var termsPanel= document.createElement('div');
                   var termsHead = document.createElement('div');
                   var termsBody = document.createElement('div');
                   termsPanel.setAttribute('class','panel panel-flat');
                   termsHead.setAttribute('class','panel-heading');
                   termsBody.setAttribute('class','panel-body');

                   //---- heading
                   var title = document.createElement('h6');
                   title.setAttribute('class','panel-title');
                   title.appendChild(document.createTextNode('Terms & Conditions'));
                   termsHead.appendChild(title);

                   //---- body
                   termsBody.innerHTML = response.offer.terms; //(document.createTextNode(response.offer.terms));
                   termsPanel.appendChild(termsHead);
                   termsPanel.appendChild(termsBody);
                   detailCont.appendChild(termsPanel);///// append to main container
                   
                   //------------------ SETTING CREATIVES PANEL -----------------------
                   var creatPanel= document.createElement('div');
                   var creatHead = document.createElement('div');
                   var creatBody = document.createElement('div');
                   creatPanel.setAttribute('class','panel panel-flat');
                   creatHead.setAttribute('class','panel-heading');
                   creatBody.setAttribute('class','panel-body');
                   
                   //---- heading
                   var title = document.createElement('h6');
                   title.setAttribute('class','panel-title');
                   title.appendChild(document.createTextNode('Creatives'));
                   creatHead.appendChild(title);

                   //---- body
                   if (response.offer.creatives.length) {
                      var crtList= document.createElement('ul');
                      crtList.setAttribute('class','list-icons creatives');

                      for (var i=0; i<response.offer.creatives.length; i++) {
                         var item = document.createElement('li');
                         var link = document.createElement('a');

                         link.setAttribute('href',response.offer.creatives[i].creative_link);
                         link.appendChild(document.createTextNode('Here'));
                         item.appendChild(document.createTextNode(response.offer.creatives[i].creative_name));
                         item.appendChild(link);  
                         crtList.appendChild(item);  
                      }

                      creatBody.appendChild(crtList);
                   }
                   else {
                      var crtEmpty= document.createElement('div');
                      crtEmpty.setAttribute('class','alert alert-info');
                      crtEmpty.appendChild(document.createTextNode('There are no creatives for this offer'));
                      creatBody.appendChild(crtEmpty);
                   }

                   creatPanel.appendChild(creatHead);
                   creatPanel.appendChild(creatBody);
                   detailCont.appendChild(creatPanel);///// append to main container

                   //------------------ SETTING PIXEL PANEL -----------------------
                   var pixelPanel= document.createElement('div');
                   var pixelHead = document.createElement('div');
                   var pixelBody = document.createElement('div');
                   pixelPanel.setAttribute('class','panel panel-flat panel-pixel');
                   pixelHead.setAttribute('class','panel-heading');
                   pixelBody.setAttribute('class','panel-body');
                   
                   //---- heading
                   var title = document.createElement('h6');
                   var addPx = document.createElement('a');
                   var icoPx = document.createElement('i');

                   title.setAttribute('class','panel-title');
                   title.appendChild(document.createTextNode('Pixels'));
                   pixelHead.appendChild(title);

                   //addPx.setAttribute('data-toggle','modal');
                   //addPx.setAttribute('data-target','#offer-modal-pixel');
                   icoPx.setAttribute('class','icon icon-plus2');
                   addPx.setAttribute('class','btn-xs btn-success');
                   addPx.setAttribute('id','add-pixel');
                   addPx.setAttribute('title','Add new pixel');
                   addPx.setAttribute('alt','Add new pixel');
                   addPx.setAttribute('rel',response.offer.cpa_id);
                   addPx.appendChild(icoPx);
                   addPx.appendChild(document.createTextNode('Add new pixel'));
                   pixelHead.appendChild(addPx);

                   newpixel = JSON.parse(response.offer.jsonforms.newpixel);
                   editpixel= JSON.parse(response.offer.jsonforms.editpixel);

                   //---- body
                   var pxlList= document.createElement('ul');
                   pxlList.setAttribute('class','list-icons pixels');

                   for (var i=0; i<response.offer.pixels.length; i++) {
                      pixelData[response.offer.pixels[i].id] = response.offer.pixels[i];

                      var item = buildPixelItem( response.offer.pixels[i] );
                      pxlList.appendChild(item);  
                   }

                   pixelBody.appendChild(pxlList);
                   pixelPanel.appendChild(pixelHead);
                   pixelPanel.appendChild(pixelBody);
                   detailCont.appendChild(pixelPanel);///// append to main container
                   
                   $('.content-wrapper').append($(detailCont));
                   var hayDetail = true;
                }
                else var hayDetail = false;

                $('body').stopSpin();

                if (hayDetail) {
                   $('.content-wrapper').find('.resultados').animateCss('fadeOut', function(elem) {
                        elem.hide();

                        $('.content-wrapper').find('.detail').animateCss('fadeIn', function(elem){
                           $('.close').show();
                           $('#close-detail').parent().parent().show();
                           $('#close-detail').tooltip();

                           setTimeout(function() {
                              $('#offerwall-container').find('.filter-control').attr('data-fab-state','open');
                           }, 1);
                        });

                        $('.content-wrapper').find('.detail').show();
                        createGraph();
                   });
                }
             }
         });

         return false;
      });

      //-------------------------- Handling filter boxes --------------------------//
      // Calculate min height
      function containerHeight() {
         var availableHeight = $(window).height() - $('.page-container').offset().top - $('.navbar-fixed-bottom').outerHeight();
         $('.page-container').attr('style', 'min-height:' + availableHeight + 'px');
      }

      // Initialize
      containerHeight();

      // Toogle sidebar
         
      $('#hide-filters').tooltip();

      $(document).on('click', '#hide-filters', function (e) {
         var __this = $(this);
         e.preventDefault();

         $('.sidebar-main').toggle('slow',function() {
           if ($(this).is(':visible')) {
              regroupOffers(3);
              __this.find('i').removeClass('icon-indent-increase2').addClass('icon-indent-decrease2');
              __this.attr('data-original-title', 'Hide Filters');
              $('.tooltip-inner').text('Hide Filters');
           }
           else{
              regroupOffers(4);
              __this.find('i').removeClass('icon-indent-decrease2').addClass('icon-indent-increase2');
              __this.attr('data-original-title', 'Show Filters');
              $('.tooltip-inner').text('Show Filters');
           }
         });
      });

      // Hide if collapsed by default
      $('.category-collapsed').children('.category-content').hide();
      $('.category-collapsed').find('[data-action=collapse]').addClass('rotate-180');

      $('.category-title [data-action=collapse]').click(function (e) {
         e.preventDefault();
         var $categoryCollapse = $(this).parent().parent().parent().nextAll();
         $(this).parents('.category-title').toggleClass('category-collapsed');
         $(this).toggleClass('rotate-180');

         containerHeight(); // adjust page height
         $categoryCollapse.slideToggle(150);
      });
      
      //----------- styling checkbox as iOS switch --------------
      if ($('.switchery').length) {
         var elems = Array.prototype.slice.call(document.querySelectorAll('.switchery'));

         elems.forEach(function(elem) {
            var rgb = $('.switchery').css('color').match(/\d+/g);
            var hex = '#'+ String('0' + Number(rgb[0]).toString(16)).slice(-2) +
                           String('0' + Number(rgb[1]).toString(16)).slice(-2) +
                           String('0' + Number(rgb[2]).toString(16)).slice(-2);
            var switchery = new Switchery(elem, {color: hex});

            /// triggering search if element is checked ///
            elem.onclick = function() {
              if (elem.checked)
                   filterAdd('options', elem.name, elem.value);
              else filterDel('options', elem.name);

              showResults();
            };
         });
      }

      //---------- catching events related to filters ----------------------
      var frmtRes = function(country) {
         if (!country.id) {
            return country.text;
         }
        
         var $country = $('<span>' + country.text + ' <label>' + $(country.element).attr('rel') + '</label></span>');
         return $country;
      };

      var frmtSel = function(country) {
         if (!country.id) {
            return country.text;
         }
        
         var $country = $('<span class="choice-cont" rel="'+ country.id +'">' + country.text + ' <label>' + $(country.element).attr('rel') + '</label></span>');
         return $country;
      };

      $('#show-rows').select2({ minimumResultsForSearch: Infinity, width: 'auto' });
      $('#show-rows').on('select2:select', function(e) { pagHandler.paginate(1); });

      $('#orderby').select2({ minimumResultsForSearch: Infinity });
      $('#paytypes').select2({ minimumResultsForSearch: Infinity, placeholder:'Filter by some payout types' });
      $('#countries').select2({ minimumResultsForSearch: Infinity, placeholder:'Filter by some countries', templateResult:frmtRes, templateSelection:frmtSel, containerCssClass:'with-pill' });
      $('#operators').select2({ minimumResultsForSearch: Infinity, placeholder:'Filter by mobile operator', templateResult:frmtRes, templateSelection:frmtSel, containerCssClass:'with-pill' });
      $('#deviceos').select2({ minimumResultsForSearch: Infinity, placeholder:'Filter by operating system', templateResult:frmtRes, templateSelection:frmtSel, containerCssClass:'with-pill' });
      $(".control-primary").uniform({ radioClass:'choice', wrapperClass:'payouttype countries operators deviceos border-primary-600 text-primary-800' });
      $(".switch").bootstrapSwitch();

      $('#orderby').on('select2:select', function(e) {
         showResults();
         return false;
      });

      $('#orient li a').click(function() {
         $('#orient li.active').removeClass('active');
         $(this).parent().addClass('active');

         showResults();
         return false;
      });

      /// triggering search when payout types are selected / unselected ///
      //$('#paytypes').val(['PER_MILE', 'PER_CLICK']);
      //$('#paytypes').trigger('change'); 
      $('#paytypes').on('select2:select', function(e) {
         var data = e.params.data;
         filterAdd('payouttypes', data.id, true);
 
         showResults();
         return false;
      });
      
      $('#paytypes').on('select2:unselect', function(e) {
         var data = e.params.data;
         filterDel('payouttypes', data.id);

         showResults();
         return false;
      });

      /// triggering search when country filter is changed (add or remove) ///
      $('#countries').on('select2:select', function(e) {
         var data = e.params.data;
         filterAdd('countries', data.id, true);
 
         showResults();
         return false;
      });
      
      $('#countries').on('select2:unselect', function(e) {
         var data = e.params.data;
         filterDel('countries', data.id);

         showResults();
         return false;
      });

      /// triggering search when operator filter is changed (add or remove) ///
      $('#operators').on('select2:select', function(e) {
         var data = e.params.data;
         filterAdd('operators', data.id, true);
 
         showResults();
         return false;
      });
      
      $('#operators').on('select2:unselect', function(e) {
         var data = e.params.data;
         filterDel('operators', data.id);

         showResults();
         return false;
      });

      /// triggering search when operatingsystem filter is changed (add or remove) ///
      $('#deviceos').on('select2:select', function(e) {
         var data = e.params.data;
         filterAdd('deviceos', data.id, true);
 
         showResults();
         return false;
      });
      
      $('#deviceos').on('select2:unselect', function(e) {
         var data = e.params.data;
         filterDel('deviceos', data.id);

         showResults();
         return false;
      });

      /// triggering search when category filter is changed (add or remove) ///
      $('#categories').on('click',' li a', function() {
         var catId = $(this).attr('rel');
         var stat  = ($(this).find('i').hasClass('icon-checkbox-checked')) ? 'checked':'unchecked';

         if (stat == 'checked') {
            $(this).find('i').removeClass('icon-checkbox-checked');
            $(this).find('i').addClass('icon-checkbox-unchecked');
            filterDel('categories', catId);
         }
         else {
            $(this).find('i').removeClass('icon-checkbox-unchecked');
            $(this).find('i').addClass('icon-checkbox-checked');
            filterAdd('categories', catId, true);
         }

         showResults();
         return false;
      });

      $('#query').keyup(function() {
         var searchText = $(this).val();

         if (searchText.length > 3 || searchText.length == 0) {
            showResults();
         }

         return false;
      });
      
      //---------- functions to handle filters & handle request to retrieve results -----------
      regroupOffers = function(indicator) {
         var offerlist = $('.resultados-list .row').children();
         var token = 0;

         $('.resultados-list .row').remove();

         //for(idx in offerlist) {
         offerlist.each(function(idx, item) {
            $(item).removeClass();
            $(item).addClass(offerSetting.offers_in_row[indicator].css);

            if (!token || token == indicator) {
               if (token > 0) {
                  $('.resultados-list').append(row);
               }

               row = $('<div class="row"></div>');
               token = 0;
            }

            row.append(item);
            token++;
         });

         if (token)
         $('.resultados-list').append(row);
      }

      filterClear = function(type) {
         if (!type)
              filterStruct = {};
         else delete filterStruct[type];
      }

      filterAdd = function(type, elem, value) {
         if (filterStruct.hasOwnProperty(type))
              var filterElems = filterStruct[type];
         else var filterElems = {};

         filterElems[elem] = value;
         filterStruct[type]= filterElems;
      }

      filterDel = function(type, elem) {
         if (filterStruct.hasOwnProperty(type))
         var filterElems = filterStruct[type];

         delete filterElems[elem];
         filterStruct[type]= filterElems;
      }

      showResults = function() {
         if ($('.content-wrapper').find('.detail').length) {
            $('.content-wrapper').find('.detail').animateCss('fadeOut', function(elem) {
              $('#close-detail').parent().parent().hide();

              $('#offerwall-container').find('.filter-control').attr('data-fab-state','close');
              elem.remove();

              pagHandler.paginate(1, function() {
                 $('.content-wrapper').find('.resultados').animateCss('fadeIn');
              });
            });
         }
         else {
            pagHandler.paginate(1, updateFilters);
         }
      }

      updateFilters = function(resp) {
         var conditions = resp.filters.conditions;

         for (var condKey in conditions) {
            var condIds = conditions[condKey];
            var selIds  = [];

            if (condKey == 'categories') {
               $('#'+condKey+' li a .icon-checkbox-checked').each(function() { selIds.push($(this).parent().attr('rel')); });
               $('#'+condKey+' li').remove();

               for (var condId in condIds) {
                  var realId = condId.substring(2);

                  if (condIds[condId].cant > 0) {
                     var opt = $('<li><a href="#" rel="'+ realId +'">'+
                                 '<span class="text-muted text-size-small text-regular pull-right">'+ condIds[condId].cant +'</span>'+
                                 '<i></i>'+ condIds[condId].text +
                                 '</a></li>');

                     if ($.inArray(realId, selIds) != -1)
                          opt.find('i').addClass('icon-checkbox-checked');
                     else opt.find('i').addClass('icon-checkbox-unchecked');

                     $('#'+condKey).append( opt );
                  }
               }
            }
            else {
               $('#'+condKey+' > option:selected').each(function() { selIds.push($(this).val()); });
               $('#'+condKey+ '> option').remove();
   
               for (var condId in condIds) {
                  if (condId.indexOf('id') != -1)
                       var realId = condId.substring(2);
                  else var realId = condId;

                  if (condIds[condId].cant > 0) {
                     var opt = $('<option rel="'+ condIds[condId].cant +'" value="'+ realId +'">'+
                                 condIds[condId].text +
                                 '</option>');
   
                     if ($.inArray(realId, selIds) !== -1)
                          opt.attr('selected', true);
                     else opt.attr('selected', false);
   
                     $('#'+condKey).append( opt );
                  }
               }
            }
         }
      };

      //////////////// function to be used in $.pagination plugin ///////////////////
      var settingColumnsAndPages = function(response) {
         var pagesList = $('.resultados-pages span a');

         if (response.pagination) {
            if (pagesList.length > response.pagination.num_pages) 
            pagesList.slice(response.pagination.num_pages).remove();

            if (response.pagingdet)
            $('.dataTables_info').text(response.pagingdet);

            $('.resultados').show();
            $('.sin-resultados').remove();
         }
         else {
            $('.resultados').hide();

            if (!$('.sin-resultados').length) {
               $('.resultados').parent().append(
                 '<div class="sin-resultados alert alert-danger">'+
                 '<strong>There are not any offer to be listed here</strong>'+
                 '</div>'
               );
            }
         }

         return false;
      };      

      var getFiltersAndSearch = function() {
         filterStruct.showrows = $('#show-rows').val();
         filterStruct.hidefilters = (!$('.sidebar-main').is(':visible')) ? 1:0;

         return filterStruct;
      }

      var beforeRendering = function () {
         offersInRow = 0;
      };

      var createItemUsing = function(off, with_filters, response) {
         offersInRow++;

         var listContainer = $('.resultados-list');
         var cantRows = listContainer.find('.row').length;
        
         /********* creating row (when it's necessary) **********/
         if (!cantRows || offersInRow > response.extra_info.offers_in_row) {
            var itemRow = document.createElement('div');
            itemRow.setAttribute('class','row');
            listContainer.append(itemRow);

            if (offersInRow > response.extra_info.offers_in_row)
            offersInRow = 1;
         }

         /********* creating item box **************************/
         var itemBox = document.createElement('div');
         itemBox.setAttribute('class', (offerSetting.offers_in_row[response.extra_info.offers_in_row].css));

         var panelFlat = document.createElement('div');
         panelFlat.setAttribute('class','panel panel-flat');

         //------------- panel BODY -----------------------------
         var panelBody = document.createElement('div');
         panelBody.setAttribute('class','panel-body');

         //--- h5 (offer name)
         var titleCont = document.createElement('h5');
         titleCont.setAttribute('class','text-semibold mb-5');

         var titleAnch = document.createElement('a');
         titleAnch.setAttribute('class','text-default');
         titleAnch.setAttribute('href', response.extra_info.offer_base_url + off.id);
         titleAnch.appendChild(document.createTextNode(off.name));
         titleCont.appendChild(titleAnch);

         //--- p (offer id - with link)
         var idCont = document.createElement('p');
         var idCont_anch = document.createElement('a');

         idCont_anch.setAttribute('class','text-muted');
         idCont_anch.setAttribute('href', response.offer_url);
         idCont_anch.appendChild(document.createTextNode(off.cpa_id));
         idCont.appendChild(document.createTextNode('ID:'));
         idCont.appendChild(idCont_anch);
         
         //--- categ/stat/operator list struct
         var catCont = renderList('categs', off.categories);
         var statCont= renderList('stats',  off.statistics);
         var operCont= renderList('opers',  off.operators);
         var osCont  = renderList('devos',  off.deviceos);
         
         //--- thumb struct
         var thumbCont = document.createElement('div');
         thumbCont.setAttribute('class','thumb content-group');

         var thumbImg = document.createElement('img');
         thumbImg.setAttribute('class', 'img-responsive');
         thumbImg.setAttribute('src',   off.thumbnail_url);
         thumbImg.setAttribute('alt',   off.name);
         thumbImg.setAttribute('title', off.name);

         var thumbLnk = document.createElement('div');
         thumbLnk.setAttribute('class','caption-overflow');

         var thumbLnk_bind = document.createElement('span');
         var thumbLnk_anch = document.createElement('a');
         var thumbLnk_ico  = document.createElement('i');

         thumbLnk_anch.setAttribute('href', response.extra_info.offer_base_url + off.id);
         thumbLnk_anch.setAttribute('class', 'show-detail btn btn-flat border-white text-white btn-rounded btn-icon');
         thumbLnk_ico.setAttribute('class', 'icon-arrow-right8');

         thumbLnk_anch.appendChild(thumbLnk_ico);
         thumbLnk_bind.appendChild(thumbLnk_anch);
         thumbLnk.appendChild(thumbLnk_bind);

         thumbCont.appendChild(thumbImg);
         thumbCont.appendChild(thumbLnk);

         panelBody.appendChild(thumbCont); 
         panelBody.appendChild(titleCont); 
         panelBody.appendChild(idCont);
         panelBody.appendChild(catCont); 
         panelBody.appendChild(statCont); 
         if (operCont) panelBody.appendChild(operCont);
         //if (osCont) panelBody.appendChild(osCont);  

         //------------- panel FOOTER ------------------------------
         var panelFooter = document.createElement('div');
         panelFooter.setAttribute('class','panel-footer panel-footer-condensed');

         var footCont = document.createElement('div');
         footCont.setAttribute('class','heading-elements not-collapsible');

         //--- payout struct
         var extraCont = document.createElement('ul');
         var extraCont_li   = document.createElement('li');
         var extraCont_span = document.createElement('span');

         extraCont.setAttribute('class','extras');
         extraCont_span.setAttribute('class','bg-success text-highlight');

         extraCont_span.appendChild(document.createTextNode(off.payout_type_label+' $'+off.payout_cost));
         extraCont_li.appendChild(extraCont_span); 
         extraCont.appendChild(extraCont_li); 
         
         //--- tracking struct
         var trackCont = document.createElement('a');
         var trackIcon = document.createElement('i');

         trackIcon.setAttribute('class','icon-arrow-right14 position-right');
         trackCont.setAttribute('class','show-detail heading-text pull-right');
         trackCont.setAttribute('href',off.offer_url);
         trackCont.appendChild(document.createTextNode('Details & Tracking Link'));
         trackCont.appendChild(trackIcon);

         footCont.appendChild(extraCont);
         footCont.appendChild(trackCont);
         panelFooter.appendChild(footCont);

         //------ building offer box --------
         panelFlat.appendChild(panelBody);
         panelFlat.appendChild(panelFooter);
         itemBox.appendChild(panelFlat);
         listContainer.find('.row').last().append(itemBox);
      }

      renderList = function(type, list) {
         var ul = document.createElement('ul');

         switch(type) {
            case 'categs': ul.setAttribute('class', 'categs list-inline content-group'); break;
            case 'stats' : ul.setAttribute('class', 'stats list-inline content-group'); break;
            case 'opers' : ul.setAttribute('class', 'opers list-inline content-group'); break;
            case 'devos' : ul.setAttribute('class', 'devos list-inline content-group'); break;
         }

         if (list) {
            for(var i=0; i<list.length; i++) {
               var li = document.createElement('li');
   
               switch(type) {
                  case 'categs':
                     var a = document.createElement('a');
                     a.setAttribute('href', '#');
                     a.setAttribute('rel', list[i].id);
                     a.appendChild(document.createTextNode(list[i].name));
   
                     li.appendChild(a);
                     ul.appendChild(li);
                     break;
   
                  case 'stats':
                     li.appendChild(document.createTextNode(list[i].name));
                     ul.appendChild(li);
                     break;
   
                  case 'opers':
                     var a = document.createElement('a');
                     a.setAttribute('href', '#');
                     a.setAttribute('class', list[i].css);
                     a.setAttribute('rel', list[i].id);
                     a.setAttribute('title', document.createTextNode(list[i].name));
                     a.setAttribute('alt', document.createTextNode(list[i].name));
   
                     li.appendChild(a);
                     ul.appendChild(li);
                     break;
   
                  case 'devos':
                     var a = document.createElement('a');
                     a.setAttribute('href', '#');
                     a.setAttribute('class', list[i].css);
                     a.setAttribute('rel', list[i].id);
                     a.setAttribute('title', document.createTextNode(list[i].name));
                     a.setAttribute('alt', document.createTextNode(list[i].name));
   
                     li.appendChild(a);
                     ul.appendChild(li);
                     break;
               }
            }
         }
         else ul = false;

         return ul;
      }
      
      //////////////// call to $.pagination plugin ///////////////////
      var pagHandler = $('#offerwall-container .resultados').pagination({
         url: RM_DOMAIN+'/offer/listing.html',
         offStyle: 'disabled',
         itemBuilder: createItemUsing,
         afterPaging: settingColumnsAndPages,
         beforePaging: beforeRendering,
         getFiltering: getFiltersAndSearch,
         queryElement: $('.offer-search'),
         orderElement: $('#orderby'),
         orientElement: $('#orient'),
         orientSelectedClass: "active"
      });      
   });
})(jQuery);

