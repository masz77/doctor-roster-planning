# Roster App Business Requirements Document

## 1. Introduction

### 1.1. Purpose
This document specifies the functional requirements for a streamlined web application that handles automated doctor on-call scheduling. The system will create rosters following defined rules, track doctor availability, deliver notifications, and maintain consistency with hospital roster systems. The key goals are to minimize administrative overhead and ensure equitable distribution of on-call duties.

### 1.2. Scope
The application will:
- Allow doctors to submit unavailable dates; automated request to submit unavailable dates 1 month before quarterly roster to be generated
- Automatically generate on-call rosters according to predefined rules
- Handle automated email notifications for when roster has been generated, reminders of upcoming on-calls, and confirmation for on-call shifts or unavailable to work assigned on-call
- Allow once-off historical Excel-based roster to be uploaded to form basis of future rostering e.g. so that doctor who worked last Christmas doesn't have to work again this year

### 1.3. Stakeholders
- Me – roster writer, IT deployment and maintenance
- Medical Administration – reviews generated roster for errors, publishes roster in Excel on Intranet, may make changes to roster without my involvement

## 2. Functional Requirements

### 2.1. Doctor Management
**Description**: The system must maintain a database of doctors to support roster generation and communication.

**Requirements**:
- Provide CRUD (Create, Read, Update, Delete) operations for doctor records.
- Each doctor record must include:
  - Name
  - Email address (may be more than one)
  - Weekly working hours (e.g., 10, 20, 40 hours/week)
  - Historical on-call data (e.g., number of public holiday on-calls completed)
  - Dates unavailable

### 2.2. Roster Generation
**Description**: The system must automatically generate on-call rosters based on specified rules to ensure equitable distribution of duties; rules can be changes in a rules engine

**Requirements**:
- Generate quarterly rosters 2 months before the quarter is due to begin, quarterly dates are 1 Feb to 30 April, 1 May to 31 July, 1 Aug to 31 Oct and 1 Nov to 31 Jan
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
  - Track each doctor's public holiday on-call history over the past 24 months
  - Calculate target number of public holiday shifts based on doctor's weekly hours
  - When generating rosters, prioritize doctors who are below their target number
  - Consider the following factors for public holiday assignments:
    - Number of public holiday shifts worked in past 24 months
    - Doctor's weekly working hours (pro-rata basis)
    - Previous year's public holiday assignments (weighted less than current year)
    - Special period assignments (Easter, Christmas etc.)
  - Generate monthly reports showing public holiday shift distribution across doctors
  - Flag any significant deviations from target allocations for admin review
- Incorporate doctors' submitted unavailability dates into the roster generation process.

### 2.3. Public Holiday Handling
**Description**: The system must accurately identify and manage public holidays to assign appropriate on-call units and ensure fairness.

**Requirements**:
- Import Australian public holiday dates manually into XANO database using data provided by Stephen.
- Track each doctor's historical public holiday on-call assignments to inform future roster generation for equitable distribution.

### 2.4. Notification System
**Description**: The system must notify doctors of their on-call shifts and handle their responses efficiently.

**Requirements**:
- Send automated reminder emails to doctors:
  - When roster is generated, showing the dates they have been rostered
  - 1 month prior to their on-call shift.
  - 1 week prior to their on-call shift.
- Include the following links in each email:
  - Confirm Ability: Confirms the doctor can perform the assigned on-call shift.
  - Indicate Inability: Allows the doctor to report they cannot perform the shift, triggering:
    - An alert to the admin (e.g., via email)

### 2.5. Unavailability Submission
**Description**: The system must allow doctors to proactively declare dates they cannot work, ensuring these are considered during roster generation.

**Requirements**:
- 1 month before roster generation which is 2 months before quarter dates begin, send an automated email to all doctors with a link to a web form.
- Provide a simple form where doctors can:
  - Select specific dates they are unavailable for on-call duties.
  - Submit the form, storing the dates in the system.
- Use submitted unavailability dates to adjust roster generation, preventing assignments on those dates.

### 2.6. Admin Interface
**Description**: The system must offer a basic interface for admins to manage the application, prioritizing functionality over aesthetics.

**Requirements**:
- Provide a web-based admin interface to:
  - Add, edit, or remove doctor records.
  - Generate and review rosters for approval before distribution.
  - View basic reports (see Reporting section below).
- Ensure the interface is functional and straightforward, with no emphasis on elegant design.

### 2.7. Data Storage
**Description**: The system must securely store all data required for its operation on XANO

**Requirements**:
- Store the following data:
  - Doctor records (name, email, hours, historical on-call data).
  - Roster data (shift dates, assigned doctors, units).
  - Unavailability dates submitted by doctors.
  - Notification records (emails sent, responses received).
- Ensure data is organized and retrievable for roster generation, reporting, and synchronization.

## 3. Assumptions
- Doctors have reliable email access and can interact with web links.
- Australian public holiday data is accessible via an API or can be manually entered by admins.

## 4. Dependencies
- Postmark service integration for sending notifications and unavailability forms. $15.00/mo