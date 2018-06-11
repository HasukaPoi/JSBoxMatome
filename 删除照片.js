del();

function del() {
  $photo.delete({
    type: $assetMedia.type.image,
    subType: $assetMedia.subType.none,
    count: 1,
    handler: function (arg0) {
      if (arg0) {
        del()
      }
    }
  })
}