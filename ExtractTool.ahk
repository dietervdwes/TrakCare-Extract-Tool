;Data extraction tool
;Written by Dieter van der Westhuizen 15-09-2020
;dietervdwes@gmail.com
;dieter.vdwesthuizen@nhls.ac.za

#SingleInstance, force
;#NoTrayIcon
#NoEnv
#Persistent
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.
SetKeyDelay, 150
SendMode, Input
SetTitleMatchMode, 1
;1: A window's title must start with the specified WinTitle to be a match.
;2: A window's title can contain WinTitle anywhere inside it to be a match.
;3: A window's title must exactly match WinTitle to be a match.
SetDefaultMouseSpeed, 0
SetMouseDelay, 0
SetWinDelay, 500



;;;;;;;;;;;;;;;;;;;;;;;;;;;;    Add Buttons ;;;;;;;;;;;;;;;;;;
Gui, Add, button, x2 y2 w75 h40 ,Extract
Gui, Add, button, x2 y44 w75 h20 ,GetMRN
Gui, Add, button, x2 y66 w75 h20 ,GetEPRs
Gui, Add, button, x2 y88 w75 h20 ,None2
Gui, Add, button, x2 y110 w75 h20 ,None3
Gui, Add, button, x2 y132 w75 h20 ,None4
Gui, Add, button, x2 y152 w32 h20 ,Close
Gui, Add, button, x45 y152 w20 h20 ,_i
;;;;;;;;;;;;;;;;;;;;;;;;;;;;   Set Window Options   ;;;;;;;;;;;;;;
;Gui, +AlwaysOnTop
Gui, -sysmenu +AlwaysOnTop
Gui, Show, , ExtractTool
WinGetPos,,,,TrayHeight,ahk_class Shell_TrayWnd,,,
height := A_ScreenHeight-270
width := A_ScreenWidth-85
Gui, Margin, 0, 0
;Gui, Add, Picture, x0 y0 w411 h485, picture.png
;Gui -Caption -Border
Gui, Show, x%width% y%height% w80

return

; This is to read the CSV defined in FileName below, parse the data and send to TrakCare window, also specified below, alter those episodes' details as specified.

ButtonExtract:
;;;;;;;;;;;;;;;;;;;;; Script to Loop Extraction by pre-defined Extracting Criteria with a pre-formatted configuration CSV.
MsgBox, Function not active yet. No not click random buttons if you don't know what they mean `n :?
return

ButtonGetMRN:
sleep, 500
IfWinNotExist, TrakCare - Google Chrome
        {
            MsgBox, Please login to TrakCare Webview with Google Chrome and activate the TrakCare tab in Chrome.
            Return
        }
WinActivate, TrakCare - Google Chrome

FileName := foldernumberlist.csv
Loop, read, foldernumberlist.csv, ;output_list.txt ; output_list.txt is the file to write to, if necessary
{   ;This part of code reads and parses the CSV / txt file and stores results of the read file in an array.
    LineNumber := A_Index
    Loop, parse, A_LoopReadLine, CSV
    
        FNLine := LineNumber
        FileReadLine, Line_out, foldernumberlist.csv, FNLine
        LineArray := StrSplit(Line_out, ",")
        FN_out := LineArray[1]
        Ref_code := LineArray[2] ; Not actually used in this script, included for future reference.
        
        ;This makes sure the right window is open:
        IfWinNotActive, TrakCare - Google Chrome
        {
            MsgBox, Please login to TrakCare Webview with Google Chrome and activate the TrakCare tab in Chrome.
            Return
        }
        
        ;MsgBox, Optional pause: Now doing my thing for for %Episode_out%
        
        WinActivate,  TrakCare - Google Chrome
        WinWaitActive,  TrakCare - Google Chrome
        sleep, 500
        MouseClick, Left, 543, 232, 2
        sleep, 300
        send, %FN_out%
        sleep, 400
        send, {Enter}
        sleep, 6000
        ; Example:
        ClickElementWithThisText("COMPOSE", Pwb.document, "div")

        ClickElementWithThisText(text, document, tagName)
            {
            elements := document.getElementsByTagName(tagName)
            Loop % elements.length
                if (elements[A_Index - 1].innerText = text)
                {
                    elements[A_Index - 1].click()
                    break
                }
                ; #web_DEBDebtor_FindList_0-row-0-item-MRN-link
            }
            
        
        ;MouseClickDrag, Left, 466,463,620,463,100
        sleep, 300
        clipboard := ""  ; Start off empty to allow ClipWait to detect when the text has arrived.
        Send ^c
        ClipWait  ; Wait for the clipboard to contain text.
        ;sleep, 100
        mrn := Clipboard
        FileAppend, %mrn%`,%A_Now%`n, mrn_list.txt
        sleep, 200
     ;Now repeat the process or continue when at the last line
}
return ; Return in AHK will "kill" the script, thus STOP.

