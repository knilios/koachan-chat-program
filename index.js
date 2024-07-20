const express = require("express");
const path = require("node:path");
const { sleep } = require("openai/core.js");
var bodyParser = require('body-parser');
const {Chat} = require("./src/models/ai-chat");
if (process.env.NODE_ENV !== 'production') {
	require("dotenv").config()
  }

const app = express();

app.set("view engine", "ejs")

app.set('views', path.join(__dirname, 'src/views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json())

app.get('/', (req, res)=>{
    res.render("index")
})

// Get the response from openAI
app.post('/koachan', async (req, res) => {
    console.log(req.body)
    const chat = new Chat();
    const to_return = await chat.gen_speech(req.body)
    console.log("got back to post: ", to_return)
    // await sleep(1000) // test code
    res.json({body: to_return})
    // res.json({role: "assistance", message: "hello"})
})

// Listening on port 2000.
app.listen(2000, () => {
    console.log('listening at http://localhost:2000');
});