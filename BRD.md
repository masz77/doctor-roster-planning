# Business Requirements Document (BRD)

## 1. Introduction

### 1.1 Purpose
This document specifies the functional requirements for a streamlined web application that handles automated doctor on-call scheduling. The system will create rosters following defined rules, track doctor availability, deliver notifications, and maintain consistency with hospital roster systems. The key goals are to minimize administrative overhead and ensure equitable distribution of on-call duties.

### 1.2 Scope
The application will:
- Automatically generate on-call rosters according to predefined rules.
- Handle notifications and confirmations for on-call shifts.
- Allow doctors to submit unavailability dates.
- Synchronize with Excel-based rosters from the hospital intranet.
- Provide basic reporting to ensure fairness and compliance with rules.

### 1.3 Stakeholders
- Medical administration department (admins and roster writers)
- Doctors (on-call participants)
- IT department (for deployment and maintenance)

---

## 2. Functional Requirements

### 2.1 Doctor Management
- **Description**: The system must maintain a database of doctors to support roster generation and communication.
- **Requirements**:
  - Provide CRUD (Create, Read, Update, Delete) operations for doctor records.
  - Each doctor record must include:
    - Name
    - Email address
    - Weekly working hours (e.g., 10, 20, 40 hours/week)
    - Historical on-call data (e.g., number of public holiday on-calls completed)

### 2.2 Roster Generation
- **Description**: The system must automatically generate on-call rosters based on specified rules to ensure equitable distribution of duties.
- **Requirements**:
  - Generate rosters for a specified period (e.g., monthly or quarterly).
  - Assign on-call shifts according to the following patterns:
    - Monday + Tuesday
    - Wednesday + Thursday
    - Friday + Saturday + Sunday
  - Calculate on-call units:
    - Monday to Friday: 1 unit per day
    - Saturday, Sunday, and public holidays: 2 units per day
  - Distribute on-call units pro-rata based on doctors' weekly working hours (e.g., a doctor working 20 hours/week is assigned twice as many on-call units as one working 10 hours/week).
  - Handle special periods:
    - Split Easter long weekend (e.g., Good Friday to Easter Monday) into two halves, assigning different doctors to each half, unless a doctor volunteers to cover the entire period.
    - Split Christmas period (e.g., Christmas Eve to Boxing Day) into two halves, assigning different doctors to each half, unless a doctor volunteers to cover the entire period.
  - Ensure pro-rata distribution of public holiday on-calls:
    - Track each doctor's public holiday on-call history over the past 12 months
    - Calculate target number of public holiday shifts based on doctor's weekly hours
    - When generating rosters, prioritize doctors who are below their target number
    - Consider the following factors for public holiday assignments:
      - Number of public holiday shifts worked in past 12 months
      - Doctor's weekly working hours (pro-rata basis)
      - Previous year's public holiday assignments (weighted less than current year)
      - Special period assignments (Easter, Christmas etc.)
    - Generate monthly reports showing public holiday shift distribution across doctors
    - Flag any significant deviations from target allocations for admin review
  - Incorporate doctors' submitted unavailability dates into the roster generation process.

### 2.3 Public Holiday Handling
- **Description**: The system must accurately identify and manage public holidays to assign appropriate on-call units and ensure fairness.
- **Requirements**:
  - Integrate with a data source (e.g., an API) to retrieve Australian public holiday dates, or allow manual entry of holiday dates by admins.
  - Track each doctor's historical public holiday on-call assignments to inform future roster generation for equitable distribution.

### 2.4 Notification System
- **Description**: The system must notify doctors of their on-call shifts and handle their responses efficiently.
- **Requirements**:
  - Send automated reminder emails to doctors:
    - 1 month prior to their on-call shift.
    - 1 week prior to their on-call shift.
  - Include the following links in each email:
    - **Confirm Receipt**: Allows the doctor to acknowledge receiving the email.
    - **Confirm Ability**: Confirms the doctor can perform the assigned on-call shift.
    - **Indicate Inability**: Allows the doctor to report they cannot perform the shift, triggering:
      - An alert to the admin (e.g., via email or dashboard notification).
      - Optionally, an automated email to all on-call doctors asking if anyone can cover or swap the shift (to be implemented if feasible within rapid development constraints; otherwise, admin handles replacements manually).
  - Record all responses (confirmations or inability indications) for tracking.

