$app.strings = {
  "en": {
    "TITLE": "yande.re Getter",
    "TAGS": "Tags",
    "SEARCH": "Search"
  },
  "zh-Hans": {
    "TITLE": "yande.re 获取器",
    "TAGS": "关键字",
    "SEARCH": "搜索"
  }
}

$ui.render({
  props: {
    title: $l10n("TITLE")
  },
  views: [{
    type: "input",
    id: "tags",
    props: {
      type: $kbType.default,
      darkKeyboard: true,
      placeholder: $l10n("TAGS")
    },
    layout: function (make, view) {
      make.left.top.inset(10)
      make.size.equalTo($size(150, 32))
    },
    events: {
      returned: function (sender) {
        search()
      }
    }
  }, {
    type: "button",
    props: {
      title: "search",
      id: "search"
    },
    layout: function (make, view) {
      make.left.equalTo($("input").right).offset(10)
      make.centerY.equalTo($("input"))
      make.width.equalTo(60)
    }
  }]
})

$http.get({
  url: "https://yande.re/post.json?api_version=2&limit=40%tags=",
  handler: function (resp) {
    render(resp.data)
  }
})

function render(data) {
  //$console.info(data)
}

function search() {
  var keyword = $("input").text
  $console.info(keyword)
}