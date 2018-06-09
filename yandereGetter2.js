$app.strings = {
  "en": {
    "TITLE": "yande.re Getter",
    "TAGS": "Tags",
    "SEARCH": "Search",
    "PREVIEW": "Preview",
    "DL": "DL",
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
    "DL": "保存",
    "DL_H": "保存大图 ",
    "SAVED": "已保存到相册",
    "SHARE": "是否进行分享？",
    "SHARE_QQ": "分享到QQ",
    "DO_NO": "什么都不做",
    "SET": "设置"
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
      placeholder: $l10n("TAGS")
    },
    layout: function (make, view) {
      make.left.inset(10)
      make.top.inset(5)
      make.size.equalTo($size(150, 32))
    },
    events: {
      returned: function (sender) {
        newSearch()
      }
    }
  }, {
    type: "button",
    props: {
      title: $l10n("SEARCH"),
      id: "search"
    },
    layout: function (make, view) {
      make.left.equalTo($("keyword").right).offset(5)
      make.centerY.equalTo($("keyword"))
      make.width.equalTo(60)
    },
    events: {
      tapped: function (sender) {
        newSearch()
      }
    }
  }, {
    type: "button",
    props: {
      title: "←",
      id: "prev"
    },
    layout: function (make, view) {
      make.left.equalTo($("search").right).offset(10)
      make.centerY.equalTo($("keyword"))
      make.width.equalTo(32)
    },
    events: {
      tapped: function (sender) {
        if (currentPage > 0) {
          if (currentPage > 1) {
            currentPage--
            search()
          } else { $ui.error("已经是第一页了") }
        } else { $ui.error("还没有创建新搜索") }
      }
    }
  }, {
    type: "label",
    props: {
      text: "0",
      id: "pageIn",
      align: $align.center
    },
    layout: function (make, view) {
      make.left.equalTo($("prev").right).offset(5)
      make.centerY.equalTo($("keyword"))
      make.width.equalTo(18)
    },
    events: {
      tapped: function (sender) {
        if ($("pageIn").text > 0) {
          $input.text({
            type: $kbType.number,
            placeholder: "请输入页码",
            handler: function (text) {
              currentPage = text
              search()
            }
          })
        }
      }
    }
  }, {
    type: "button",
    props: {
      title: "→",
      id: "next"
    },
    layout: function (make, view) {
      make.left.equalTo($("pageIn").right).offset(5)
      make.centerY.equalTo($("keyword"))
      make.width.equalTo(32)
    },
    events: {
      tapped: function (sender) {
        if (currentPage > 0) {
          currentPage++
          search()
        } else {
          $ui.error($ui.error("还没有创建新搜索"))
        }
      }
    }
  }, {
    type: "button",
    props: {
      title: $l10n("SET")
    },
    layout: function (make, view) {
      make.left.equalTo($("next").right).offset(15)
      make.centerY.equalTo($("keyword"))
      make.width.equalTo(48)
    },
    events: {
      tapped: function (sender) {
        $ui.menu({
          items: ["设置列数", "设置每页图片数量"],
          handler: function (title, idx) {
            if (idx == 0) {
              $ui.menu({
                items: [1, 2, 3, 4, 5],
                handler: function (title, idx) {
                  $cache.set("columns", title)
                  $ui.toast("该设置重启扩展后生效")
                }
              })
            } else if (idx == 1) {
              $ui.menu({
                items: [20, 30, 40, 50],
                handler: function (title, idx) {
                  $console.info(title)
                  $cache.set("limit", title)
                  $ui.toast("该设置下次搜索生效")
                }
              })
            }
          }
        })
      }
    }
  }, {
    type: "matrix",
    props: {
      columns: $cache.get("columns") ? $cache.get("columns") : 3,
      square: true,
      spacing: 5,
      template: [{
        type: "image",
        props: {
          id: "preview",
          contentMode: $contentMode.scaleAspectFit
        },
        layout: $layout.fill
      }],
    },
    layout: function (make, view) {
      make.top.equalTo($("keyword").bottom).offset(5)
      make.left.right.bottom.equalTo(0)
    },
    events: {
      didSelect: function (tableView, indexPath) {
        var post = tableView.object(indexPath)
        //preview(post)
        var message = {
          title: post.id + " 请选择需要的图片质量",
          message: "若JPEG显示为0kB，则与origin为同文件",
          actions: [{
            title: "查看Tags",
            handler: function () {
              $ui.push({
                props: {
                  title: "Tags: #" + post.id
                },
                views: [{
                  type: "label",
                  props: {
                    text: post.tags.split(" ").join("\n"),
                    align: $align.center,
                    lines: 0,
                    font: $font("bold", 18)
                  },
                  layout: $layout.fill
                }]
              })
            }
          }, {
            title: "Sample " + makeSizeText(post.sample_width, post.sample_height, post.sample_size),
            handler: function () {
              preview(post, "sample")
            }
          }, {
            title: "JPEG " + makeSizeText(post.jpeg_width, post.jpeg_height, post.jpeg_size),
            handler: function () {
              preview(post, "jpeg")
            }
          }, {
            title: "Origin " + makeSizeText(0, 0, post.file_size),
            handler: function () {
              preview(post, "origin")
            }
          }, {
            title: "取消",
            style: "Cancel"
          }
          ]
        }
        $ui.action(message)
      },
      pulled: function (sender) {
        search()
      }
    }
  }]
})

