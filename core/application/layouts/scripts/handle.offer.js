(function ($) {
   $(document).ready(function() {
      //------------------ HANDLE PREVIEW LANDING ------------------------//
      $('#offer-modal-preview').on('show.bs.modal', function() {
         var iframe = document.createElement('iframe');
         var height = Math.ceil($(window).height() / 1.3);

         iframe.setAttribute('src', $('#preview-url').attr('rel'));
         iframe.setAttribute('id',  'offer-iframe-preview');
         iframe.setAttribute('width','100%');
         iframe.setAttribute('height',height);
         $('#offer-modal-preview').find('.modal-body').append(iframe);

         document.getElementById('offer-iframe-preview').src =
         document.getElementById('offer-iframe-preview').src;
      });

      $('#offer-modal-preview').on('hidden.bs.modal', function() {
         var iframe = document.getElementById('offer-iframe-preview');
         iframe.parentNode.removeChild(iframe);
      });

      //------------------ HANDLE TRACKING LINK -------------------------//
      $('body').on('click', '#tracking-link-modal .copy', function(e) {
         copyToClipboard($('#tracking-link-modal .alert span').text());
         createAlertLabel('success', $('#tracking-link-modal .link'), {description:'Copied!'});
         
         $('#tracking-comment').attr('disabled',false);
         $('#tracking-comment').keyup(function() {
            if ($(this).val() != '') {
               $('#tracking-comment').attr('aria-invalid','false');
               $('#tracking-comment').removeClass('error');
               $('#tracking-comment').addClass('valid');
               $('.sa-confirm-button-container button').attr('disabled',false);
            }
            else {
               $('#tracking-comment').attr('aria-invalid','true');
               $('#tracking-comment').removeClass('valid');
               $('#tracking-comment').addClass('error');
               $('.sa-confirm-button-container button').attr('disabled','disabled');
            }
         });
      });

      $('#offer-detail-container').on('click','#tracking-link', function(e) {
         e.preventDefault();
         performTracking($(this));
      });

      $('#offerwall-container').on('click','#tracking-link', function(e) {
         e.preventDefault();
         performTracking($(this));
      });

      //------------------ HANDLE APPLY TO RUN -------------------------//
      $('#offer-detail-container, #offerwall-container').on('click','#apply-to-run', function(e) {
         e.preventDefault();
         performApply($(this));
      });

      var performTracking = function(el) {
         var offerId = el.attr('rel');

         $.ajax({  
            type: 'POST',
            url: RM_DOMAIN+'/services/get_tracking_link_for-'+offerId+'.html',
            dataType:'json',
            beforeSend: function() { $('body').startSpin(); },
            success: function(response) {
               $('body').stopSpin();

               var title = 'Get the tracking link now!';
               var comment = '<div id="tracking-link-modal" class="jsonform">'+
                             '<form id="tracking">'+ 
                             '<div>'+ 
                             '<div class="control-group link">'+
                             '<div class="alert bg-primary alert-styled-left link-box">'+
                             '<span>'+response.data.link+'</span>'+
                             '<a href="#" class="copy icon icon-copy3" alt="Copy" title="Copy" rel="Link copied!"></a>'+
                             '</div>'+
                             '</div>'+
                             '<div class="control-group">'+
                             '<textarea disabled="disabled" class="valid" aria-invalid="false" id="tracking-comment" placeholder="You must send your intention with this link">'+
                             '</textarea>'+
                             '</div>'+ 
                             '</div>'+
                             '</form>'+
                             '</div>';

               var call = function() {
                  $('.sa-confirm-button-container button').attr('disabled', 'disabled');
                  $('.sa-confirm-button-container .la-ball-fall').remove();
               };

               var confObj = {
                  cancel: 'Cancel',
                  cancelCb: function() {
                     createAlertWindow({title:'Action cancelled', type:'none', translate:false});
                  },
                  confirm: 'Send comment!',
                  confirmCb: function() {
                     var comm = $('#tracking-comment').val();
                     var link = $('#tracking-link-modal .alert span').text();

                     if (comm == '') {
                        $('#tracking-comment').attr('aria-invalid','true');
                        $('#tracking-comment').removeClass('valid');
                        $('#tracking-comment').addClass('error');
                     }
                     else {
                        $('#tracking-comment').attr('aria-invalid','false');
                        $('#tracking-comment').removeClass('error');
                        $('#tracking-comment').addClass('valid');
                        postData({offer_cpa_id:offerId, link:link, comment:comm}, 'register', 'tlink', false);
                     }
                  }
               }

               createAlertWindow({title:title, text:comment, type:'none', translate:false, confirmation:confObj}, call);
            }
         });
      }

      var performApply = function(el) {
         var offerId = el.attr('rel');

         var title   = 'Apply to run this offer!';
         var comment = '<div id="apply-to-run-modal" class="jsonform">'+
                       '<form id="apply">'+ 
                       '<div>'+ 
                       '<div class="control-group">'+
                       '<textarea class="valid" aria-invalid="false" id="apply-comment" placeholder="You must send your intention with this offer to get the tracking link">'+
                       '</textarea>'+
                       '</div>'+ 
                       '<div class="control-group">'+
                       '<label class="checkbox">'+
                       '<input type="checkbox" id="accept" name="accept" require="true" style="display:block; width:auto; margin:4px 0 0;">'+
                       '<span style="float:left; padding-left:20px">'+
                       'I agree to the <a href="https://toroadvertising.com/terms-and-conditions.php" target="_blank">terms and conditions</a>'+
                       '</span>'+
                       '</label>'+
                       '</div>'+ 
                       '</div>'+
                       '</form>'+
                       '</div>';

         var checkfields = function() {
            var valid_comment, valid_accept = false;

            if ($('#apply-comment').val() != '') {
               $('#apply-comment').attr('aria-invalid','false');
               $('#apply-comment').removeClass('error');
               $('#apply-comment').addClass('valid');

               valid_comment = true;
            }
            else {
               $('#apply-comment').attr('aria-invalid','true');
               $('#apply-comment').removeClass('valid');
               $('#apply-comment').addClass('error');

               valid_comment = false;
            }

            if ($('#accept').is(':checked'))
                 valid_accept = true;
            else valid_accept = false;
               
            if (valid_comment && valid_accept)
                 $('.sa-confirm-button-container button').attr('disabled',false);
            else $('.sa-confirm-button-container button').attr('disabled','disabled');
         };

         var call = function() {
            $('.sa-confirm-button-container button').attr('disabled', 'disabled');
            $('.sa-confirm-button-container .la-ball-fall').remove();

            /// validating comment field
            $('#apply-comment').keyup(function() {
               checkfields();
            });

            /// validating accept field
            $('#accept').click(function() {
               checkfields();
            });
         };

         var confObj = {
             confirm: 'Send comment!',
             cancel: 'Cancel',
             cancelCb: function() {
                var text = 'The offer request has been canceled, you have to consider that the only way '+
                           'to be able to run the offer is by confirming the request.';

                createAlertWindow({title:'Action cancelled', text:text, type:'none', translate:false});
             },
             confirmCb: function() {
                var comm = $('#apply-comment').val();

                if (comm == '') {
                   $('#apply-comment').attr('aria-invalid','true');
                   $('#apply-comment').removeClass('valid');
                   $('#apply-comment').addClass('error');
                }
                else {
                   $('#apply-comment').attr('aria-invalid','false');
                   $('#apply-comment').removeClass('error');
                   $('#apply-comment').addClass('valid');
                   postData({offer_cpa_id:offerId, comment:comm}, 'register', 'apply', function() {
                     $('#apply-to-run').remove();
                   });
                }
             }
         }

         createAlertWindow({title:title, text:comment, type:'none', translate:false, confirmation:confObj}, call);
      }

      var postData = function(data, action, resource, cb) {
         $.ajax({  
             type: 'POST',
             url: '/resource/'+action+'-'+resource+'.html',
             dataType:'json',
             data: data,
             beforeSend: function() { $('body').startSpin(); },
             success: function(response) {
               $("html, body").animate({ scrollTop: 0 }, "fast");
               $('body').stopSpin();
               
               createAlertWindow({title:response.message.title, text:response.message.description, type:'success', translate:false}, cb(response));
             },
             error: function(jqXHR, textStatus) {
               if (jqXHR.responseJSON) {
                  var response = jqXHR.responseJSON;

                  $("html, body").animate({ scrollTop: 0 }, "fast");
                  $('body').stopSpin();
               
                  createAlertWindow({title:response.message.title, text:response.message.description, type:'error', translate:false}, cb(response));
               }
               else $('body').stopSpin();
             }
         });
      }

      createGraph = function() {
         setTimeout(function(){
            require.config({ paths: { echarts: RM_CORE_JSURL + 'limitless/plugins/visualization/echarts' }});
            require(
               [
                'echarts',
                'echarts/theme/limitless',
                'echarts/chart/line',
                'echarts/chart/bar',
                'echarts/chart/pie'
               ],

               // Charts setup
               function (ec, limitless) {
                  var yaxis = graphdata.yaxis;
                  var xaxis = graphdata.xaxis;

                  if (!graphdata)
                  return false;

                  var myChart = ec.init(document.getElementById('barchart-container'), limitless);
                  var option  = {
                      title: {text:graphdata.title, padding:[0,0,70,0]},
                      legend: {data: [graphdata.yaxis[0].label, graphdata.yaxis[1].label]},
                      color: ['#2196F3', '#B3D6F2'],
                      tooltip: {trigger: 'axis', axisPointer:{type:'shadow'}},
                      grid: { x:55, x2:45, y:55, y2:25 },
                      calculable: true,
                      xAxis: [
                            { type: 'category', data: xaxis[0].data}
                      ],
                      yAxis: [
                            { type:'value', name:yaxis[0].label, min:yaxis[0].min, max:yaxis[0].max },
                            { type:'value', name:yaxis[1].label, min:yaxis[1].min, max:yaxis[1].max, axisLabel: { formatter: '{value}%'} },
                      ],
                      series: [
                            {name:graphdata.yaxis[0].label, type:'bar', data: yaxis[0].data},
                            {name:graphdata.yaxis[1].label, type:'line', yAxisIndex:1, data: yaxis[1].data},
                      ]
                  }

                  myChart.setOption(option);

                  window.onresize = function () {
                     setTimeout(function () {
                        myChart.resize();
                     }, 200);
                  }
               }
            );
        }, 500);
      }
   });
})(jQuery);

