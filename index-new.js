const puppeteer = require('puppeteer');
const config = require('./config.json');
const csvToJson = require('csvtojson');
const fs = require('fs')
const parse = require('csv-parse');
const xlsx = require('xlsx');
const Excel = require('exceljs');
const delay = time => new Promise(res=>setTimeout(res,time));
const scrapedData = []

let date_ob = new Date();
let day = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hour =  ("0" + date_ob.getHours()).slice(-2)
let minute = ("0" + date_ob.getMinutes()).slice(-2);
let second = ("0" + date_ob.getSeconds()).slice(-2);

var AllHospitalNumbers = fs.readFileSync(config.CSVFileName)
    .toString()
    .split('\n')
    .map(e => e.trim())
    .map(e => e.split(',').map(e=> e.trim()));


// var csvData=[];
// fs.createReadStream(config.CSVFileName)
//     .pipe(parse({delimiter: ','}))
//     .on('data', function(csvrow) {
//         console.log(csvrow);
//         //do something with csvrow
//         csvData.push(csvrow);        
//     })
//     .on('end',function() {
//       //do something with csvData
//       console.log(csvData);
//     });








// This function is used to log in and process the other functions
async function login() {
    const browser = await puppeteer.launch({
        headless:false,
        defaultViewport: null
    });
    console.log("Starting extraction process:\nOpening browser and logging in...")
    const page = await browser.newPage();
    const url = config.url;
    await page.goto(url, {waitUntil: 'networkidle2'});
    //var html = await page.content(); //This is to get the page source code
    await page.waitForSelector('#SSUser_Logon_0-item-USERNAME');
    await page.focus('#SSUser_Logon_0-item-USERNAME');
    await page.keyboard.type(config.username);
    await page.focus('#SSUser_Logon_0-item-PASSWORD'); 
    await page.keyboard.type(config.password);
    await page.click('#SSUser_Logon_0-button-Logon');
    await page.waitForSelector('#web_DEBDebtor_FindList_0-item-HospitalMRN');
    console.log('Logged in successfully');
    console.log(AllHospitalNumbers)
    let dataraw = await type(page);
    console.log(dataraw)
    await browser.close();
    return dataraw
    
}

async function myFlow(){
    //await login();
    console.log("Completed Login");
    let dataFromLogin = await login()
    // Put data entry here
    // AllHospitalNumber = await LoadCSV();
    await writeToExcel(dataFromLogin)
    
}
myFlow();
//LoadCSV();
//console.log(AllHospitalNumbers)
async function writeToExcel(rawdatafromscrape){
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(rawdatafromscrape);
    xlsx.utils.book_append_sheet(wb,ws);
    xlsx.writeFile(wb,config.FinalXLSX);
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
            //await ClickSearch(p)
            await p.click('#web_DEBDebtor_FindList_0-button-Find')
            await p.waitForSelector('#web_DEBDebtor_FindList_0-row-0-item-MRN-link')//
            await delay(1500); //This is to wait 'x' milliseconds after clicking search (delay function was defined on top)
            //await p.waitFor(3000)  //Another possible wait function
            var pagedata = await getPageData(p);
            console.log(pagedata)
            scrapedData.push(pagedata)
            await p.click('#web_DEBDebtor_FindList_0-button-Clear')
            //console.log("Clicked clear")
            fs.appendFile(config.WriteRawFile, HospitalNo + ',' + pagedata.MRNnumber + ',' + pagedata.Name + ',' + pagedata.Surname + ',' + pagedata.DOB + ',' + pagedata.Sex + ',' + pagedata.Laboratory + '\n' , function(err) {
                if (err) throw err;
                console.log('The file was appended.');
            });
        }
        await typehospno(HospitalNo)   
    }
    return scrapedData
}



//
//ClickSearch
// async function ClickSearch(page){
//     try{
//         await page.click('#web_DEBDebtor_FindList_0-button-Find')
//         console.log('clicked Search')
//         await page.waitForSelector('#web_DEBDebtor_FindList_0-row-0-item-MRN-link')
//     }catch(err){
//         console.log("Search not successful:\n",err)
//     }   
// }

//GetData
// function GetData(page){
//     const datafromscrape = getPageData(page);
//     scrapedData.push(datafromscrape);
//     console.log(scrapedData);
// }


//Shorter way of getting page data
// (async () =>{
//     let data = await page.evaluate(() => {
//         let MRNnumber = document.querySelector('#web_DEBDebtor_FindList_0-row-0-item-MRN-link').textContent;
//         let Surname = document.querySelector('#web_DEBDebtor_FindList_0-row-0-item-Surname-link').textContent;
//         let Name = document.querySelector('#web_DEBDebtor_FindList_0-row-0-item-GivenName').textContent;
//         let DOB = document.querySelector('#web_DEBDebtor_FindList_0-row-0-item-DOB').textContent;
//         let Sex = document.querySelector('#web_DEBDebtor_FindList_0-row-0-item-Species').textContent;
//         let HospitalNo = document.querySelector('#web_DEBDebtor_FindList_0-row-0-item-HospitalURNo').textContent;
//         let Laboratory = document.querySelector('#web_DEBDebtor_FindList_0-row-0-item-UserLocation').textContent;
//         return {
//         MRNnumber,
//         Surname,
//         Name,
//         DOB,
//         Sex,
//         HospitalNo,
//         Laboratory
//         }
//     });
//     return data
// })

