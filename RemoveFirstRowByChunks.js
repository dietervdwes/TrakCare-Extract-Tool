const fs = require("fs")
var xlsx = require("xlsx");

const dir = './mrnfiles/'; // <<--change this to the relevant path inside the working directory

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
    console.log("Starting conversion for:" + "\n" + files[0] + "... and others." + "\n" + "A total of " + files.length + " files will be processed. Please wait...");
    
    // This function CHUNKS the array (filelist) into sub-arrays (filelist chunks)
    function chunkArray(array, size) {
      let result = []
      for (let i = 0; i < array.length; i += size) {
          let chunk = array.slice(i, i + size)
          result.push(chunk)
      }
      return result
    }
    //console.log(chunks)
    
    async function transformFiles(filearray){
      try{
        const chunks = chunkArray(filearray, 50) // <--Change this value to the chunk size of how many files should be processed asynchronously at a time
        for (const chunk of chunks){
          await transformfunction(chunk);
        }
      } catch (error){
      console.log(error)
      }
    }
    transformFiles(files)

    async function transformfunction(fileschunks){
      for(let fileschunk of fileschunks){
      //the transform function transforms a single file
      async function transform(f){
          try{
            var wb = await xlsx.readFile(dir + f,{cellDates:true});
            var filenameraw = await f.split(".")[0]
            var ws = await wb.Sheets["Sheet2"];
            var data = await xlsx.utils.sheet_to_json(ws,{range:1});
            //Range:1 specifies that the row index [1] (and not 0) will be used for the first row. See https://www.npmjs.com/package/xlsx#json
        
            //Now need to start writing to a new sheet
            var newWB = await xlsx.utils.book_new();  //Make a new Workbook
            var newWS = await xlsx.utils.json_to_sheet(data); //Convert the JSON array of objects to sheet data again.
            //This is to change the value of a certain cell - not used anymore
            //newWS['A1'].v = "Episode" 
            //newWS['B1'].v = "Date"
            //newWS['C1'].v = "Time"
            await xlsx.utils.book_append_sheet(newWB,newWS,"TransformedData"); //Attach the new worksheet to the new Workbook
            await xlsx.writeFile(newWB, dir + filenameraw + "_new.xlsx", {compression:true})
    
            console.log(filenameraw)
          } catch (error){
              console.log(error)
          }
          
          }
        await transform(fileschunk)
        }
    }  
      
});  

// for(let file of files){
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