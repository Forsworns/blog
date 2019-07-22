const fs = require('fs')
const findMarkdown = require('./findMarkdown')
const rootDir = './blog'

findMarkdown(rootDir, writeComponents)

function writeComponents(dir) {
    let lang = 'en'
    if (dir.split('/')[1] == 'zh') {
        lang = 'zh-CN'
    }
    fs.appendFile(dir, `\n \n <Comment lang="${lang}"/> \n `, (err) => {
        if (err) throw err
        console.log(`add components to ${dir}`)
    })
}