import express from "express";
import {nanoid} from "nanoid";
import fs from "node:fs";

const app = express();

const PORT = 9000;

const isUrlValid = (url) => {
    try {
        new URL(url);
        return true;
    } 
    catch (error) {
        return false;
    }
}

app.use(express.json());

app.post("/url-shotner", (req, res) => {

    if(!isUrlValid(req.body.url)) {
        return res.status(400).json({
            success : false,
            error : "Invalid URL, Please Enter Valid URL"
        })
    }
    // console.log(req.body.url);
    // console.log(nanoid(7));
    const shortUrl = nanoid(7);

    const urlMap = {
        [shortUrl] : req.body.url,
    }

    const urlFileData = fs.readFileSync("urlmap.json", {encoding: "UTF-8"});
    const urlFileDataJson = JSON.parse(urlFileData);
    console.log(urlFileDataJson);
    urlFileDataJson[shortUrl] = req.body.url;
    fs.writeFileSync("urlmap.json", JSON.stringify(urlFileDataJson));

    res.status(200).json({
        success : true,
        message : "URL SHOTNER API",
        data : `http://localhost:9000/${shortUrl}`
    })
})

app.get("/:shortUrl", (req, res) => {
    const fileData = fs.readFileSync("urlmap.json", {encoding: "utf-8"});
    const fileDataJson = JSON.parse(fileData);
    console.log(fileDataJson);
    const shortUrl = req.params.shortUrl;
    const longUrl = fileDataJson[shortUrl];
    if(!longUrl){
        return res.status(404).json({
            success : false,
            error : "Short URL Not Found"
        })
    }
    res.redirect(longUrl);

    // req.status(200).json({
    //     success : true,
    //     message : "Short url recived",
    //     longUrl,
    // }) 
})

app.use("/*", (req, res) => {
    res.status(404).json({
        success : false,
        error : "Invalid URL"
    })
})

app.listen(PORT, () => {
    console.log("URL Shortner App is running at port " + `${PORT}`);
})