ButtonGetEPRs:
sleep, 500
Window = HST - Web Results
WinActivate, %Window%
if ErrorLevel   ; i.e. it's not blank or zero.
    MsgBox, The window does not exist.
else
    ;MsgBox, The window exists.
    
;MsgBox, %Window%
FileName := mrnlist.csv
Loop, read, mrnlist.csv, ;output_list.txt ; output_list.txt is the file to write to, if necessary
{   ;This part of code reads and parses the CSV / txt file and stores results of the read file in an array.
    LineNumber := A_Index
    Loop, parse, A_LoopReadLine, CSV
    
        FNLine := LineNumber
        FileReadLine, Line_out, mrnlist.csv, FNLine
        LineArray := StrSplit(Line_out, ",")
        MRN_out := LineArray[1]
        Ref_code := LineArray[2] ; Not actually used in this script, included for future reference.
        ;MsgBox, %MRN_out%
        ;This makes sure the right window is open:
        ;IfWinNotActive, %Window%
        ;{
        ;    MsgBox, Please open Google Chrome and navigate to: http://trakdb-prod.nhls.ac.za:57772/csp/reporting/epr.csp?PAGE=4&vstRID=*&MRN=
        ;    Return
        ;}
        
        ;MsgBox, Optional pause: Now doing my thing for for %Episode_out%
        
        WinActivate,  %Window%
        WinWaitActive,  %Window%
        sleep, 500
        FullUrl := "http://trakdb-prod.nhls.ac.za:57772/csp/reporting/epr.csp?PAGE=4&vstRID=*&MRN=" + MRN_out
        send, {F6}
        sleep, 500
        send, %FullUrl%
        sleep, 500
        send, {Enter}
        sleep, 2000
        send, ^a
        sleep, 500
        ;MouseClickDrag, Left, 466,463,620,463,100
        clipboard := ""  ; Start off empty to allow ClipWait to detect when the text has arrived.
        sleep, 200
        Send ^c
        ClipWait  ; Wait for the clipboard to contain text.
        ;sleep, 100
        data := Clipboard
        sleep, 200
        WinActivate, ahk_class XLMAIN
        WinWaitActive, ahk_class XLMAIN
        if ErrorLevel   ; i.e. it's not blank or zero.
            MsgBox, The Excel window does not exist. Open a blank workbook.
            else
        sleep, 200
        send, ^n
        sleep, 200
        WinWaitActive, Book
        sleep, 200
        send, {AltDown}{Tab}{AltUp}
        sleep, 100
        send, {AltDown}{F4}{AltUp}
        sleep, 80
        if WinActive(ahk_class NUIDialog)
        	send, {AltDown}n{AltUp}
        else
        WinActivate, Book
        send, ^{Home}
        sleep, 200
        send, ^v ;Paste
        sleep, 3000
        send, {Alt} 
        sleep, 300
        send, h
        send, m 
        send, u ; unmerge cells
        sleep, 200
        send, ^{Home} ; top left cell
        send, {Down} ; populate empty top left cells with something to prevent delete in next step.
        sleep, 200
        send, %MRN_out%
        sleep, 200
        send, {Down}
        send, %MRN_out%
        sleep, 50
        send, {Right}
        send, %MRN_out%
        sleep, 50
        send, {Up}
        send, %MRN_out%
        sleep, 50
        send, ^{Home} ;Navigate to top left cell again.
        send, {Right}{Right}
        send, {Down}{Down}{Down}
        sleep, 100
        send, ^{Down} ;Go to bottom data.
        send, {Home} ; Beginning of line
        send, {Up} ; Select black bar above.
        send, {CtrlDown}{ShiftDown}{End}{ShiftUp}{CtrlUp} ; Select all data at the bottom.
        sleep, 200
        send, ^x ;Cut
        sleep,150
        send, ^{Home}
        send, {Down}{Down}{Down}{Down}{Right}{Right}
        sleep, 200
        send, ^v ; Paste
        sleep, 1000
        send, ^{Home}
        send, ^{Space} ; Selects the whole first column
        send, {Alt}
        send, h
        send, f
        send, d
        send, s
        WinWaitActive, Go To Special
        send, {AltDown}k{AltUp}
        send, {Enter}
        sleep, 200
        send, {Alt}
        send, h
        send, d
        send, r
        sleep, 200
        clipboard := ""  ; Start off empty to allow ClipWait to detect when the text has arrived.
        send, ^{Home}
        send, {CtrlDown}{ShiftDown}{End}{ShiftUp}{CtrlUp}
        sleep, 200
        Send ^c
        ClipWait  ; Wait for the clipboard to contain text.
        sleep, 100
        send, {Alt}
        send, h
        send, i
		send, s     
		sleep, 100
		send, {Alt}
		send, h
		send, v
   		send, s
   		WinWaitActive, Paste Special
   		sleep, 50
   		send, {AltDown}e{AltUp}
   		sleep, 100
   		send, {Enter}
		send, {F12} ; Opens Save As window
        sleep, 100
        WinWaitActive, Save As
        sleep, 1500
        suffix := .xlsx
        send, %MRN_out%%suffix%
        sleep, 200
        send, {Enter}
        sleep, 500
        #IfWinActive, Confirm Save As
            send, {AltDown}y{AltUp}
        #IfWinActive
        FileAppend, %MRN_out%`,%A_Now%`n, mrn_scraped.txt
        sleep, 500

        
     ;Now repeat the process or continue when at the last line
}
return ; Return in AHK will "kill" the script, thus STOP.

