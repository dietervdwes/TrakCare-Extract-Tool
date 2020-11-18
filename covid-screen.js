const puppeteer = require('puppeteer');
const config = require('./config.json');
const csvToJson = require('csvtojson');
const fs = require('fs')
const parse = require('csv-parse');
const xlsx = require('xlsx');
const Excel = require('exceljs');
const delay = time => new Promise(res=>setTimeout(res,time));
const scrapedData = []
//Change the properties of the person here:
const Surname = config.DJSurname
const DOB = config.DJDOB
const EmployeeNumber = config.DJEmployeeNumber

// This function is used to log in and process the other functions
async function login() {
    const browser = await puppeteer.launch({
        headless:false,
        defaultViewport: null
    });
    console.log("Starting COVID Health screen process:")
    const page = await browser.newPage();
    // Configure the navigation timeout
    await page.setDefaultNavigationTimeout(320000);
    await page.authenticate({
        username: config.nhlsusername,
        password: config.nhlspassword,
    });
    const url = "http://ohasis.nhls.ac.za/CovidScreening.aspx";
    await page.goto(url, {waitUntil: 'networkidle2'});
    //var html = await page.content(); //This is to get the page source code
    await page.waitForSelector('#txtEmployee');
    await page.focus('#txtEmployee');
    await page.keyboard.type(EmployeeNumber); //"EmployeeNumber" : "19597",
    //"Surname" : "VAN DER WESTHUIZEN",
    //"DOB" : "1991-10-24",
    await page.focus('#txtSurname'); 
    await page.keyboard.type(Surname);
    await page.focus('#txtDob'); 
    await page.keyboard.type(DOB);
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(1000);
    await page.click('#btnConfirmDetails');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');
    console.log('Entered User...');

    await page.waitForTimeout(2000);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await page.click('#formScreening > div > div.grid.condensed.no-margin > div:nth-child(2) > div:nth-child(2) > div:nth-child(2)');
    await page.click('#formScreening > div > div.grid.condensed.no-margin > div:nth-child(3) > div.cell.colspan4 > div:nth-child(2) > label');
    await page.click('#formScreening > div > div.grid.condensed.no-margin > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > label');
    await page.click('#formScreening > div > div.grid.condensed.no-margin > div:nth-child(5) > div.cell.colspan4 > div:nth-child(2) > label');
    await page.click('#formScreening > div > div.grid.condensed.no-margin > div:nth-child(6) > div.cell.colspan4 > div:nth-child(2)');
    await page.click('#formScreening > div > div.grid.condensed.no-margin > div:nth-child(7) > div.cell.colspan4 > div:nth-child(2)');
    await page.click('#formScreening > div > div.grid.condensed.no-margin > div:nth-child(8) > div.cell.colspan4 > div:nth-child(2)');
    await page.click('#formScreening > div > div.grid.condensed.no-margin > div:nth-child(9) > div:nth-child(2) > div:nth-child(2)');
    await page.click('#formScreening > div > div.grid.condensed.no-margin > div:nth-child(10) > div:nth-child(2) > div:nth-child(2)');
    await page.click('#btnSaveScreening');
    console.log('Completed Screening for COVID for'+ Surname)
            // await p.waitForSelector('#web_DEBDebtor_FindList_0-item-HospitalMRN'); 
            // await p.focus('#web_DEBDebtor_FindList_0-item-HospitalMRN');
            // await p.keyboard.type(mrn);
            // console.log("Typed: " + mrn)
            // //await ClickSearch(p)
            // await p.click('#web_DEBDebtor_FindList_0-button-Find')
            // await p.waitForSelector('#web_DEBDebtor_FindList_0-row-0-item-MRN-link')//
            // await delay(1500); //This is to wait 'x' milliseconds after clicking search (delay function was defined on top)
            //await p.waitFor(3000)  //Another possible wait function
            
            // var pagedata1 = await getPageData1(p)
            // var pagedata2 = await getPageData2(p)
            // var pagedata3 = await getPageData3(p)
            // var pagedata4 = await getPageData4(p)
    await browser.close()
}
login()


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
// async function getPageData(p){
//     try{
        
