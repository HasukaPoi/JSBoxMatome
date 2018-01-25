$app.strings = {
  "en": {
    "TITLE": "yande.re Getter",
    "TAGS": "Tags",
    "SEARCH": "Search",
    "PREVIEW": "Preview"
  },
  "zh-Hans": {
    "TITLE": "yande.re 获取器",
    "TAGS": "关键字",
    "SEARCH": "搜索",
    "PREVIEW": "预览"
  }
}

$ui.render({
  props: {
    title: $l10n("TITLE")
  },
  views: [{
    type: "input",

    props: {
      id: "keyword",
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
        $console.info("returned")
        search()
      }
    }
  }, {
    type: "button",
    props: {
      title: $l10n("SEARCH"),
      id: "search"
    },
    layout: function (make, view) {
      make.left.equalTo($("keyword").right).offset(10)
      make.centerY.equalTo($("keyword"))
      make.width.equalTo(60)
    },
    events: {
      tapped: function (sender) {
        $console.info("tapped")
        search()
      }
    }
  }, {
    type: "list",
    props: {
      rowHeight: 96.0,
      separatorInset: $insets(0, 5, 0, 0),
      template: [
        {
          type: "image",
          props: {
            id: "preview"
          },
          layout: function (make, view) {
            make.left.top.bottom.inset(5)
            make.width.equalTo(view.height)
          }
        },
        {
          type: "label",
          props: {
            id: "tags",
            font: $font("bold", 17),
            lines: 0
          },
          layout: function (make) {
            make.left.equalTo($("preview").right).offset(10)
            make.top.bottom.equalTo(0)
            make.right.inset(10)
          }
        }
      ],
      actions: [
        {
          title: "Preview",
          handler: function(tableView, indexPath) {
            $ui.toast("preview"+tableView.object(indexPath).sample)
          }
        }
      ]
    },
    layout: function (make, view) {
      make.top.equalTo($("keyword").bottom).offset(20)
      make.left.right.bottom.equalTo(0)
    }
  }]
})

function render2(posts) {
  var data = []
  for (var idx in posts) {
    var post = posts[idx]
    data.push({
      preview: { src: post.preview_url },
      tags: { text: post.id + "\t" + post.jpeg_width + " * " + post.jpeg_height + "\n" + post.tags},
      sample: post.sample_url,
    })
  }
  $("list").data = data
  $("list").endRefreshing()
}

function search() {
  var keyword = $("keyword").text
  $ui.loading(true)
  $http.get({
    url: "https://yande.re/post.json?api_version=2&limit=10&tags=" + keyword,
    handler: function (resp) {
      $ui.loading(false)
      $console.info(resp.data.posts)
      render2(resp.data.posts)
    }
  })
}
