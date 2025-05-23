I need a developer to rapidly develop and deploy a no-frills web application for doctor on-call rostering. Key features include:

- automatic roster generation according to rules:
-- doctors are on-call Monday+Tuesday, Wednesday+Thursday or Friday+Saturday+Sunday
-- Monday to Friday on-call = 1 on-call unit each, while Saturday, Sunday and public holiday on-call = 2 on-call units each; it would be preferable if application can know when Australian public holidays are
-- Pro-rata distribution of on-call units according to number of hours worked. For example, a doctor working 20 hours per week will be on-call two times more than another working 10 hours per week
-- Easter long weekend and Christmas on-call split in half so no one works the entire Easter long weekend or Christmas (unless a doctor volunteers)
-- Pro-rata distribution of public holiday on-call so that no one is on-call for more public holidays than another; the application needs to analyse historical public holiday on-call data
- Automated reminder emails to doctor 1 month and 1 week prior to their rostered on-call shift; I would like a link for them to confirm that they have received the email and that they are able to do the assigned on-call; a "I can't do my assigned on-call" link will alert admin and possibly generate automated email to all on-call doctors asking if anyone can do the assigned on-call, or swap an on-call (this workflow is more complicated)
- Automated emailed link at beginning of each quarter to doctors to form where they can nominate dates they are unable to perform on-call duties
- As medical administration department then lists rosters in Excel on hospital intranet and frequently make change to the on-call roster without informing me, the roster writer, until I can migrate them to this web application, I need to be able to upload said Excel-based roster to the web application on a monthly basis to ensure that web application's roster is consistent with hospital roster; all inconsistencies trigger a automated email to the affected doctor to ensure they are informed.

An elegant user interface is low priority as doctors uncommonly access their rosters.

The main requirements are that I can select a roster period (1 February to 30 April, 1 May to 31 July, 1 August to 31 October and 1 November to 31 January) and then click "Generate Roster" button. I will then export this generated roster to my medical administration for review and after their approval I will then click "Publish" which will notify all doctors that roster has been written and the on-call shifts they have been rostered for (they can view whole roster on hospital intranet) and activate the reminder notifications.

The date range for these quarters must seem strange to you - it's because the most important date range for roster to be published at once is 1 November to 31 January which contains many important public holidays and school holidays). I have chosen to publish rosters in quarters to allow personnel changes (e.g. change in hours, new doctors, etc.) and to provide ample opportunities for doctors to submit unavailable dates.

I need to make sure that the roster generation algorithm you are creating can generate roster for date ranges that have already been partially filled. This is because the current roster has been written up to 31 May and I need the app to be able to take this into account and generate the roster for the remainder of the 1 May to 31 July time period.

The main reason for this requirement is so that no one works two public holidays in a row. The only time this could happen is Christmas Day and Boxing Day. Because this year Christmas Day is on Thursday and Boxing Day is on Friday, no one has to work both public holidays. But next year Christmas Day is on Friday and Boxing Day is on Saturday, can you write the algorithm such that two doctors share/split the two public holidays? For example one doctor will work Friday and another will work Saturday and Sunday.
This is another reason that the auto-generation of roster has to be able to take into account shifts that admin has locked in. Some doctors don't celebrate Christmas and have volunteered to work both Christmas Day and Boxing Day. I want to be able to enter a doctor into a roster for Christmas and Boxing Day but get the app to generate roster around what I have entered.
As Good Friday is always on a Friday and Easter Monday is always on a Monday, this means two doctors will always be on-call for the Easter long weekend which works for me. No solution is required for Easter.

Hi Duong, thank you for sending through the results of your shift assignment algorithm. Unfortunately, unless I am reading it wrong (which is highly likely), the outcome is not what I desire. Monday and Tuesday should be one doctor, Wednesday and Thursday should be one doctor and Friday, Saturday and Sunday should one doctor. I have attached the roster from June 2024 to May 2025 for your reference.

In terms of report, it would be nice to have a page with the following information:
At top of report page - Average on-call units per hour worked in last 12 months (all doctors) = x
Then table with the following columns/fields:
Doctor | Contracted Hours Per Week | Number of On-Call Units Last 12 Months | Number of On-Call Units per Contracted Hour | Number of Public Holiday On-Call In last 24 Months
Rows (Doctors) with Number of On-Call Units per Contracted Hour < x should be highlighted red. These doctors are on-call less than average.
Doctors who have not done on-call in 12 months should also be highlighted. Doctors who don't do any on-call (by swapping with colleagues after I publish the roster) have reduced annual leave according to the rules.
Doctors who have not done public holiday on-call in last 24 months should also be highlighted. I can then try and manually amend roster to make them do public holiday on-call if required