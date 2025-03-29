1. Roster Generation Logic
Why It’s Unclear: The BRD specifies roster patterns (e.g., Monday+Tuesday) and on-call unit calculations (1 unit for weekdays, 2 for weekends/public holidays), with pro-rata distribution based on weekly working hours. However, the exact method for calculating this distribution isn’t detailed.
Questions:
How is the pro-rata distribution calculated? Is there a specific formula tying on-call shifts or units to a doctor’s working hours (e.g., a doctor working 20 hours/week gets twice as many shifts as one working 10 hours/week)?
Should the system balance on-call units over a specific timeframe (e.g., monthly, quarterly, annually), or is it recalculated per roster cycle?
For special periods like Easter and Christmas, how should shifts be split if no volunteer is found? Is it always an equal split, or are there other rules?
2. Public Holiday Handling and Fairness
Why It’s Unclear: The BRD mentions analyzing historical public holiday data for fair distribution, but it doesn’t define what “fair” means or how to measure it.
Questions:
What metrics determine fairness in public holiday assignments? For example, should the system equalize the number of public holiday shifts each doctor works over a 12-month period?
How should historical data be used? Are recent public holiday shifts given more weight, or is all data treated equally?
3. Notification System and Shift Coverage Workflow
Why It’s Unclear: The BRD describes sending reminders and handling shift rejections, but the workflow for replacements or swaps is vague.
Questions:
Should the system automate shift coverage (e.g., emailing all doctors and assigning the first responder), or does the admin manually handle replacements?
If automated, what’s the exact process—does the first doctor to reply get the shift, or are there other criteria (e.g., prioritizing doctors with fewer shifts)?
Are there rules for who can cover a shift (e.g., doctors with fewer on-call units)?
4. Unavailability Submission
Why It’s Unclear: The BRD allows doctors to submit unavailability quarterly, but it doesn’t specify timing constraints or exceptions.
Questions:
How far in advance can doctors submit unavailability (e.g., up to 6 months)?
Are there blackout periods where unavailability can’t be submitted (e.g., within 2 weeks of a shift)?
Can doctors submit unavailability for dates they’re already scheduled for, and if so, does it require admin approval?
5. Roster Synchronization with Excel Uploads
Why It’s Unclear: The BRD mentions uploading Excel rosters and detecting inconsistencies, but the file format and conflict resolution rules are undefined.
Questions:
What’s the exact Excel file format (e.g., column names, data types)? Can a sample file be provided?
When inconsistencies arise, should the system always adopt the uploaded roster, or are there cases where the system’s roster takes priority?
How should conflicts be handled if the uploaded roster assigns a doctor to a date they marked unavailable?
6. Volunteer Management for Special Periods
Why It’s Unclear: The BRD allows volunteering for special periods like Easter, but it doesn’t specify how to choose among multiple volunteers.
Questions:
If multiple doctors volunteer for the same period, how is the assignment decided? Is it first-come, first-served, or does the admin select?
Should the system allow multiple volunteers and defer to the admin, or assign automatically?
7. Admin Interface and Reporting
Why It’s Unclear: The BRD covers basic CRUD operations and distribution reports, but additional reporting needs aren’t specified.
Questions:
Are there specific reports beyond distribution data, like change logs or audit trails, that admins need?
Should the system track and report shift swaps or coverage frequency?
8. Data Storage and Retention
Why It’s Unclear: The BRD lists data types to store but doesn’t address retention or compliance.
Questions:
How long should historical data (e.g., rosters, on-call records) be kept (e.g., 1 year, 5 years)?
Are there legal or compliance requirements for data storage (e.g., healthcare regulations)?