var date = new Date()
var dateStr=date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
$ui.toast(dateStr)
$clipboard.text = dateStr+"："