//GetPageData
async function getPageData(p){
    try{
        
        var MRNnumber = await p.evaluate(()=> {
            return document.querySelector('#web_DEBDebtor_FindList_0-row-0-item-MRN-link').textContent;
        });
        var Surname = await p.evaluate(()=> {
            return document.querySelector('#web_DEBDebtor_FindList_0-row-0-item-Surname-link').textContent;
        });
        var Name = await p.evaluate(()=> {
            return document.querySelector('#web_DEBDebtor_FindList_0-row-0-item-GivenName').textContent;
        });
        var DOB = await p.evaluate(()=> {
            return document.querySelector('#web_DEBDebtor_FindList_0-row-0-item-DOB').textContent;
        });
        var Sex = await p.evaluate(()=> {
            return document.querySelector('#web_DEBDebtor_FindList_0-row-0-item-Species').textContent;
        });
        var HospitalNo = await p.evaluate(()=> {
            return document.querySelector('#web_DEBDebtor_FindList_0-row-0-item-HospitalURNo').textContent;
        });
        var Laboratory = await p.evaluate(()=> {
            return document.querySelector('#web_DEBDebtor_FindList_0-row-0-item-UserLocation').textContent;
        });
        // fs.appendFile("./testwritefile", MRNnumber + ',' + Name + ',' + Surname + ',' + DOB + ',' + Sex + ',' + Laboratory + '\n' , function(err) {
        //     if (err) throw err;
        //     console.log('The file was appended.');
        // });
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


//Scrape Data from Excelread
// async function LoadCSV(){
//     const AllHospitalNumbers = [];
//     fs.createReadStream(config.CSVFileName)
//         .pipe(parse({delimiter: ','}))
//         .on('data', function(csvrow) {
//             //console.log(csvrow);
//             AllHospitalNumbers.push(csvrow)   
//         })
//         .on('end',function() {
//         //do something with csvData
//         console.log("Done Reading CSV");
//         //console.log(AllHospitalNumbers)
//         for(let HospitalNo of AllHospitalNumbers){
//             async function typehospno(mrn){
//                 // Use the endpoint to reestablish a connection
//                 // const browser2 = await puppeteer.connect({browserWSEndpoint});
//                 // // Close Chromium
//                 // await browser2.close();
//                 //await page.waitForSelector('#web_DEBDebtor_FindList_0-item-HospitalMRN'); 
//                 // await page.focus('#web_DEBDebtor_FindList_0-item-HospitalMRN');
//                 // await page.keyboard.type(mrn);
//                 console.log("Typed: " + mrn)
//                 //await ClickSearch(page)
//                 // .then(GetData()); 
//                 //page.click('#web_DEBDebtor_FindList_0-button-Clear')
//                 console.log("Clicked clear")      
//             }
//             typehospno(HospitalNo)   
//         }


//         });
//     return AllHospitalNumbers
// };





// //Loop of MRN's
//         //This is where the loop begins
        // for(let HospitalNo of AllHospitalNumbers){
        //     async function ClickperHospitalMRN(mrn){
        //         await page.waitForSelector('#web_DEBDebtor_FindList_0-item-HospitalMRN'); 
        //         await page.focus('#web_DEBDebtor_FindList_0-item-HospitalMRN');
        //         await page.keyboard.type(mrn);
        //         console.log("Typed: " + mrn)
                
        //         await ClickSearch(page)
        //         // .then(GetData());
                    
                
                    
        //         page.click('#web_DEBDebtor_FindList_0-button-Clear')
        //         console.log("Clicked clear")      

        //     }
        //     ClickperHospitalMRN(HospitalNo);
        
            
        // }
//         //This is where the loop ends






// new function ScrapeData(){
//     const scrapedData = [];
//     const AllHospitalNumbers = [];
//     fs.createReadStream(config.CSVFileName)
//     .pipe(parse({}))
//     .on('data', (data) => AllHospitalNumbers.push(data))
//     .on('end', () => {
//         console.log(AllHospitalNumbers);
//         //This is where the loop begins
//         for(let HospitalNo of AllHospitalNumbers){
//             async function ClickperHospitalMRN(mrn){
//                 await page.waitForSelector('#web_DEBDebtor_FindList_0-item-HospitalMRN'); 
//                 await page.focus('#web_DEBDebtor_FindList_0-item-HospitalMRN');
//                 await page.keyboard.type(mrn);
//                 console.log("Typed: " + mrn)
                // async function ClickSearch(page){
                //     try{
                //         await page.click('#web_DEBDebtor_FindList_0-button-Find')
                //         console.log('clicked Search')
                //         await page.waitForSelector('#web_DEBDebtor_FindList_0-row-0-item-MRN-link')
                //     }catch(err){
                //         console.log("Search not successful:\n",err)
                //     }   
                // }
//                 await ClickSearch(page)
//                 .then(GetData());
                    
//                 function GetData(page){
//                 const datafromscrape = getPageData(page);
//                 scrapedData.push(datafromscrape);
//                 console.log(scrapedData);
//                 }
                    
//                 page.click('#web_DEBDebtor_FindList_0-button-Clear')
//                 console.log("Clicked clear")      

//             }
//             ClickperHospitalMRN(HospitalNo);
        
            
//         }
//         //This is where the loop ends
//     });
// };