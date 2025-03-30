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