//         var MRNnumber = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-0-item-MRN-link').textContent;
//         });
//         var Surname = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-0-item-Surname-link').textContent;
//         });
//         var Name = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-0-item-GivenName').textContent;
//         });
//         var DOB = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-0-item-DOB').textContent;
//         });
//         var Sex = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-0-item-Species').textContent;
//         });
//         var HospitalNo = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-0-item-HospitalURNo').textContent;
//         });
//         var Laboratory = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-0-item-UserLocation').textContent;
//         });
//         return {
//             MRNnumber,
//             Surname,
//             Name,
//             DOB,
//             Sex,
//             HospitalNo,
//             Laboratory
//         }
//     }catch(err){
//         console.log(err)
//     }
//     //await new Promise((resolve, reject) => setTimeout(resolve, 1000));
// }

// async function getPageData1(p){
//     try{
        
//         var MRNnumber = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-1-item-MRN-link').textContent;
//         });
//         var Surname = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-1-item-Surname-link').textContent;
//         });
//         var Name = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-1-item-GivenName').textContent;
//         });
//         var DOB = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-1-item-DOB').textContent;
//         });
//         var Sex = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-1-item-Species').textContent;
//         });
//         var HospitalNo = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-1-item-HospitalURNo').textContent;
//         });
//         var Laboratory = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-1-item-UserLocation').textContent;
//         });
//         return {
//             MRNnumber,
//             Surname,
//             Name,
//             DOB,
//             Sex,
//             HospitalNo,
//             Laboratory
//         }
//     }catch(err){
//         console.log("No extra item")
//     }
//     //await new Promise((resolve, reject) => setTimeout(resolve, 1000));
// }

// async function getPageData2(p){
//     try{
        
//         var MRNnumber = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-2-item-MRN-link').textContent;
//         });
//         var Surname = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-2-item-Surname-link').textContent;
//         });
//         var Name = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-2-item-GivenName').textContent;
//         });
//         var DOB = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-2-item-DOB').textContent;
//         });
//         var Sex = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-2-item-Species').textContent;
//         });
//         var HospitalNo = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-2-item-HospitalURNo').textContent;
//         });
//         var Laboratory = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-2-item-UserLocation').textContent;
//         });
//         return {
//             MRNnumber,
//             Surname,
//             Name,
//             DOB,
//             Sex,
//             HospitalNo,
//             Laboratory
//         }
//     }catch(err){
//         console.log("No 2nd extra item")
//     }
//     //await new Promise((resolve, reject) => setTimeout(resolve, 1000));
// }

// async function getPageData3(p){
//     try{
        
//         var MRNnumber = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-3-item-MRN-link').textContent;
//         });
//         var Surname = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-3-item-Surname-link').textContent;
//         });
//         var Name = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-3-item-GivenName').textContent;
//         });
//         var DOB = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-3-item-DOB').textContent;
//         });
//         var Sex = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-3-item-Species').textContent;
//         });
//         var HospitalNo = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-3-item-HospitalURNo').textContent;
//         });
//         var Laboratory = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-3-item-UserLocation').textContent;
//         });
//         return {
//             MRNnumber,
//             Surname,
//             Name,
//             DOB,
//             Sex,
//             HospitalNo,
//             Laboratory
//         }
//     }catch(err){
//         console.log("No 3rd extra item")
//     }
//     //await new Promise((resolve, reject) => setTimeout(resolve, 1000));
// }

// async function getPageData4(p){
//     try{
        
//         var MRNnumber = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-4-item-MRN-link').textContent;
//         });
//         var Surname = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-4-item-Surname-link').textContent;
//         });
//         var Name = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-4-item-GivenName').textContent;
//         });
//         var DOB = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-4-item-DOB').textContent;
//         });
//         var Sex = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-4-item-Species').textContent;
//         });
//         var HospitalNo = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-4-item-HospitalURNo').textContent;
//         });
//         var Laboratory = await p.evaluate(()=> {
//             return document.querySelector('#web_DEBDebtor_FindList_0-row-4-item-UserLocation').textContent;
//         });
//         return {
//             MRNnumber,
//             Surname,
//             Name,
//             DOB,
//             Sex,
//             HospitalNo,
//             Laboratory
//         }
//     }catch(err){
//         console.log("No 4th extra item")
//     }
//     //await new Promise((resolve, reject) => setTimeout(resolve, 1000));
// }


