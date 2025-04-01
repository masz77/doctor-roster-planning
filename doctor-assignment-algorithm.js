/**
 * Main function to assign doctors to shift assignments
 * @param {Object[]} doctors - Array of doctor objects with availability and weekly hours
 * @param {Object[]} shiftAssignments - Array of shift assignment objects that need doctors assigned
 * @param {Object[]} publicHolidayHistory - History of public holiday shifts worked by doctors
 * @returns {Object[]} - Array of updated shift assignments with doctor_id filled in
 */
function assignDoctorsToShiftAssignments(doctors, shiftAssignments, publicHolidayHistory) {
  // Sort shift assignments chronologically by date
  const sortedAssignments = sortAssignmentsByDate(shiftAssignments);
  
  // Pre-process data
  const totalWeeklyHours = calculateTotalWeeklyHours(doctors);
  const doctorTargetPercentages = calculateDoctorTargetPercentages(doctors, totalWeeklyHours);
  const publicHolidayDeficits = calculatePublicHolidayDeficits(doctors, publicHolidayHistory, doctorTargetPercentages);
  
  // Track assigned units per doctor
  const doctorUnits = initializeDoctorUnits(doctors);
  
  // Create a new array to hold all updated assignments
  const updatedAssignments = [...sortedAssignments];
  
  // First pass: Handle public holiday assignments
  processPublicHolidayAssignments(
    updatedAssignments, 
    doctors, 
    doctorUnits, 
    publicHolidayDeficits
  );
  
  // Second pass: Handle regular assignments (non-public holiday)
  processRegularAssignments(
    updatedAssignments, 
    doctors, 
    doctorUnits, 
    doctorTargetPercentages
  );
  
  // Final validation and adjustment to ensure fair distribution
  validateAndAdjustAssignments(
    updatedAssignments, 
    doctors, 
    doctorUnits, 
    doctorTargetPercentages
  );
  
  return updatedAssignments;
}

/**
 * Sort shift assignments by their date
 * @param {Object[]} assignments - Array of shift assignment objects
 * @returns {Object[]} - Sorted array of shift assignments
 */
function sortAssignmentsByDate(assignments) {
  return [...assignments].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
}

/**
 * Calculate total weekly hours across all doctors
 * @param {Object[]} doctors - Array of doctor objects
 * @returns {number} - Total weekly hours
 */
function calculateTotalWeeklyHours(doctors) {
  return doctors.reduce((total, doctor) => total + doctor.weekly_hours, 0);
}

/**
 * Calculate target percentage of assignments for each doctor based on weekly hours
 * @param {Object[]} doctors - Array of doctor objects
 * @param {number} totalWeeklyHours - Total weekly hours across all doctors
 * @returns {Object} - Map of doctor IDs to target percentages
 */
function calculateDoctorTargetPercentages(doctors, totalWeeklyHours) {
  const targetPercentages = {};
  
  doctors.forEach(doctor => {
    targetPercentages[doctor.id] = doctor.weekly_hours / totalWeeklyHours;
  });
  
  return targetPercentages;
}

/**
 * Calculate public holiday deficits for each doctor
 * @param {Object[]} doctors - Array of doctor objects
 * @param {Object[]} publicHolidayHistory - History of public holiday shifts worked by doctors
 * @param {Object} doctorTargetPercentages - Map of doctor IDs to target percentages
 * @returns {Object} - Map of doctor IDs to public holiday deficits
 */
function calculatePublicHolidayDeficits(doctors, publicHolidayHistory, doctorTargetPercentages) {
  const deficits = {};
  const totalPublicHolidayUnits = calculateTotalPublicHolidayUnits(publicHolidayHistory);
  
  doctors.forEach(doctor => {
    // Calculate target units
    const targetUnits = totalPublicHolidayUnits * doctorTargetPercentages[doctor.id];
    
    // Calculate actual units worked (weighted by recency)
    const actualUnits = calculateWeightedPublicHolidayUnits(doctor.id, publicHolidayHistory);
    
    // Calculate deficit (positive means doctor should get more holiday shifts)
    deficits[doctor.id] = targetUnits - actualUnits;
  });
  
  return deficits;
}

/**
 * Calculate total public holiday units across all history
 * @param {Object[]} publicHolidayHistory - History of public holiday shifts
 * @returns {number} - Total public holiday units
 */
