const express = require('express')
const app = express()
const colors = (text, type = 'green') => console.log(require('colors-console')([type, 'underline'], `${new Date().toLocaleTimeString()} => ${text}`))
const fs = require('fs')
const path = require('path')
const { BASE_URL, POST, API_CONFIG, JSON_PATH, CONSOLE_LOG } = JSON.parse(fs.readFileSync('./config.json').toString())
const bodyParser = require("body-parser")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// 列表
app.get('/getApiConfig', (req, res) => {
  res.json(API_CONFIG)
})

// 详情
app.get('/getApiConfigDetail', (req, res) => {
  let { file_name } = req.query
  res.json(JSON.parse(fs.readFileSync(`${JSON_PATH}/${file_name}`).toString()))
})

API_CONFIG.forEach(api => {
  app[api.type](`${BASE_URL}${api.url}`, (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    fs.readFile(`./${JSON_PATH}/${api.file_name}`, (err, data) => {
      if (err) {
        throw err
      }

      if (CONSOLE_LOG) {
        switch (req.method) {
          case 'POST':
            colors(`POST => ${req.url} => ${JSON.stringify(req.body).replace(/[\\]/g, '')}`)
            break
          default:
            colors(`${req.method} => ${req.url}`)
        }
      }
      res.json(JSON.parse(data))
    })
  })
})

app.listen(POST, () => {
  colors(`${POST} ready`)
  colors(`127.0.0.1:${POST}/index.html`)
})
