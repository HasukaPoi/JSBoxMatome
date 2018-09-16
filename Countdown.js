var goal = {
    year: 2018,
    month: 12 - 1,
    day: 22,
    comment: "研招初试"
}


var date = new Date(goal.year, goal.month, goal.day, 0, 0, 0, 0)
var temp = new Date()
var today = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate(), 0, 0, 0, 0)

var sum = (date.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)

$ui.render({
    props: {
        title: "title"
    },
    views: [ {
        type: "label",
        props: {
            text:"距离 "+goal.comment+" 还有",
            id: "caption",
            align: $align.center,
            font: $font(24),
            lines: 0
        },
        layout: function (make, view) {
            make.top.inset(5)
            make.left.right.inset(0)
        }
    },{
        type: "label",
        props: {
            //text:compare(date,today),
            id: "date",
            align: $align.center,
            font: $font("bold", 36),
            lines: 0
        },
        layout: function (make, view) {
            make.top.equalTo($("caption").bottom).offset(5)
            make.left.right.inset(0)
        }

    },{
        type: "label",
        props: {
            //text:date.getFullYear(),
            id: "goaldate",
            align: $align.center,
            font: $font(18),
            lines: 0
        },
        layout: function (make, view) {
            make.top.equalTo($("date").bottom).offset(5)
            make.left.right.inset(0)
        }

    }]

})

var weekDay = ["日", "一", "二", "三", "四", "五", "六"];

$("date").text = (date.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)+" 天"
$("goaldate").text="将来临于 "+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" 周"+weekDay[date.getDay()]

function compare(date1, date2) {
    return (date1.getTime() - date2.getTime()) / (24 * 60 * 60 * 1000)
}