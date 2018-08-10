$ui.render({
    props: {
        title: "LED灯牌 alpha1",
        backgroundColor:$color("black")
    },
    views: [{
        type: "label",
        props: {
            align: $align.right,
            textColor: $color("white"),
            font: $font("bold", 150),
            text: "君に捧げる🏠🐯",
            backgroundColor:$color("black")
        },
        layout: function (make, view) {
            //make.width.equalTo(view.super)
            make.centerY.equalTo(view.super)
            //make.centerX.equalTo(view.super)
            make.right.inset(0)

        }
    }]
})

function animate1(){
    $ui.animate({
        duration: 2,
        animation: function () {
            $("label").alpha = 0
        },
        completion: function () {
            animate2()
        }
    })
}

function animate2(){
    $ui.animate({
        duration: 1,
        animation: function () {
            $("label").alpha = 1
        },
        completion: function () {
           
        }
    })
}

function animate3(){
    $("label").animator.moveX(1050).thenAfter(0).moveX(-2100).thenAfter(5).moveX(2100).animateWithCompletion(1.0, ^{
        NSLog(@"Animation Done");
    });
    //$("label").animator.moveX(-2000).animate(20)
}

animate3()

var timer = $timer.schedule({
    interval: 5,
    handler: function() {
      animate3()
      $ui.toast("Hey!")
    }
  })
