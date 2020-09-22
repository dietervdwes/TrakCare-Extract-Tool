# TrakCare-Extract-Tool
An extraction tool for use with TrakCare backend and TrakCare WebView

This tool needs an MRN list (as in the included CSV file) with the patients' results and a PC with Microsoft Excel (at least 2017 version which uses/supports the modern Alt-hotkeys).

To get the MRN list from Hospital numbers, see other repository of the Javascript Web Scraper which uses Node and Puppeteer web scraper (via Chromium - a standalone / headless Chrome browser).

#Dependencies:
1. AutoHotkey must be installed.
2. Excel >2017 must be installed.
3. Google Chrome web browser must be installed.

#How this script is intended to work
1. Prepare the mrn_list.csv as in the example.  Save it in the directory where the AHK script is.
2. Close all other open programs.
3. Open a blank Excel workbook.
4. Navigate to http://trakdb-prod.nhls.ac.za:57772/csp/reporting/epr.csp?PAGE=4&vstRID=*&MRN= and leave the tab open.  Make sure the address bar is not selected.
5. Open the ExtractTool.ahk and hit "GetEPRs".
6. Please report errors and contact me for troubleshooting so we can make this thing better - dieter.vdwesthuizen@nhls.ac.za
