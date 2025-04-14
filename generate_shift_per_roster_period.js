const { DateTime } = require('luxon');

function generateGroupedDateRanges(fromDate, toDate, holidays = []) {
    // Convert input dates to Luxon DateTime objects
    let start = DateTime.isDateTime(fromDate) ? fromDate : 
                (fromDate instanceof Date) ? DateTime.fromJSDate(fromDate) : 
                DateTime.fromISO(fromDate);
    
    let end = DateTime.isDateTime(toDate) ? toDate : 
              (toDate instanceof Date) ? DateTime.fromJSDate(toDate) : 
              DateTime.fromISO(toDate);
    
    // Ensure start date is before or equal to end date
    if (start > end) {
      [start, end] = [end, start]; // Swap dates if needed
    }
    
    // Normalize holidays to ISO date strings
    const normalizedHolidays = holidays.map(holiday => {
      if (typeof holiday === 'string') return holiday;
      if (holiday instanceof Date) return DateTime.fromJSDate(holiday).toISODate();
      if (DateTime.isDateTime(holiday)) return holiday.toISODate();
      return null;
    }).filter(date => date !== null);
    
    const result = [];
    let current = start;
    let groupStart = null;
    let currentShiftPattern = null;
    
    // Function to determine if a date is a holiday
    const isHoliday = (date) => {
      return normalizedHolidays.includes(date.toISODate());
    };
    
    // Function to determine shift pattern based on weekday
    const getShiftPattern = (date) => {
      const weekday = date.weekday;
      
      // Monday (1) or Tuesday (2)
      if (weekday === 1 || weekday === 2) {
        return 'mon_tue';
      }
      
      // Wednesday (3) or Thursday (4)
      if (weekday === 3 || weekday === 4) {
        return 'wed_thu';
      }
      
      // Friday (5), Saturday (6), or Sunday (7)
      return 'fri_sat_sun';
    };
    
    // Function to get units for a single day
    const getUnitsForDay = (date) => {
      // Holidays are always 2 units regardless of the day
      if (isHoliday(date)) {
        return 2;
      }
      
      const weekday = date.weekday;
      
      // Saturday (6) or Sunday (7) are 2 units each
      if (weekday === 6 || weekday === 7) {
        return 2;
      }
      
      // All other days (incl. Friday) are 1 unit each
      return 1;
    };
    
    // Function to calculate total units for a date range
    const calculateTotalUnits = (startDate, endDate) => {
      let total = 0;
      let currentDate = startDate;
      
      while (currentDate <= endDate) {
        total += getUnitsForDay(currentDate);
        currentDate = currentDate.plus({ days: 1 });
      }
      
      return total;
    };
    
    // Function to check if date range contains any holiday
    const containsHoliday = (startDate, endDate) => {
      let currentDate = startDate;
      
      while (currentDate <= endDate) {
        if (isHoliday(currentDate)) {
          return true;
        }
        currentDate = currentDate.plus({ days: 1 });
      }
      
      return false;
    };
  
    // Function to generate details array for each group
    const generateDetails = (startDate, endDate) => {
      const details = [];
      let currentDate = startDate;
      while (currentDate <= endDate) {
        const units = getUnitsForDay(currentDate);
        const isPublicHoliday = isHoliday(currentDate);
        
        // Create a single details item per date with appropriate units
        details.push({
          date: currentDate.toISODate(),
          units_assigned: units, // This will be 2 for weekends and holidays, 1 for other days
          is_public_holiday_shift: isPublicHoliday
        });
        
        currentDate = currentDate.plus({ days: 1 });
      }
      return details;
    };
    
    // Loop through each day from start to end (inclusive)
    while (current <= end) {
      const shiftPattern = getShiftPattern(current);
      
      // Start a new group if needed
      if (currentShiftPattern === null || currentShiftPattern !== shiftPattern) {
        // Add the previous group to results if it exists
        if (groupStart !== null) {
          const previousDay = current.minus({ days: 1 });
          result.push({
            start_date: groupStart.toISODate(),
            end_date: previousDay.toISODate(),
            units: calculateTotalUnits(groupStart, previousDay),
            shift_pattern: currentShiftPattern,
            containing_public_holiday: containsHoliday(groupStart, previousDay),
            roster_period_id: 1,
            details: generateDetails(groupStart, previousDay)
          });
        }
        
        // Start a new group
        groupStart = current;
        currentShiftPattern = shiftPattern;
      }
      
      // Move to the next day
      current = current.plus({ days: 1 });
    }
    
    // Add the last group
    if (groupStart !== null) {
      result.push({
        start_date: groupStart.toISODate(),
        end_date: end.toISODate(),
        units: calculateTotalUnits(groupStart, end),
        shift_pattern: currentShiftPattern,
        containing_public_holiday: containsHoliday(groupStart, end),
        roster_period_id: 1,
        details: generateDetails(groupStart, end)
      });
    }
    
    return result;
  }

  const startDate = '2026-05-01';
  const endDate = '2026-07-31';
  const holidays = ["2026-06-08"]
  
  const result = generateGroupedDateRanges(startDate, endDate, holidays);
  console.log(result);
