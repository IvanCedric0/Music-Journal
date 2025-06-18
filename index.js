import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import pg from 'pg';

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
const db = new  pg.Client({
    user: "postgres",
    host: "localhost",
    database: "music",
    password: "106807",
    port: 5432,
})

db.connect();

let songs = [

];

app.get("/", async (req, res) =>{
    const result = await db.query("SELECT * FROM songs");
    songs = result.rows;
    console.log(songs);
    res.render("index.ejs", {songs: songs});
});

app.get("/search/results", async(req, res) =>{
    try{
        const userInput = req.query.term;
        console.log(userInput)
        try {
            const result = await axios.get(`https://itunes.apple.com/search?term=${userInput}`);
            
            res.render("results.ejs", {data : result.data.results});
        }catch (err){
            console.log(err)
        }
        
    } catch (err){
        console.log(err)
    }  
});

app.post("/save", (req, res) =>{
    const element = req.body;
    console.log(element);
    res.render("save.ejs", {element: element});
});

app.post("/add", async (req, res) =>{
    const data = req.body;
    console.log(data);
    try{
        await db.query("INSERT INTO songs (title, artist, category, release_date, notes, rating, cover_url, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) ", 
        [data.title, data.artist, data.category, data.release_date, data.notes, parseInt(data.rating) , data.coverArt]);
        res.redirect("/")
    } catch(err) {
        console.log(err.message)
    }
    
});

app.delete("/delete/:id", async (req, res) =>{
    console.log("DELETE route hit for ID:", req.params.id);
    const id = req.params.id;
    try{
        await db.query("DELETE FROM songs WHERE id = $1",[id]);
        res.sendStatus(200);
    }catch(err){
        console.error("Something wrong happened", err)
        res.sendStatus(500);
    }
});
app.post("/edit/:id", async (req, res) =>{
    const id = req.params.id;
    const elements = req.body;
    try {
        await db.query("UPDATE songs SET notes= $1, rating= $2, updated_at = NOW() WHERE id = $3", [elements.notes, elements.rating, id]);
        res.redirect("/");
    }catch(err){
        console.error("Something wrong happened", err)
    }
});

app.listen(port, () =>{
    console.log(`Server running on port ${port}`)
})