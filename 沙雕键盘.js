var origin = ""
var shuffledText = ""

$ui.render({
  views: [{
    type: "label",
    props: {
      text: "请先选中文字或复制文字，再使用下面的工具",
      id: "mainInfo"
    },
    layout: function (make, view) {
      make.left.inset(10)
      make.top.inset(10)
      make.height.equalTo(32)
      make.width.equalTo(view.width)
    },
    events: {
      tapped: function (sender) {
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
    layout: function (make, view) {
      make.left.inset(20)
      make.width.equalTo(96)
      make.top.equalTo($("mainInfo").bottom).offset(10)
    },
    events: {
      tapped: function (sender) {
        getOrigin()
        if (typeof (origin) != "undefined") {
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
    layout: function (make, view) {
      make.width.equalTo(96)
      make.left.equalTo($("pushSpace").right).offset(10)
      make.top.equalTo($("mainInfo").bottom).offset(10)
    },
    events: {
      tapped: function (sender) {
        getOrigin()
        if (typeof (origin) != "undefined") {
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
    layout: function (make, view) {
      make.width.equalTo(96)
      make.left.inset(20)
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
      title: "上屏乱序串"
    },
    layout: function (make, view) {
      make.width.equalTo(96)
      make.left.equalTo($("shuffle").right).offset(10)
      make.top.equalTo($("pushSpace").bottom).offset(10)
    },
    events: {
      tapped: function (sender) {
        $keyboard.playInputClick()
        $keyboard.insert($("preview").text)
      }
    }
  }, {
    type: "label",
    props: {
      id: "preview",
      text: "这里是字符串乱序预览"
    },
    layout: function (make, view) {

      make.left.right.inset(10)
      make.width.equalTo(view.width)
      make.height.equalTo(32)
      make.top.equalTo($("shuffle").bottom).offset(10)
    }
  }]
});

function addSpace(origin) {
  return origin.split('').join('　');
}


function flipText(origin) {
  return origin.split('').reverse().join('');
}

function shuffle(origin) {
  var input = origin
  var arr = input.split("");
  arr.sort(function () { return Math.random() > 0.5 ? -1 : 1; });
  var output = (arr.join(""))
  return output
}

function getOrigin() {
  origin = $keyboard.selectedText
  if (typeof (origin) == "undefined") {
    origin = $clipboard.text
    if (typeof (origin) == "undefined") {
      $("preview").text = "选中和剪贴板均为空"
    }
  }
}