function calculateTotalPublicHolidayUnits(publicHolidayHistory) {
  return publicHolidayHistory.reduce((total, record) => total + record.units, 0);
}

/**
 * Calculate weighted public holiday units for a doctor
 * (more recent holidays are weighted more heavily)
 * @param {number} doctorId - ID of the doctor
 * @param {Object[]} publicHolidayHistory - History of public holiday shifts
 * @returns {number} - Weighted units
 */
function calculateWeightedPublicHolidayUnits(doctorId, publicHolidayHistory) {
  const currentYear = new Date().getFullYear();
  let weightedUnits = 0;
  
  // Filter history for this doctor
  const doctorHistory = publicHolidayHistory.filter(record => record.doctor_id === doctorId);
  
  doctorHistory.forEach(record => {
    // Calculate years ago (0 for current year, 1 for last year, etc.)
    const recordYear = new Date(record.date).getFullYear();
    const yearsAgo = currentYear - recordYear;
    
    // Weight decreases with age: current year = 1.0, last year = 0.5
    const weight = yearsAgo <= 1 ? 1.0 : 0.5;
    
    weightedUnits += record.units * weight;
  });
  
  return weightedUnits;
}

/**
 * Initialize tracker for units assigned to each doctor
 * @param {Object[]} doctors - Array of doctor objects
 * @returns {Object} - Map of doctor IDs to assigned units (initially 0)
 */
function initializeDoctorUnits(doctors) {
  const doctorUnits = {};
  doctors.forEach(doctor => {
    doctorUnits[doctor.id] = 0;
  });
  return doctorUnits;
}

/**
 * Process public holiday assignments (first pass)
 * @param {Object[]} allAssignments - Array of all shift assignment objects
 * @param {Object[]} doctors - Array of doctor objects
 * @param {Object} doctorUnits - Map of doctor IDs to assigned units
 * @param {Object} publicHolidayDeficits - Map of doctor IDs to public holiday deficits
 */
function processPublicHolidayAssignments(allAssignments, doctors, doctorUnits, publicHolidayDeficits) {
  // Find public holiday assignments
  const publicHolidayAssignments = allAssignments.filter(a => a.is_public_holiday_shift);
  
  // Group public holiday assignments by date (we want to assign all assignments for a date to the same doctor)
  const holidayDateGroups = {};
  
  publicHolidayAssignments.forEach(assignment => {
    if (!holidayDateGroups[assignment.date]) {
      holidayDateGroups[assignment.date] = [];
    }
    holidayDateGroups[assignment.date].push(assignment);
  });

  // Identify Christmas Day and Boxing Day for special handling
  const christmasPeriod = identifyChristmasPeriod(holidayDateGroups);
  
  // Track already assigned doctors for holiday periods to prevent consecutive assignments
  const assignedHolidayDoctors = {};
  
  // Sort dates chronologically for sequential processing
  const sortedDates = Object.keys(holidayDateGroups).sort((a, b) => {
    return new Date(a) - new Date(b);
  });
  
  // Process each public holiday date in chronological order
  sortedDates.forEach(date => {
    const assignments = holidayDateGroups[date];
    
    // Check if any assignments on this date are already assigned (pre-filled)
    const hasPrefilledAssignments = assignments.some(a => a.doctor_id !== null);
    
    // If pre-filled, skip automatic assignment for this date
    if (hasPrefilledAssignments) {
      // Update doctor units for any pre-filled assignments
      assignments.forEach(assignment => {
        if (assignment.doctor_id !== null) {
          doctorUnits[assignment.doctor_id] += assignment.units_assigned;
          
          // Track this doctor for holiday assignment
          assignedHolidayDoctors[date] = assignment.doctor_id;
        }
      });
      return;
    }
    
    // Skip if this is part of Christmas period that needs special handling
    if (christmasPeriod.isConsecutive && 
        (date === christmasPeriod.christmasDay || date === christmasPeriod.boxingDay)) {
      // Will be handled separately
      return;
    }
    
    // Find eligible doctors (not unavailable during this period)
    let eligibleDoctors = filterAvailableDoctors(doctors, date);
    
    if (eligibleDoctors.length === 0) {
      return; // No eligible doctors, leave unassigned for now
    }
    
    // Identify doctors assigned to recent public holidays
    const recentlyAssignedDoctorIds = findRecentlyAssignedDoctors(sortedDates, date, assignedHolidayDoctors);
    
    // Filter out doctors who have been assigned to recent holidays
    if (recentlyAssignedDoctorIds.length > 0 && eligibleDoctors.length > recentlyAssignedDoctorIds.length) {
      eligibleDoctors = eligibleDoctors.filter(doctor => !recentlyAssignedDoctorIds.includes(doctor.id));
    }
    
    // If we've filtered out all doctors, use the original list as a fallback
    if (eligibleDoctors.length === 0) {
      eligibleDoctors = filterAvailableDoctors(doctors, date);
    }
    
    // Sort by public holiday deficit (highest deficit first)
    const sortedDoctors = sortDoctorsByPublicHolidayDeficit(eligibleDoctors, publicHolidayDeficits);
    
    // Assign all assignments for this date to the same doctor
    const assignedDoctor = sortedDoctors[0];
    
    // Update all assignments for this date
    assignments.forEach(assignment => {
      const index = allAssignments.findIndex(a => a.id === assignment.id);
      if (index !== -1) {
        allAssignments[index] = {
          ...allAssignments[index],
          doctor_id: assignedDoctor.id
        };
        
        // Update doctor units
        doctorUnits[assignedDoctor.id] += assignment.units_assigned;
      }
    });
    
    // Track this doctor for holiday assignment
    assignedHolidayDoctors[date] = assignedDoctor.id;
  });

  // Handle Christmas period if consecutive days
  if (christmasPeriod.isConsecutive) {
    handleConsecutiveChristmasPeriod(
      allAssignments, 
      doctors, 
      doctorUnits, 
      publicHolidayDeficits, 
      christmasPeriod,
      holidayDateGroups,
      assignedHolidayDoctors
    );
  }
}

