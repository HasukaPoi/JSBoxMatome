del()
tuduku()

function tuduku(){
  $ui.menu({
    items: ["继续删除"],
    handler: function (title, idx) {
      if(idx==0){
        del()
        tuduku()
      }
    }
  })
}

function del(){
  $photo.delete({
    type: $assetMedia.type.image,
    subType: $assetMedia.subType.none,
    count: 1
  })
}