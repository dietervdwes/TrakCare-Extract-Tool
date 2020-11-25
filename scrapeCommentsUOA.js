const puppeteer = require('puppeteer');
const fs = require('fs')
const config = require('./config.json')
const path = require('path');
const tabletojson = require('tabletojson').Tabletojson
const parse = require('json2csv');
const xlsx = require('xlsx');
const ExcelJS = require('exceljs');

let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours =  ("0" + date_ob.getHours()).slice(-2)
let minutes = ("0" + date_ob.getMinutes()).slice(-2);
let seconds = ("0" + date_ob.getSeconds()).slice(-2);

let DateLog = year + month + date + hours + minutes;
let YMD = year + month + date

//This reads the CSV into an array variable
var AllEpisodesToBeScraped = fs.readFileSync(config.CSVFileNameEpisodes)
    .toString()
    .split('\n')
    .map(e => e.trim())
    .map(e => e.split(',').map(e=> e.trim()));




async function MyFlow(episodes){
    await launchpuppeteer(episodes) //DataFromScrape contains: [RowHeaders,ColumnHeaders,result]
}
MyFlow(AllEpisodesToBeScraped)


async function launchpuppeteer(allEpisodes){
    // set some options (set headless to false so we can see 
    // this automated browsing experience)
    let launchOptions = { headless: true, args: ['--start-maximized'] };

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(600000);
    // set viewport and user agent (just in case for nice viewing)
    await page.setViewport({width: 1366, height: 768});
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    await page.authenticate({
        username: config.nhlsusername,
        password: config.nhlspassword,
    });
    // go to the target web
    console.log("Starting extraction...")
    
    newData=[]

    for(let episode of allEpisodes){
        console.log(episode);
        async function getDataOnPage(episode){
            url = 'http://trakdb-prod.nhls.ac.za:57772/csp/reporting/eprajax.csp?chunk=' + episode + '%5EC440%5E1%5EC3200%5E'
            await page.goto(url, {waitUntil: 'networkidle2'});
                        
            //Now getting the Data
            const DataOnPage = await page.$eval('*', el => el.innerText);
              
            //console.log(DataOnPage);
            newData.push([DataOnPage]);
            return DataOnPage

        }
        datafromMRN = await getDataOnPage(episode)
    }
    //console.log(newData)
    async function writeToExcel(dataFromScrapeMRN, filename){
        try{
            const wb = xlsx.utils.book_new();
    
            wsdata0 = dataFromScrapeMRN
    
            const ws = xlsx.utils.aoa_to_sheet(wsdata0, {origin: "A1"});
            
            //ws['A1'] = {v:"Episode",t:"s"};

            //ws_new_data = xlsx.utils.aoa_to_sheet(newData, {blankrows:false, raw:false});
            
            xlsx.utils.book_append_sheet(wb,ws);
            //xlsx.utils.book_append_sheet(wb,ws_new_data); //This is to add a second worksheet
            xlsx.writeFile(wb,'./' + filename + '.xlsx' );
            console.log("Written to file: " + './' + filename + '.xlsx' )
        }catch(err){
            console.log(err)
        }
    
    }
    await writeToExcel(newData, DateLog);


    await browser.close();
     
};