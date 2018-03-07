const tabemono = [
    "麦当劳",
    "黄焖鸡米饭",
    "大排面干挑加荷包蛋",
    "别吃了",
    "回转寿司",
    "汉堡王",
    "台湾便当",
    "脆皮鸡排",
    "凉皮",
    "蛋炒饭",
    "生煎包",
    "菜肉馄饨",
    "锅贴",
    "南翔小笼",
    "牛丼",
    "咖喱饭",
    "酸菜鱼",
    "萨莉亚",
    "乌冬面",
    "煎饺",
    "章鱼丸子",
    "三明治",
    "披萨",
    "脆皮鸡米饭",
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
