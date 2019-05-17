(function ($) {
   $(document).ready(function() {
      if ($('#password-form-container').length) {
         $('#password-form-container').buildForm({
            jsondata: editpassword,
            modal:false,
            dataType:'json',
            submission: {
               method:'POST', action:'/user/edit_password.html',
               async:true,
               beforeSend: function() { $('body').startSpin(); },
               after: function(container, form, pars, stat, spinCloser) {
                  $("html, body").animate({ scrollTop: 0 }, "slow");

                  if (typeof spinCloser == 'function') {
                     spinCloser();
                  }
               }
            }
         });
      }

      if ($('#profile-form-container').length) {
         $('#profile-form-container').buildForm({
            jsondata: profile,
            modal:false,
            customValidation: {
               'toroalias': function(value, element) {
                  return $.validator.methods.email.call({optional:function(){return false}}, value, element) ||
                         $.validator.methods.useralias.call({optional:function(){return false}}, value, element);
               }
            },
            submission: {
               method:'POST', action:'/user/edit_profile.html',
               async:true,
               beforeSend: function() { $('body').startSpin(); },
               after: function(container, form, pars, stat, spinCloser) {
                  $("html, body").animate({ scrollTop: 0 }, "slow");
   
                  if (typeof stat.code != 'undefined' && stat.code == 200 && pars) {
                     $('.user-fullname').html(pars.fullname);
                     $('.user-alias').html('( '+pars.alias+' )');
                     $('.user-profilename').html(pars.profile);
                     $('.user-status').html(pars.status);
                     $('.profile-thumb img').attr('src', pars.avatar+'?'+Math.floor(Math.random()*1000));

                     $('.user-status').removeClass('bg-'+pars.stcss_old+'-400');
                     $('.user-status').addClass('bg-'+pars.stcss_new+'-400');

                     $('.dropdown-user span').html(pars.fullname);
                     $('.dropdown-user img').attr('src', pars.avatar+'?'+Math.floor(Math.random()*1000));

                     $('.user-profile').html(pars.profile_short);

                     if (pars.remove_restricted_fields) {
                        for (var i in pars.remove_restricted_fields) {
                           $('.jsonform-error-' + pars.remove_restricted_fields[i]).remove();
                        }
                     }
                  }

                  if (typeof spinCloser == 'function') {
                     spinCloser();
                  }
               }
            }
         },function(){
              //----------- styling checkbox as iOS switch -----------------
              if ($('.switchery').length) {
                 var primary = document.querySelector('.switchery');
                 var rgb = $('.switchery').css('color').match(/\d+/g);
                 var hex = '#'+ String('0' + Number(rgb[0]).toString(16)).slice(-2) +
                                String('0' + Number(rgb[1]).toString(16)).slice(-2) +
                                String('0' + Number(rgb[2]).toString(16)).slice(-2);
                 var switchery = new Switchery(primary, {color: hex});
              }

              $('#userprofile .buildform-messagebox').after($('.media'));
              
              //----------- adding toggle control for thumb ---------------
              $('#avatar').load(function() {
                 var currHeight = this.height;
                 var currWidth  = this.weight;

                 if (currHeight < 132) {
                    $(this).css('height','100%');
                 }
                 else if (currWidth < 132) {
                    $(this).css('width','100%');
                 }
                 else if (currHeight > 132) {
                    $(this).css('top', ((currHeight - 132) / 2 ) * -1);
                 }
                 else if (currWidth > 132) {
                    $(this).css('left',((currHeight - 132) / 2 ) * -1);
                 }
              });
              
              $(".input-file").change(function () {
                 if (this.files && this.files[0]) {
                       console.log(this.files[0]);
                    var reader = new FileReader();
                    reader.onload = function (e) {
                       console.log(e);

                       $('#avatar').attr('src', e.target.result);
                    }

                    reader.readAsDataURL(this.files[0]);
                 }
              });

              $("#edit-avatar").on('click', function(e){
                 e.preventDefault();
                 $(".input-file:hidden").trigger('click');
              });
         });

         //$('#user_profile-elt-avatar').fileinput(defaultSingleUploadImg);
         //$('#affiliate_profile-elt-avatar').fileinput(defaultSingleUploadImg);
      }

      //---- Functionality related to authentication ----//
      if ($('#login-form-container').length) {
         $('#login-form-container').buildForm({
            jsondata: loginJson,
            formError: {title: '', description: ''},
            formSuccess: {title: '', description: ''},
            requiredMark:'none',
            customValidation: {
               'toroalias': function(value, element) {
                  return $.validator.methods.email.call({optional:function(){return false}}, value, element) ||
                         $.validator.methods.useralias.call({optional:function(){return false}}, value, element);
               }
            },
            modal:false,
            submission: {
               method:'POST', action:'/auth/login', async:true,
               after: function(container, form, pars, stat, spinCloser) {
                  $("html, body").animate({ scrollTop: 0 }, "slow");
   
                  if (typeof stat.code != 'undefined' && stat.code == 200) {
                     if (pars.redirect) {
                        window.location.replace(pars.redirect);
                     }
                     else window.location.reload(true);
                  }
                  else if (typeof spinCloser == 'function') {
                     spinCloser();
                  }
               }
            }
         });
      }

      $('#user-profile').click(function(e) {
         e.preventDefault();
         window.location.href="/users/edit/profile";
      });

      $('#user-logout, #user-profile-logout').click(function(e) {
         e.preventDefault();

         $.ajax({
            type: 'post',
            url: '/auth/logout',
            data:{},
            beforeSend: function() { $('body').startSpin(); },
            success: function (response) {
               window.location.href = '/auth/sign_in';
            }
         });

         return false;
      });
   });
})(jQuery);
   
