var fs = require('fs');
var files = fs.readdirSync('./music');

var fullJson = {'library': {}}

for(let i=0;i<files.length;i++){
    fullJson.library[i+""] = {
        "name": files[i],
        "artist": "Artist",
        "Album": "Album",
        "filePath":"D:/MP3 Player/mp3-player/server/music/"+files[i]
    }
}

 
let data = JSON.stringify(fullJson);
fs.writeFileSync('./db/songs.json', data);