//Please input your own api key when first use

var origin = ""
var origin2 = ""
var tokenized = ""
var shuffledText = ""

$ui.render({
  views: [{
      type: "label",
      props: {
        text: "请先选中文字或复制文字，再使用下面的工具",
        font: $font("bold", 12),
        id: "mainInfo"
      },
      layout: function (make, view) {
        make.left.inset(10)
        make.top.inset(5)
        make.height.equalTo(16)
        make.width.equalTo(view.width)
      },
      events: {
        tapped: function (sender) {
          if ($app.env != $env.keyboard) {
            $input.text({
              type: $kbType.default,
              handler: function (text) {
                $clipboard.text = text
                getOrigin()
                $("mainInfo").text = "当前剪贴板: " + $clipboard.text
              }
            })
          }
        }
      }
    }, {
      type: "button",
      props: {
        title: "加半角空格",
        id: "pushSpace"
      },
      layout: function (make, view) {
        make.left.inset(10)
        make.width.equalTo(112)
        make.top.equalTo($("mainInfo").bottom).offset(5)
      },
      events: {
        tapped: function (sender) {
          getOrigin()
          if (origin) {
            send(addSpace(origin))
          }
        }
      }
    }, {
      type: "button",
      props: {
        title: "加全角空格",
        id: "pushSpace2"
      },
      layout: function (make, view) {
        make.width.equalTo(112)
        make.left.equalTo($("pushSpace").right).offset(10)
        make.top.equalTo($("mainInfo").bottom).offset(5)
      },
      events: {
        tapped: function (sender) {
          getOrigin()
          if (typeof (origin) != "undefined") {
            send(addSpace(origin, "　"))
          }
        }
      }
    }, {
      type: "button",
      props: {
        title: "逆序",
      },
      layout: function (make, view) {
        make.width.equalTo(112)
        make.left.equalTo($("pushSpace2").right).offset(10)
        make.top.equalTo($("mainInfo").bottom).offset(5)
      },
      events: {
        tapped: function (sender) {
          getOrigin()
          if (typeof (origin) != "undefined") {
            send(flipText(origin))
          }
        }
      }
    }, {
      type: "button",
      props: {
        title: "普通乱序",
        id: "shuffle"
      },
      layout: function (make, view) {
        make.width.equalTo(112)
        make.left.inset(10)
        make.top.equalTo($("pushSpace").bottom).offset(10)
      },
      events: {
        tapped: function (sender) {
          getOrigin()
          if (typeof (origin) != "undefined") {
            $keyboard.playInputClick()
            $("preview").text = shuffle(origin)
          }
        }
      }
    }, {
      type: "button",
      props: {
        title: "→上屏←",
        id: "pushShuffle"
      },
      layout: function (make, view) {
        make.width.equalTo(112)
        make.left.equalTo($("shuffle").right).offset(10)
        make.top.equalTo($("pushSpace").bottom).offset(10)
      },
      events: {
        tapped: function (sender) {
          send($("preview").text)
        }
      }
    }, {
      type: "button",
      props: {
        title: "分词乱序"
      },
      layout: function (make, view) {
        make.width.equalTo(112)
        make.left.equalTo($("pushShuffle").right).offset(10)
        make.top.equalTo($("pushSpace").bottom).offset(10)
      },
      events: {
        tapped: function (sender) {
          getOrigin()
          if (typeof (origin) != "undefined") {
            if (origin2 != origin) {
              //由于哈工大语言云API迁移，以下代码作废，但暂时保留。
              /* 
              $ui.loading(true)
              $("preview").text = "loading"
              $http.get({
                url: "http://api.ltp-cloud.com/analysis/?api_key=c1T867f2y1no3IzEHs3P0YSzCAuzfdnO1rltzjNT&text=" + $text.URLEncode(origin) + "&pattern=ws&format=plain",
                handler: function (resp) {
                  //setTimeout("",2000)                
                  origin2 = origin
                  $ui.loading(false)
                  tokenized = resp.data
                  $console.log(tokenized)
                  $("preview").text = shuffle2(tokenized)
                  $console.log(shuffle2(tokenized))
                }
              }) */

              //原本打算接入讯飞平台，考虑手续繁杂，故放弃。有兴趣的朋友可以自行查找使用。
              origin2 = origin
              $text.tokenize({
                text: origin2,
                handler: function (results) {
                  tokenized = results
                  //$console.info(tokenized)
                  $("preview").text = shuffle2(tokenized)
                }
              })


            } else {
              $("preview").text = shuffle2(tokenized)
            }
          }
        }
      }
    },
    {
      type: "label",
      props: {
        id: "preview",
        text: "【乱序预览区】"
      },
      layout: function (make, view) {

        make.left.right.inset(10)
        make.width.equalTo(view.width)
        make.height.equalTo(32)
        make.top.equalTo($("shuffle").bottom).offset(5)
      }
    }, {
      type: "button",
      props: {
        title: "引用",
        id: "quote"
      },
      layout: function (make, view) {
        make.width.equalTo(80)
        make.left.inset(10)
        make.top.equalTo($("preview").bottom).offset(5)
      },
      events: {
        tapped: function (sender) {
          getOrigin()
          if (typeof (origin) != "undefined") {
            send("“" + origin + "”\n——————————\n")
          }
        }
      }
    }, {
      type: "button",
      props: {
        title: "我↔你",
        id: "u2m"
      },
      layout: function (make, view) {
        make.width.equalTo(80)
        make.left.equalTo($("quote").right).offset(10)
        make.top.equalTo($("preview").bottom).offset(5)
      },
      events: {
        tapped: function (sender) {
          getOrigin()
          if (typeof (origin) != "undefined") {
            send(origin.replace(/你/g, "#WO#").replace(/我/g, "你").replace(/#WO#/g, "我"))
          }
        }
      }
    }
  ]
});

function addSpace(origin, opr) {
  opr = arguments[1] ? arguments[1] : " "
  return origin.split('').join(opr);
}

function flipText(origin) {
  return origin.split('').reverse().join('');
}

function shuffle(origin) {
  var input = origin
  var arr = input.split("");
  arr.sort(function () {
    return Math.random() > 0.5 ? -1 : 1;
  });
  var output = (arr.join(""))
  return output
}

function shuffle2(origin) {
  origin.sort(function () {
    return Math.random() > 0.5 ? -1 : 1;
  });
  var output = (origin.join(""))
  return output
}

function getOrigin() {
  if ($app.env == $env.keyboard) {
    origin = $keyboard.selectedText
    if (typeof (origin) == "undefined") {
      origin = $clipboard.text
      if (typeof (origin) == "undefined") {
        $("preview").text = "选中和剪贴板均为空"
      }
    }
  } else {
    if (!(origin = $clipboard.text)) {
      $("mainInfo").text = "请先点此输入文字"
      origin = undefined
    }
  }
}

function send(data) {
  $console.info(data)
  if ($app.env == $env.keyboard) {
    $keyboard.playInputClick()
    $keyboard.insert(data)
  } else {
    $clipboard.text = data
    $ui.toast("已复制: " + data)
    $("mainInfo").text = "当前剪贴板: " + $clipboard.text
  }
}

//判断运行环境
if ($app.env != $env.keyboard) {
  if ($clipboard.text) {
    $("mainInfo").text = "当前剪贴板: " + $clipboard.text
  } else {
    $("mainInfo").text = "剪贴板里没有东西，请点此输入"
  }
}

$cache.set("key", "c1T867f2y1no3IzEHs3P0YSzCAuzfdnO1rltzjNT")
//这API也没什么流量好省的，贴个自己的