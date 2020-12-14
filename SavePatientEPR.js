//Written by Dieter van der Westhuizen
//dietervdwes@gmail.com
//09/12/2020

/*
This script is intended to accept one parameter after calling it and passing that parameter to "Parameter1" which can be used to execute a function with.
Typically this parameter is a patient's MRN number and a web scraping technique will extract results for that particular patient into an Excel file named with the patient's MRN.

Works only from within the NHLS network, if connected on the intranet.

For more usage instructions visit github.com/dietervdwes/
*/

const puppeteer = require('puppeteer');
const config = require('./config.json')
const xlsx = require('xlsx');


let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours =  ("0" + date_ob.getHours()).slice(-2)
let minutes = ("0" + date_ob.getMinutes()).slice(-2);
let seconds = ("0" + date_ob.getSeconds()).slice(-2);

let DateLog = year + month + date + hours + minutes;
let YMD = year + month + date

var Parameter1 = process.argv[2];

console.log("Scraping results of "+ Parameter1 );
console.log("To close this script, active this window and hit 'Ctrl + C' or close the window.");
console.log("You can continue with other tasks while this window is busy in the background.");



// //This reads the CSV into an array variable
// var AllMRNsToBeScraped = fs.readFileSync(config.CSVFileNameMRNs)
//     .toString()
//     .split('\n')
//     .map(e => e.trim())
//     .map(e => e.split(',').map(e=> e.trim()));


launchpuppeteer(Parameter1);

async function launchpuppeteer(MRNfromTrak){
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
    console.log("Starting to extract from EPR...")
    console.log(MRNfromTrak);
    async function getDataOnPage(mrn){
        url = 'http://trakdb-prod.nhls.ac.za:57772/csp/reporting/epr.csp?PAGE=4&vstRID=*&MRN=' + mrn
        await page.goto(url, {waitUntil: 'networkidle2'});
        //await page.goto('http://trakdb-prod.nhls.ac.za:57772/csp/reporting/epr.csp?PAGE=4&vstRID=*&MRN=MRN78876108', {waitUntil: 'networkidle2'});
        
        //Now getting the Column Headers Episodes only
        const ColumnHeaders_episode = await page.$$eval('#ColHeaders tr', rows => {
            return Array.from(rows, row => {
                    const columns = row.querySelectorAll('th');
                    return Array.from(columns, column => column.innerText.substr(0,10));
                });
        });   
        
        //Now getting the Column Headers dates only
        const ColumnHeaders_date = await page.$$eval('#ColHeaders tr', rows => {
            return Array.from(rows, row => {
                    const columns = row.querySelectorAll('th');
                    return Array.from(columns, column => column.innerText.substr(11,10));
                });
        });   
        
        //Now getting the Column Headers times only
        const ColumnHeaders_time = await page.$$eval('#ColHeaders tr', rows => {
            return Array.from(rows, row => {
                    const columns = row.querySelectorAll('th');
                    return Array.from(columns, column => column.innerText.substr(22,10));
                });
        });   
    
        //Now getting the Row Headers
        const RowHeaders = await page.$$eval('#RowHeaders tr', rows => {  //(selector, pagefunction)
            return Array.from(rows, row => {  // Array.from(object, mapFunction, thisValue)
              const columns = row.querySelectorAll('td');
              return Array.from(columns, column => column.innerText);
            });
        });  
        
        //Now getting the DataCells
        const DataCells = await page.$$eval('#DataCells tr', rows => {
            return Array.from(rows, row => {
              const columns = row.querySelectorAll('td');
              return Array.from(columns, column => column.innerText);
            });
        });
        //console.log(DataCells)

        return[RowHeaders,ColumnHeaders_episode,ColumnHeaders_date,ColumnHeaders_time,DataCells]
    }
    datafromMRN = await getDataOnPage(MRNfromTrak)
    
    async function writeToExcel(dataFromScrapeMRN, filename){
        try{
            const wb = xlsx.utils.book_new();
    
            wsdata0 = dataFromScrapeMRN[0]
            wsdata1 = dataFromScrapeMRN[1]
            wsdata2 = dataFromScrapeMRN[2]
            wsdata3 = dataFromScrapeMRN[3]
            wsdata4 = dataFromScrapeMRN[4]
    
            const ws = xlsx.utils.aoa_to_sheet(wsdata0, {origin: "A3"});
            xlsx.utils.sheet_add_aoa(ws, wsdata1, {origin: "C1"});
            xlsx.utils.sheet_add_aoa(ws,wsdata2,{origin:"C2"});
            xlsx.utils.sheet_add_aoa(ws,wsdata3, {origin:"C3"});
            xlsx.utils.sheet_add_aoa(ws, wsdata4, {origin:"C4"});
            
            ws['A1'] = {v:"Episode",t:"s"};
            ws['B1'] = {v:"Episode",t:"s"};
            ws['A2'] = {v:"Date",t:"s"};
            ws['B2'] = {v:"Date",t:"s"};
            ws['A3'] = {v:"Time",t:"s"};
            ws['B3'] = {v:"Time",t:"s"};
            
            const rawdata = xlsx.utils.sheet_to_json(ws, {header:1, blankrows:false, raw:false});
            
            function RemoveBlankRows(array){
                var newArray = [];
                for(var i = 0; i < array.length; i++){
                    if(array[i][0].trim() != ''){
                        newArray.push(array[i]);
                    }                  
                };
            
                return newArray;
            }
            let data = RemoveBlankRows(rawdata)
            let datasheet = xlsx.utils.aoa_to_sheet(data)
            //console.log(data)
    
            //const datatrim = data[3].map(data => data.trim());  //original working trim for one line
            //console.log(data.flat(2)) //flat is an ECMAscript2019 function to remove empty array items.
    
            //THis is to transpose the data
            // array[0].map((_, colIndex) => array.map(row => row[colIndex]));
            // OR
            //console.log(data[0].length);
            function transposeArray(array, arrayLength){
                var newArray = [];
                for(var i = 0; i < array.length; i++){
                    newArray.push([]);
                };
            
                for(var i = 0; i < array.length; i++){
                    for(var j = 0; j < arrayLength; j++){
                        newArray[j].push(array[i][j]);
                    };
                };
            
                return newArray;
            }
            let newData= transposeArray(data,data[0].length)
    
    
            
            ws_new_data = xlsx.utils.aoa_to_sheet(newData, {blankrows:false, raw:false});
            
            xlsx.utils.book_append_sheet(wb,datasheet);
            xlsx.utils.book_append_sheet(wb,ws_new_data);
            xlsx.writeFile(wb,'./MRN_archives/' + filename + '.xlsx' );
            console.log("Written to file: " + './' + filename + '.xlsx' )
        }catch(err){
            console.log(err)
        }
    
    }
    await writeToExcel(datafromMRN, MRNfromTrak);
    
    await browser.close();
     
};
