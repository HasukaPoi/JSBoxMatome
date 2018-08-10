$ui.render({
  views: [{
    type: "input",
    props: {
      id: "noSpace"
    },
    layout: function(make, view) {
      make.left.top.right.inset(10)
      make.width.equalTo(view.width)
      make.height.equalTo(32)
    },
    events: {
      changed: function(sender) {
        //$console.info("noSpace")
        addSpace()
        $("shuffled").text = shuffle()
      },
      returned: function(sender) {
        $("noSpace").blur()
      }
    }
  }, {
    type: "button",
    props: {
      title: "复制空格",
      id: "copySpace"
    },
    layout: function(make, view) {
      make.left.inset(20)
      make.top.equalTo($("noSpace").bottom).offset(10)
    },
    events: {
      tapped: function(sender) {
        $clipboard.text = $("withSpace").text
        $ui.toast("Copied")
        $device.taptic()
        $app.close()
      }
    }
  }, {
    type: "button",
    props: {
      title: "复制逆序",
    },
    layout: function(make, view) {
      make.left.equalTo($("copySpace").right).offset(10)
      make.top.equalTo($("noSpace").bottom).offset(10)
    },
    events: {
      tapped: function(sender) {
        $clipboard.text = flipText()
        $ui.toast("Copied")
        $device.taptic()
        $app.close()
      }
    }
  }, {
    type: "input",
    props: {
      id: "withSpace"
    },
    layout: function(make, view) {
      make.left.right.inset(10)
      make.width.equalTo(view.width)
      make.height.equalTo(32)
      make.top.equalTo($("copySpace").bottom).offset(10)
    },
    events: {
      changed: function(sender) {
        //$console.info("noSpace")
        removeSpace()
      },
      returned: function(sender) {
        $("withSpace").blur()
      }
    }
  }, {
    type: "button",
    props: {
      title: "生成乱序",
      id: "shuffle"
    },
    layout: function(make, view) {
      make.left.inset(20)
      make.top.equalTo($("withSpace").bottom).offset(10)
    },
    events: {
      tapped: function(sender) {
        $("shuffled").text = shuffle()
      }
    }
  }, {
    type: "button",
    props: {
      title: "复制乱序"
    },
    layout: function(make, view) {
      make.left.equalTo($("shuffle").right).offset(10)
      make.top.equalTo($("withSpace").bottom).offset(10)
    },
    events: {
      tapped: function(sender) {
        $clipboard.text = $("shuffled").text
        $ui.toast("Copied")
        $device.taptic()
        $app.close()
      }
    }
  }, {
    type: "input",
    props: {
      id: "shuffled"
    },
    layout: function(make, view) {
      make.left.right.inset(10)
      make.width.equalTo(view.width)
      make.height.equalTo(32)
      make.top.equalTo($("shuffle").bottom).offset(10)
    },
    events: {
      changed: function(sender) {
        //$console.info("noSpace")
        removeSpace()
      },
      returned: function(sender) {
        $("withSpace").blur()
      }
    }
  }]
});

function addSpace() {
  var input = $("noSpace").text
  var output = ""
  for (var i = 0; i < input.length; i++) {
    output += input.charAt(i) + " "
    if (i === input.length - 1) {
      output = output.substring(0, output.length - 1)
    }
  }
  $("withSpace").text = output
}

function removeSpace() {
  var input = $("withSpace").text
  var output = ""
  for (var i = 0; i < input.length; i++) {
    var c = input.charAt(i)
    if (input.charAt(i) != " ") {
      output += input.charAt(i)
      console.info(c)
    }
  }
  $("noSpace").text = output
}

function flipText() {
  var input = $("noSpace").text
  var output = ""
  var len = input.length
  for (var i = len - 1; i >= 0; i--) {
    var c = input.charAt(i)
    output += c
  }
  console.info(output)
  return output
}

function shuffle() {
  var input = $("noSpace").text
  var arr = input.split("");
  arr.sort(function() { return Math.random() > 0.5 ? -1 : 1; });
  var output = (arr.join(""))
  return output
}

$("noSpace").text = $clipboard.text
addSpace()
$("shuffled").text = shuffle()