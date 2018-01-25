$app.strings = {
  "en": {
    "TITLE": "yande.re Getter",
    "TAGS": "Tags",
    "SEARCH": "Search",
    "PREVIEW": "Preview",
    "PREV": "Prev",
    "NEXT": "Next"
  },
  "zh-Hans": {
    "TITLE": "yande.re 获取器",
    "TAGS": "关键字",
    "SEARCH": "搜索",
    "PREVIEW": "预览",
    "PREV": "上页",
    "NEXT": "下页"
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
      type: $kbType.ascii,
      //darkKeyboard: true,
      placeholder: $l10n("TAGS")
    },
    layout: function (make, view) {
      make.left.top.inset(10)
      make.size.equalTo($size(150, 32))
    },
    events: {
      returned: function (sender) {
        $console.info("returned")
        currentPage = 1
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
        currentPage = 1
        search()
      }
    }
  }, {
    type: "button",
    props: {
      title: $l10n("PREV"),
      id: "prev"
    },
    layout: function (make, view) {
      make.left.equalTo($("search").right).offset(20)
      make.centerY.equalTo($("keyword"))
      make.width.equalTo(50)
    },
    events: {
      tapped: function (sender) {
        currentPage--
        if (currentPage > 0) {
          search()
        } else {
          $ui.toast("invalid page number")
        }
      }
    }
  }, {
    type: "label",
    props: {
      text: "",
      id: "pageIn",
      align: $align.center
    },
    layout: function (make, view) {
      make.left.equalTo($("prev").right).offset(5)
      make.centerY.equalTo($("keyword"))
      make.width.equalTo(10)
    }
  }, {
    type: "button",
    props: {
      title: $l10n("NEXT"),
      id: "next"
    },
    layout: function (make, view) {
      make.left.equalTo($("pageIn").right).offset(5)
      make.centerY.equalTo($("keyword"))
      make.width.equalTo(50)
    },
    events: {
      tapped: function (sender) {
        if (currentPage > 0) {
          currentPage++
          search()
        } else {
          $ui.toast("invalid page number")
        }
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
          handler: function (tableView, indexPath) {
            $ui.toast("preview" + tableView.object(indexPath).sample)
          }
        }
      ]
    },
    layout: function (make, view) {
      make.top.equalTo($("keyword").bottom).offset(20)
      make.left.right.bottom.equalTo(0)
    },
    events: {
      didSelect: function (tableView, indexPath) {
        var post = tableView.object(indexPath)
        // $console.info(post.sample)
        preview(post)
      },
      pulled: function (sender) {
        search()
      }
    }
  }]
})

function render2(posts) {
  var data = []
  for (var idx in posts) {
    var post = posts[idx]
    data.push({
      preview: { src: post.preview_url },
      tags: { text: post.id + "\t" + post.jpeg_width + " * " + post.jpeg_height + "\n" + post.tags },
      sample: post.sample_url,
      id: post.id,
      ratio: post.jpeg_width / post.jpeg_height
    })
  }
  $("list").data = data
  $("list").endRefreshing()
}

function search() {
  $("keyword").blur()
  $("pageIn").text = currentPage
  var keyword = $("keyword").text
  $ui.loading(true)
  $http.get({
    url: "https://yande.re/post.json?api_version=2&limit=15&tags=" + keyword + "&page=" + currentPage,
    handler: function (resp) {
      $ui.loading(false)
      //$console.info(resp.data.posts)
      render2(resp.data.posts)
    }
  })
}

function preview(post) {
  if ($cache.get(post.id)) {
    showpreview(post)
  } else {
    $ui.loading(true)
    $http.download({
      url: post.sample,
      handler: function (resp) {
        $ui.loading(false)
        $cache.set(post.id, resp.data)
        showpreview(post)
      }
    })
  }
}

function showpreview(post) {
  $ui.push({
    props: {
      title: $l10n("PREVIEW") + ": " + post.id
    },
    views: [
      {
        type: "image",
        props: {
          // src: post.sample,
          data: $cache.get(post.id),
          id: "current",
          contentMode: $contentMode.scaleAspectFit
        },
        layout: $layout.fill
      }
    ]
  })
}

var currentPage = 0;