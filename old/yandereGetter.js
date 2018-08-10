$app.strings = {
  "en": {
    "TITLE": "yande.re Getter",
    "TAGS": "Tags",
    "SEARCH": "Search",
    "PREVIEW": "Preview",
    "PREV": "Prev",
    "NEXT": "Next",
    "INVALID_PAGE": "Invalid Page",
    "DL": "DL SQ",
    "DL_H": "DL HQ",
    "SAVED": "Saving succeed",
    "SHARE": "Ready to share?",
    "SHARE_QQ": "Share to QQ",
    "DO_NO": "Do nothing"
  },
  "zh-Hans": {
    "TITLE": "yande.re 获取器",
    "TAGS": "关键字",
    "SEARCH": "搜索",
    "PREVIEW": "预览",
    "PREV": "←",
    "NEXT": "→",
    "INVALID_PAGE": "页码无效",
    "DL": "保存小图",
    "DL_H": "保存大图 ",
    "SAVED": "已保存到相册",
    "SHARE": "是否进行分享？",
    "SHARE_QQ": "分享到QQ",
    "DO_NO": "什么都不做"
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
        currentPage = 1
        $cache.set("keyw", $("keyword").text)
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
      template: [{
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
      actions: [{
        title: $l10n("DL_H"),
        handler: function (tableView, indexPath) {
          $ui.loading("Downloading")
          $http.download({
            url: tableView.object(indexPath).jpeg,
            progress: function (bytesWritten, totalBytes) {
              var percentage = bytesWritten * 1.0 / totalBytes
              $ui.progress(percentage)
            },
            handler: function (resp) {
              $ui.loading(false)
              $photo.save({
                data: resp.data,
                handler: function (success) {
                  share(resp.data)
                }
              })
            }
          })
        }
      }, {
        title: $l10n("DL"),
        handler: function (tableView, indexPath) {
          $ui.loading("Downloading")
          $http.download({
            url: tableView.object(indexPath).sample,
            progress: function (bytesWritten, totalBytes) {
              var percentage = bytesWritten * 1.0 / totalBytes
              $ui.progress(percentage)
            },
            handler: function (resp) {
              $ui.loading(false)
              $photo.save({
                data: resp.data,
                handler: function (success) {
                  share(resp.data)
                }
              })
            }
          })
        }
      }, /* {
        title: $l10n("PREVIEW"),
        handler: function (tableView, indexPath) {
          var post = tableView.object(indexPath)
          preview(post)
        }
      } */]
    },
    layout: function (make, view) {
      make.top.equalTo($("keyword").bottom).offset(20)
      make.left.right.bottom.equalTo(0)
    },
    events: {
      didSelect: function (tableView, indexPath) {
        var post = tableView.object(indexPath)
        preview(post)
      },
      pulled: function (sender) {
        search()
      }
    }
  }]
})

function share(data) {
  var message = {
    title: $l10n("SAVED"),
    message: $l10n("SHARE"),
    actions: [{
      title: $l10n("SHARE_QQ"),
      handler: function () {
        $share.qq(data)
      }
    }, {
      title: "Share Sheet",
      handler: function () {
        $share.sheet(data)
      }
    }, {
      title: "JSBox Universal",
      handler: function () {
        $share.universal(data)
      }
    }, {
      title: $l10n("DO_NO"),
      style: "Cancel"
    }]
  }
  $ui.action(message)
}

function render2(posts) {
  var data = []
  for (var idx in posts) {
    var post = posts[idx]
    data.push({
      preview: { src: post.preview_url },
      tags: { text: post.id + "\t" + post.jpeg_width + "*" + post.jpeg_height + "\n" + post.tags },
      sample: post.sample_url,
      jpeg: post.jpeg_url,
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
  $ui.loading("Downloading")
  $http.get({
    url: "https://yande.re/post.json?api_version=2&limit=15&tags=" + keyword + "&page=" + currentPage,
    handler: function (resp) {
      $ui.loading(false)
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
    $ui.loading("Downloading")
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
  $console.info(post.jpeg)
  $ui.push({
    props: {
      title: $l10n("PREVIEW") + ": " + post.id
    },
    views: [{
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
        make.height.equalTo(32)
      },
      events: {
        tapped: function (sender) {
          $photo.save({
            data: $cache.get(post.id),
            handler: function (success) {
              share($cache.get(post.id))
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
          $ui.loading("Downloading")
          $http.download({
            url: post.jpeg,
            progress: function (bytesWritten, totalBytes) {
              var percentage = bytesWritten * 1.0 / totalBytes
              $ui.progress(percentage)
            },
            handler: function (resp) {
              $ui.loading(false)
              $photo.save({
                data: resp.data,
                handler: function (success) {
                  share(resp.data)
                }
              })
            }
          })
        }
      }
    }]
  })
}

var currentPage = 0;
if ($cache.get("keyw")) {
  $("keyword").text = $cache.get("keyw")
}