
var buses = [
    {
        title: "528往常工院",
        lineId: "528",
        direction: "1"
    }, {
        title: "529往常州北站",
        lineId: "529",
        direction: "1"
    }, {
        title: "B1往武进",
        lineId: "81",
        direction: "1"
    }, {
        title: "B1往常州北站",
        lineId: "81",
        direction: "2"
    }, {
        title: "B10往常州站",
        lineId: "810",
        direction: "1"
    }, {
        title: "B10往常州北站",
        lineId: "810",
        direction: "2"
    }
]

// $ui.menu({
//     items: [528, 529, "B1", "B10", "B12", "B13"],
//     handler: function (title, idx) {
//         $safari.open({
//             url: "http://wap.czgj.cn:8081/MyBus/LineDetailQuery?lineId="
//                 + title.replace(/B/, "8")
//                 + "&direction=1"
//         })
//     }
// })

$ui.menu({
    items: buses.map(function (item) { return item.title }),
    handler: function (title, idx) {
        $safari.open({
            url: "http://wap.czgj.cn:8081/MyBus/LineDetailQuery?lineId="
                + buses[idx].lineId
                + "&direction="
                + buses[idx].direction
        })
    }
})