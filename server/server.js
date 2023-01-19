const express = require('express')
const { chromium } = require('playwright');
const app = express()
const fs = require('fs');
const port = 3000
var json = {}


app.get('/', (req, res) => {
  res.send('mock api')
})

app.get('/db', (req, res) => {
    console.log('db hit')
    res.set('Access-Control-Allow-Origin', '*');
    res.send(json)
})

app.get('/refreshDb', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    var files = fs.readdirSync('./music');
    json = {'library': {}}
    
    for(let i=0;i<files.length;i++){
        var fullName = files[i]
        var fileNamePieces = fullName.split(',') // 0-id,1-artist,2-albumn,3-name
        var songNamePieces = fileNamePieces[3].split(".")
        var songName = ''
        for(var index=0;index<songNamePieces.length;index++){
            if(index!==songNamePieces.length-1){
                songName += songNamePieces[index]
            }
        }

        json.library[fileNamePieces[0]] = {
            "name": songName,
            "artist": fileNamePieces[1],
            "album": fileNamePieces[2],
            "filePath":"./music/"+fullName
        }
    }
    let data = JSON.stringify(json);
    fs.writeFileSync('./db/songs.json', data);

    var playlistsJson = JSON.parse(fs.readFileSync( './db/playlists.json' ).toString())
    json.playlists = playlistsJson.playlists
    res.send({resp:true})
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
    res.sendFile(songObj.filePath,{root:'C:/Users/Zed God/Documents/Code Docs/Music player/mp3-player/server'});
})

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    })
};

function getIds(fullDownloadFolderPath){
    var files = fs.readdirSync(fullDownloadFolderPath);
    var ids = []
    for(let i=0;i<files.length;i++){
        var splitName = files[i].split(',')
        ids.push(splitName[0])
    }
    return ids
}

function getNewId(fullDownloadFolderPath){
    var ids = getIds(fullDownloadFolderPath)
    ids.sort(function compareFn(a, b) {
        if (Number(a) < Number(b)) {
          return -1;
        }
        if (Number(a) > Number(b)) {
          return 1;
        }
        // a must be equal to b
        return 0;
    })
    console.log(ids)
    var prev = -1
    for(var i=0;i<ids.length;i++){
        if(Number(ids[i])-1 !== prev){
            return ids[i]-1
        }
        prev = Number(ids[i])
    }
    return Number(ids[ids.length-1]) + 1
}

app.get('/addsongtoplaylist', (req, res) => {
    console.log('addsongtoplaylist hit');
    res.set('Access-Control-Allow-Origin', '*');

    var params = req.query
    console.log(params);
    var playlistId = params.playlistid
    var songId = params.songid

    var playlist = json.playlists[playlistId]
    if(playlist){
        playlist.songs.push(songId)
        fs.writeFileSync('./db/playlists.json' , JSON.stringify({playlists:json.playlists}))
    }
    res.send({id:playlistId});
})

app.get('/newsong', async (req, res) => {
    console.log('post song hit');
    res.set('Access-Control-Allow-Origin', '*');
    var yttopm3url = 'https://tomp3.cc/en7';
    var fullDownloadFolderPath = 'C:/Users/Zed God/Documents/Code Docs/Music player/mp3-player/server/music/';

    var params = req.query
    console.log(params);
    var ytUrl = decodeURIComponent(params.ytlink);
    console.log(ytUrl);
    var newId = getNewId(fullDownloadFolderPath)
    var newName = `${newId},${params.artist},${params.album},${params.name}.mp3`

    // Setup
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(yttopm3url);

    // Type into search box.
    await page.type('input[type="search"]', ytUrl);
    await page.keyboard.press('Enter')

    // convert
    await page.waitForSelector('#btn-convert',{timeout:30000})
    await page.click('#btn-convert');

    //download 
    var dlbtn = await page.waitForSelector('#asuccess',{timeout:30000})
    await delay(500);
    const downloadPromise = page.waitForEvent('download');
    await page.click('#asuccess');
    const download = await downloadPromise;
    // Wait for the download process to complete.
    await download.path()
    await download.saveAs(fullDownloadFolderPath+newName);
   
  
    // Teardown
    await context.close();
    await browser.close();
    res.send({id:newId});
})

app.get('/updatesong', async (req, res) => {
    console.log('put song hit');
    res.set('Access-Control-Allow-Origin', '*');
    var fullDownloadFolderPath = 'C:/Users/Zed God/Documents/Code Docs/Music player/mp3-player/server/music/';

    var params = req.query
    console.log(params);
    var newPath =  fullDownloadFolderPath + params.newfullname + '.mp3';
    var id = params.id
    var files = fs.readdirSync('./music');
    var oldfullname = ''
    for(var i=0;i<files.length;i++){
        if(files[i].startsWith(id)){
            oldfullname = files[i]
        }
    }
    if(oldfullname){
        var oldPath =  fullDownloadFolderPath + oldfullname;
        fs.renameSync(oldPath, newPath)
        res.send({id:params.id});
    }else{
        res.send({error:'no file'});
    }
    
   
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})