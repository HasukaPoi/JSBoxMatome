$app.strings = {
  "en": {
    "TITLE": "yande.re Getter",
    "TAGS": "Tags",
    "SEARCH": "Search",
    "PREVIEW": "Preview",
    "PREV": "Prev",
    "NEXT": "Next",
    "INVALID_PAGE": "Invalid Page",
    "DL": "Download",
    "DL_H": "DL HQ Ver: ",
    "SAVED": "Saving Succeed"
  },
  "zh-Hans": {
    "TITLE": "yande.re 获取器",
    "TAGS": "关键字",
    "SEARCH": "搜索",
    "PREVIEW": "预览",
    "PREV": "上页",
    "NEXT": "下页",
    "INVALID_PAGE": "页码无效",
    "DL": "直接保存",
    "DL_H": "保存高质量版: ",
    "SAVED": "保存到相册成功"
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
          $ui.error($l10n("INVALID_PAGE"))
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
          $ui.error($l10n("INVALID_PAGE"))
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
      tags: { text: post.id + "\t" + post.sample_width + "*" + post.sample_height + "\n" + post.tags },
      sample: post.sample_url,
      id: post.id,
      jpeg_width: post.jpeg_width,
      jpeg_height: post.jpeg_height,
      sample_width: post.sample_width,
      sample_height: post.sample_height
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
      $("list").scrollTo({
        indexPath: $indexPath(0, 0),
        animated: true // 默认为 true
      })
    }
  })
}

function preview(post) {
  // get preview
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
      },
      {
        type: "button",
        props: {
          title: $l10n("DL"),
          id: "dl"
        },
        layout: function (make, view) {
          make.left.bottom.inset(10)
          //make.size.equalTo($size(64, 32))
          make.height.equalTo(32)
        },
        events: {
          tapped: function (sender) {
            $photo.save({
              data: $cache.get(post.id),
              handler: function (success) {
                $ui.toast("Succeed")
              }
            })
          }
        }
      },
      {
        type: "button",
        props: {
          title: $l10n("DL_H") + "(" + post.jpeg_width + "*" + post.jpeg_height + ")",
          id: "dl_h"
        },
        layout: function (make, view) {
          make.left.equalTo($("dl").right).offset(10)
          make.centerY.equalTo($("dl"))
        },
        events: {
          tapped: function (sender) {
            $ui.toast("暂未实现")
          }
        }
      }
    ]
  })
}

var currentPage = 0;