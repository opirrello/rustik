(function ($) {
   $(document).ready(function() {
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

      var inoutCheckedItem = function(affId) {
         var allChecked = $('#accountlist-container .resultados input.checklist').val() == 'all';
         var totalRows  = ($('.resultados-pages').length) ?
                           $('.resultados-pages').attr('rel').split('::')[0].split(':')[1] :
                           $('.datatable-header').attr('rel');

         if (allChecked) {
            var affCont = $('#accountlist-container .resultados input.less');
            var affValue= $('#accountlist-container .resultados input.less').val();
         }
         else {
            var affCont = $('#accountlist-container .resultados input.checklist');
            var affValue= $('#accountlist-container .resultados input.checklist').val();
         }

         if (!affValue)
              var affList = [];
         else var affList = affValue.split(':');

         if (affList.indexOf(affId) == -1)
              affList.push(affId);
         else affList.splice(affList.indexOf(affId), 1);

         affCont.val(affList.join(':'));

         //---------- control gral check & list of selected/excluded ------------------------
         //all checked and some items are excluded
         if (allChecked && affValue) { 
            if (affList.length == totalRows) { ///if the excluded items are equal to total rows...
               $('#check-all').prop('checked', false);                           // unckeck all
               $('#accountlist-container .resultados input.checklist').val('');  //clean selected
               $('#accountlist-container .resultados input.less').val('');       //clean excluded
            }
         }

         //---------- control gral check to disable/enable gral action buttons --------------
         if (!$('#accountlist-container .resultados input.checklist').val())
              $('#general-actions button').addClass('disabled'); // disable action buttons if nothing it's checked
         else $('#general-actions button').removeClass('disabled'); // enable action buttons if something is checked
      }

      var setCheckStatus = function(affId) {
         var stat = false;
         var esta = false;
         var allChecked = $('#accountlist-container .resultados input.checklist').val() == 'all';

         if (allChecked) {
            var affCont = $('#accountlist-container .resultados input.less');
            var affValue= $('#accountlist-container .resultados input.less').val();
         }
         else {
            var affCont = $('#accountlist-container .resultados input.checklist');
            var affValue= $('#accountlist-container .resultados input.checklist').val();
         }

         if (!affValue)
              var affList = [];
         else var affList = affValue.split(':');

         for (var idx in affList) {
            if (affId == affList[idx]) {
               stat = (allChecked) ? false : true;
               esta = true;
               break;
            }
         }

         if (esta)
              return stat;
         else return (allChecked) ? true : false;
      }

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

      $('#acc-data').on('show.bs.modal', function(evt){
         var affId = $(evt.relatedTarget).attr('rel');
         var platformData = extra_info[affId].platform_info;

         $(this).find('.modal-body .platform-info').empty();

         completeTabsFor(affId,1);

         //------------ setting platform data
         if (platformData.cpa_id)
         $(this).find('.modal-body .platform-info').prepend($('<span class="label label-success">CPA Id: '+platformData.cpa_id+'</span>'));

         if (platformData.crm_id)
         $(this).find('.modal-body .platform-info').prepend($('<span class="label label-success">CRM Id: '+platformData.crm_id+'</span>'));
      })
      
      var completeTabsFor = function(affId, activeTab) {
         var extraInfoObj = extra_info[affId];
         var platformData = extra_info[affId].platform_info;
         var idx = 0;

         $('#acc-data .nav-tabs').empty();
         $('#acc-data .tab-content').empty();

         for(var infoType in extraInfoObj) {
            if (infoType == 'platform_info')
            continue;
            
            var infoObj = extraInfoObj[infoType];

            switch(infoType) {
               case 'basic_info': var label = 'Basic info'; var col_dim = 3; break;
               case 'billing_info': var label = 'Billing info'; var col_dim = 4; break;
               case 'questions_info': var label = 'Questions & Answers'; var col_dim = 5; break;
            }

            //------------ setting data
            if (infoObj) {
               idx++;
               var active = (idx == activeTab)? " active":"";
               var tab = $('<li class="'+infoType+active+'"><a href="#highlighted-tab'+idx+'" data-toggle="tab">'+label+'</a></li>');
               var con = $('<div class="tab-pane'+active+'" id="highlighted-tab'+idx+'"></div>');
               $('#acc-data .nav-tabs').append(tab);

               var databoxObj = $('<dl class="dl-horizontal"></dl>');

               for(var field in infoObj) {
                  var dt = $('<dt>'+field+'</dt>');

                  if (Array.isArray(infoObj[field])) { 
                     var dd = $('<dd></dd>');
                     var spn= $('<span>'+infoObj[field][0]+'</span>');
                     var ul = $('<ul></ul>');

                     for(var i=0; i<infoObj[field][2].length; i++) {
                        var url = RM_DOMAIN +'/download/question/'+affId+'-'+infoObj[field][1]+'-'+infoObj[field][2][i];
                        var li  = $('<li><a class="icon-file-download2" href="'+ url +'"><span>'+infoObj[field][2][i]+'</span></a></li>');
                        ul.append(li);
                     }

                     dd.append(spn);
                     dd.append(ul);
                  }
                  else var dd = $('<dd>'+infoObj[field]+'</dd>');
                  databoxObj.append(dt);
                  databoxObj.append(dd);
               }

               con.append(databoxObj);
               $('#acc-data .tab-content').append(con);
            }
         }
/*
         $('#acc-data .tab-content .dl-horizontal dt').hover(function() {
            if ($(this).scrollWidth != $(this).offsetWidth && !$(this).attr('title')) {
               $this.tooltip({ title: $(this).text(), placement: "top" });
               $this.tooltip('show');
            }
         });*/
      };

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

      var createItemUsing = function(aff, with_filters, response) {
         var itemTr = document.createElement('tr');
         itemTr.setAttribute('class', aff.row_odd);

         /*********** creating td for checkbox ************/
         var rowCell = document.createElement('td');
         rowCell.setAttribute('class','check');

         var check  = document.createElement('input');
         check.setAttribute('type', 'checkbox');
         check.setAttribute('name', 'accounts[]');
         check.setAttribute('value', aff.id);

         if ( setCheckStatus(aff.id) )
         check.setAttribute('checked','checked');

         rowCell.appendChild(check);
         itemTr.appendChild(rowCell);

         /*********** creating td group for data ****************/
         createCellUsingInto(aff, itemTr, response.columnset);

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
         conLn.setAttribute('rel', aff.id);
         conI.setAttribute('class', 'icon-menu9');

         conLn.appendChild(conI);
         conLi.appendChild(conLn);
         var accUl = document.createElement('ul');
         accUl.setAttribute('class', 'dropdown-menu dropdown-menu-right actionlist');

         for (action in aff.actions) {
            var accLi = document.createElement('li');
            var accLn = document.createElement('a');
            var accI  = document.createElement('i');

            accLn.setAttribute('href','#');
            accLn.setAttribute('class', action);
            accLn.setAttribute('rel', aff.id);
            accI.setAttribute('class', 'icon-' + aff.actions[action].stylename);

            if (aff.actions[action].extra) {
               for (attr in aff.actions[action].extra) {
                   accLn.setAttribute(attr, aff.actions[action].extra[attr]);
               }
            }

            accLn.appendChild(accI);
            accLn.appendChild(document.createTextNode(aff.actions[action].desc));
            accLi.appendChild(accLn);
            accUl.appendChild(accLi);
         }

         conLi.appendChild(accUl);
         conUl.appendChild(conLi);

         rowCell.appendChild(conUl);
         itemTr.appendChild(rowCell);
          
         return itemTr;
      }
     
      var postData = function(data, action) {
         $.ajax({  
             type: 'POST',
             url: '/affiliate/'+action+'.html',
             dataType:'json',
             data: data,
             beforeSend: function() { $('body').startSpin(); },
             success: function(response) {
                $('#accountlist-container .resultados input.checklist').val('');
                $('#accountlist-container .resultados input.less').val('');
                $('#general-actions button').addClass('disabled');
                // call to retrieve listing again
                // after reload the list...
                pagHandler.paginate(1, function() {
                   handleMessage('success', response);
                }); 
             },
             error: function(jqXHR, textStatus) {
                // call to retrieve listing again
                // after reload the list...
                pagHandler.paginate(1, function() { 
                  if (jqXHR.responseJSON){
                     $('#accountlist-container .resultados input.checklist').val('');
                     $('#accountlist-container .resultados input.less').val('');
                     $('.resultados-actions .actionlist').addClass('disabled');
                     var response = jqXHR.responseJSON;
                     handleMessage('error', response);
                  }
                });
             }
         });
      }

      //////////////// call to $.pagination plugin ///////////////////
      var pagHandler = $('#accountlist-container .resultados').pagination({
         url: RM_DOMAIN+'/affiliate/listing.html',
         offStyle: 'disabled',
         itemBuilder: createItemUsing, /// items are generated cloning last one
         afterPaging: settingColumnsAndPages, /// put each N item into a container (div class='row')
         getFiltering: getFiltersAndSearch
      });      

      /////////////// other handler called ////////////////////////////
      if ($('#accountlist-container').length) {
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
               $('#accountlist-container .resultados input.checklist').val('all');
            }
            //------ if check-all is unchecked, set 'checklist' as empty
            else {
               $('#general-actions button').addClass('disabled');
               $('#accountlist-container .resultados input.checklist').val('');
               $('#accountlist-container .resultados input.less').val('');
            }
         });

         /// HANDLING INDIVIDUAL CHECK CHECKBOX
         $('.resultados').on('change', '.check input:checkbox', function() {
            var itemId = $(this).val();
            inoutCheckedItem(itemId);

            if (!$(this).is(':checked')) {
               $('#check-all').prop('checked', false);
            }
            else if ( $('#accountlist-container .resultados input.checklist').val() == 'all' ) {
               $('#check-all').prop('checked', true);
            }
         });

         var statusOption = function(opt) { return $(opt.text); };
         var filtersData = {
             'status':[
             {id:'P', text:'<span class="label label-default">Pending</span>', title:'Pending', 'selected':true},
             {id:'C', text:'<span class="label label-info">Confirmed</span>', title:'Confirmed', 'selected':true},
             {id:'A', text:'<span class="label label-success">Approved</span>', title:'Approved'},
             {id:'B', text:'<span class="label label-warning">Blocked</span>', title:'Blocked'},
             {id:'D', text:'<span class="label label-default">Deleted</span>', title:'Deleted'},
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
               var cantRows = $('#accountlist-container .resultados input.checklist').val().split(':').length;
               var titRows = cantRows +' accounts';
               var actionName = $(this).attr('rel');
               var jsonData = {
                  "checklist": $('#accountlist-container .resultados input.checklist').val(),
                  "less": $('#accountlist-container .resultados input.less').val()
               };

               dialogModal(actionName, titRows, jsonData, 'massive');
            }
         });

         /// single impact ------------------------------------
         $('.resultados-list').on('click','.resultados-actions a.approve,'+
                                          '.resultados-actions a.resend,'+
                                          '.resultados-actions a.reject,'+
                                          '.resultados-actions a.recover,'+
                                          '.resultados-actions a.block,'+
                                          '.resultados-actions a.unblock',
                                           function(e) {
            e.preventDefault();

            var _this = $(this);
            var descr = _this.parents('tr').find('td').eq(2).text();
            var action= _this[0].className;
            var data  = {"checklist":_this.attr('rel')};

            dialogModal(action, descr, data, 'single');
         });

         /// general dialog handling ---------------------------
         dialogModal = function(actionName, EntityName, jsonData, cuantity) {
            var title = 'Are you sure to '+actionName +'<br>'+EntityName+'?';
            var description = 'Please note that this action can be reversed,<br>but you should contact an administrator user';


            var msgData = {
               message:{description:description, title:title},
               confirmation:{confirm:'Yes, '+actionName+' them!', cancel:'No, cancel this action!'}
            };

            switch(actionName) {
               case 'reject':
               case 'recover':
                  var action = 'actuate';
                  jsonData.real_action = actionName;
                  break;

               default:
                  var action = actionName;
            }

            if (cuantity == 'massive')
                 var descrip = EntityName +' were not '+ actionName;
            else var descrip = EntityName +' wasn\'t '+ actionName;

            msgData.confirmation.confirmCb = function() { postData(jsonData, action); }
            msgData.confirmation.cancelCb = function() {
               $('#manager-user').select2('destroy');
               $('#manager-user-container').remove();

               var msgData = {message: {description:descrip, title:actionName + ' action cancelled'}};
               handleMessage('error', msgData);
            }

            if (actionName == 'approve') {
               msgData.after = function() {
                  $.ajax({
                     type: 'GET',
                     url: '/services/get_toro_users.html',
                     dataType:'json',
                     beforeSend: function() { $('body').startSpin(); },
                     success: function(response) {
                        var userCont = '<div class="manager-user-container">'+
                                       '<select id="manager-user" name="user"><option value=""></option></select>'+
                                       '</div>';

                        $(userCont).insertAfter('#alertWindowContent h1');
                        var filtersData = [];

                        for(idx in response) {
                           var option = {id:response[idx].id, text:response[idx].first_name+' '+response[idx].last_name};

                           if (response[idx].selected)
                           option.selected = true;

                           filtersData.push( option );
                        }

                        $('#manager-user').select2({
                           data:filtersData,
                           minimumResultsForSearch: Infinity,
                           placeholder:'Assign a manager user...'
                        });
                        
                        jsonData.assignee = $('#manager-user').val();

                        $('#manager-user').on('select2:select', function(e) {
                           jsonData.assignee = e.target.options[e.target.selectedIndex].value;
                        });

                        $('body').stopSpin();
                     }
                  });
               };
            }

            handleMessage('warning', msgData);
         }
      }
   });
})(jQuery);

