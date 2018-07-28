var busIdx

var buses = [
    {
        title: "528路往常工院",
        lineId: "528",
        direction: "1"
    }, {
        title: "529路往常州北站",
        lineId: "529",
        direction: "1"
    }, {
        title: "B1路往武进公交中心",
        lineId: "81",
        direction: "1"
    }, {
        title: "B1路往常州北站",
        lineId: "81",
        direction: "2"
    }, {
        title: "B10路往客运中心",
        lineId: "810",
        direction: "1"
    }, {
        title: "B10路往常州北站",
        lineId: "810",
        direction: "2"
    }
]

$ui.menu({
    items: buses.map(function (item) { return item.title }),
    handler: function (title, idx) {
        busIdx = idx
        showBus(idx)
    }
})

function showBus(idx) {
    $http.get({
        url: "http://wap.czgj.cn:8081/MyBus/LineDetailQuery?lineId="
            + buses[idx].lineId
            + "&direction="
            + buses[idx].direction,
        handler: function (resp) {
            var data = resp.data
            // $console.info(resp.data)
            render(data)
        }
    })
}

function render(data) {
    var json = parse(data)
    $console.info(json)
    $ui.render({
        props: {
            title: buses[busIdx].title,
        },
        views: [{
            type: "list",
            props: {
                rowHeight: 48,
                template: [{
                    type: "label",
                    props: {
                        id: "index",
                        align: $align.left,
                        font: $font(17)
                    },
                    layout: function (make, view) {
                        make.left.inset(10)
                        make.top.bottom.right.inset(0)
                    }
                }, {
                    type: "label",
                    props: {
                        id: "station",
                        align: $align.left,
                        font: $font(18)
                    },
                    layout: function (make, view) {
                        make.left.inset(36)
                        make.top.bottom.right.inset(0)
                    }
                }, {
                    type: "label",
                    props: {
                        id: "info",
                        align: $align.right,
                        textColor: $color("blue"),
                        font: $font("bold", 20)
                    },
                    layout: function (make, view) {
                        make.right.inset(10)
                        make.top.bottom.left.inset(0)
                    }
                }],
                data: json,
            },
            layout: function (make, view) {
                make.top.inset(50)
                make.right.bottom.left.inset(0)
            },
            events: {
                pulled: function (sender) {
                    showBus(busIdx)
                }
            }
        },{
            type: "label",
                    props: {
                        text:"TODO:在这里显示线路详细信息\n标题等车站动态刷新",
                        id: "maininfo",
                        align: $align.left,
                        font: $font(18),
                        lines:0

                    },
                    layout: function (make, view) {
                        make.top.left.right.inset(0)
                        make.width.equalTo(50)
                    }
        }]
    })
    //$("list").data=json
    $("list").endRefreshing()

}

function parse(data) {
    var regDiv = /<div class="list-bus-station .*([\n\r]+.*){9}.*<div class="clear"><\/div>/g
    var divList = (data.match(regDiv))
    var stationList = []
    for (var idx in divList) {
        var station = divList[idx].match(/<a.*>.*(?=<\/a>)/)[0].replace(/.*>/g, "")
        var info = divList[idx].match(/[1-9]辆[\u4e00-\u9fa5]+</g)
        var index = parseInt(idx) + 1
        index = index + ""
        stationList.push({
            index: { text: index },
            station: { text: station },
            info: { text: info == null ? "" : ("←" + info[0] + (info[1] ? ", " + info[1] : "")).replace(/</g, "") }
        })
    }
    //$console.info(stationList)
    return stationList
}