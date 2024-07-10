const express = require("express");
const path = require("node:path")

const app = express();

app.set("view engine", "ejs")

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res)=>{
    res.render("index")
})

// Listening on port 2000.
app.listen(2000, () => {
    console.log('listening at http://localhost:2000');
});