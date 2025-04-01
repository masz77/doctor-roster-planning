1. The algorithm has two main passes:
   - First pass: `processPublicHolidayAssignments` handles public holiday shifts
   - Second pass: `processRegularAssignments` handles regular (non-public holiday) shifts
2. The algorithm has a third pass for validation and adjustment:
   - Final pass: `validateAndAdjustAssignments` ensures fair distribution of shifts
   - This pass attempts to rebalance assignments if there are significant deviations from target allocations
   - It can reassign non-public holiday shifts from overallocated to underallocated doctors
3. Special period handling is incorporated into the first pass:
   - The algorithm detects and handles Christmas Day and Boxing Day as a special case
   - When these holidays are consecutive, they are assigned to different doctors

### Public Holiday Assignments (First Pass)

In `processPublicHolidayAssignments`, before processing individual public holiday dates:
1. The algorithm first identifies Christmas Day and Boxing Day using `identifyChristmasPeriod`
   - This determines if Christmas Day (December 25) and Boxing Day (December 26) are present in the assignments
   - It checks if they are consecutive days requiring special handling

Then, for each public holiday date:
1. It checks if the date has any pre-filled assignments
   - If so, it respects these assignments and updates the doctor's unit count
   - This preserves manual assignments made by administrators
2. It checks if the date is part of a consecutive Christmas-Boxing Day period
   - If so, it skips the standard assignment process for these dates
   - These dates will be handled separately by `handleConsecutiveChristmasPeriod`
3. It identifies eligible doctors who are available on that date using `filterAvailableDoctors`
   - This function filters out doctors who have marked the date in their unavailability periods
   - Availability is checked by calling the `isUnavailable` helper function on each doctor
4. It sorts these eligible doctors by their public holiday deficit using `sortDoctorsByPublicHolidayDeficit`
   - The public holiday deficit is calculated as a doctor's target units (based on their weekly hours percentage) minus their actual public holiday units worked
   - Historical public holiday shifts are considered, with more recent holidays weighted more heavily 
   - A higher deficit means a doctor should be given priority for public holiday shifts
5. It assigns the doctor with the highest deficit to all shifts on that date
   - This ensures that all shifts on a single public holiday are assigned to the same doctor
   - Each public holiday is processed independently, potentially assigning different doctors to different holidays
6. It updates the assigned units for that doctor
   - These updated unit counts are used in subsequent assignments to maintain fairness
   - The running count helps ensure fair distribution across the entire assignment period

After processing all individual dates, if a consecutive Christmas-Boxing Day period was identified, the algorithm calls `handleConsecutiveChristmasPeriod` to handle this special case.

### Special Christmas Period Handling

When Christmas Day and Boxing Day are consecutive days, `handleConsecutiveChristmasPeriod` is called to ensure these holidays are split between different doctors (unless manually assigned):

1. It first checks if either or both days already have pre-filled assignments
   - If both days are pre-filled, it simply updates the doctor units and returns
   - If only one day is pre-filled, it assigns the other day to a different doctor
   
2. If neither day is pre-filled, it:
   - Assigns Christmas Day to an eligible doctor with the highest public holiday deficit
   - Then assigns Boxing Day to a different eligible doctor, explicitly excluding the doctor assigned to Christmas Day

3. The `assignHolidayToDoctor` helper function is used to assign holidays to doctors:
   - It filters eligible doctors based on availability and any exclusion list
   - It sorts them by public holiday deficit and selects the doctor with the highest deficit
   - It assigns all shifts for that holiday to the selected doctor
   - It updates the doctor's unit count

This special handling ensures that:
- No doctor is required to work both Christmas Day and Boxing Day when they're consecutive
- Pre-filled assignments (manual assignments) are always respected
- The algorithm still prioritizes doctors with the highest deficit when making assignments

### Regular Assignments (Second Pass)

In `processRegularAssignments`:
1. It processes only assignments where `assignment.doctor_id === null` (not yet assigned)
   - This ensures that public holiday shifts assigned in the first pass remain untouched
   - It groups these unassigned regular shifts by shift_id and then by date
2. For each date, it:
   - Finds eligible doctors who are available using `filterAvailableDoctors`
   - Additionally removes doctors who have assignments on adjacent dates using `removeWithAdjacentDates`
     - This prevents doctors from working consecutive days, which is an important constraint
     - The function checks both the day before and the day after the current date
   - Sorts eligible doctors by their pro-rata deficit using `sortDoctorsByProRataDeficit`
     - This deficit is calculated as the difference between a doctor's target units (based on weekly hours) and actual assigned units
     - Higher deficits indicate doctors who have been under-allocated relative to their weekly hours
   - Assigns doctors based on their deficit, rotating through eligible doctors if multiple shifts exist on the same date
   - Updates each doctor's running unit count after assignments

The key part here is the check for `assignment.doctor_id === null` when building the `shiftGroups`:

```javascript
allAssignments.forEach(assignment => {
  if (!assignment.is_public_holiday_shift && assignment.doctor_id === null) {
    // Add to shiftGroups
  }
});
```

This means that regular assignments will only process shifts that haven't been assigned a doctor yet. So doctors assigned in the first pass (to public holiday shifts) won't have those shifts reassigned in the second pass.

### Final Validation and Adjustment (Third Pass)

After the initial assignments are made, `validateAndAdjustAssignments` performs a final pass to ensure fairness in the workload distribution:

1. It calculates the total units assigned across all doctors
   - This gives the actual workload that has been distributed in the assignment period
2. It determines each doctor's target units based on their percentage of weekly hours
   - Target units = total units × (doctor's weekly hours ÷ total weekly hours)
   - This creates a pro-rata target based on each doctor's contracted hours
3. It identifies doctors with significant deviations from their targets:
   - Deviations > 2 units are noted as significant but may not trigger rebalancing
   - Deviations > 4 units trigger rebalancing attempts, as they represent substantial unfairness
   - Deviations are calculated as actual units minus target units
4. If severe deviations exist, it calls `attemptRebalancing` which:
   - Identifies overallocated doctors (positive deviation) and underallocated doctors (negative deviation)
   - For each overallocated doctor:
     - Gets their non-public holiday assignments (public holiday assignments remain fixed)
     - Tries to reassign them to underallocated doctors who:
       - Are available on that date (checked with `isUnavailable`)
       - Don't have assignments on adjacent dates (checked with `hasAdjacentDateAssignment`)
   - Updates assignments and doctor units accordingly after each reassignment
   - Stops when either the overallocation is fixed or no more reassignments are possible
   - Reassignments respect the same constraints used in the original assignment process

This final pass helps correct any unfair distributions that might have occurred during the initial assignment process, ensuring that each doctor's workload more closely matches their target percentage based on weekly hours.
