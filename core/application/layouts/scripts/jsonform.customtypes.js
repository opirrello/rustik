(function ($) {
   JSONForm.fieldTypes['ranking'] = {
      'template': '<div id="ranking-container">'+
                     '<input id="<%=node.id%>" name="<%=node.name%>" class="ranking" type="hidden" value="" <%= (node.schemaElement && node.schemaElement.required ? " required=\'required\'" : "") %>/>'+
                     '<div>'+
                     '<span>'+
                     '<ul>'+
                     '<%_.each(node.schemaElement.data.items, function(item, key) {%>'+
                       '<li rel="<%= item.code %>"><%= item.text %></li>'+
                     '<%}); %>'+
                     '</ul>'+
                     '</span>'+
                     '<span>'+
                     '<ul>'+
                     '<%_.each(node.schemaElement.data.points, function(itemPoints, key) {%>'+
                        '<li class="<%=node.schemaElement.data.items[key].code%>">'+
                        '<ul>'+
                        '<%_.each(itemPoints, function(point, key2) {%>'+
                        '<li><input type="radio" class="point" name="point_<%=node.schemaElement.data.items[key].code%>" value="<%=node.schemaElement.data.items[key].code+\':\'+point.value%>"/><%=point.text%></li>'+
                        '<%}); %>'+
                        '<li class="icon"><i></i></li>'+
                        '</ul>'+
                        '</li>'+
                     '<%}); %>'+
                     '</ul>'+
                     '</span>'+
                     '</div>'+
                  '</div>',
      'onInsert': function(evt, node) {
         var points = [];
         var califs = [];

         $('#ranking-container .point').each(function() {
            var name = $(this).attr('name');

            if (points.indexOf(name) == -1) {
               points.push(name);
            }
         });

         $('#ranking-container .point').click(function() {
            if ($(this).is(':checked')) {
               var voteArr  = $(this).val().split(':');
               var currCalif = califs; //$('#'+node.id).val();

               var parentLi = $(this).parent().parent().parent();
               parentLi.attr('class',voteArr[0]+' p'+voteArr[1]);

               if (currCalif != '')
                    var califArr = currCalif.split('|');
               else var califArr = [];

               var isHere = false;

               for (var i=0; i<califArr.length; i++) {
                  var votedArr = califArr[i].split(':');

                  if (voteArr[0] == votedArr[0]) {
                     votedArr[1] = voteArr[1];
                     isHere = true;
                     break;
                  }
               }

               if (isHere)
                    califArr[i] = voteArr.join(':');
               else califArr.push(voteArr.join(':'));

               califs = califArr.join('|');

               if (califArr.length == points.length) {
                  $('#'+node.id).val(califs);
               }
            }
         });
      },
      'fieldtemplate': true,
      'inputfield': true
   };

   JSONForm.fieldTypes['calendar'] = {
      'template': '<input type="text" class="calendar" name="<%=node.name%>" id="<%=node.id%>" value="" ' +
                  '<%= (node.placeholder? "placeholder=" + \'"\' + escape(node.placeholder) + \'"\' : "")%>' +
                  '<%= (node.schemaElement && node.schemaElement.format ? " format=\'"+node.schemaElement.format+"\'" : "")%> ' +
                  '<%= (node.schemaElement && node.schemaElement.required ? " required=\'required\'" : "")%> ' +
                  'type="text">'+
                  '<span class="datepicker-button"></span>',
      'fieldtemplate': true,
      'inputfield': true,
      'onInsert': function(evt, node) {
         if (typeof $.datepicker._updateDatepicker_original == 'undefined') {
            $.datepicker._updateDatepicker_original = $.datepicker._updateDatepicker;

            $.datepicker._updateDatepicker = function(inst) {
               $.datepicker._updateDatepicker_original(inst);
   
               var titleElem = inst.dpDiv[0].childNodes[0].childNodes[2];
               var monthList = titleElem.childNodes[0];
               var yearList  = titleElem.childNodes[1];
               var monthName = monthList.options[monthList.selectedIndex].text; 
               var yearName  = yearList.options[yearList.selectedIndex].text; 
             
               $(titleElem).prepend('<span>'+yearName+'</span>');
               $(titleElem).prepend('<span>'+monthName+'</span>');
            }
         }

         $('#'+node.id).datepicker({
            showOtherMonths: true,
            selectOtherMonths: true,
            nextText: "›",
            prevText: "‹",
            changeMonth: true,
            changeYear: true,
            beforeShow: function(el, dp) {
               var inputField = $(el);

               /// si se esta dentro de un popup, se vincula el datepicker con el modal
			      if (inputField.parents('.jsonform.modal').length > 0) {
                  inputField.parent().append($('#ui-datepicker-div'));
                  $('#ui-datepicker-div').addClass('datepicker-modal');
                  //$('#ui-datepicker-div').hide();
    	         }    
            }
         }).on('change', function() {
            $(this).valid();
         });

         $('#'+node.id).parent().find('span.datepicker-button').click(function(){
            $('#'+node.id).focus();
         });
      }
   };

   JSONForm.fieldTypes['spriteselect'] = {
    'template': 
      '<div class="spriteselect">' +
      '<% if (spriteFile) { %>'+
      '<input type="hidden" name="<%= node.name %>" id="<%= node.id %>" value="<%= value %>" />' +
      '<div class="container">' +
        '<%if (selectContainer){%><%=selectContainer%><%}else{%><div class="choosen"></div><%}%>'+
        '<span<%= (buttonClass ? \' class="\'+buttonClass+\'" \':\'\')%>rel=""><%if (selectTitle) {%><%=selectTitle%><%}%></span>'+
        '<div class="itemlist">' +
          '<div class="page">' +
          '<% _.each(node.options, function(key, idx) { %>'+
            '<% if ((idx > 0) && ((idx % columns) === 0)) { %>'+
            '</div><div class="page">'+
            '<% } %>'+
            '<a>'+
              '<% if (key instanceof Object) { %>'+
              '<span<%if (itemClass) { %> class="<%=itemClass%>" <% } %>style="background:url(<%=spriteFile%>) no-repeat;'+
                           'background-position:<%=key.x%>px <%=key.y%>px;'+
                           'width:<%=key.w%>px;'+
                           'height:<%=key.h%>px" alt="<%=key.name%>" title="<%=key.name%>">'+
              '</span>'+
              '<% } else { if (key.match(/[a-z0-9\-]/) ) { %>'+
              '<span class="<%if (itemClass) {%><%=itemClass%> <%}%><%= key %>" alt="<%=key%>" title="<%=key%>"></span>'+
              '<% }} %>'+
            '</a>'+
          '<% }); %>' +
          '</div>' +
        //'<% if (buttonClass) {%>' +
        '</div>' +
        //'<%}%>'+
      '</div>'+
      '<% } %>'+
      '</div>',
    'fieldtemplate': true,
    'inputfield': true,
    'onBeforeRender': function (data, node) {
      var needSpriteFile = false;

      var elt = node.formElement || {};
      var nbRows = null;
      var maxColumns = elt.imageSelectorColumns || 5;
      data.buttonTitle = elt.imageSelectorTitle || 'Select...';
      data.spriteFile = elt.sprite || false;
      data.itemClass = elt.itemClass || false;
      data.buttonClass = elt.buttonClass || false;
      data.defWidth  = elt.width || 32;
      data.defHeight = elt.height || 32;
      data.selectTitle = elt.selectTitle || false;
      data.selectContainer = elt.container || false;

      var definido = function(value) {
         return !(_.isUndefined(value) || _.isNull(value));
      }

      for (var i=0; i<node.options.length; i++) {
         if (node.options[i] instanceof Object) {
            needSpriteFile = true;

            if (!definido(node.options[i].w))
            node.options[i].w = data.defWidth;

            if (!definido(node.options[i].h))
            node.options[i].h = data.defHeight;

            if (!definido(node.options[i].x))
            node.options[i].x = i+node.options[i].w * -1;

            if (!definido(node.options[i].y))
            node.options[i].y = i+node.options[i].h * -1;
         }
      }

      if (!needSpriteFile) {
         data.spriteFile = 'x'; // fill with something to bypass sprite file control
      }

      if (node.options.length > maxColumns) {
         nbRows = Math.ceil(node.options.length / maxColumns);
         data.columns = Math.ceil(node.options.length / nbRows);
      }
      else {
         data.columns = maxColumns;
      }
    },
    'getElement': function (el) {
      return $(el).parent().get(0);
    },
    'onInsert': function (evt, node) {
      if (node.formElement.buttonInside) {
         $(node.el).find('.container .choosen').append($(node.el).find('.container>span')) ;
      }

      $(node.el).on('click', '.itemlist a', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();

        if (node.formElement.target)
             var target = $(node.formElement.target);
        else var target = $('.choosen');

        if (typeof evt.target.attributes.style !== 'undefined') {
           target.attr('style', evt.target.attributes.style.value);
           var value = evt.target.attributes.style.value;
        }
        else if (evt.target.className != '') {
           target.attr('class', evt.target.className + ' in-marquee');
           var value = evt.target.className;
        }

        $(node.el).find('input').attr('value', value);
      });
    }
  },

   JSONForm.fieldTypes['captcha'] = {
      'template': '<div id="<%=node.id%>-container" class="rtk_captcha">'+
                    '<div class="eq-so-container">'+
                      '<div class="eq">'+
                         '<div>'+
                         '<span class="<%= eq.first_digit%>"></span>'+
                         '<span class="<%= eq.operator%>"></span>'+
                         '<span class="<%= eq.second_digit%>"></span>'+
                         '</div>'+
                         '<span class="equal"></span>'+
                         '<span class="result"><label>?</label></span>'+
                      '</div>'+
                      '<div class="so">'+
                         '<ul>'+
                         '<%_.each(ans, function(val, key) {%>'+
                            '<li><%= val %></li>'+
                         '<%}); %>'+
                         '</ul>'+
                      '</div>'+
                    '</div>'+
                    '<div class="re" alt="Reload" title="Reload"></div>'+
                    '<input type="hidden" class="captcha" name="<%=node.name%>" id="<%=node.id%>" value="" <%= (node.schemaElement && node.schemaElement.required ? " required=\'required\'" : "") %>/>'+
                  '</div>',
      'fieldtemplate': true,
      'inputfield': true,
      'onBeforeRender': function (data, node) {
         $.ajax({
            type:'GET',
            url:'/services/get_captcha.html',
            dataType:'json',
            async: false,
            success: function( response ) {
              data.eq = response.operation;
              data.ans= response.results;
              right = response.right;
            }
         });
      },
      'onInsert': function(evt, node) {
         var list_size= $('#'+node.id+'-container .so ul li').length;

         /// method to reload captcha
         $('#'+node.id+'-container .re').click(function() {
            $.ajax({
               type:'GET',
               url:'/services/get_captcha.html',
               dataType:'json',
               async: false,
               success: function( response ) {
                  $('#'+node.id+'-container .so ul li').each(function(key) {
                     $(this).html(response.results[key]);
                     $(this).removeClass('selected');
                  });

                  $('#'+node.id+'-container .eq span:eq(0)').removeAttr('class').addClass(response.operation.first_digit);
                  $('#'+node.id+'-container .eq span:eq(1)').removeAttr('class').addClass(response.operation.operator);
                  $('#'+node.id+'-container .eq span:eq(2)').removeAttr('class').addClass(response.operation.second_digit);
                  $('#'+node.id+'-container .eq .result label').html('?');
                  $('#'+node.id).val('');
                  $('#'+node.id).valid();
               }
            });
         });

         /// method to resolve captcha
         $('#'+node.id+'-container .so ul li').click(function() {
            var curr_sol = $(this).html();

            $(this).parent().find('li').each(function(key) {
               if ($(this).html() != curr_sol) {
                  $(this).removeClass('selected');
                  $('#'+node.id).val('');
                  $('#'+node.id+'-container .eq .result label').html('?');
               }
            });

            if ($(this).hasClass('selected')) {
               $(this).removeClass('selected');
               $('#'+node.id).val('');
               $('#'+node.id+'-container .eq .result label').html('?');
            }
            else {
               $(this).addClass('selected');

               var eq = $('#'+node.id+'-container .eq div span:eq(0)').attr('class')+':'+
                        $('#'+node.id+'-container .eq div span:eq(1)').attr('class')+':'+
                        $('#'+node.id+'-container .eq div span:eq(2)').attr('class')+':'+
                        $(this).html();

               $('#'+node.id).val(eq);
               $('#'+node.id+'-container .eq .result label').html($(this).html());
            }

            if (typeof $('#'+node.id).valid === 'function')
            $('#'+node.id).valid();

            return false;
         });
      }
   };

   JSONForm.fieldTypes['swcheckbox'] = {
      'template': '<div id="<%=node.id%>" class="checkbox checkbox-switchery checkbox-<%=position%> switchery-<%=size%>">' +
                  '<label class="display-block">' +
                  '<input type="checkbox" class="swcheckbox switchery" name="<%=node.name%>"<%=checked%> value="<%= value %>">' +
                  '<%= inlinetitle %>' +
                  '</label>' +
                  '</div>',
      'onBeforeRender': function(data, node) {
         var elt = node.formElement || {};

         data.position = elt.position || 'right';
         data.size = elt.size || 'xs';
         data.checked = elt.checked || '';
         data.inlinetitle = elt.inlinetitle || '';
      }
   };

   JSONForm.fieldTypes['tabcontent'] = {
      'template': '<div id="<%=panecode%>" class="tab-pane<%=(node.formElement.active)?" active":""%>" data-idx="<%=node.childPos%>">' +
                  '<%=children%>'+
                  '</div>',
      'onBeforeRender': function (data, node) {
          var father = node.parentNode.formElement;
          data.panecode = ((father.prefix) ? father.prefix+'-':'') + node.formElement.id;
      }
   };

   JSONForm.fieldTypes['fieldtab'] = {
      'template': '<div id="<%=node.id%>" class="tabbable">'+
                  '<ul class="<%=node.id%>-tabs <%=node.formElement.htmlClass%>">'+
                     '<%_.each(tabs, function(tab, key) {%>'+
                       '<li class="<%=(tab.active)?"active":""%>">'+
                       '<a href="#<%=tab.code%>" data-toggle="tab"><%= tab.title %></a>'+
                       '</li>'+
                     '<%}); %>'+
                     '</ul>'+
                     '<div class="tab-content">'+
                       '<%=children%>'+
                     '</div>'+
                  '</div>',
    'getElement': function (el) {
      return $(el).parent().get(0);
    }, 
    'onBeforeRender': function (data, node) {
         var elt = node.formElement || {};
         var tabs= [];
         var children = null;
         var currtab  = null;
         var contents = {};

         data.customClass = '';

         _.each(node.children, function (item, idx) {
            var tab = {};
            tab.code = ((elt.prefix) ? elt.prefix+'-':'') + item.formElement.id;
            tab.active = (item.formElement.active) ? item.formElement.active : false;
            tab.title = (item.formElement.title) ? item.formElement.title : '';
            tabs.push(tab);
         });

         data.tabs = tabs;
      },
      'onInsert': function(evt, node) {
         $('#'+node.id+' ul.'+node.id+'-tabs li a').click(function (e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            $(this).tab('show');
         })
      }
   }
})(jQuery);

