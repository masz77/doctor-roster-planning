flowchart TD
    Start([Start]) --> AdminLogin[Admin logs in]
    AdminLogin --> SelectRoster[Select roster period]
    SelectRoster --> A{Roster status?}
    
    A -->|Draft| ProceedAdd[Proceed to add shift]
    A -->|Published/Active| ConfirmChange[Confirm changing published roster]
    A -->|Archived| Error[Cannot modify archived roster]
    Error --> End([End])
    
    ConfirmChange -->|Confirmed| ChangeToDraft[Change roster to draft status]
    ConfirmChange -->|Cancelled| End
    ChangeToDraft --> ProceedAdd
    
    ProceedAdd --> SelectDates[Select shift dates]
    SelectDates --> SelectPattern[Select shift pattern]
    SelectPattern --> B{Pattern selected?}
    
    B -->|Mon-Tue| SetMonTue[Set pattern as Mon-Tue\nCalculate units = 2]
    B -->|Wed-Thu| SetWedThu[Set pattern as Wed-Thu\nCalculate units = 2]
    B -->|Fri-Sun| SetFriSun[Set pattern as Fri-Sun\nCalculate units = 4-5]
    B -->|Special| SetSpecial[Enter special period name\nSet custom dates]
    
    SetMonTue --> CheckHolidays[Check for public holidays]
    SetWedThu --> CheckHolidays
    SetFriSun --> CheckHolidays
    SetSpecial --> CheckHolidays
    
    CheckHolidays --> C{Contains public holidays?}
    C -->|Yes| AdjustUnits[Adjust units calculation]
    C -->|No| NoUnitChanges[No changes to units]
    
    AdjustUnits --> SelectDoctor
    NoUnitChanges --> SelectDoctor
    
    SelectDoctor --> D{Check availability}
    D -->|Doctor available| ConfirmAssignment[Confirm assignment]
    D -->|Doctor unavailable| WarningUnavailable[Show warning of unavailability]
    
    WarningUnavailable --> E{Force assign?}
    E -->|Yes| ConfirmAssignment
    E -->|No| SelectDoctor
    
    ConfirmAssignment --> F{Units fit pro-rata?}
    F -->|Yes| SaveShift[Save shift and assignment]
    F -->|No| ShowUnitWarning[Show warning about uneven unit distribution]
    
    ShowUnitWarning --> G{Continue anyway?}
    G -->|Yes| SaveShift
    G -->|No| SelectDoctor
    
    SaveShift --> CreateNotification[Create notification for doctor]
    CreateNotification --> UpdatePHHistory[Update public holiday history if applicable]
    UpdatePHHistory --> Success[Shift added successfully]
    Success --> End
