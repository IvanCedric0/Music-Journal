import express from 'express';
import bodyParser from 'body-parser'
import axios from 'axios';

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) =>{
    res.render("index.ejs")
});

app.get("/search/results", async(req, res) =>{
    try{
        const userInput = req.query.term;
        console.log(userInput)
        try {
            const result = await axios.get(`https://itunes.apple.com/search?term=${userInput}`);
            console.log(result.data.results); 
            res.render("results.ejs", {data : result.data.results});
        }catch (err){
            console.log(err)
        }
        
    } catch (err){
        console.log(err)
    }  
});

app.listen(port, () =>{
    console.log(`Server running on port ${port}`)
})