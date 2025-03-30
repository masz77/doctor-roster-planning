# Roster Period Examples

According to the BRD, roster periods are quarterly and follow these date ranges:
- Q1: February 1 to April 30
- Q2: May 1 to July 31
- Q3: August 1 to October 31
- Q4: November 1 to January 31

## Example Roster Periods Data

Below are examples of roster periods as they would be stored in the database:

| id | name | start_date | end_date | status | created_at | created_by | published_at | published_by |
|----|------|------------|----------|--------|------------|------------|--------------|--------------|
| 1 | Q1 2023 | 2023-02-01 | 2023-04-30 | archived | 2022-11-25 10:00:00 | 1 | 2022-12-15 14:30:00 | 1 |
| 2 | Q2 2023 | 2023-05-01 | 2023-07-31 | archived | 2023-02-25 09:15:00 | 1 | 2023-03-20 11:45:00 | 1 |
| 3 | Q3 2023 | 2023-08-01 | 2023-10-31 | archived | 2023-05-28 14:20:00 | 1 | 2023-06-15 16:00:00 | 1 |
| 4 | Q4 2023 | 2023-11-01 | 2024-01-31 | active | 2023-08-27 10:30:00 | 1 | 2023-09-18 13:45:00 | 1 |
| 5 | Q1 2024 | 2024-02-01 | 2024-04-30 | published | 2023-11-25 11:10:00 | 1 | 2023-12-18 15:30:00 | 1 |
| 6 | Q2 2024 | 2024-05-01 | 2024-07-31 | draft | 2024-02-26 09:45:00 | 1 | null | null |

## Roster Generation Timeline

According to the BRD, the roster generation follows this timeline:
1. **3 months before quarter start**: Send email to doctors to submit unavailability dates
2. **2 months before quarter start**: Generate the roster
3. **After generation**: Publish roster, send notifications to doctors

Example for Q3 2024 (August 1 - October 31, 2024):
- **May 1, 2024**: System sends email to doctors requesting unavailability dates
- **June 1, 2024**: System generates the roster
- **Mid-June 2024**: Admin reviews and publishes the roster
- **After publishing**: Doctors receive notifications of their assigned shifts

## Roster Status Lifecycle

Each roster period follows this status progression:
1. **Draft**: Initial state when created, can be modified
2. **Published**: Finalized and published to doctors, limited modifications
3. **Active**: Current quarter in progress
4. **Archived**: Past quarters, read-only

## Example JSON Representation

```json
{
  "id": 6,
  "name": "Q2 2024",
  "start_date": "2024-05-01",
  "end_date": "2024-07-31",
  "status": "draft",
  "created_at": "2024-02-26T09:45:00",
  "created_by": 1,
  "published_at": null,
  "published_by": null,
  "shifts": [
    {
      "id": 142,
      "start_date": "2024-05-01",
      "end_date": "2024-05-02",
      "shift_pattern": "wed_thu",
      "units": 2.0,
      "is_public_holiday": false,
      "doctor_id": 5,
      "doctor_name": "Dr. Sarah Johnson"
    },
    {
      "id": 143,
      "start_date": "2024-05-03",
      "end_date": "2024-05-05",
      "shift_pattern": "fri_sat_sun",
      "units": 5.0,
      "is_public_holiday": true,
      "doctor_id": 8,
      "doctor_name": "Dr. Michael Chen"
    }
    // More shifts...
  ]
}
``` 