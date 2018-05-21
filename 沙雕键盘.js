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
        id: "mainInfo"
      },
      layout: function(make, view) {
        make.left.inset(10)
        make.top.inset(10)
        make.height.equalTo(32)
        make.width.equalTo(view.width)
      },
      events: {
        tapped: function(sender) {
          origin = $clipboard.text
          $("withSpace").text = addSpace(origin)
          $("preview").text = shuffle()
          $keyboard.playInputClick()
        }
      }
    }, {
      type: "button",
      props: {
        title: "加 上 空 格",
        id: "pushSpace"
      },
      layout: function(make, view) {
        make.left.inset(20)
        make.width.equalTo(96)
        make.top.equalTo($("mainInfo").bottom).offset(10)
      },
      events: {
        tapped: function(sender) {
          getOrigin()
          if (typeof(origin) != "undefined") {
            $keyboard.playInputClick()
            $keyboard.insert(addSpace(origin))
          }
        }
      }
    }, {
      type: "button",
      props: {
        title: "串符字序逆",
      },
      layout: function(make, view) {
        make.width.equalTo(96)
        make.left.equalTo($("pushSpace").right).offset(10)
        make.top.equalTo($("mainInfo").bottom).offset(10)
      },
      events: {
        tapped: function(sender) {
          getOrigin()
          if (typeof(origin) != "undefined") {
            $keyboard.playInputClick()
            $keyboard.insert(flipText(origin))
          }
        }
      }
    }, {
      type: "button",
      props: {
        title: "生成乱序串",
        id: "shuffle"
      },
      layout: function(make, view) {
        make.width.equalTo(96)
        make.left.inset(20)
        make.top.equalTo($("pushSpace").bottom).offset(10)
      },
      events: {
        tapped: function(sender) {
          getOrigin()
          if (typeof(origin) != "undefined") {
            $keyboard.playInputClick()
            $("preview").text = shuffle(origin)
          }
        }
      }
    }, {
      type: "button",
      props: {
        title: "上屏乱序串",
        id: "pushShuffle"
      },
      layout: function(make, view) {
        make.width.equalTo(96)
        make.left.equalTo($("shuffle").right).offset(10)
        make.top.equalTo($("pushSpace").bottom).offset(10)
      },
      events: {
        tapped: function(sender) {
          $keyboard.playInputClick()
          $keyboard.insert($("preview").text)
        }
      }
    }, {
      type: "button",
      props: {
        title: "分词后乱序"
      },
      layout: function(make, view) {
        make.width.equalTo(96)
        make.left.equalTo($("pushShuffle").right).offset(10)
        make.top.equalTo($("pushSpace").bottom).offset(10)
      },
      events: {
        tapped: function(sender) {
          getOrigin()
          
          if (typeof(origin) != "undefined") {
            if (origin2 != origin) {
              $ui.loading(true)
              $http.get({
                url: "https://api.ltp-cloud.com/analysis/?api_key=YOURTOKEN&text=" + $text.URLEncode(origin) + "&pattern=ws&format=plain",
                handler: function(resp) {
                  origin2=origin                
                  $ui.loading(false)
                  tokenized=resp.data
                  $("preview").text = shuffle2(tokenized)
                }
              })

              //$text.tokenize({
              //  text: "你可能是一个傻屌",
              //  handler: function(results) {
              //    var temp=""  
              //      //$console.info(results)
              //      for(var index in results){
              //        temp+=results[index]+" "
              //      }
              //      $("preview").text = shuffle2(temp.substring(0, temp.lastIndexOf(" ")))
              //      $console.info(temp.substring(0, temp.lastIndexOf(" ")))
              //  }
              //})

            }else {
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
        text: "这里是字符串乱序预览"
      },
      layout: function(make, view) {

        make.left.right.inset(10)
        make.width.equalTo(view.width)
        make.height.equalTo(32)
        make.top.equalTo($("shuffle").bottom).offset(10)
      }
    }
  ]
});

function addSpace(origin) {
  return origin.split('').join('　');
}

function flipText(origin) {
  " ddd"
  return origin.split('').reverse().join('');
}

function shuffle(origin) {
  var input = origin
  var arr = input.split("");
  arr.sort(function() { return Math.random() > 0.5 ? -1 : 1; });
  var output = (arr.join(""))
  return output
}

function shuffle2(origin) {
  var input = origin
  var arr = input.split(" ");
  arr.sort(function() { return Math.random() > 0.5 ? -1 : 1; });
  var output = (arr.join(""))
  return output
}

function getOrigin() {
  origin = $keyboard.selectedText
  if (typeof(origin) == "undefined") {
    origin = $clipboard.text
    if (typeof(origin) == "undefined") {
      $("preview").text = "选中和剪贴板均为空"
    }
  }
}