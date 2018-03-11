$ui.render({
    props: {
        title: "数制转换器"
    },
    views: [{
        type: "input",
        props: {
            id: "source",
            type: $kbType.ascii,
            placeholder: "待转换的数"
        },
        layout: function (make, view) {
            make.left.top.inset(10)
            make.size.equalTo($size(192,32))
        },
        events:{
            changed:function(sender){
                convert()
            }
        }
    },{
        type: "stepper",
        props: {
            id:"stepper1",
            max: 16,
            min: 2,
            value: 10
        },
        layout: function (make, view) {
            make.centerY.equalTo($("source"))
            make.left.equalTo($("source").right).offset(10)
        },
        events: {
            changed: function (sender) {
                $("stepper1-label").text = "" + sender.value
                convert()
            }
        }
    },{
        type: "label",
        props: {
            id: "stepper1-label",
            text: "10"
        },
        layout: function (make) {
            make.centerY.equalTo($("stepper1"))
            make.left.equalTo($("stepper1").right).offset(10)
        }
    }, {
        type: "input",
        props: {
            id: "output",
            type: $kbType.ascii,
            placeholder: "输出"
        },
        layout:function(make,view){
            make.size.equalTo($size(192,32))
            make.top.equalTo($("source").bottom).offset(10)
            make.left.inset(10)
        },
        events:{
            changed:function(sender){
                convert()
            }
        }
    },{
        type: "stepper",
        props: {
            id:"stepper2",
            max: 16,
            min: 2,
            value: 16
        },
        layout: function (make, view) {
            make.centerY.equalTo($("output"))
            make.left.equalTo($("output").right).offset(10)
        },
        events: {
            changed: function (sender) {
                $("stepper2-label").text = "" + sender.value
                convert()
            }
        }
    },{
        type: "label",
        props: {
            id: "stepper2-label",
            text: "16"
        },
        layout: function (make) {
            make.centerY.equalTo($("stepper2"))
            make.left.equalTo($("stepper2").right).offset(10)
        }
    },{
        type:"button",
        props:{
            title:"复制结果",
            id:"b1"
        },
        layout:function(make,view){
            make.left.inset(10)
            make.top.equalTo($("output").bottom).offset(10)
        },
        events:{
            tapped:function(sender){
                $clipboard.text=$("output").text
                $ui.toast("Copied")
                $device.taptic()
                $app.close()
            }
        }
    } ,{
        type:"button",
        props:{
            title:"复制表达式",
            id:"b2"
        },
        layout:function(make,view){
            make.centerY.equalTo($("b1"))
            make.left.equalTo($("b1").right).offset(20)
        },
        events:{
            tapped:function(sender){
                $clipboard.text=makeStr()
                $ui.toast("Copied")
                $device.taptic()
                $app.close()
            }
        }
    } ]
});

$("source").focus()

function convert(){
    var dec=parseInt($("source").text,$("stepper1-label").text);
    var out=dec.toString($("stepper2-label").text)
    $("output").text=out
}

function makeStr(){
    var str=$("source").text+"("+$("stepper1-label").text+") = "+$("output").text+"("+$("stepper2-label").text+")"
    return str
}