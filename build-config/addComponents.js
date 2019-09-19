const fs = require('fs')
const findMarkdown = require('./findMarkdown')
const rootDir = './blog'

findMarkdown(rootDir, writeComponents)

function writeComponents(dir) {
    let dirArr = dir.split('/')
        /*
        if(!dirArr.includes('blogs')){
            return 
        }
        */
    let lang = 'en'
    if (dirArr.includes('zh')) {
        lang = 'zh-CN'
    }
    fs.appendFile(dir, `\n \n <Comment lang="${lang}"/> \n `, (err) => {
        if (err) throw err
        console.log(`add components to ${dir}`)
    })
}