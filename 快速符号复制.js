const data = [
  "♂",
  "♀",
  "ﾞ",
  "ﾟ",
  "\n",
  ""
]

$app.strings = {
  "en": {
    "MAIN_TITLE": "Special Symbols"
  },
  "zh-Hans": {
    "MAIN_TITLE": "特殊符号"
  }
}

$ui.render({
  props: {
    title: $l10n("MAIN_TITLE")
  },
  views: [{
    type: "list",
    props: {
      data: data
    },
    layout: $layout.fill,
    events: {
      didSelect: function(tableView, indexPath, title) {
        $clipboard.text = title
        $device.taptic()
        $app.close()
      }
    }
  }]
})