// //Scrape Data from Excelread
// // async function LoadCSV(){
// //     const AllHospitalNumbers = [];
// //     fs.createReadStream(config.CSVFileName)
// //         .pipe(parse({delimiter: ','}))
// //         .on('data', function(csvrow) {
// //             //console.log(csvrow);
// //             AllHospitalNumbers.push(csvrow)   
// //         })
// //         .on('end',function() {
// //         //do something with csvData
// //         console.log("Done Reading CSV");
// //         //console.log(AllHospitalNumbers)
// //         for(let HospitalNo of AllHospitalNumbers){
// //             async function typehospno(mrn){
// //                 // Use the endpoint to reestablish a connection
// //                 // const browser2 = await puppeteer.connect({browserWSEndpoint});
// //                 // // Close Chromium
// //                 // await browser2.close();
// //                 //await page.waitForSelector('#web_DEBDebtor_FindList_0-item-HospitalMRN'); 
// //                 // await page.focus('#web_DEBDebtor_FindList_0-item-HospitalMRN');
// //                 // await page.keyboard.type(mrn);
// //                 console.log("Typed: " + mrn)
// //                 //await ClickSearch(page)
// //                 // .then(GetData()); 
// //                 //page.click('#web_DEBDebtor_FindList_0-button-Clear')
// //                 console.log("Clicked clear")      
// //             }
// //             typehospno(HospitalNo)   
// //         }


// //         });
// //     return AllHospitalNumbers
// // };





// // //Loop of MRN's
// //         //This is where the loop begins
//         // for(let HospitalNo of AllHospitalNumbers){
//         //     async function ClickperHospitalMRN(mrn){
//         //         await page.waitForSelector('#web_DEBDebtor_FindList_0-item-HospitalMRN'); 
//         //         await page.focus('#web_DEBDebtor_FindList_0-item-HospitalMRN');
//         //         await page.keyboard.type(mrn);
//         //         console.log("Typed: " + mrn)
                
//         //         await ClickSearch(page)
//         //         // .then(GetData());
                    
                
                    
//         //         page.click('#web_DEBDebtor_FindList_0-button-Clear')
//         //         console.log("Clicked clear")      

//         //     }
//         //     ClickperHospitalMRN(HospitalNo);
        
            
//         // }
// //         //This is where the loop ends






// // new function ScrapeData(){
// //     const scrapedData = [];
// //     const AllHospitalNumbers = [];
// //     fs.createReadStream(config.CSVFileName)
// //     .pipe(parse({}))
// //     .on('data', (data) => AllHospitalNumbers.push(data))
// //     .on('end', () => {
// //         console.log(AllHospitalNumbers);
// //         //This is where the loop begins
// //         for(let HospitalNo of AllHospitalNumbers){
// //             async function ClickperHospitalMRN(mrn){
// //                 await page.waitForSelector('#web_DEBDebtor_FindList_0-item-HospitalMRN'); 
// //                 await page.focus('#web_DEBDebtor_FindList_0-item-HospitalMRN');
// //                 await page.keyboard.type(mrn);
// //                 console.log("Typed: " + mrn)
//                 // async function ClickSearch(page){
//                 //     try{
//                 //         await page.click('#web_DEBDebtor_FindList_0-button-Find')
//                 //         console.log('clicked Search')
//                 //         await page.waitForSelector('#web_DEBDebtor_FindList_0-row-0-item-MRN-link')
//                 //     }catch(err){
//                 //         console.log("Search not successful:\n",err)
//                 //     }   
//                 // }
// //                 await ClickSearch(page)
// //                 .then(GetData());
                    
// //                 function GetData(page){
// //                 const datafromscrape = getPageData(page);
// //                 scrapedData.push(datafromscrape);
// //                 console.log(scrapedData);
// //                 }
                    
// //                 page.click('#web_DEBDebtor_FindList_0-button-Clear')
// //                 console.log("Clicked clear")      

// //             }
// //             ClickperHospitalMRN(HospitalNo);
        
            
// //         }
// //         //This is where the loop ends
// //     });
// // };