### 2.5 Unavailability Submission
- **Description**: The system must allow doctors to proactively declare dates they cannot work, ensuring these are considered during roster generation.
- **Requirements**:
  - At the start of each quarter, send an automated email to all doctors with a link to a web form.
  - Provide a simple form where doctors can:
    - Select specific dates they are unavailable for on-call duties.
    - Submit the form, storing the dates in the system.
  - Use submitted unavailability dates to adjust roster generation, preventing assignments on those dates.

### 2.6 Roster Synchronization
- **Description**: The system must reconcile its roster with Excel-based rosters from the hospital intranet to maintain consistency and inform doctors of changes.
- **Requirements**:
  - Allow admins to upload Excel-based rosters monthly from the hospital intranet.
  - Parse the uploaded Excel file (assuming a predefined format, e.g., columns for date, doctor name, and shift type) and compare it with the system's current roster.
  - Detect inconsistencies (e.g., different doctor assignments for the same date).
  - For each inconsistency:
    - Send an automated email to the affected doctor(s) detailing the change (e.g., "You were scheduled for [date] but the hospital roster shows [new assignment]").
    - Update the system's roster to reflect the uploaded Excel data, ensuring alignment with hospital records.

### 2.7 Volunteer Management
- **Description**: The system must accommodate doctors who wish to volunteer for entire special periods, overriding the default splitting logic.
- **Requirements**:
  - Provide an option (e.g., via the unavailability form or a separate interface) for doctors to volunteer to cover the entire Easter long weekend or Christmas period.
  - If a volunteer is confirmed, assign them the full period instead of splitting it between two doctors.

### 2.8 Admin Interface
- **Description**: The system must offer a basic interface for admins to manage the application, prioritizing functionality over aesthetics.
- **Requirements**:
  - Provide a web-based admin interface to:
    - Add, edit, or remove doctor records.
    - Generate and review rosters for approval before distribution.
    - Upload Excel rosters from the hospital intranet.
    - View basic reports (see Reporting section below).
  - Ensure the interface is functional and straightforward, with no emphasis on elegant design.

### 2.9 Reporting
- **Description**: The system must provide insights into on-call distributions to verify fairness and compliance with rules.
- **Requirements**:
  - Generate reports including:
    - On-call assignments per doctor (e.g., total units assigned in a period).
    - Distribution of public holiday on-calls (e.g., number of public holiday shifts per doctor historically and in the current roster).
    - Compliance with pro-rata distribution (e.g., comparison of on-call units assigned vs. expected based on working hours).
  - Make reports accessible via the admin interface.

### 2.10 Data Storage
- **Description**: The system must securely store all data required for its operations.
- **Requirements**:
  - Store the following data:
    - Doctor records (name, email, hours, historical on-call data).
    - Roster data (shift dates, assigned doctors, units).
    - Unavailability dates submitted by doctors.
    - Notification records (emails sent, responses received).
    - Uploaded Excel roster data for comparison.
  - Ensure data is organized and retrievable for roster generation, reporting, and synchronization.

---

## 3. Assumptions
- Doctors have reliable email access and can interact with web links.
- The hospital provides Excel rosters in a consistent, predefined format (e.g., specific columns for dates and assignments).
- Australian public holiday data is accessible via an API or can be manually entered by admins.

---

## 4. Dependencies
- Postmark service integration for sending notifications and unavailability forms. $15.00/mo
- ExcelJS library integration for parsing and processing Excel roster files from hospital intranet.
- Optional integration with a public holiday API for automatic holiday data retrieval, or use a fixed list of special holidays, or allow admins to manually define and manage holiday dates.

---

## 5. Acceptance Criteria
- **Roster Generation**: Rosters are generated correctly per the rules (patterns, units, pro-rata distribution, special period handling, and unavailability incorporation).
- **Notifications**: Emails are sent 1 month and 1 week prior, with functional links for confirmation or inability reporting; admin alerts work as expected.
- **Unavailability**: Quarterly emails are sent, and submitted dates are accurately reflected in rosters.
- **Synchronization**: Excel uploads are parsed, inconsistencies are detected, and affected doctors receive emails with correct details.
- **Reporting**: Reports accurately reflect assignments, public holiday distributions, and pro-rata compliance.

---