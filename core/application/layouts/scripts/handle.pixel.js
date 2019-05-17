(function ($) {
   pixel_actions = {
         delete:{icon:'trash-alt', label:'Delete pixel'},
         edit:  {icon:'pencil4',   label:'Edit pixel'},
         view:  {icon:'search4',   label:'View pixel'}
   };

   $(document).ready(function() {
      //------------------ HANDLE PIXELS (affiliate profile) ---------------------------------//
      $('#offer-detail-container, #offerwall-container').on('click','#add-pixel', function(e) {
         e.preventDefault();
         addPixel($(this));
      });

      $('#offer-detail-container, #offerwall-container').on('click','.edit-pixel', function(e) {
         e.preventDefault();
         editPixel($(this));
      });

      $('#offer-detail-container, #offerwall-container').on('click','.delete-pixel', function(e) {
         e.preventDefault();
         deletePixel($(this));
      });

      $('#offer-detail-container, #offerwall-container').on('click','.view-pixel', function(e) {
         e.preventDefault();
         viewPixel($(this));
      });
      
      //------------------- GENERAL FUNCTIONS ---------------------//
      buildPixelItem = function(pxlData) {
         var item = document.createElement('li');
         var span = document.createElement('span');
         var label= document.createElement('label');
         var code = document.createElement('code');
         
         pixelData[pxlData.id] = pxlData;

         label.setAttribute('class', 'status '+pxlData.status_text);
         label.appendChild(document.createTextNode(pxlData.status));
         code.appendChild(document.createTextNode(pxlData.url));
         span.setAttribute('id','ID'+pxlData.id);
         span.setAttribute('class','pixel-url');
         span.appendChild(label);
         span.appendChild(code);
         item.appendChild(span);

         for (var acc in pixel_actions) {
            var link = document.createElement('a');
            var icon = document.createElement('i');

            icon.setAttribute('class', 'icon icon-'+pixel_actions[acc].icon);
            link.setAttribute('href' , '#');
            link.setAttribute('class', acc+'-pixel');
            link.setAttribute('rel'  , pxlData.id);
            link.setAttribute('alt'  , pixel_actions[acc].label);
            link.setAttribute('title', pixel_actions[acc].label);
            link.appendChild(icon);
            item.appendChild(link);  
         }

         return item;
      };

      renderPixelForm = function(formTarget, jsonData, caller) {
         switch (formTarget) {
            case 'form-add-pixel':  var url = '/resource/register-pixel.html'; break;
            case 'form-edit-pixel': var url = '/resource/modify-pixel.html';   break;
         }

         var pixel = false;
         
         $('#offer-modal-pixel .modal-body').buildForm({
            target:formTarget,
            jsondata:jsonData,
            parameters: [],
            formError: {title: '', description: ''},
            formSuccess: {title: '', description: ''},
            submission:{
               'async':true,
               action:url,
               before: function(cont, form) {
                  //$('.modal-backdrop.in').hide();
               },
               after:function(cont, form, pars, stat, spinCloser) {
                  var pxlData = pars.data;
                  var pxlList = $('.panel-pixel .pixels');

                  $("html, body").animate({ scrollTop: 0 }, "slow");
   
                  if (typeof stat.code != 'undefined' && stat.code == 200) {
                     if (typeof spinCloser == 'function') { spinCloser(); }

                     switch (formTarget) {
                        case 'form-add-pixel':
                           pxlData.url     = $('#newpixel-elt-link').val();
                           pxlData.comment = $('#newpixel-elt-comment').val();

                           var item = buildPixelItem(pxlData);
                           pxlList.append(item);

                           //createAlertLabel('success', form.find('.buildform-messagebox'), pars.message);
                           form.trigger("reset");

                           $('#newpixel-elt-ename').attr('disabled','disabled');
                           $('.jsonform-error-ename').hide();
                           break;

                        case 'form-edit-pixel':
                           caller.parent().find('span code').text($('#editpixel-elt-link').val());

                           pixelData[caller.attr('rel')].url = $('#editpixel-elt-link').val();

                           var pixelId = $('#editpixel-elt-id').val();
                           $('#ID'+ $('#editpixel-elt-id').val() + ' label').removeClass(pars.data.last_status_text);
                           $('#ID'+ $('#editpixel-elt-id').val() + ' label').addClass(pars.data.status_text);
                           $('#ID'+ $('#editpixel-elt-id').val() + ' label').html(pars.data.status);

                           //createAlertLabel('success', form.find('.buildform-messagebox'), pars.message);
                           //$('#offer-modal-pixel').modal('hide');
                           break;
                     }
                  }
                  else {
                     if (typeof spinCloser == 'function') { spinCloser(); }
                  }
               }
            },
         }, function() {
            switch (formTarget) {
               case 'form-add-pixel':
                  $('#'+formTarget).append();
                  $('#'+formTarget).parent().removeClass('fixed');
                  $('#newpixel-elt-ename').attr('disabled','disabled');
                  $('#newpixel-elt-cancel').attr('data-dismiss','modal');
                  $('.jsonform-error-ename').hide();

                  if ($('.swcheckbox.switchery').length) {
                     var elem = $('.swcheckbox.switchery');

                     var rgb  = elem.css('color').match(/\d+/g);
                     var hex  = '#'+ String('0' + Number(rgb[0]).toString(16)).slice(-2) +
                                     String('0' + Number(rgb[1]).toString(16)).slice(-2) +
                                     String('0' + Number(rgb[2]).toString(16)).slice(-2);

                     var switchery = new Switchery(elem[0], {color: hex});

                  elem.click(function() {
                     if ($(this).is(':checked')) {
                        $('#newpixel-elt-ename').attr('disabled',false);
                        $('.jsonform-error-ename').show();
         
                        if (!$('#'+formTarget).validate().checkForm())
                             $('#'+formTarget+' input[type=submit]').attr('disabled','disabled');
                        else $('#'+formTarget+' input[type=submit]').removeAttr('disabled');
                     }
                     else{
                        $('#newpixel-elt-ename').attr('disabled','disabled');
                        $('.jsonform-error-ename').hide();

                        if (!$('#'+formTarget).validate().checkForm())
                             $('#'+formTarget+' input[type=submit]').attr('disabled','disabled');
                        else $('#'+formTarget+' input[type=submit]').removeAttr('disabled');
                     }
                  });
                  }
                  break;

               case 'form-edit-pixel':
                  var extra = pixelData[caller.attr('rel')];
                  
                  if (extra.extra_info) {
                     for (prop in extra.extra_info) {
                        switch(prop) {
                           case 'EVT':
                              $('#editpixel-elt-event').html('<span>Apply to<strong> <i>'+extra.extra_info[prop]+'</i></strong></span>');
                              break;

                           case 'TYP':
                              $('#editpixel-elt-type').html('<label class="label label-primary">'+extra.extra_info[prop]+'</label>');
                              break;
                        }
                     }
                  }

                  $('#'+formTarget).parent().removeClass('fixed');
                  $('#editpixel-elt-cancel').attr('data-dismiss','modal');
                  $('#editpixel-elt-id').val(extra.id);
                  $('#editpixel-elt-offer_id').val(extra.offer_id);
                  $('#editpixel-elt-link').text(extra.url);
                  $('#editpixel-elt-comment').html($('<p>'+extra.comment+'</p>'));
                  $('#editpixel-elt-comment p').shorten({
                        'showChars':50,
                        'moreText':'[&nbsp;View&nbsp;more&nbsp;]',
                        'lessText':'[&nbsp;View&nbsp;less&nbsp;]'
                  });
                  break;
            }

            $('#offer-modal-pixel').on('hidden.bs.modal', function() {
               $(this).find('form').remove();
            });
         });
      };

      var viewPixel = function(el) {
         var pixelId   = el.attr('rel');
         var pixelInfo = pixelData[pixelId];
         var pixelHtml = '';
         var pixelTitle= 'View pixel';
         
         pixelHtml += '<label class="label label-primary">' + pixelInfo.extra_info.TYP + '</label>';

         if (pixelInfo.extra_info.EVT)
         pixelHtml += '<span><strong>Apply to</strong> <i>' + pixelInfo.extra_info.EVT + '</i></span>';

         pixelHtml += '<div>';
         pixelHtml += '<code>'  + pixelInfo.url + '</code>';
         pixelHtml += '</div>';
         pixelHtml += '<p>' + pixelInfo.comment + '</p>';

         createAlertWindow({title:pixelTitle, className:'view', idName:'offer-modal-pixel', text:pixelHtml, type:'none', translate:false},
         function() {
            $('#offer-modal-pixel.view').parent().parent().find('h2').css('text-align','left');
            $('#offer-modal-pixel.view').parent().parent().find('h2').css('margin-bottom','20px');
            $('#offer-modal-pixel.view div code').text( $('#offer-modal-pixel.view div code').html());
            $('#offer-modal-pixel.view p').shorten({
               'showChars':50,
               'moreText':'[&nbsp;View&nbsp;more&nbsp;]',
               'lessText':'[&nbsp;View&nbsp;less&nbsp;]'
            });
         });
      };

      var addPixel = function(el) {
         renderPixelForm('form-add-pixel', newpixel);
       
         $('#offer-modal-pixel').find('.modal-title').text(el.attr('title'));
         $('#offer-modal-pixel').modal('show');
      };

      var editPixel = function(el) {
         renderPixelForm('form-edit-pixel', editpixel, el);
       
         $('#offer-modal-pixel').find('.modal-title').text(el.attr('title'));
         $('#offer-modal-pixel').modal('show');
      };

      var deletePixel = function(el) {
         var title = "Delete this pixel";
         var pixelInfo='<div id="pixel-modal" class="jsonform">'+
                       '<div class="control-group">'+
                       '<p>Are you sure to delete this pixel?</p>'+
                       '</div>'+ 
                       '</div>';

         var confObj = {
            cancel: 'Cancel',
            cancelCb: function() {
               createAlertWindow({title:'Action cancelled', type:'none', translate:false});
            },
            confirm: 'Yes, delete it!',
            confirmCb: function() {
               postData({id:el.attr('rel')}, 'resource', 'delete-pixel', function() {
                  console.log('asasasasas');
                  var pixelId = el.attr('rel');

                  el.parent().remove();
                  delete pixelData[pixelId];
               });
            }
         };

         createAlertWindow({title:title, text:pixelInfo, type:'none', translate:false, confirmation:confObj});
      };

      //------------------- MANAGER FUNCTIONS (listing / pagination / actions) ---------------------//
      $('body').on('click','#alertWindowContent .view-verbose', function(e) {
         e.preventDefault();

         $('.verbose-container').toggle();

         if ($('.verbose-container').is(':visible'))
              $(this).find('label').text('View less detail');
         else $(this).find('label').text('View more detail');
             
         $(this).find('.caret').toggleClass('rotate-180');
      });

      var handleMessage = function (stat, response) {
         if (response.message) {
            if (Array.isArray(response.message.description))
                 var description = '<p>'+response.message.description.join('</p><p>')+'</p>';
            else var description = '<p>'+response.message.description+'</p>';

            if (response.message.title)
                 var errorCont = '<h1>'+response.message.title+'</h1>'+description;  
            else var errorCont = description;

            if (response.confirmation)
                 var confirmation = response.confirmation;
            else var confirmation = false;

            if (Array.isArray(response.message.verbose)) {
               var vbsArr = [];

               for (var i=0; i<response.message.verbose.length; i++) {
                  var vbsObj = response.message.verbose[i];
                  vbsArr.push('<tr><td class="bg-danger-300">'+ vbsObj.code +'</td><td>'+ vbsObj.text +'</td></tr>');
               }

               errorCont += '<a href="#" class="view-verbose" data-action="collapse"><label>View more detail</label> <i class="caret"></i></a>'+
                            '<div class="verbose-container"><table class="verbose">' + vbsArr.join('') + '</table></div>';
            }

            //--- create alert window with callback if was declared in 'after' property
            if (response.after)
                 createAlertWindow({type:stat, text:errorCont, confirmation:confirmation, translate:false}, response.after);
            else createAlertWindow({type:stat, text:errorCont, confirmation:confirmation, translate:false});
         }
      }
 
      var inoutCheckedItem = function(pixId) {
         var allChecked = $('#pixellist-container .resultados input.checklist').val() == 'all';
         var totalRows  = ($('.resultados-pages').length) ?
                           $('.resultados-pages').attr('rel').split('::')[0].split(':')[1] :
                           $('.datatable-header').attr('rel');

         if (allChecked) {
            var pixCont = $('#pixellist-container .resultados input.less');
            var pixValue= $('#pixellist-container .resultados input.less').val();
         }
         else {
            var pixCont = $('#pixellist-container .resultados input.checklist');
            var pixValue= $('#pixellist-container .resultados input.checklist').val();
         }

         if (!pixValue)
              var pixList = [];
         else var pixList = pixValue.split(':');

         if (pixList.indexOf(pixId) == -1)
              pixList.push(pixId);
         else pixList.splice(pixList.indexOf(pixId), 1);

         pixCont.val(pixList.join(':'));

         //---------- control gral check & list of selected/excluded ------------------------
         //all checked and some items are excluded
         if (allChecked && pixValue) { 
            if (pixList.length == totalRows) { ///if the excluded items are equal to total rows...
               $('#check-all').prop('checked', false);                           // unckeck all
               $('#pixellist-container .resultados input.checklist').val('');  //clean selected
               $('#pixellist-container .resultados input.less').val('');       //clean excluded
            }
         }

         //---------- control gral check to disable/enable gral action buttons --------------
         if (!$('#pixellist-container .resultados input.checklist').val())
              $('#general-actions button').addClass('disabled'); // disable action buttons if nothing it's checked
         else $('#general-actions button').removeClass('disabled'); // enable action buttons if something is checked
      }

      var setCheckStatus = function(affId) {
         var stat = false;
         var esta = false;
         var allChecked = $('#pixellist-container .resultados input.checklist').val() == 'all';

         if (allChecked) {
            var affCont = $('#pixellist-container .resultados input.less');
            var affValue= $('#pixellist-container .resultados input.less').val();
         }
         else {
            var affCont = $('#pixellist-container .resultados input.checklist');
            var affValue= $('#pixellist-container .resultados input.checklist').val();
         }

         if (!affValue)
              var pixList = [];
         else var pixList = pixValue.split(':');

         for (var idx in pixList) {
            if (pixId == pixList[idx]) {
               stat = (allChecked) ? false : true;
               esta = true;
               break;
            }
         }

         if (esta)
              return stat;
         else return (allChecked) ? true : false;
      }

      $('#pixellist-container').on('click','.resultados-actions .actionlist .edit', function(e) {
         e.preventDefault();
         var caller = $(this);

         $('#pix-edit .modal-body').buildForm({
            target:'form-edit-pixel',
            jsondata: editpixel,
            formError: {title: '', description: ''},
            formSuccess: {title: '', description: ''},
            submission:{
               'async':true,
               action:'/resource/modify-pixel.html',
               before: function(cont, form) {
                  //$('.modal-backdrop.in').hide();
               },
               after:function(cont, form, pars, stat, spinCloser) {
                  var pxlData = pars.data;
                  
                  $("html, body").animate({ scrollTop: 0 }, "slow");

                  if (typeof stat.code != 'undefined' && stat.code == 200) {
                     var pixId = caller.attr('rel');
                     extra_info[pixId].url = $('#editpixel-elt-link').val();
                     extra_info[pixId]['CODE/URL'] = $('#editpixel-elt-link').val();

                     $('#px'+pixId).text($('#editpixel-elt-link').val());
                  }
                  
                  if (typeof spinCloser == 'function') { spinCloser(); }
               }
            }
         },
         function() {
            $('#pix-edit').modal('show');
            var pixId = caller.attr('rel');
            var extra = extra_info[pixId];

            $('#form-edit-pixel').parent().removeClass('fixed');
            $('#editpixel-elt-cancel').attr('data-dismiss','modal');
            $('#editpixel-elt-id').val(pixId);
            $('#editpixel-elt-offer_id').val(extra.offer_id);

            for(var prop in extra) {
               switch(prop) {
                  case 'CODE/URL': $('#editpixel-elt-link').html(extra[prop]); break;
                  case 'Event Name': (extra[prop]) ? $('#editpixel-elt-event').html('<span>Apply to<strong> <i>'+extra[prop]+'</i></strong></span>'):false; break;
                  case 'Type': $('#editpixel-elt-type').html(extra[prop]); break;

                  case 'Comment':
                     $('#editpixel-elt-comment').html('<p>'+extra[prop]+'</p>');
                     
                     $('#editpixel-elt-comment p').shorten({
                        'showChars':50,
                        'moreText':'[&nbsp;View&nbsp;more&nbsp;]',
                        'lessText':'[&nbsp;View&nbsp;less&nbsp;]'
                     });
                     break;
               }
            }
            
            $('#pix-edit').on('hidden.bs.modal', function() {
               $(this).find('form').remove();
            });
         });
      });

      //////////////// function to be used in $.pagination plugin ///////////////////
      $('#search').click(function() {
         pagHandler.paginate(1);
      });

      $('.ord').click(function() {
         var currSort = $(this).attr('rel').split(':');

         //--- If current orderer column is clicked, then change current orientation
         if ($(this).hasClass('selected')) {
            var rel = currSort[0] +':'+ ((currSort[1] == 'asc') ? 'desc':'asc');
            var css = 'sorting_'+ currSort[1];
            $(this).attr('rel', rel);
         }
         else {
            $('.ord.selected').addClass('sorting');
            $('.ord.selected').removeClass('sorting_asc');
            $('.ord.selected').removeClass('sorting_desc');
            $('.ord.selected').removeClass('selected');
            var css = 'sorting_'+ ((currSort[1] == 'asc') ? 'desc':'asc'); 
         }

         //--- If some orderer column it's clicked then toggle current orientation icon
         $(this).removeClass('sorting_asc');
         $(this).removeClass('sorting_desc');
         $(this).removeClass('sorting');
         $(this).addClass(css);
      });

      var getFiltersAndSearch = function() {
         var filters = {};

         if ($('#status-filter').val())
         filters.statuses = $('#status-filter').val();

         filters.showrows = $('#show-rows').val();

         return filters;
      }

      var settingColumnsAndPages = function(response) {
         var pagesList = $('.resultados-pages span a');

         if (response.pagination) {
            if (pagesList.length > response.pagination.num_pages)
            pagesList.slice(response.pagination.num_pages).remove();

            if (response.pagingdet) 
            $('.dataTables_info').text(response.pagingdet);

            if (response.extra_info)
            extra_info = response.extra_info;

            $('.datatable-scroll').show();
            $('.datatable-footer').show();
            $('.sin-resultados').remove();
         }
         else {
            $('.datatable-scroll').hide();
            $('.datatable-footer').hide();

            if (!$('.sin-resultados').length) {
               $('.datatable-scroll').parent().append(
                 '<div class="sin-resultados alert alert-danger" style="margin:20px">'+
                 '<strong>There are not any offer to be listed here</strong>'+
                 '</div>'
               );
            }
         }

         return false;
      };

      var createCellUsingInto = function(cellData, rowObj, columnset) {
         var dataCols = Object.keys(columnset);

         for (idx in dataCols) {
            for (col in cellData) {
               if (col == dataCols[idx]) {
                  var rowCell = document.createElement('td');
                  rowCell.setAttribute('class','sorting_1');

                  cellData[col] = (cellData[col] == null) ? '' : cellData[col];

                  if (cellData[col] != null && cellData[col].html)
                       rowCell.appendChild(document.createRange().createContextualFragment(cellData[col].html));
                  else rowCell.appendChild(document.createTextNode(cellData[col]));

                  rowObj.appendChild(rowCell);

                  break;
               }
            }
         }
      }

      var createItemUsing = function(pixel, with_filters, response) {
         var itemTr = document.createElement('tr');
         itemTr.setAttribute('class', pixel.row_odd);

         /*********** creating td for checkbox ************/
         var rowCell = document.createElement('td');
         rowCell.setAttribute('class','check');

         var check  = document.createElement('input');
         check.setAttribute('type', 'checkbox');
         check.setAttribute('name', 'pixels[]');
         check.setAttribute('value', pixel.id);

         if ( setCheckStatus(pixel.id) )
         check.setAttribute('checked','checked');

         rowCell.appendChild(check);
         itemTr.appendChild(rowCell);

         /*********** creating td group for data ****************/
         createCellUsingInto(pixel, itemTr, response.columnset);

         /*********** creating span for actions ************/
         var rowCell = document.createElement('td');
         var conUl = document.createElement('ul');
         var conLi = document.createElement('li');
         var conLn = document.createElement('a');
         var conI  = document.createElement('i');

         rowCell.setAttribute('class','text-center');

         conUl.setAttribute('class','icons-list resultados-actions');
         conLi.setAttribute('class', 'dropdown');
         conLn.setAttribute('class', 'dropdown-toggle');
         conLn.setAttribute('data-toggle',  'dropdown');
         conLn.setAttribute('aria-expanded','true');
         conLn.setAttribute('rel', pixel.id);
         conI.setAttribute('class', 'icon-menu9');

         conLn.appendChild(conI);
         conLi.appendChild(conLn);
         var pixUl = document.createElement('ul');
         pixUl.setAttribute('class', 'dropdown-menu dropdown-menu-right actionlist');

         for (action in pixel.actions) {
            var pixLi = document.createElement('li');
            var pixLn = document.createElement('a');
            var pixI  = document.createElement('i');

            pixLn.setAttribute('href','#');
            pixLn.setAttribute('class', action);
            pixLn.setAttribute('rel', pixel.id);
            pixI.setAttribute('class', 'icon-' + pixel.actions[action].stylename);

            if (pixel.actions[action].extra) {
               for (attr in pixel.actions[action].extra) {
                   pixLn.setAttribute(attr, pixel.actions[action].extra[attr]);
               }
            }

            pixLn.appendChild(pixI);
            pixLn.appendChild(document.createTextNode(pixel.actions[action].desc));
            pixLi.appendChild(pixLn);
            pixUl.appendChild(pixLi);
         }

         conLi.appendChild(pixUl);
         conUl.appendChild(conLi);

         rowCell.appendChild(conUl);
         itemTr.appendChild(rowCell);
          
         return itemTr;
      }
     
      var postData = function(data, context, action) {
         if (arguments.length > 3)
         var callback = arguments[3];

         $.ajax({  
             type: 'POST',
             url: '/'+context+'/'+action+'.html',
             dataType:'json',
             data: data,
             beforeSend: function() { $('body').startSpin(); },
             success: function(response) {
                if ($('#pixellist-container').length) {
                   $('#pixellist-container .resultados input.checklist').val('');
                   $('#pixellist-container .resultados input.less').val('');
                   $('#general-actions button').addClass('disabled');
                   // call to retrieve listing again
                   // after reload the list...
                   pagHandler.paginate(1, function() {
                      handleMessage('success', response);
                   }); 
                }
                else if ( $('.panel-pixel .pixels').length ) {
                   if (typeof callback == 'function') {
                      callback();
                   }
                  
                   $('body').stopSpin();
                   handleMessage('success', response);
                }
             },
             error: function(jqXHR, textStatus) {
                // call to retrieve listing again
                // after reload the list...
                var response = jqXHR.responseJSON;

                if ($('#pixellist-container').length) {
                   pagHandler.paginate(1, function() { 
                       if (jqXHR.responseJSON) {
                          $('#pixellist-container .resultados input.checklist').val('');
                          $('#pixellist-container .resultados input.less').val('');

                          $('.resultados-actions .actionlist').addClass('disabled');
   
                          handleMessage('error', response);
                       }
                   });
                }
                else if ( $('.panel-pixel .pixels').length ) {
                   if (typeof callback == 'function')
                   callback();
                  
                   $('body').stopSpin();
                   handleMessage('error', response);
                }
             }
         });
      }

      if ($('#pixellist-container').length) {
         //////////////// call to $.pagination plugin ///////////////////
         var pagHandler = $('#pixellist-container .resultados').pagination({
            url: RM_DOMAIN+'/pixel/listing.html',
            offStyle: 'disabled',
            itemBuilder: createItemUsing, /// items are generated cloning last one
            afterPaging: settingColumnsAndPages, /// put each N item into a container (div class='row')
            getFiltering: getFiltersAndSearch
         });      

         /////////////// other handler called ////////////////////////////
         $('#reload').click(function() {
             pagHandler.paginate(1); 
         });

         /// HANDLING CHECK-ALL CHECKBOX
         $('#check-all').change(function() {
            /// checking all checkboxs or not, deppend on check-all status
            $(".check input:checkbox").prop('checked', $(this).prop("checked"));

            //------ if check-all is checked, set 'checklist' input with 'all' value
            if ($(this).is(':checked')) {
               $('#general-actions button').removeClass('disabled');
               $('#pixellist-container .resultados input.checklist').val('all');
            }
            //------ if check-all is unchecked, set 'checklist' as empty
            else {
               $('#general-actions button').addClass('disabled');
               $('#pixellist-container .resultados input.checklist').val('');
               $('#pixellist-container .resultados input.less').val('');
            }
         });

         /// HANDLING INDIVIDUAL CHECK CHECKBOX
         $('.resultados').on('change', '.check input:checkbox', function() {
            var itemId = $(this).val();
            inoutCheckedItem(itemId);

            if (!$(this).is(':checked')) {
               $('#check-all').prop('checked', false);
            }
            else if ( $('#pixellist-container .resultados input.checklist').val() == 'all' ) {
               $('#check-all').prop('checked', true);
            }
         });

         var statusOption = function(opt) { return $(opt.text); };
         var filtersData = {
             'status':[
             {id:'P', text:'<span class="label label-default">Pending</span>', title:'Pending', 'selected':true},
             {id:'A', text:'<span class="label label-success">Approved</span>', title:'Approved'},
             {id:'R', text:'<span class="label label-danger">Rejected</span>', title:'Rejected'}]
         };

         $('#status-filter').select2({
            data:filtersData['status'],
            placeholder:'Filter by status',
            templateSelection:statusOption,
            templateResult:statusOption
         });

         $('#show-rows').select2({ minimumResultsForSearch: Infinity, width: 'auto' });
         $('#show-rows').on('select2:select', function(e) {
             pagHandler.paginate(1); 
         });

         /************** actions handle ************************/
         /// massive impact ------------------------------------
         $('#general-actions button').click(function(e) {
            e.preventDefault();

            if (!$('#general-actions button').is('.disabled')) {
               var cantRows = $('#pixellist-container .resultados input.checklist').val().split(':').length;
               var titRows = cantRows +' pixels';
               var actionName = $(this).attr('rel');
               var jsonData = {
                  "checklist": $('#pixellist-container .resultados input.checklist').val(),
                  "less": $('#pixellist-container .resultados input.less').val()
               };

               dialogModal(actionName, titRows, jsonData, 'massive');
            }
         });

         /// single impact ------------------------------------
         $('.resultados-list').on('click','.resultados-actions a.approve,'+
                                          '.resultados-actions a.reject,'+
                                          '.resultados-actions a.delete',
                                           function(e) {
            e.preventDefault();

            var _this = $(this);
            var descr = 'this pixel'; //_this.parents('tr').find('td').eq(2).text();
            var action= _this[0].className;
            var data  = {"checklist":_this.attr('rel')};

            dialogModal(action, descr, data, 'single');
         });

         /// general dialog handling ---------------------------
         dialogModal = function(actionName, EntityName, jsonData, cuantity) {
            var title = 'Are you sure to '+actionName +'<br>'+EntityName+'?';
            var description = 'Please note that this action can be reversed,<br>but you should contact an administrator user';
            var action = 'actuate';

            jsonData.real_action = actionName;

            var msgData = {
               message:{description:description, title:title},
               confirmation:{confirm:'Yes, '+actionName+' them!', cancel:'No, cancel this action!'}
            };

            if (cuantity == 'massive')
                 var descrip = EntityName +' were not '+ actionName;
            else var descrip = EntityName +' wasn\'t '+ actionName;

            msgData.confirmation.confirmCb = function() { postData(jsonData, 'pixel', action); }
            msgData.confirmation.cancelCb = function() {
               $('#manager-user').select2('destroy');
               $('#manager-user-container').remove();

               var msgData = {message: {description:descrip, title:actionName + ' action cancelled'}};
               handleMessage('error', msgData);
            }

            handleMessage('warning', msgData);
         }
      }

      //------- pixel info modal handlers --------------------//
      $('#pix-data').on('show.bs.modal', function(evt){
         var affId = $(evt.relatedTarget).attr('rel');
         var infoObj = extra_info[affId];
         var databoxObj = $('<dl class="dl-horizontal"></dl>');
         
         $(this).find('.modal-body').empty();

         for(var field in infoObj) {
            if (field == 'pix_cpa_id' || field == 'offer_id')
            continue;

            if (field == 'Event Name')
            infoObj[field] = '<strong><i>'+infoObj[field]+'</i></strong>';

            var dt = $('<dt>'+field+'</dt>');
            var dd = $('<dd>').html(infoObj[field]);

            databoxObj.append(dt);
            databoxObj.append(dd);
         }

         $(this).find('.modal-body').append(databoxObj);
         
         //------------ setting platform data
         if (infoObj.pix_cpa_id)
         $(this).find('.modal-body').prepend($('<div style="display:table; width:100%">'+
                                               '<span class="label label-success" style="float:right">CPA Id: '+infoObj.pix_cpa_id+'</span>'+
                                               '</div>'));
      });
   });
})(jQuery);

