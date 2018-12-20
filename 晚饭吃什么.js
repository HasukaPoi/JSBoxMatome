const tabemono = [
    "[1-2]聚鑫园盖浇饭",
    "[1-2]如意馄饨/饺子",
    "[1-2]石板饭",
    "[2-2]苏式汤面",
    "[2-2]葱油拌面",
    "[2-2]水饺",
    "[2-2]蒸饺",
    "[2-2]石锅菜",
    "[2-2]香扒饭",
    "[2-2]砂锅",
    "[2-2]铁板炒饭",
    "[3-2]重庆小面",
    "[2-2]芝士焗饭（有吗？）",
    "[3-2]芝士焗饭",
    "[3-2]石锅拌饭",
    "[3-2]黄焖鸡米饭",
    "一食堂1F",
    "二食堂1F",
    "三食堂1F",
    "外卖的烤肉饭",
    "外卖的汉堡",
    "外卖的黄焖鸡",

]



 
$ui.render({
    views: [{
        type: "label",
        props: {
            text: "111",
            align: $align.center
        },
        layout: function (make, view) {
            make.centerX.equalTo(view.super)
            make.size.equalTo($size(400, 32))
        }
    }, {
        type: "button",
        props: {
            title: "不行换一个"
        },
        layout: function (make, view) {
            make.size.equalTo($size(100, 32))
            make.centerX.equalTo(view.super)
            make.top.equalTo($("label").bottom).offset(5)
        },
        events: {
            tapped: function (sender) {
                ren()
            }
        }
    }]
}); 

function ran() {
    return Math.floor(Math.random() * (tabemono.length))
}

function ren() {
    //$console.info(tabemono[ran()])
    $("label").text = tabemono[ran()]
}

ren()