/**
 * Identify Christmas Day and Boxing Day for special handling
 * @param {Object} holidayDateGroups - Grouped public holiday assignments by date
 * @returns {Object} - Object with Christmas period information
 */
function identifyChristmasPeriod(holidayDateGroups) {
  const dates = Object.keys(holidayDateGroups);
  let christmasDay = null;
  let boxingDay = null;
  
  // Find Christmas Day (December 25)
  for (const date of dates) {
    const d = new Date(date);
    if (d.getMonth() === 11 && d.getDate() === 25) { // December is month 11 (0-indexed)
      christmasDay = date;
    }
    if (d.getMonth() === 11 && d.getDate() === 26) { // Boxing Day is December 26
      boxingDay = date;
    }
  }
  
  // Check if Christmas Day and Boxing Day are consecutive in the assignments
  let isConsecutive = false;
  
  if (christmasDay && boxingDay) {
    const christmasDate = new Date(christmasDay);
    const boxingDate = new Date(boxingDay);
    
    // Check if they're consecutive days
    const dayAfterChristmas = new Date(christmasDate);
    dayAfterChristmas.setDate(dayAfterChristmas.getDate() + 1);
    
    isConsecutive = dayAfterChristmas.toDateString() === boxingDate.toDateString();
  }
  
  return {
    christmasDay,
    boxingDay,
    isConsecutive
  };
}

/**
 * Find doctors who have been assigned to recent public holidays
 * @param {string[]} allHolidayDates - Array of holiday dates in chronological order
 * @param {string} currentDate - Current holiday date being processed
 * @param {Object} assignedHolidayDoctors - Map of dates to assigned doctor IDs
 * @returns {string[]} - Array of recently assigned doctor IDs
 */
function findRecentlyAssignedDoctors(allHolidayDates, currentDate, assignedHolidayDoctors) {
  const recentlyAssignedDoctorIds = [];
  const currentDateObj = new Date(currentDate);
  
  // Calculate date range to check (no public holidays in a row)
  const earliestDate = new Date(currentDateObj);
  earliestDate.setDate(earliestDate.getDate() - 7); // Check for assignments within the past week
  
  // Find earlier dates that are close to the current date
  const recentDates = allHolidayDates.filter(dateStr => {
    const dateObj = new Date(dateStr);
    return dateObj < currentDateObj && dateObj >= earliestDate;
  });
  
  // Add doctors assigned to these recent dates
  recentDates.forEach(dateStr => {
    const assignedDoctorId = assignedHolidayDoctors[dateStr];
    if (assignedDoctorId && !recentlyAssignedDoctorIds.includes(assignedDoctorId)) {
      recentlyAssignedDoctorIds.push(assignedDoctorId);
    }
  });
  
  return recentlyAssignedDoctorIds;
}

