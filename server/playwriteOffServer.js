const { chromium } = require('playwright');

var asyncMain = async () =>{
    try{
        
        // throw 'endpoint down'
        console.log('off server newsong')
       //  console.log(req.body)
        
        var yttopm3url = 'https://yt2mp3.info/?l=en';
        var fullDownloadFolderPath = 'C:/Users/Zed God/Documents/Code Docs/Music player/mp3-player/server/music/';
    
        var body = {
            ytlink: 'https://www.youtube.com/watch?v=83Lv790h79k&ab_channel=TheKidLAROIVEVO',
            artist: 'n',
            album: 'n',
            name:'n',
        }
        var ytUrl = decodeURIComponent(body.ytlink)
        console.log(ytUrl)
        var newId = 1
        var newName = `${newId},${body.artist},${body.album},${body.name}.mp3`
    
        // Setup
        const browser = await chromium.launch({headless:false});
        const context = await browser.newContext();
        const page = await context.newPage();
    
        await page.goto(yttopm3url);
    
        // Type into search box.
        await page.type('input[name="url"]', ytUrl);
        var searchBtnSelector = 'button[type="submit"]'
        if(searchBtnSelector){
            await page.screenshot({ path: 'logs/test1.png' });
            await page.click(searchBtnSelector);
        }else{
            await page.keyboard.press('Enter')
        }
        
    
        // await delay(3000)
        const downloadPromise = page.waitForEvent('download');
        const download = await downloadPromise;
        // Wait for the download process to complete.
        await download.path()
        await download.saveAs(fullDownloadFolderPath+newName);
    
    
        // Teardown
        await context.close();
        await browser.close();
        // res.send({id:newId});
    }catch(e){
        console.log(e)
        // res.send({error:e});
    }
}

asyncMain()
