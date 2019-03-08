var engines = [{
  name: "ヤフオク",
  pattern: "https://auctions.yahoo.co.jp/search/search?fixed=0&auccat=0&tab_ex=commerce&type=all&ei=utf-8&p=[KEY]&aq=-1&oq=&sc_i=&fr=auc_top"
}, {
  name: "駿河屋",
  pattern: "https://www.suruga-ya.jp/search?category=&search_word=[KEY]"
},]

var keywords = [
  "ゆずソフト",
  "CANVAS+GARDEN",
  "宮坂みゆ",
  "宮坂なこ",
  "しらたまこ",
  "まいてつ タペストリー"
]

var types = [
  "タペストリー",
  "抱き枕",
  "アクリル"
]

if ($context.text) {
  $thread.main({
    delay: 0.3,
    handler: function () {
      showTypes($context.text)
    }
  })
} else {
  main()
  /*   $ui.menu({
      items: ["【剪贴板】" + $clipboard.text, "【输入内容】"].concat(keywords),
      handler: function (title, idx) {
        switch (idx) {
          case 0:
            showTypes($clipboard.text);
            break;
          case 1:
            $input.text({
              handler: function (text) {
                showTypes(text)
              }
            });
            break;
          default:
            showTypes(title)
  
        }
      }
    }) */
}

function main() {
  let message = {
    //title: "请选择次级关键字",
    message: "请选择或输入关键字",
    actions: keywords.map((item) => ({
      title: item,
      handler: () => showTypes(item)
    })).concat([{
      title: "[剪贴板]" + $clipboard.text,
      handler: () => showTypes($clipboard.text)
    }, {
      title: "[输入关键字]",
      style: "cancel",
      handler: () => {
        $input.text({
          handler: function (text) {
            showTypes(text)
          }
        });
      }
    }]),
  }
  $ui.action(message)

}

function showTypes(key) {
  let message = {
    title: "请选择次级关键字",
    message: "如果不想看到本菜单，请在前一步的主关键字最前添加空格或加号",
    actions: types.map((item) => ({
      title: item,
      handler: () => showEngines(key + " " + item)
    })).concat([{
      title: "无次级关键字",
      style: "cancel",
      handler: () => showEngines(key)
    }])
  }
  if (key.indexOf(" ") === -1 || key.indexOf("+") === 0) {
    $ui.action(message)
  } else {
    showEngines(key)
  }

}

function showEngines(text) {
  let message = {
    message: "请选择购物网站",
    actions: engines.map(
      (item) => ({
        title: item.name,
        handler: () => {
          $thread.main({
            delay: 0.4,
            handler: () => search(item.pattern, text)
          })
        }
      })
    ).concat([{
      title: "别手滑",
      style: "cancel",
      handler: () => search(engines[0].pattern, text)
    }])
  }
  $ui.action(message)
}

function search(pattern, text) {
  $safari.open({
    url: pattern.replace(/\[KEY\]/, encodeURIComponent(text))
  })
}