/**
 * Handle consecutive Christmas Day and Boxing Day period
 * @param {Object[]} allAssignments - Array of all shift assignment objects
 * @param {Object[]} doctors - Array of doctor objects
 * @param {Object} doctorUnits - Map of doctor IDs to assigned units
 * @param {Object} publicHolidayDeficits - Map of doctor IDs to public holiday deficits
 * @param {Object} christmasPeriod - Object with Christmas period information
 * @param {Object} holidayDateGroups - Grouped public holiday assignments by date
 * @param {Object} assignedHolidayDoctors - Map of dates to assigned doctor IDs
 */
function handleConsecutiveChristmasPeriod(
  allAssignments, 
  doctors, 
  doctorUnits, 
  publicHolidayDeficits, 
  christmasPeriod,
  holidayDateGroups,
  assignedHolidayDoctors = {}
) {
  const christmasAssignments = holidayDateGroups[christmasPeriod.christmasDay] || [];
  const boxingDayAssignments = holidayDateGroups[christmasPeriod.boxingDay] || [];
  
  // Check if either day already has pre-filled assignments
  const christmasHasPrefilledAssignments = christmasAssignments.some(a => a.doctor_id !== null);
  const boxingDayHasPrefilledAssignments = boxingDayAssignments.some(a => a.doctor_id !== null);
  
  // If both days are pre-filled, just update units and return
  if (christmasHasPrefilledAssignments && boxingDayHasPrefilledAssignments) {
    updateUnitsForPrefilledAssignments(christmasAssignments, doctorUnits);
    updateUnitsForPrefilledAssignments(boxingDayAssignments, doctorUnits);
    return;
  }
  
  // If only one day is pre-filled, assign the other day to a different doctor
  if (christmasHasPrefilledAssignments) {
    // Christmas is pre-filled, assign Boxing Day
    const christmasAssignedDoctor = christmasAssignments.find(a => a.doctor_id !== null).doctor_id;
    assignedHolidayDoctors[christmasPeriod.christmasDay] = christmasAssignedDoctor;
    
    assignHolidayToDoctor(
      boxingDayAssignments, 
      allAssignments, 
      doctors, 
      doctorUnits, 
      publicHolidayDeficits,
      [christmasAssignedDoctor] // exclude this doctor
    );
    
    // Track the assigned doctor
    if (boxingDayAssignments.length > 0 && boxingDayAssignments[0].doctor_id) {
      assignedHolidayDoctors[christmasPeriod.boxingDay] = boxingDayAssignments[0].doctor_id;
    }
    
    return;
  }
  
  if (boxingDayHasPrefilledAssignments) {
    // Boxing Day is pre-filled, assign Christmas
    const boxingDayAssignedDoctor = boxingDayAssignments.find(a => a.doctor_id !== null).doctor_id;
    assignedHolidayDoctors[christmasPeriod.boxingDay] = boxingDayAssignedDoctor;
    
    assignHolidayToDoctor(
      christmasAssignments, 
      allAssignments, 
      doctors, 
      doctorUnits, 
      publicHolidayDeficits,
      [boxingDayAssignedDoctor] // exclude this doctor
    );
    
    // Track the assigned doctor
    if (christmasAssignments.length > 0 && christmasAssignments[0].doctor_id) {
      assignedHolidayDoctors[christmasPeriod.christmasDay] = christmasAssignments[0].doctor_id;
    }
    
    return;
  }
  
  // Neither day is pre-filled, assign both days to different doctors
  // First, assign Christmas Day
  const christmasEligibleDoctors = filterAvailableDoctors(doctors, christmasPeriod.christmasDay);
  
  if (christmasEligibleDoctors.length === 0) {
    return; // No eligible doctors for Christmas Day, leave unassigned
  }
  
  // Check for recently assigned doctors
  const recentlyAssignedDoctorIds = Object.values(assignedHolidayDoctors);
  let filteredChristmasEligibleDoctors = christmasEligibleDoctors;
  
  // Filter out recently assigned doctors if possible
  if (recentlyAssignedDoctorIds.length > 0 && christmasEligibleDoctors.length > recentlyAssignedDoctorIds.length) {
    filteredChristmasEligibleDoctors = christmasEligibleDoctors.filter(
      doctor => !recentlyAssignedDoctorIds.includes(doctor.id)
    );
    
    // If we've filtered out all doctors, fall back to the original list
    if (filteredChristmasEligibleDoctors.length === 0) {
      filteredChristmasEligibleDoctors = christmasEligibleDoctors;
    }
  }
  
  const christmasSortedDoctors = sortDoctorsByPublicHolidayDeficit(filteredChristmasEligibleDoctors, publicHolidayDeficits);
  
  // Assign Christmas Day
  assignHolidayToDoctor(
    christmasAssignments, 
    allAssignments, 
    doctors, 
    doctorUnits, 
    publicHolidayDeficits,
    [], // No excludes, we'll rely on the filtered list
    christmasSortedDoctors // Pass in our pre-filtered and sorted list
  );
  
  // Track the assigned doctor for Christmas
  const christmasDoctor = christmasAssignments[0].doctor_id;
  assignedHolidayDoctors[christmasPeriod.christmasDay] = christmasDoctor;
  
  // Now assign Boxing Day to a different doctor
  assignHolidayToDoctor(
    boxingDayAssignments, 
    allAssignments, 
    doctors, 
    doctorUnits, 
    publicHolidayDeficits,
    [christmasDoctor] // exclude Christmas doctor
  );
  
  // Track the assigned doctor for Boxing Day
  if (boxingDayAssignments.length > 0 && boxingDayAssignments[0].doctor_id) {
    assignedHolidayDoctors[christmasPeriod.boxingDay] = boxingDayAssignments[0].doctor_id;
  }
}

