
const fs = require('fs')
const path = require('path')
const colors = (text, type = 'green') => console.log(require('colors-console')([type, 'underline'], `${new Date().toLocaleTimeString()} => ${text}`))
const { JSON_PATH } = JSON.parse(fs.readFileSync('./config.json').toString())

const run = function (fileName = process.argv[2]) {
  if (!fileName) {
    colors('未输入参数', 'red')
    return false
  }

  const extname = path.extname(fileName)
  if (!extname) {
    fileName = fileName + '.json'
  }

  if (!fs.existsSync(`${JSON_PATH}/${fileName}`)) {
    colors('文件不存在', 'red')
    return false
  }

  colors(`开始对 ${JSON_PATH}/${fileName} 格式化`)

  const json = JSON.parse(fs.readFileSync(`${JSON_PATH}/${fileName}`).toString())
  const stringify = JSON.stringify(json).replace(/[\\]/g, '').replace(/(\"\[)/g, '[').replace(/\]\"/g, ']').replace(/\"\{/g, '{').replace(/\}\"/g, '}')
  fs.writeFileSync(`${JSON_PATH}/${fileName}`, stringify)

  colors('格式化完成')
}

// 如果是命令行 直接执行
if (process.argv[2]) {
  run()
}

exports.modules = run





