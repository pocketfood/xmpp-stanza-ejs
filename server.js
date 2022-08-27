const express = require("express")
const router = require("./routes/xmppconnection")
const app = express()
const port = process.env.port || 8083;

// URL encoded bodies
app.use(express.urlencoded({extended: false}));

// Root url
app.use('/', router)

// ejs
app.set("view engine", "ejs")

console.log('running on',port,'\n');
app.listen(port)