/**
 * Update units for pre-filled assignments
 * @param {Object[]} assignments - Array of assignments for a date
 * @param {Object} doctorUnits - Map of doctor IDs to assigned units
 */
function updateUnitsForPrefilledAssignments(assignments, doctorUnits) {
  assignments.forEach(assignment => {
    if (assignment.doctor_id !== null) {
      doctorUnits[assignment.doctor_id] += assignment.units_assigned;
    }
  });
}

/**
 * Assign holiday to the most suitable doctor
 * @param {Object[]} assignments - Array of assignments for the holiday
 * @param {Object[]} allAssignments - Array of all shift assignment objects
 * @param {Object[]} doctors - Array of doctor objects
 * @param {Object} doctorUnits - Map of doctor IDs to assigned units
 * @param {Object} publicHolidayDeficits - Map of doctor IDs to public holiday deficits
 * @param {Array} excludeDoctorIds - Array of doctor IDs to exclude
 * @param {Array} [preSortedDoctors] - Optional pre-sorted list of doctors to use
 */
function assignHolidayToDoctor(
  assignments, 
  allAssignments, 
  doctors, 
  doctorUnits, 
  publicHolidayDeficits,
  excludeDoctorIds = [],
  preSortedDoctors = null
) {
  if (assignments.length === 0) return;
  
  const date = assignments[0].date;
  
  let assignedDoctor;
  
  if (preSortedDoctors && preSortedDoctors.length > 0) {
    // Use the pre-sorted doctor list if provided
    assignedDoctor = preSortedDoctors[0];
  } else {
    // Find eligible doctors (not unavailable and not in exclude list)
    let eligibleDoctors = filterAvailableDoctors(doctors, date);
    eligibleDoctors = eligibleDoctors.filter(doctor => !excludeDoctorIds.includes(doctor.id));
    
    if (eligibleDoctors.length === 0) {
      return; // No eligible doctors, leave unassigned
    }
    
    // Sort by public holiday deficit
    const sortedDoctors = sortDoctorsByPublicHolidayDeficit(eligibleDoctors, publicHolidayDeficits);
    assignedDoctor = sortedDoctors[0];
  }
  
  // Assign all assignments for this date to the same doctor
  assignments.forEach(assignment => {
    const index = allAssignments.findIndex(a => a.id === assignment.id);
    if (index !== -1) {
      allAssignments[index] = {
        ...allAssignments[index],
        doctor_id: assignedDoctor.id
      };
      
      // Update doctor units
      doctorUnits[assignedDoctor.id] += assignment.units_assigned;
    }
  });
}

