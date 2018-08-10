$ui.render({
    props: {
        title: "LED灯牌"
    },
    views: [{
        type: "canvas",
        layout: $layout.fill,
        events: {
            draw: function (view, ctx) {
                var centerX = view.frame.width * 0.5
                var centerY = view.frame.height * 0.5
                ctx.font = $font("PingFang SC");
                ctx.fillPath("111")
                // var radius = 50.0
                // ctx.fillColor = $color("red")
                // ctx.moveToPoint(centerX, centerY - radius)
                // for (var i=1; i<5; ++i) {
                //   var x = radius * Math.sin(i * Math.PI * 0.8)
                //   var y = radius * Math.cos(i * Math.PI * 0.8)
                //   ctx.addLineToPoint(x + centerX, centerY - y)
                // }
                // ctx.fillPath()

            }
        }
    }]
})