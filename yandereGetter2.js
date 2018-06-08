$app.strings = {
  "en": {
    "TITLE": "yande.re Getter",
    "TAGS": "Tags",
    "SEARCH": "Search",
    "PREVIEW": "Preview",
    "PREV": "Prev",
    "NEXT": "Next",
    "INVALID_PAGE": "Invalid Page",
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
    "PREV": "←",
    "NEXT": "→",
    "INVALID_PAGE": "页码无效",
    "DL": "保存",
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
        newSearch()
      }
    }
  }/* , {
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
  } */, {
    type: "button",
    props: {
      title: $l10n("PREV"),
      id: "prev"
    },
    layout: function (make, view) {
      make.left.equalTo($("keyword").right).offset(15)
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

        } else {
          $ui.error($l10n("INVALID_PAGE"))
        }
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
      make.width.equalTo(32)
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
    type: "button",
    props: {
      title: $l10n("SET"),
      id: "set"
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
                items: [1, 2, 3, 4, 5].map(function (item) { return item }),
                handler: function (title, idx) {
                  var count = idx + 1
                  $cache.set("columns", count)
                  $ui.toast("该设置重启扩展后生效")
                }
              })
            } else if (idx == 1) {
              $ui.menu({
                items: [20, 30, 40, 50],
                handler: function (title, idx) {
                  var count = title
                  $console.info(count)
                  $cache.set("limit", count)
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
      //itemHeight:128,
      square: true,
      spacing: 5,
      template: [{
        type: "image",
        props: {
          id: "preview",
          contentMode: $contentMode.scaleAspectFit
        },
        layout: function (make, view) {
          make.left.top.bottom.right.inset(0)
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
      }],
    },
    layout: function (make, view) {
      make.top.equalTo($("keyword").bottom).offset(10)
      make.left.right.bottom.equalTo(0)
    },
    events: {
      didSelect: function (tableView, indexPath) {
        var post = tableView.object(indexPath)
        //preview(post)
        var message = {
          title: "请选择需要的图片质量",
          message: "若JPEG显示为0kB，则与origin为同文件",
          actions: [{
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
            title: "Origin "+makeSizeText(0,0,post.file_size),
            handler: function () {
              preview(post, "origin")
            }
          },
          {
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
    size=size.toFixed(2)
    unit = "MB"

  } else size=size.toFixed(2)
  if (width > 0) return "(" + width + "*" + height + ", " + size + unit + ")"
  else return "(" + size + unit + ")"

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

function render2(posts) {
  var data = []
  for (var idx in posts) {
    var post = posts[idx]
    data.push({
      preview: { src: post.preview_url },
      tags: { text: post.jpeg_width + "*" + post.jpeg_height },
      sample: post.sample_url,
      jpeg: post.jpeg_url,
      origin: post.file_url,
      id: post.id,
      file_size: post.file_size,
      jpeg_width: post.jpeg_width,
      jpeg_height: post.jpeg_height,
      jpeg_size: post.jpeg_file_size,
      sample_width: post.sample_width,
      sample_height: post.sample_height,
      sample_size: post.sample_file_size
    })
  }
  $("matrix").data = data
  $("matrix").endRefreshing()
}

function newSearch() {
  currentPage = 1
  $cache.set("keyw", $("keyword").text.replace(/ /, "+"))
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
        animated: true // 默认为 true
      })
    }
  })
}




function preview(post, q) {
  q = arguments[1] ? arguments[1] : "sample"
  if ($cache.get(post.id + q)) {
    showpreview(post, q)
  } else {
    $ui.toast("下载" + q + "中")
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

// function showpreview(post) {
//   $console.info(post.jpeg)
//   $ui.push({
//     props: {
//       title: $l10n("PREVIEW") + ": #" + post.id
//     },
//     views: [{
//       type: "image",
//       props: {
//         // src: post.sample,
//         data: $cache.get(post.id),
//         id: "current",
//         contentMode: $contentMode.scaleAspectFit
//       },
//       layout: $layout.fill
//     },{
//       type: "button",
//       props: {
//         title: $l10n("DL_H") + "(" + post.jpeg_width + "*" + post.jpeg_height + ")",
//         id: "dl_h"
//       },
//       layout: function (make, view) {
//         make.left.bottom.inset(10)
//         make.height.equalTo(32)
//       },
//       events: {
//         tapped: function (sender) {
//           $ui.toast("下载大图中")
//           $ui.loading(true)
//           $http.download({
//             url: post.jpeg,
//             progress: function (bytesWritten, totalBytes) {
//               var percentage = bytesWritten * 1.0 / totalBytes
//               $ui.progress(percentage)
//             },
//             handler: function (resp) {
//               $ui.loading(false)
//               $photo.save({
//                 data: resp.data,
//                 handler: function (success) {
//                   share(resp.data)
//                 }
//               })
//             }
//           })
//         }
//       }
//     },{
//       type: "button",
//       props: {
//         title: $l10n("DL"),
//         id: "dl"
//       },
//       layout: function (make, view) {
//         make.bottom.equalTo($("dl_h").top).offset(-10)
//         make.left.equalTo($("dl_h"))
//       },
//       events: {
//         tapped: function (sender) {
//           $photo.save({
//             data: $cache.get(post.id),
//             handler: function (success) {
//               share($cache.get(post.id))
//             }
//           })
//         }
//       }
//     }]
//   })
// }

var currentPage = 0;
if ($cache.get("keyw")) {
  $("keyword").text = $cache.get("keyw")
}