/**
 * Process regular assignments (second pass)
 * @param {Object[]} allAssignments - Array of all shift assignment objects
 * @param {Object[]} doctors - Array of doctor objects
 * @param {Object} doctorUnits - Map of doctor IDs to assigned units
 * @param {Object} doctorTargetPercentages - Map of doctor IDs to target percentages
 */
function processRegularAssignments(allAssignments, doctors, doctorUnits, doctorTargetPercentages) {
  // Group regular assignments by shift_id (we want to process each shift pattern together)
  const shiftGroups = {};
  
  allAssignments.forEach(assignment => {
    if (!assignment.is_public_holiday_shift && assignment.doctor_id === null) {
      if (!shiftGroups[assignment.shift_id]) {
        shiftGroups[assignment.shift_id] = [];
      }
      shiftGroups[assignment.shift_id].push(assignment);
    }
  });
  
  // Process shifts in chronological order
  const shiftIds = Object.keys(shiftGroups).sort((a, b) => {
    const dateA = new Date(shiftGroups[a][0].date);
    const dateB = new Date(shiftGroups[b][0].date);
    return dateA - dateB;
  });
  
  shiftIds.forEach(shiftId => {
    const shiftAssignments = shiftGroups[shiftId];
    
    // Group assignments by date
    const dateGroups = {};
    shiftAssignments.forEach(assignment => {
      if (!dateGroups[assignment.date]) {
        dateGroups[assignment.date] = [];
      }
      dateGroups[assignment.date].push(assignment);
    });
    
    // Get all dates for this shift
    const dates = Object.keys(dateGroups).sort((a, b) => new Date(a) - new Date(b));
    
    // For each date, assign doctors
    dates.forEach(date => {
      const dateAssignments = dateGroups[date];
      
      // Find eligible doctors (not unavailable on this date)
      let eligibleDoctors = filterAvailableDoctors(doctors, date);
      
      // Remove doctors assigned to adjacent dates
      eligibleDoctors = removeWithAdjacentDates(eligibleDoctors, date, allAssignments);
      
      if (eligibleDoctors.length === 0) {
        return; // No eligible doctors, leave unassigned for now
      }
      
      // Calculate total units assigned so far
      const totalUnitsAssigned = Object.values(doctorUnits).reduce((sum, units) => sum + units, 0);
      
      // Sort eligible doctors by pro-rata deficit
      const sortedDoctors = sortDoctorsByProRataDeficit(eligibleDoctors, doctorUnits, doctorTargetPercentages, totalUnitsAssigned);
      
      // Assign all assignments for this date to doctors, starting with the one with highest deficit
      let doctorIndex = 0;
      
      dateAssignments.forEach(assignment => {
        // Get next doctor (rotating through the sorted list if needed)
        const assignedDoctor = sortedDoctors[doctorIndex % sortedDoctors.length];
        doctorIndex++;
        
        // Update assignment
        const index = allAssignments.findIndex(a => a.id === assignment.id);
        if (index !== -1) {
          allAssignments[index] = {
            ...allAssignments[index],
            doctor_id: assignedDoctor.id
          };
          
          // Update doctor units
          doctorUnits[assignedDoctor.id] += assignment.units_assigned;
        }
      });
    });
  });
}

/**
 * Filter doctors who are available on a specific date
 * @param {Object[]} doctors - Array of doctor objects
 * @param {string} date - Date string in ISO format (YYYY-MM-DD)
 * @returns {Object[]} - Array of available doctors
 */
function filterAvailableDoctors(doctors, date) {
  return doctors.filter(doctor => !isUnavailable(doctor, date));
}

/**
 * Check if a doctor is unavailable on a specific date
 * @param {Object} doctor - Doctor object
 * @param {string} date - Date string in ISO format (YYYY-MM-DD)
 * @returns {boolean} - True if doctor is unavailable
 */
function isUnavailable(doctor, date) {
  if (!doctor.unavailability_periods) {
    return false;
  }
  
  const targetDate = new Date(date);
  
  // Check each unavailability period
  return doctor.unavailability_periods.some(period => {
    const periodStart = new Date(period.start_date);
    const periodEnd = new Date(period.end_date);
    
    // Check if the target date falls within this period
    return (
      targetDate >= periodStart && targetDate <= periodEnd
    );
  });
}

