const puppeteer = require('puppeteer');
const config = require('./config.json');
const fs = require('fs')
const xlsx = require('xlsx');
const delay = time => new Promise(res=>setTimeout(res,time));
const scrapedData = []

let date_ob = new Date();
let day = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hour =  ("0" + date_ob.getHours()).slice(-2)
let minute = ("0" + date_ob.getMinutes()).slice(-2);
let second = ("0" + date_ob.getSeconds()).slice(-2);

//This reads the CSV into an array variable
var AllHospitalNumbers = fs.readFileSync(config.FoldernumbersCSV)
    .toString()
    .split('\n')
    .map(e => e.trim())
    .map(e => e.split(',').map(e=> e.trim()));



//LoadCSV();
//console.log(AllHospitalNumbers)
async function writeToExcel(rawdatafromscrape){
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(rawdatafromscrape)
    //const ws = xlsx.utils.sheet_add_json(rawdatafromscrape);
    //const ws = xlsx.utils.sheet_add_aoa(rawdatafromscrape);
    //const ws = xlsx.utils.table_to_sheet(rawdatafromscrape);
    xlsx.utils.book_append_sheet(wb,ws);
    xlsx.writeFile(wb,config.FinalXLSX);
}

async function myFlow(){
    //await login();
    console.log("Opening browser...");
    let dataFromLogin = await login()
    // Put data entry here
    // AllHospitalNumber = await LoadCSV();
    await writeToExcel(dataFromLogin)
    
}
myFlow();


// This function is used to log in and process the other functions
async function login() {
    const browser = await puppeteer.launch({
        headless:false,
        defaultViewport: null
    });
    console.log("Starting extraction process:\nOpening browser and logging in...")
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(320000);
    await page.authenticate({
        username: config.nhlsusername,
        password: config.nhlspassword,
    });
    const url = config.url;
    await page.goto(url, {waitUntil: 'networkidle2'});
    //var html = await page.content(); //This is to get the page source code
    await page.waitForSelector('#SSUser_Logon_0-item-USERNAME');
    await page.focus('#SSUser_Logon_0-item-USERNAME');
    await page.keyboard.type(config.webviewusername);
    await page.focus('#SSUser_Logon_0-item-PASSWORD'); 
    await page.keyboard.type(config.webviewpassword);
    await page.click('#SSUser_Logon_0-button-Logon');
    await page.waitForSelector('#web_DEBDebtor_FindList_0-item-HospitalMRN');
    console.log('Logged in successfully');
    console.log(AllHospitalNumbers)
    let dataraw = await type(page);
    console.log(dataraw)
    await browser.close();
    return dataraw
    
}


async function type(p){
    fs.appendFile("./testwritefile", 'Starting extraction:' + year + month + day + hour + minute + second + '\n' , function(err) {
        if (err) throw err;
        console.log('The file was appended.');
    });
    for(let HospitalNo of AllHospitalNumbers){
        async function typehospno(mrn){

            await p.waitForSelector('#web_DEBDebtor_FindList_0-item-HospitalMRN'); 
            await p.focus('#web_DEBDebtor_FindList_0-item-HospitalMRN');
            await p.keyboard.type(mrn);
            console.log("Typed: " + mrn)
            await p.click('#web_DEBDebtor_FindList_0-button-Find')
            await p.waitForSelector('#web_DEBDebtor_FindList_0-row-0-item-MRN-link')//
            await delay(1500); //This is to wait 'x' milliseconds after clicking search (delay function was defined on top)
            var pagedata = await getPageData(p);

            console.log(pagedata)
            scrapedData.push(pagedata)

            await p.click('#web_DEBDebtor_FindList_0-button-Clear')
            await p.waitForSelector('#web_DEBDebtor_FindList_0-misc-noMatches')
            await delay(2000);

            fs.appendFile(config.WriteRawFile, HospitalNo + ',' + pagedata.MRNnumber + ',' + pagedata.Name + ',' + pagedata.Surname + ',' + pagedata.DOB + ',' + pagedata.Sex + ',' + pagedata.Laboratory + '\n' , function(err) {
                if (err) throw err;
                console.log('The file was appended.');
            });
        }
        await typehospno(HospitalNo)   
    }
    return scrapedData
}

//GetPageData
async function getPageData(p){
    try{
        
        var MRNnumber = await p.$$eval('.componentTableRow.ng-scope .layout-xs-column .componentTableItem .ng-binding[id*="MRN-link"]', options => options.map(option => option.textContent));
        var Surname = await p.$$eval('.componentTableRow.ng-scope .layout-xs-column .componentTableItem .ng-binding[id*="Surname-link"]', options => options.map(option => option.textContent));
        var Name = await p.$$eval('.componentTableRow.ng-scope .layout-xs-column .componentTableItem .ng-binding[id*="GivenName"]', options => options.map(option => option.textContent));
        var DOB = await p.$$eval('.componentTableRow.ng-scope .layout-xs-column .componentTableItem .ng-binding[id*="DOB"]', options => options.map(option => option.textContent));
        var Sex = await p.$$eval('.componentTableRow.ng-scope .layout-xs-column .componentTableItem .ng-binding[id*="Species"]', options => options.map(option => option.textContent));
        var HospitalNo = await p.$$eval('.componentTableRow.ng-scope .layout-xs-column .componentTableItem .ng-binding[id*="HospitalURNo"]', options => options.map(option => option.textContent));
        var Laboratory = await p.$$eval('.componentTableRow.ng-scope .layout-xs-column .componentTableItem .ng-binding[id*="UserLocation"]', options => options.map(option => option.textContent));
        
        return {
            MRNnumber,
            Surname,
            Name,
            DOB,
            Sex,
            HospitalNo,
            Laboratory
        }
    }catch(err){
        console.log(err)
    }
    //await new Promise((resolve, reject) => setTimeout(resolve, 1000));
}

