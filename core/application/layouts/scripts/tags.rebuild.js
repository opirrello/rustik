function tagsRebuild(text, tagsRebuild) {
   var specialchars = 'áâäàåéêëèíïîìóôöòüûùúÿÁÂÄÀÅÉÊËÈÍÏÎÌÓÔÖÒÜÛÙÚŸçÇæÆ';

   if (!tagsRebuild)
   return text;

   if (!new RegExp('/#\\w+:([\\w'+specialchars+']+)', "g").test(text)) {
      return text;
   }

   var tagIds = [];

   for(id in tagsRebuild){
      tagIds.push(id);
   }

   for (idx in tagIds) {
      var tagStr = tagsRebuild[tagIds[idx]].split('$$');
      var tagOpen = tagStr[0];
      var tagClose = tagStr[1];
      var regex = new RegExp('/#'+tagIds[idx]+':([\\w\\s'+specialchars+']+)/', "g");

      if (regex.test(text)) {
         text = text.replace(regex, tagOpen+'$1'+tagClose);
      }
   }

   return text;
}
