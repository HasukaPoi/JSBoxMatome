
var pcs = 2
var result = ""
var sum = 0
for (var i = 0; i < pcs; ++i) {
    var temp = random()
    result += temp + "  "
    sum += temp
}
var start=""

switch(sum%4){
    case 0:start="东";break;
    case 1:start="南";break;
    case 2:start="西";break;
    case 3:start="北";break;
}
result += "\n"+start + sum

$ui.alert(result)

function random() {
    return Math.floor(Math.random() * 5) + 1
}