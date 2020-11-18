# TrakCare-Extract-Tool
An extraction tool for use with TrakCare backend and TrakCare WebView.  There are essentially three scripts in this repository

# 1. AHK TrakCare-Extract-Tool - This script is old, see "2. JavaScript..." script below
This tool needs an MRN list (as in the included CSV file) with the patients' results and a PC with Microsoft Excel (at least 2017 version which uses/supports the modern Alt-hotkeys).

To get the MRN list from Hospital numbers, see other items below of the Javascript Web Scraper which uses Node and Puppeteer web scraper (via Chromium - a standalone / headless Chrome browser).

# Dependencies:
1. AutoHotkey must be installed.
2. Excel 2017 or newer must be installed.
3. Google Chrome web browser must be installed.

# How this script is intended to work
1. Prepare the mrn_list.csv as in the example.  Save it in the directory where the AHK script is.
2. Close all other open programs (especially any other AutoHotkey scripts open).
3. Open a blank Excel workbook. Leave Excel Open.
4. Open Chrome and navigate to http://trakdb-prod.nhls.ac.za:57772/csp/reporting/epr.csp?PAGE=4&vstRID=*&MRN= and leave the tab open.  Make sure the address bar is not selected.
5. Open the ExtractTool.ahk and hit "GetEPRs".
6. Please report errors and contact me for troubleshooting so we can make this thing better - dieter.vdwesthuizen@nhls.ac.za

# 2. JavaScript / Node / Puppeteer MRN extraction tool

This is a more advanced script which needs a few dependencies installed on the PC.  It interacts with TrakCare Webview to get the MRN numbers using a list of Hospital numbers as supplied to it by a file "foldernumbers.csv" and "AllMRNsToBeScraped.csv" respectively (needs to be in the same directory as the main script file: "index-new.js".

# Start here if you DID get all the necessary files via a Flash disk from Dieter

Introduction
--------
Web scraping with these scripts uses the web scraping module called “Puppeteer”.  This is a module within JavaScript which has a standalone Chromium web browser (can be run from a flash drive) and is controllable with Node (a JavaScript V8 Engine).

The language these scripts are written in, is JavaScript.  This is not Java.

Python has a similar Web Scraping module called Selenium.  There are other python packages which are smaller and faster: BeautifulSoup, LXML, Python Requests, Scrapy, Urllib and MechanicalSoup to name a few, but each has its advantages and disadvantages.

The main reason I’m using Puppeteer is because I have already learnt some JavaScript, and it opens a web page in a similar fashion as a human would, hence there’s little chance that any network traffic will be blocked. It also has an option to see the web page being opened (headless:false mode).  The downside is that the whole page needs to load before the data can be obtained, which is not always necessary with other Python Packages (excluding Selenium). 

Step 1 – Dependencies:
------------
•	Make sure Node.js is installed on the computer where you are working (LTS version recommended).

•	Make sure VSCode (Visual Studio Code) is installed on the computer where you are working.

Step 2 – Getting the files and folders ready (can be put on a flash drive):
-----------
Copy the Folder called “Web Scraping” anywhere with at least the following files and folders in it:
1.	package.json 
  a.	This file houses the names of the main packages installed in the node_modules folder
2.	package-lock.json 
  a.	This file houses the names of all the branches and dependencies of the main packages
3.	node_modules 
  a.	This folder contains, amongst others, the standalone Chromium browser with the Puppeteer module in it – the biggest module ~400mb)
4.	config.json (must be edited) 
  a.	with your own username(s) and password(s)
  b.	contains the variables which will often need to be read or edited, like passwords and filenames.
For Scraping MRN numbers from Hospital Folder Numbers (can be done from any network which has access to TrakCare Webview):
5.	getMRNs.js (must be copied)
  a.	This is the main script to scrape MRN numbers.
6.	foldernumbers.csv -must be formatted as:

...........
  
  123456489725
  
  1234564987984
  
  123456498797
  
.............

This file should contain the folder numbers which you wish to get the MRN numbers for.
For Scraping the data from the MRN numbers (must be done from within the NHLS – and preferably afterhours, especially if the internet is as slow as it currently is, to prevent this script from pulling data continually through the network)

7.	scrapeHST.js 
  a.	This is the main script to scrape the data from each MRN number.
8.	AllMRNsToBeScraped.csv -must formatted like such:

.............
  
  MRN1234561235
  
  MRN123456789465
  
  MRN12345965498
  
  MRN12345656554
  
.............

a.	This is the file which should contain the MRN numbers of which you want the data from.

Step 3 – Open the folder in File Explorer by right clicking in an empty space and select “Open with Code”
--------- 
OR 
Open VSCode and open the folder “Web Scraping” within VSCode.
From within VSCode you will see all the files and folders in the left-hand panel and if you click on each, it will open in a new tab in the main window.
Open a new terminal window in the folder: in VSCode click “Terminal > New Terminal” or open CMD and navigate to the folder with the "cd" command.
A Terminal window should now be displayed in the bottom panel.

Step 4 : Terminal window commands
---------
In a terminal window type the following command to start extracting:
node getMRNs.js
Chromium browser should launch or an output should become visible in the command line.
The MRN’s will output to a raw file: rawwritefile.csv. This file can be opened in VSCode or with any text editor, or saved as .csv by changing the file suffix. If the MRN list has been obtained and cleaned up, save it as “AllMRNsToBeScraped.csv” as noted above.
Then in the terminal window type:
node scrapeHST.js

To let the scripts extract in the background without showing the Chromium browser (headless mode), edit the getMRNs.js or  scrapeHST.js files and change “headless:false” to “headless:true”.
To stop the extract mid-extract, click on the command window and hit Ctrl+C.



# Start here if you DIDN'T get all the files via a Flash disk from Dieter
This script needs:
1. Node.js installed on the PC.
2. VS Code installed (not necessary but highly recommended).

Node modules needed:

1. Puppeteer installed using "npm -i puppeteer - y" from the CMD.
2. XLSX intalled using "npm -i xlsx -y"

To run:

1. Copy all the files to a directory on the computer, including: config.json, foldernumbers.csv, AllMRNsToBeScraped.csv, getMRNs.js and scrapeHST.js.  Edit config.json with a text editor so your TrakCare WebView username and password is in the correct field between inverted commas like so: ("N19592") and your NHLS username and password is inserted.
2. Open a terminal window in the that folder location (easiest is to right click in the folder and click "Open with Code" - which opens VSCode in that folder location).

(Steps 3 -5 Optional if not having the node_modules and packages already.  Steps 3-5 are also near impossible on the NHLS network - for me at least...)

3. Initiatlise a package by running "npm init -y"
4. Type "npm -i xlsx -y" and hit enter.
5. Type "npm -i puppeteer" -y and hit enter.  (Note steps 3-5 is only necessary if not downloading the whole "node_modules" from Github / from Dieter's Flash Drive.

6. To start MRN extract from TrakCare WebView, type: "node getMRNs.js"
7. To start Data extract from HST EPR, type: "node scrapeHST.js"

Shout for help, if needed.
dieter.vdwesthuizen@nhls.ac.za