/**
 * Remove doctors who are assigned to adjacent dates
 * @param {Object[]} doctors - Array of doctor objects
 * @param {string} date - Date string in ISO format (YYYY-MM-DD)
 * @param {Object[]} allAssignments - All shift assignments
 * @returns {Object[]} - Filtered array of doctors
 */
function removeWithAdjacentDates(doctors, date, allAssignments) {
  return doctors.filter(doctor => !hasAdjacentDateAssignment(doctor, date, allAssignments));
}

/**
 * Check if a doctor has an assignment on an adjacent date
 * @param {Object} doctor - Doctor object
 * @param {string} date - Date string in ISO format (YYYY-MM-DD)
 * @param {Object[]} allAssignments - All shift assignments
 * @returns {boolean} - True if doctor has an adjacent date assignment
 */
function hasAdjacentDateAssignment(doctor, date, allAssignments) {
  const targetDate = new Date(date);
  
  // Calculate dates before and after the target date
  const dayBefore = new Date(targetDate);
  dayBefore.setDate(dayBefore.getDate() - 1);
  
  const dayAfter = new Date(targetDate);
  dayAfter.setDate(dayAfter.getDate() + 1);
  
  // Get doctor's assignments
  const doctorAssignments = allAssignments.filter(a => a.doctor_id === doctor.id);
  
  // Check if any assignment is on an adjacent date
  return doctorAssignments.some(assignment => {
    const assignmentDate = new Date(assignment.date);
    
    return (
      assignmentDate.toDateString() === dayBefore.toDateString() ||
      assignmentDate.toDateString() === dayAfter.toDateString()
    );
  });
}

/**
 * Sort doctors by public holiday deficit (highest deficit first)
 * @param {Object[]} doctors - Array of doctor objects
 * @param {Object} publicHolidayDeficits - Map of doctor IDs to public holiday deficits
 * @returns {Object[]} - Sorted array of doctors
 */
function sortDoctorsByPublicHolidayDeficit(doctors, publicHolidayDeficits) {
  return [...doctors].sort((a, b) => {
    return publicHolidayDeficits[b.id] - publicHolidayDeficits[a.id];
  });
}

/**
 * Sort doctors by pro-rata deficit (doctor with fewest units relative to target gets priority)
 * @param {Object[]} doctors - Array of doctor objects
 * @param {Object} doctorUnits - Map of doctor IDs to assigned units
 * @param {Object} doctorTargetPercentages - Map of doctor IDs to target percentages
 * @param {number} totalUnitsAssigned - Total units assigned so far
 * @returns {Object[]} - Sorted array of doctors
 */
function sortDoctorsByProRataDeficit(doctors, doctorUnits, doctorTargetPercentages, totalUnitsAssigned) {
  return [...doctors].sort((a, b) => {
    // Calculate target units for each doctor based on current total
    const targetUnitsA = totalUnitsAssigned * doctorTargetPercentages[a.id];
    const targetUnitsB = totalUnitsAssigned * doctorTargetPercentages[b.id];
    
    // Calculate deficit (target - actual)
    const deficitA = targetUnitsA - doctorUnits[a.id];
    const deficitB = targetUnitsB - doctorUnits[b.id];
    
    // Sort by deficit (highest deficit first)
    return deficitB - deficitA;
  });
}

/**
 * Validate and adjust assignments to ensure fairness
 * @param {Object[]} allAssignments - Array of all shift assignment objects
 * @param {Object[]} doctors - Array of doctor objects
 * @param {Object} doctorUnits - Map of doctor IDs to assigned units
 * @param {Object} doctorTargetPercentages - Map of doctor IDs to target percentages
 */
