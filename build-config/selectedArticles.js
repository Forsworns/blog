const fs = require('fs')
const blogs = require('../blog/zh/blogs/blogs.json')
const fileName = './blog/zh/README.md'
const AMOUNT = 2

selectArticles(fileName)

function selectArticles(fileName) {

    fs.readFile(fileName, 'utf-8', (err, content) => {
        if (err) throw err
        fs.writeFile(fileName, content.replace(/\n \n -  \[.*\]\(.*\) .*\n/g, ''), (err) => {
            if (err) throw err
            console.log(`del selected articles from index page`)
        })

        let articles = blogs.slice(blogs.length - AMOUNT)
        articles.forEach((item) => {
            fs.appendFile(fileName, `\n \n -  [${item.title}](/zh/blogs/${item.date.split('/').join("")}/) ${item.content}\n `, (err) => {
                if (err) throw err
                console.log(`add selected articles to index page`)
            })
        })
    })
}