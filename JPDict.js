var engines =
  [{
      name: "Weblio辞書",
      pattern: "http://jisho.org/search/[KEY]"
    }, {
      name: "goo国語辞書",
      pattern: "http://dictionary.goo.ne.jp/srch/all/[KEY]/m0u/"
    }, {
      name: "音调/动词变形",
      pattern: "http://www.gavo.t.u-tokyo.ac.jp/ojad/search/index/sortprefix:accent/narabi1:kata_asc/narabi2:accent_asc/narabi3:mola_asc/yure:visible/curve:fujisaki/details:invisible/limit:20/word:[KEY]"
    },{
      name: "漢字の読み方",
      pattern: "https://yomikatawa.com/kanji/[KEY]?search=1"
    },{
      name: "品詞表現",
      pattern: "http://collocation.hyogen.info/word/[KEY]"
    },{
      name: "作文支援システム(请手动搜索)",
      pattern: "https://hinoki-project.org/natsume/"
    }
  ]

if ($context.text) {
  $thread.main({
    delay: 0.3,
    handler: function () {
      showEngines($context.text)
    }
  })
} else {
  $ui.menu({
    items: ["搜索剪贴板", "输入内容"],
    handler: function (title, idx) {
      if (idx == 0) {
        showEngines($clipboard.text)
      } else {
        $input.text({
          handler: function (text) {
            showEngines(text)
          }
        })
      }
    }
  })
}

function showEngines(text) {
  $ui.menu({
    items: engines.map(function (item) { return item.name }),
    handler: function (title, idx) {
      $thread.main({
        delay: 0.4,
        handler: function () {
          search(engines[idx].pattern, text)
        }
      })
    }
  })
}

function search(pattern, text) {
  $safari.open({ url: pattern.replace(/\[KEY\]/,encodeURIComponent(text)) })
}