function makeSizeText(width, height, size) {
  var unit = "kB"
  size /= 1024
  if (size > 1000) {
    size /= 1024
    size = size.toFixed(2)
    unit = "MB"
  } else {
    size = size.toFixed(0)
  }

  if (width > 0) {
    return "(" + width + "*" + height + ", " + size + unit + ")"
  } else {
    return "(" + size + unit + ")"
  }

}

function newSearch() {
  currentPage = 1
  $cache.set("keyw", $("keyword").text.replace(/ /g, "+"))
  search()
}

function search() {
  $("keyword").blur()
  $("pageIn").text = currentPage
  if (currentPage == 0) return;
  //var keyword = $("keyword").text
  var keyword = $cache.get("keyw") ? $cache.get("keyw") : ""
  $ui.loading(true)
  $http.get({
    url: "https://yande.re/post.json?api_version=2&limit=" + ($cache.get("limit") ? $cache.get("limit") : 20) + "&tags=" + keyword + "&page=" + currentPage,
    handler: function (resp) {
      $ui.loading(false)
      render2(resp.data.posts)
      $("matrix").scrollTo({
        indexPath: $indexPath(0, 0),
        animated: true
      })
    }
  })
}

function render2(posts) {
  var data = []
  for (var idx in posts) {
    var post = posts[idx]
    data.push({
      preview: { src: post.preview_url },
      id: post.id,
      tags: post.tags,
      sample: post.sample_url,
      sample_width: post.sample_width,
      sample_height: post.sample_height,
      sample_size: post.sample_file_size,
      jpeg: post.jpeg_url,
      jpeg_width: post.jpeg_width,
      jpeg_height: post.jpeg_height,
      jpeg_size: post.jpeg_file_size,
      origin: post.file_url,
      file_size: post.file_size,
    })
  }
  $("matrix").data = data
  $("matrix").endRefreshing()
}

function preview(post, q) {
  q = arguments[1] ? arguments[1] : "sample"
  if ($cache.get(post.id + q)) {
    showpreview(post, q)
  } else {
    $ui.toast("Downloading: " + q)
    $ui.loading(true)
    $http.download({
      url: post[q],
      handler: function (resp) {
        $ui.loading(false)
        $cache.set(post.id + q, resp.data)
        showpreview(post, q)
      }
    })
  }
}

function showpreview(post, q) {
  q = arguments[1] ? arguments[1] : "sample";
  $ui.push({
    props: {
      title: $l10n("PREVIEW") + ": #" + post.id
    },
    views: [{
      type: "image",
      props: {
        data: $cache.get(post.id + q),
        id: "current",
        contentMode: $contentMode.scaleAspectFit
      },
      layout: $layout.fill
    }, {
      type: "button",
      props: {
        title: $l10n("DL") + q,
        id: "dl"
      },
      layout: function (make, view) {
        make.left.bottom.inset(10)
        make.height.equalTo(32)

      },
      events: {
        tapped: function (sender) {
          $photo.save({
            data: $cache.get(post.id + q),
            handler: function (success) {
              share($cache.get(post.id + q))
            }
          })
        }
      }
    }]
  })
}

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

var currentPage = 0;
if ($cache.get("keyw")) {
  $("keyword").text = $cache.get("keyw")
}