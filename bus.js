
var buses = []

$ui.menu({
    items: [528, 529, "B1", "B10", "B12", "B13"],
    handler: function (title, idx) {
        $safari.open({
            url: "http://wap.czgj.cn:8081/MyBus/LineDetailQuery?lineId="
                + title.replace(/B/, "8")
                + "&direction=1"
        })
    }
})