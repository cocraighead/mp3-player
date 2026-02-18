const express = require('express')
const { chromium } = require('playwright');
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const fs = require('fs');
const port = 3000
var json = {'library': {}}

// EXPRESS
app.get('/api/', (req, res) => {
    var ret = get_api(req, res)
    res.send(ret)
})
app.get('/api/db', (req, res) => {
    var ret = get_apiDb(req, res)
    res.send(ret)
})
app.get('/api/refreshDb', (req, res) => {
    var ret = get_apiRefreshDb(req, res)
    res.send(ret)
})
app.get('/api/song/:id', (req, res) => {
    var ret = get_apiSong(req, res)
    res.send(ret)
})
app.get('/api/mp3/:id', (req, res) => {
    var ret = get_apiMp3(req, res)
    res.sendFile(ret.filePath, ret.rootObj);
})
app.put('/api/addsongtoplaylist', (req, res) => {
    var ret = put_apiAddsongtoplaylist(req, res)
    res.send(ret);
})
app.put('/api/updatesong', async (req, res) => {
    res.send(put_apiUpdatesong(req, res));
})
app.post('/api/mp3import', async (req, res) => {
    res.send(post_apiMp3import(req, res));
})
async function downloadSong(browser,context,ytlink,pageTitle){
    console.log('downloading',pageTitle)
    
    var yttopm3url = 'https://ytmp3.ec/10/';
    var fullDownloadFolderPath = 'C:/Users/Zed God/Documents/Code Docs/Music player/mp3-player/server/music/';

    var ytUrl = decodeURIComponent(ytlink)
    console.log(ytUrl)

    // Setup
    const page = await context.newPage();

    await page.goto(yttopm3url);

    // Type into search box.
    await page.type('input[id="url"]', ytUrl);
    page.on('download', download => download.path().then((filePath)=>{
        console.log('native file path: ',filePath)
        var newId = getNewId(fullDownloadFolderPath)
        var newName = `${newId},art,alb,${pageTitle}.mp3`
        var desitinationPath = fullDownloadFolderPath+newName
        fs.copyFile(filePath, desitinationPath, (err) => {
            if(err){
                console.error(err);
            }else{
                console.log('File copied successfully!');
            }
        })
        // Teardown
        page.close()
    }));
    var searchBtnSelector = 'button[type="submit"]'
    if(searchBtnSelector){
        await page.click(searchBtnSelector);
    }else{
        await page.keyboard.press('Enter')
    }

    var clickDownloadLoadNeeded = false // toggle to click download after submit
    if(clickDownloadLoadNeeded){
        await delay(6000)
        var downloadBtnSelector = 'Download'
        await page.getByText('Download', { exact: true }).click();
        if(downloadBtnSelector){
            await page.click(downloadBtnSelector);
        }
    }
    return true
}
app.post('/api/searchyoutube', async (req, res) => {
    try{
        // throw 'endpoint down'
        console.log('POST /api/scrapeyoutubeinfo')
        console.log(req.body)
        var body = req.body
        var browserArgs = []
        if(body.muteConfig){
            browserArgs.push('--mute-audio')
        }

        // Setup
        const browser = await chromium.launch({headless:false,args: browserArgs});
        const context = await browser.newContext();
        const page = await context.newPage();

        page.on('close', () => {
            console.log ('page closed');
            context.close()
            browser.close()
            res.send({
                res: true
            })
        })

        await page.goto('https://www.youtube.com/');

        let searchSelector = 'input[name="search_query"]'
        await page.locator(searchSelector).first()

        await page.evaluate(() => {
            let divToInsert = document.createElement('div');
            divToInsert.id = 'custom-div-inserted'
            divToInsert.innerText = 'Choose Song'
            divToInsert.style = 'font-size: large; border: 1px black solid; cursor: pointer; z-index: 100; position: fixed; right: 12px; bottom: 32px; padding: 22px; background-color: rgb(214, 167, 47);'
            divToInsert.onclick = function(e){ 
                confirm("Download Video as MP3")
            }    
            document.body.appendChild(divToInsert);
        })

        page.on('dialog', async dialog => {
            // find title
            let titleDiv = await page.locator('#title > h1')
            let titleText = await titleDiv.innerText()
            titleText = cleanSongName(titleText)
            console.log('titleText',titleText)
            downloadSong(browser,context,page.url(),titleText)
            await page.bringToFront()
        })
    }catch(e){
        console.log(e)
        res.send({error:e});
    }
})
// ACTUAL FUNCTIONS
function get_api(req, res){
    console.log('GET: /api')
    return 'mock api'
}
function get_apiDb(req, res){
    console.log('GET: /api/db')
    return json
}
function get_apiRefreshDb(req, res){
    console.log('GET: /api/refreshDb')
    var files = fs.readdirSync('./music');
    
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
    return {resp:true}
}
function get_apiSong(req, res){
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
    return responseObj
}
function get_apiMp3(req, res){
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
    return {filePath: songObj.filePath, rootObj: {root:'C:/Users/Zed God/Documents/Code Docs/Music player/mp3-player/server'}}
}
function put_apiAddsongtoplaylist(req, res){
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
    return {id:playlistId}
}
function put_apiUpdatesong(req, res){
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
        return {id:body.id}
    }else{
        return {error:'no file'}
    } 
}
function post_apiMp3import(req, res){
    var body = req.body
    console.log('PUT /api/mp3import')
    console.log('body',body)
    let folderPath = body.folderPath.replaceAll('\\', '/')
    var fullDownloadFolderPath = 'C:/Users/Zed God/Documents/Code Docs/Music player/mp3-player/server/music/';
    var newIdsArr = []
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
    let startId = Number(ids[ids.length-1]) + 1
    
    var files = fs.readdirSync(folderPath);
    for(var i=0;i<files.length;i++){
        let oldFileName = files[i]
        let pIndex = oldFileName.lastIndexOf('.')
        if(pIndex === -1){
            pIndex = null
        } 
        let oldFileNameWithOutMP3 = oldFileName.substring(0, pIndex)
        // get id and name of new file
        let newId = startId + i
        newIdsArr.push(newId)
        console.log('newId',newId)
        var newName = `${newId},art,alb,${oldFileNameWithOutMP3}.mp3`
        var desitinationPath = fullDownloadFolderPath+newName
        // move file db folder
        let currentPath = folderPath+'/'+oldFileName
        fs.copyFile(currentPath, desitinationPath, (err) => {
            console.log('currentPath',currentPath);
            console.log('desitinationPath',desitinationPath);
            if(err){
                console.error(err);
            }
            console.log('File copied successfully!');
        })
    }
    return {resp:newIdsArr}
}
// HELPERS
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
    // ids.sort(function compareFn(a, b) {
    //     if (Number(a) < Number(b)) {
    //       return -1;
    //     }
    //     if (Number(a) > Number(b)) {
    //       return 1;
    //     }
    //     // a must be equal to b
    //     return 0;
    // })
    // var prev = -1
    // for(var i=0;i<ids.length;i++){
    //     if(Number(ids[i])-1 !== prev){
    //         return ids[i]-1
    //     }
    //     prev = Number(ids[i])
    // }
    return Number(ids[ids.length-1]) + 1
}

function cleanSongName(nameString){
    var newName = ''
    for(var i=0;i<nameString.length;i++){
        var c = nameString[i]
        if(
            (c >= '0' && c <= '9') ||
            (c >= 'A' && c <= 'Z') ||
            (c >= 'a' && c <= 'z') ||
            (c == ' ')
        ){
            newName += c
        }
    }
    return newName
}


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})