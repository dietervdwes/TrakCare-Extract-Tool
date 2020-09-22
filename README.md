# TrakCare-Extract-Tool
An extraction tool for use with TrakCare backend and TrakCare WebView.  There are essentially two scripts in this repository:

# 1. AHK TrakCare-Extract-Tool
This tool needs an MRN list (as in the included CSV file) with the patients' results and a PC with Microsoft Excel (at least 2017 version which uses/supports the modern Alt-hotkeys).

To get the MRN list from Hospital numbers, see other items below of the Javascript Web Scraper which uses Node and Puppeteer web scraper (via Chromium - a standalone / headless Chrome browser).

# Dependencies:
1. AutoHotkey must be installed.
2. Excel >2017 must be installed.
3. Google Chrome web browser must be installed.

# How this script is intended to work
1. Prepare the mrn_list.csv as in the example.  Save it in the directory where the AHK script is.
2. Close all other open programs.
3. Open a blank Excel workbook.
4. Navigate to http://trakdb-prod.nhls.ac.za:57772/csp/reporting/epr.csp?PAGE=4&vstRID=*&MRN= and leave the tab open.  Make sure the address bar is not selected.
5. Open the ExtractTool.ahk and hit "GetEPRs".
6. Please report errors and contact me for troubleshooting so we can make this thing better - dieter.vdwesthuizen@nhls.ac.za

# 2. JavaScript / Node / Puppeteer MRN extraction tool
This is a more advanced script which needs a few dependencies installed on the PC.  It interacts with TrakCare Webview to get the MRN numbers using a list of Hospital numbers as supplied to it by a file "AllFolderNumbers.csv" (needs to be in the same directory as the main script file: "index-new.js".

This script needs:
1. Node.js installed on the PC.
2. VS Code installed (not necessary but highly recommended).
Node modules needed:
1. Puppeteer installed using "npm -i puppeteer - y" from the CMD. (Chromium also needs to be installed, if it doesn't do automatically).
2. XLSX intalled using "npm -i xlsx -y"

To run:
1. Copy the files index.js, config.json, AllHospitalNumbers.xlsx and ScrapedMRNs.xlsx to a folder.  Edit config.json with a text editor so your TrakCare WebView username and password is in the correct field between inverted commas like so: ("N19592")
2. Open a terminal window in the that folder location (easiest is to right click in the folder and click "Open with Code").
3. Initiatlise a package by running "npm init -y"
4. Type "npm -i xlsx -y" and hit enter.
5. Type "npm -i puppeteer" -y and hit enter.  (Note steps 3-5 is only necessary if not downloading the whole "node_modules" from Github / from Dieter's Flash Drive.
6. To start extract, type: "node index.js"
