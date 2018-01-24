$http.download({
  url: "https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg",
  handler: function(resp) {
    $cache.set("test",resp.data)
  }
})

$ui.render({
  views:[{
    type: "image",
    props: {
      src: "https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg"
    },
    layout: function(make, view) {
      make.center.equalTo(view.super)
      make.size.equalTo($size(100, 100))
    }
  }]
})