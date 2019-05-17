function copyToClipboard (str) {
   var elem = document.createElement('textarea');

   elem.value = str;
   elem.setAttribute('readonly','');
   elem.style.position = 'absolute';
   elem.style.left = '-9999px';

   document.body.appendChild(elem);

   elem.focus();
   elem.select();
   document.execCommand('copy');
   document.body.removeChild(elem);
}
