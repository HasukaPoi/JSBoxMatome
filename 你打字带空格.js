$ui.render({
    views: [{
        type: "input",
        props: {
            id: "noSpace"
        },
        layout: function (make, view) {
            make.left.top.right.inset(10)
            make.width.equalTo(view.width)
            make.height.equalTo(32)
        },
        events: {
            changed: function (sender) {
                //$console.info("noSpace")
                addSpace()
            },
            returned: function (sender) {
                $("noSpace").blur()
            }
        }
    }, {
        type: "button",
        props: {
            title: "复制带空格版"
        },
        layout: function (make, view) {
            make.left.right.inset(100)
            make.width.equalTo(96)
            make.height.equalTo(32)
            make.top.equalTo($("noSpace").bottom).offset(10)
        },
        events: {
            tapped: function (sender) {
                $clipboard.text = $("withSpace").text
                $ui.toast("Copied")
            }
        }
    }, {
        type: "input",
        props: {
            id: "withSpace"
        },
        layout: function (make, view) {
            make.left.right.inset(10)
            make.width.equalTo(view.width)
            make.height.equalTo(32)
            make.top.equalTo($("button").bottom).offset(10)
        },
        events: {
            changed: function (sender) {
                //$console.info("noSpace")
                removeSpace()
            },
            returned: function (sender) {
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
            output +=  input.charAt(i)
            console.info(c)
        }
    }
    $("noSpace").text = output
}

$("noSpace").text = $clipboard.text
addSpace()