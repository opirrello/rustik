var initCaptcha = function() {
   grecaptcha.execute();
};
/*
var resetCaptcha = function() {
   grecaptcha.reset();
   grecaptcha.execute();
   var response = grecaptcha.getResponse();
   console.log('reseteando el captcha');
   console.log(response);
};
*/
var getCaptchaResponse = function(response) { 
   $('#signup').submit();
}
