const express = require('express')
const app = express()
const fs = require('fs');
const port = 3000
var json = {'library': {}}


app.get('/', (req, res) => {
  res.send('mock api')
})

app.get('/db', (req, res) => {
    console.log('db hit')
    res.set('Access-Control-Allow-Origin', '*');
    res.send(json)
})

app.get('/refreshDb', (req, res) => {
    var files = fs.readdirSync('./music');
    for(let i=0;i<files.length;i++){
        fullJson.library[i+""] = {
            "name": files[i],
            "artist": "Artist",
            "album": "Album",
            "filePath":"D:/MP3 Player/mp3-player/server/music/"+files[i]
     }
  }
    res.send(true)
})

app.get('/song/:id', (req, res) => {
    console.log('song hit')
    let responseObj
    let songId = req.params.id
    let song = json.library[songId]
    if(song){
        responseObj = json.library[songId]
    }else{
        responseObj = {err:'Song Not Found'}
    }
    res.set('Access-Control-Allow-Origin', '*');
    res.send(responseObj)
})

app.get('/mp3/:id', (req, res) => {
    console.log('mp3 hit')
    let songObj
    let songId = req.params.id
    let song = json.library[songId]
    if(song){
        songObj = json.library[songId]
    }else{
        songObj = {err:'Song Not Found'}
    }
    res.set('Access-Control-Allow-Origin', '*');
    res.sendFile(songObj.filePath);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
  var files = fs.readdirSync('D:/MP3 Player/mp3-player/server/music');
  for(let i=0;i<files.length;i++){
    json.library[i+""] = {
        "name": files[i],
        "artist": "Artist",
        "Album": "Album",
        "filePath":"D:/MP3 Player/mp3-player/server/music/"+files[i]
    }
  }
})