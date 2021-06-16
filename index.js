const fs = require('fs')
const http = require('http')
const url = require('url')
const replaceTemplate = require('./modules/replacetemplate')
const slugify = require('slugify')
//SERVER
//PROMISES



const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

const slugs = dataObj.map(el => slugify(el.productName, {lower: true}))
console.log(slugs)
const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true)


    //overview page
    if(pathname ==='/' || pathname === '/overview'){
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        const cardsHtml = dataObj.map(el => replaceTemplate( tempCard, el)).join("")
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
        res.end(output)
      //  console.log(cardsHtml)

    //product page
    }else if(pathname === '/product'){
        res.writeHead(200, {'Content-type': 'text/html'})
    const product = dataObj[query.id]
    const output = replaceTemplate(tempProduct, product)
        res.end(output)
    
    //API    
    }else if(pathname === '/api'){
            res.writeHead(200, {'Content-type': 'application/json'})
            res.end(data)
    }
    //Not found
    else{
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        })
        res.end('<h1>PAGE NOT FOUND</h1>');
    }
})

server.listen(3000, '127.0.0.1', ()=>{
    console.log("server is up on the port 3000")
})
