const fs = require("fs")
var xlsx = require("xlsx");


var dir = './MRNs extracted AKI ICU COVID/';

fs.readdir(dir, function(err, files){
    files = files.map(function (fileName) { //files will be array of files in ascending order.
      return {
        name: fileName,
        time: fs.statSync(dir + '/' + fileName).mtime.getTime()
      };
    })
    .sort(function (a, b) {
      return a.time - b.time; }) //For descending, just replace a.time with b.time, like b.time - a.time
    .map(function (v) {
      return v.name; });
      console.log(files);
      for(let file of files){
        async function transform(f){
          try{
            directory = dir + f
            var wb = await xlsx.readFile(directory,{cellDates:true});
            var filenameraw = await f.slice(-99, -5)
            var ws = await wb.Sheets["Sheet2"];
            var data = await xlsx.utils.sheet_to_json(ws,{range:1});
            //Range:1 specifies that the row index [1] (and not 0) will be used for the first row. See https://www.npmjs.com/package/xlsx#json
        
            //Now need to start writing to a new sheet
            var newWB = await xlsx.utils.book_new();  //Make a new Workbook
            var newWS = await xlsx.utils.json_to_sheet(data); //Convert the JSON array of objects to sheet data again.
            //newWS['A1'].v = "Episode" 
            //newWS['B1'].v = "Date"
            //newWS['C1'].v = "Time"
            await xlsx.utils.book_append_sheet(newWB,newWS,"TransformedData"); //Attach the new worksheet to the new Workbook
            await xlsx.writeFile(newWB, dir + filenameraw + "_new.xlsx")
            //console.log("test")
            console.log("Transforming file " + files.indexOf(file) + 1 +" of " + files.length)

          }catch(err){
            console.log(err)
          }
        
        }
        transform(file)
        
    
      }
      return files
});  

// fs.readdir(dir, function(err, files){
//     var files = files.map(function (fileName) { //files will be array of files in ascending order.
//       return {
//         name: fileName,
//         time: fs.statSync(dir + '/' + fileName).mtime.getTime()
//       };
//     })
//     .sort(function (a, b) {
//       return a.time - b.time; }) //For descending, just replace a.time with b.time, like b.time - a.time
//     .map(function (v) {
//       return v.name; });
//       console.log(files);
//   });  

//console.log(files)
// for(file of files){
//     var wb = xlsx.readFile(file,{cellDates:true});
//     let filenameraw = file.slice(-99,5)
//     var ws = wb.Sheets["Sheet2"];
//     var data = xlsx.utils.sheet_to_json(ws,{range:1});
//     //Range:1 specifies that the row index [1] (and not 0) will be used for the first row. See https://www.npmjs.com/package/xlsx#json

//     //Now need to start writing to a new sheet
//     var newWB = xlsx.utils.book_new();  //Make a new Workbook
//     var newWS = xlsx.utils.json_to_sheet(data); //Convert the JSON array of objects to sheet data again.
//     newWS['A1'].v = "Episode" 
//     newWS['B1'].v = "Date"
//     newWS['C1'].v = "Time"
//     xlsx.utils.book_append_sheet(newWB,newWS,"TransformedData"); //Attach the new worksheet to the new Workbook
//     xlsx.writeFile(newWB, filenameraw + "_new.xlsx")

// }




// const Excel = require('exceljs');
// const wb = new Excel.Workbook();
// async ()=>{
//     await wb.xlsx.readFile(ExcelFileName);
// // ... use workbook

// let ExcelFileName = 'MRN53130567 - Copy.xlsx'
// let excelFile = await wb.xlsx.readFile(ExcelFileName);
// let ws = await excelFile.getWorksheet('Sheet2');

// ws.removeRows(0, 2);
// console.log(ws)
// }

//let data = ws.getSheetValues(); //0 is the first and 1 is the second worksheet
//let OTLsiteraw = ws.getCell('A8').value; 

//const table = ws.getTable('MyTable');

// remove first two rows
// table.removeRows(0, 2);