ButtonRemove_fol:
sleep, 500
IfWinNotExist, Patient Entry
        {
            MsgBox, Please open the Patient Entry Window
            Return
        }
WinActivate, Patient Entry

FileName := folder_list.csv
Loop, read, folder_list.csv, ;output_list.txt ; output_list.txt is the file to write to, if necessary
{   ;This part of code reads and parses the CSV / txt file and stores results of the read file in an array.
    LineNumber := A_Index
    Loop, parse, A_LoopReadLine, CSV
    
        EpisodeLine := LineNumber
        FileReadLine, Line_out, folder_list.csv, EpisodeLine
        LineArray := StrSplit(Line_out, ",")
        Episode_out := LineArray[1]
        Ref_code := LineArray[2] ; Not actually used in this script, included for future reference.
        
        ;This makes sure the right window is open:
        IfWinNotActive,  Patient Entry
        {
            MsgBox, Please open the  Patient Entry Window
            Return
        }
        
        ;MsgBox, Optional pause: Now doing my thing for for %Episode_out%
        
        WinActivate,  Patient Entry
        WinWaitActive,  Patient Entry
        sleep, 300
        send, %Episode_out%
        sleep, 400
        send, {Tab}
        sleep, 2000
        WinWaitActive, Patient Entry - Fully Entered
        sleep, 900
        ;send, {CtrlDown}{Delete}{CtrlUp}
        ;sleep, 100
        MouseClick, Left, 883, 109, 1 ;Click on Hospital number field start
        sleep, 200
        send, {ShiftDown}{End}{ShiftUp}
        sleep, 100
        send, {Delete}
        sleep, 100
        send, {Tab}
        sleep, 900
        send, {AltDown}u{AltUp}
        sleep, 500
        send, {Enter}
        sleep, 400
        FileAppend, %Episode_out%`,%Ref_code%`,%A_Now%`n, folder_list_removed.txt
        sleep, 200
     ;Now repeat the process or continue when at the last line
}
return ; Return in AHK will "kill" the script, thus STOP.

ButtonRe_bill:
sleep, 500
IfWinNotExist, Accounts Re-Pricing Episode
        {
            MsgBox, Please open the Accounts Re-Pricing Window
            Return
        }
WinActivate, Accounts Re-Pricing

FileName := rebill_list.csv
Loop, read, rebill_list.csv, ;output_list.txt ; output_list.txt is the file to write to, if necessary
{
    LineNumber := A_Index
    Loop, parse, A_LoopReadLine, CSV
    
        EpisodeLine := LineNumber
        FileReadLine, Line_out, rebill_list.csv, EpisodeLine
        LineArray := StrSplit(Line_out, ",")
        Episode_out := LineArray[1]
        Test_item := LineArray[2]
        
        IfWinNotActive,  Accounts Re-Pricing Episode
        {
            MsgBox, Please open the  Accounts Re-Pricing Window
            Return
        }
                    
        WinActivate,  Accounts Re-Pricing
        WinWaitActive,  Accounts Re-Pricing
        sleep, 500
        send, %Episode_out%
        sleep, 500
        send, {Tab}
        sleep, 700
        send, {AltDown}a{AltUp}
        sleep, 500
        send, %Episode_out%
        send, {Tab}
        sleep, 700
        send, {AltDown}r{AltUp}
        sleep, 200
        WinWaitActive, Re Billing
        sleep, 400   ; Decrease this time to speed up!!
        send  {AltDown}y{AltUp}
        sleep, 800    ; Decrease this time to speed things up further.
     
}
return

ButtonClear_List:
sleep, 500
IfWinNotExist, Result Entry
        {
            MsgBox, Please open the Result Entry Window
            Return
        }
WinActivate, Result Entry
;^!U::
FileName := clear_list.csv
Loop, read, clear_list.csv, ;output_list.txt ; output_list.txt is the file to write to, if necessary
{
    LineNumber := A_Index
    Loop, parse, A_LoopReadLine, CSV
    
        EpisodeLine := LineNumber
        FileReadLine, Line_out, clear_list.csv, EpisodeLine
        LineArray := StrSplit(Line_out, ",")
        Episode_out := LineArray[1]
        Test_set := LineArray[2]
        
        IfWinActive, Result Entry - Single
            WinClose, Result Entry - Single
        IfWinNotActive, Result Entry
        {
            MsgBox, Please open the Result Entry Window
            Return
        }
        
        ;MsgBox, Now going to clear results for %Episode_out%
        
        WinActivate, Result Entry
        WinWaitActive, Result Entry
        ;Run, Notepad
        ;WinWaitActive, Notepad
        sleep, 500
        send, {AltDown}l{AltUp}
        sleep, 300
        ;MouseClick, Left, 105, 112, 2, 100
        ;MouseClick, Left, 105, 500, 2, 100
        sleep, 1000
        send, %Episode_out%
        sleep, 300
        send, {Tab}
        sleep, 300
        send, {Tab}
        sleep, 300
        send, %Test_set%
        sleep, 200
        send, {Enter}
        sleep, 1000
        MouseClick, Left, 150, 300
        sleep, 1000
        send, {AltDown}e{AltUp}
        WinWaitActive, Result Entry - Single
        
        
        sleep, 3000 ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  <<<<<<<<< Increase this wait time if the connection is slow
        /*
        This portion of code would usually send results
        */
        sleep, 500
        send, {AltDown}l{AltUp}
        WinWaitActive, tkLTResultsEntry (L2016)
        sleep, 300
        send, {Enter}
        sleep, 3000
        WinWaitActive, Result Entry - Single
        sleep, 800
        send, {AltDown}c{AltUp} ; This is to exit Result Entry Window.
        sleep, 1000
        send, {AltDown}l{AltUp}
        sleep, 800
     
}
return

ButtonRe-add_tests:
sleep, 500
IfWinNotExist, Patient Entry
        {
            MsgBox, Please open the Patient Entry Window
            Return
        }
WinActivate, Patient Entry

FileName := re_add_list.csv
Loop, read, re_add_list.csv, ;output_list.txt ; output_list.txt is the file to write to, if necessary
{   ;This part of code reads and parses the CSV / txt file and stores results of the read file in an array.
    LineNumber := A_Index
    Loop, parse, A_LoopReadLine, CSV
    
        EpisodeLine := LineNumber
        FileReadLine, Line_out, re_add_list.csv, EpisodeLine
        LineArray := StrSplit(Line_out, ",")
        Episode_out := LineArray[1]
        Test_set := LineArray[2] 
        
        ;This makes sure the correct window is open:
        IfWinNotActive,  Patient Entry
        {
            MsgBox, Please open the  Patient Entry Window
            Return
        }
        
        ;MsgBox, Optional pause: Now doing my thing for for %Episode_out%
        
        WinActivate,  Patient Entry
        WinWaitActive,  Patient Entry
        send, %Episode_out%
        sleep, 400
        send, {Tab}
        sleep, 2000
        WinWaitActive, Patient Entry - Fully Entered, , 1000
        sleep, 1000
        if ErrorLevel
        {
            MsgBox, Timeout waiting for Patient Entry - Fully Entered Window.`nWhen you press OK the script will resume.
        }
        else
        send, {AltDown}t{AltUp}
        sleep, 200
        MouseClick, Left, 471, 153, 1, 
        sleep, 300
        send, {Delete}
        sleep, 800
        send, {Enter}
        sleep, 500
        send, %Test_set%
        sleep, 500
        send, {Tab}
        sleep, 200
        send, {Enter}
        sleep, 500
        send, {AltDown}u{AltUp}
        sleep, 500
        send, {Enter}
        sleep, 800
        FileAppend, %Episode_out%`,%Ref_code%`,%A_Now%`n, re_add_list.txt ; This will append the text file (defined after the last comma in this line) with the log of episodes transcribed.
        
     ;Now repeat the process or continue when at the last line
}
return ; Return in AHK will "kill" the script, thus STOP.

Escape::Reload
;ExitApp
Return

^!r::Reload  ; Assign Ctrl-Alt-R as a hotkey to restart the script.

ButtonClose:
ExitApp

Button_i:
Run, http://github.com/dietervdwes/chemhelp


    