function validateAndAdjustAssignments(allAssignments, doctors, doctorUnits, doctorTargetPercentages) {
  // Calculate total units assigned
  const totalUnits = Object.values(doctorUnits).reduce((sum, units) => sum + units, 0);
  
  // Calculate target units for each doctor
  const doctorTargets = {};
  doctors.forEach(doctor => {
    doctorTargets[doctor.id] = totalUnits * doctorTargetPercentages[doctor.id];
  });
  
  // Check for significant deviations from target
  const ACCEPTABLE_THRESHOLD = 2; // Units of deviation considered acceptable
  const ADJUSTMENT_THRESHOLD = 4; // Units of deviation that trigger adjustment attempts
  
  const deviations = [];
  
  doctors.forEach(doctor => {
    const deviation = doctorUnits[doctor.id] - doctorTargets[doctor.id];
    
    if (Math.abs(deviation) > ACCEPTABLE_THRESHOLD) {
      deviations.push({
        doctorId: doctor.id,
        deviation: deviation,
        needsAdjustment: Math.abs(deviation) > ADJUSTMENT_THRESHOLD
      });
    }
  });
  
  // If severe deviations exist, attempt to rebalance
  const severeDeviations = deviations.filter(d => d.needsAdjustment);
  
  if (severeDeviations.length > 0) {
    attemptRebalancing(allAssignments, severeDeviations, doctors, doctorUnits, doctorTargets);
  }
}

/**
 * Attempt to rebalance assignments to reduce severe deviations
 * @param {Object[]} allAssignments - Array of all shift assignment objects
 * @param {Object[]} deviations - Array of deviation objects
 * @param {Object[]} doctors - Array of doctor objects
 * @param {Object} doctorUnits - Map of doctor IDs to assigned units
 * @param {Object} doctorTargets - Map of doctor IDs to target units
 */
function attemptRebalancing(allAssignments, deviations, doctors, doctorUnits, doctorTargets) {
  // Sort deviations - overallocated doctors first (positive deviation)
  deviations.sort((a, b) => b.deviation - a.deviation);
  
  // Get doctors who are overallocated and underallocated
  const overallocatedDoctors = deviations.filter(d => d.deviation > 0).map(d => d.doctorId);
  const underallocatedDoctors = deviations.filter(d => d.deviation < 0).map(d => d.doctorId);
  
  if (overallocatedDoctors.length === 0 || underallocatedDoctors.length === 0) {
    return; // Can't rebalance if all deviations are in the same direction
  }
  
  // For each overallocated doctor, try to reassign some of their assignments
  for (const doctorId of overallocatedDoctors) {
    if (underallocatedDoctors.length === 0) break;
    
    // Get non-public holiday assignments for this doctor
    const doctorAssignments = allAssignments.filter(a => 
      a.doctor_id === doctorId && !a.is_public_holiday_shift
    );
    
    // Sort assignments chronologically
    doctorAssignments.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Try to reassign each assignment
    for (const assignment of doctorAssignments) {
      // Skip if this doctor is now properly allocated
      if (doctorUnits[doctorId] <= doctorTargets[doctorId]) {
        break;
      }
      
      // Try each underallocated doctor
      for (const underallocatedDoctorId of [...underallocatedDoctors]) {
        const underallocatedDoctor = doctors.find(d => d.id === underallocatedDoctorId);
        
        // Check if doctor is available for this date
        if (isUnavailable(underallocatedDoctor, assignment.date)) continue;
        
        // Check if doctor has adjacent dates
        if (hasAdjacentDateAssignment(underallocatedDoctor, assignment.date, allAssignments)) continue;
        
        // Reassign the assignment
        const assignmentIndex = allAssignments.findIndex(a => a.id === assignment.id);
        
        if (assignmentIndex !== -1) {
          // Update the assignment
          allAssignments[assignmentIndex] = {
            ...allAssignments[assignmentIndex],
            doctor_id: underallocatedDoctorId
          };
          
          // Update units
          doctorUnits[doctorId] -= assignment.units_assigned;
          doctorUnits[underallocatedDoctorId] += assignment.units_assigned;
          
          // If doctor is no longer underallocated, remove from the list
          if (doctorUnits[underallocatedDoctorId] >= doctorTargets[underallocatedDoctorId]) {
            underallocatedDoctors.splice(underallocatedDoctors.indexOf(underallocatedDoctorId), 1);
          }
          
          // If we've fixed the overallocation, break
          if (doctorUnits[doctorId] <= doctorTargets[doctorId]) {
            break;
          }
        }
      }
    }
  }
}

// Export the main function
module.exports = {
  assignDoctorsToShiftAssignments,
  // Export helper functions for testing
  calculateTotalWeeklyHours,
  calculateDoctorTargetPercentages,
  calculatePublicHolidayDeficits,
  // New helpers for Christmas period handling
  identifyChristmasPeriod,
  handleConsecutiveChristmasPeriod,
  // New helper for tracking public holiday assignments
  findRecentlyAssignedDoctors
}; 