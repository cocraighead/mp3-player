const express = require('express')
const { chromium } = require('playwright');
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const fs = require('fs');
const port = 3000
var json = {}


app.get('/api/', (req, res) => {
    console.log('GET: /api')
    res.send('mock api')
})

app.get('/api/db', (req, res) => {
    console.log('GET: /api/db')
    res.send(json)
})

app.get('/api/refreshDb', (req, res) => {
    console.log('GET: /api/refreshDb')
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

app.get('/api/song/:id', (req, res) => {
    console.log('GET /api/song/:id')
    console.log(req.params)
    let responseObj
    let songId = req.params.id
    let song = json.library[songId]
    if(song){
        responseObj = json.library[songId]
    }else{
        responseObj = {err:'Song Not Found'}
    }
    
    res.send(responseObj)
})

app.get('/api/mp3/:id', (req, res) => {
    console.log('GET /api/mp3/:id')
    console.log(req.params)
    let songObj
    let songId = req.params.id
    let song = json.library[songId]
    if(song){
        songObj = json.library[songId]
    }else{
        songObj = {err:'Song Not Found'}
    }
    
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
    var prev = -1
    for(var i=0;i<ids.length;i++){
        if(Number(ids[i])-1 !== prev){
            return ids[i]-1
        }
        prev = Number(ids[i])
    }
    return Number(ids[ids.length-1]) + 1
}

app.put('/api/addsongtoplaylist', (req, res) => {
    console.log('PUT /api/addsongtoplaylist')
    console.log(req.body)

    var body = req.body
    var playlistId = body.playlistid
    var songId = body.songid

    var playlist = json.playlists[playlistId]
    if(playlist){
        playlist.songs.push(songId)
        fs.writeFileSync('./db/playlists.json' , JSON.stringify({playlists:json.playlists}))
    }
    res.send({id:playlistId});
})

app.post('/api/newsong', async (req, res) => {
    try{
        throw 'endpoint down'
        console.log('POST /api/newsong')
        console.log(req.body)
        
        var yttopm3url = 'https://yt2mp3.info/?l=en';
        var fullDownloadFolderPath = 'C:/Users/Zed God/Documents/Code Docs/Music player/mp3-player/server/music/';

        var body = req.body
        var ytUrl = decodeURIComponent(body.ytlink)
        console.log(ytUrl)
        var newId = getNewId(fullDownloadFolderPath)
        var newName = `${newId},${body.artist},${body.album},${body.name}.mp3`

        // Setup
        const browser = await chromium.launch();
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto(yttopm3url);

        // Type into search box.
        await page.type('input[name="video"]', ytUrl);
        var searchBtnSelector = 'button[type="submit"]'
        if(searchBtnSelector){
            await page.click(searchBtnSelector);
        }else{
            await page.keyboard.press('Enter')
        }
        

        // convert
        // await page.waitForSelector('#btn-convert',{timeout:30000})
        // await page.click('#btn-convert');

        //download 
        var downloadSelector = '#mp3data a'
        await page.screenshot({ path: 'logs/test.png' });
        var dlbtn = await page.waitForSelector(downloadSelector ,{timeout:30000})
        await delay(500);
        const downloadPromise = page.waitForEvent('download');
        await page.click(downloadSelector);
        const download = await downloadPromise;
        // Wait for the download process to complete.
        await download.path()
        await download.saveAs(fullDownloadFolderPath+newName);
    
    
        // Teardown
        await context.close();
        await browser.close();
        res.send({id:newId});
    }catch(e){
        console.log(e)
        res.send({error:e});
    }
})

app.put('/api/updatesong', async (req, res) => {
    console.log('PUT /api/updatesong')
    console.log(req.body)
    
    var fullDownloadFolderPath = 'C:/Users/Zed God/Documents/Code Docs/Music player/mp3-player/server/music/';

    var body = req.body
    var newPath = fullDownloadFolderPath + body.newfullname + '.mp3';
    var id = body.id
    var files = fs.readdirSync('./music');
    var oldfullname = ''
    for(var i=0;i<files.length;i++){
        var fileIId = files[i].substring(0, files[i].indexOf(','))
        if(Number(fileIId) === Number(id)){
            oldfullname = files[i]
        }
    }
    console.log(oldfullname)
    console.log(newPath)
    if(oldfullname){
        var oldPath = fullDownloadFolderPath + oldfullname;
        fs.renameSync(oldPath, newPath)
        res.send({id:body.id});
    }else{
        res.send({error:'no file'});
    } 
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})