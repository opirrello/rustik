///// General JS configuration 
defaultSpinOptions = {
   lines: 13, // The number of lines to draw
   length: 38, // The length of each line
   width: 11, // The line thickness
   radius: 37, // The radius of the inner circle
   scale: 0.3,
   opacity: 0.25,
   top:'50%',
   left:'50%',
   color: '#fff', // #rbg or #rrggbb
   fadeColor: 'transparent',
   speed: 0.2, // Rounds per second
   trail: 60, // Afterglow percentage
   shadow: false, // Whether to render a shadow
   position: 'fixed'
}

defaultSingleUploadImg = {
   multiple : false,
   allowedFileTypes: ['image'],
   allowedFileExtensions: ['jpg', 'gif', 'png'],
   fileTypeSetting: 'image',
   browseIcon: '<i class="icon-folder-open"></i>',
   removeIcon: '<i class="icon-bin"></i>',
   layoutTemplates:{fileIcon: '<i class="icon-image2"></i>'},
   showUpload: false,
   showPreview: false,
   hiddenThumbnailContent: true
}

defaultMultiUploadImg = {
   uploadUrl:'x',
   maxFileCount: 5,
   multiple : true,
   allowedFileTypes: ['image'],
   allowedFileExtensions: ['jpg', 'gif', 'png'],
   fileActionSettings: {
       removeIcon: '<i class="icon-bin"></i>',
       removeClass: 'btn btn-link btn-xs btn-icon',
       zoomIcon: '<i class="icon-zoomin3"></i>',
       zoomClass: 'btn btn-link btn-xs btn-icon',
       indicatorNew: '',
       indicatorSuccess: '<i class="icon-checkmark3 file-icon-large text-success"></i>',
       indicatorError: '<i class="icon-cross2 text-danger"></i>',
       showUpload:false,
       showRemove:true
   },
   layoutTemplates : {
       fileIcon: '<i class="icon-file-empty"></i>',
       footer: '<div class="file-thumbnail-footer">\n' +
               '<div class="file-caption-name">{caption}{size}</div' +
               '{actions}\n' +
               '</div>'
   },
   previewSettings:{image:{height:'80px'}},
   fileTypeSetting: 'image',
   browseIcon: '<i class="icon-folder-open"></i>',
   removeIcon: '<i class="icon-bin"></i>',
   showUpload: false,
   hiddenThumbnailContent: true
}

