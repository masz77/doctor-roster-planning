/**
 * Doctor Assignment Example V2
 * 
 * This file demonstrates how to use the doctor assignment algorithm
 * with shifts that have nested shift_assignments.
 */

const { assignDoctorsToShiftAssignments } = require('./doctor-assignment-algorithm');

// Sample doctors with weekly hours and unavailability periods
const doctors = [{"id":"0ce7469a-f61e-4085-9c17-88e6a0bd4169","name":"Michal Amir","weekly_hours":7.75,"unavailability_periods":[]},{"id":"50936d85-58ec-499a-8c08-bf494d896a4b","name":" Catarina Ang","weekly_hours":11.5,"unavailability_periods":[]},{"id":"52eee1fd-13bc-43e7-b16c-6c51b3a1bccc","name":" Toby Angstmann","weekly_hours":3.13,"unavailability_periods":[]},{"id":"3a5c6be0-f049-4bb9-ba01-7078327e5e10","name":" Paul Berlund","weekly_hours":13.13,"unavailability_periods":[]},{"id":"67d47300-fe2f-402d-bd1a-e8c0d1525210","name":" Alison Bryant-Smith","weekly_hours":1.75,"unavailability_periods":[]},{"id":"d0eb4131-f9f5-4e68-825f-51adf6ed2f34","name":" Melissa Cameron","weekly_hours":12,"unavailability_periods":[]},{"id":"17428f66-3e63-47de-b6e9-fe5f6a20f14a","name":" Ruth Cameron-Jeffs","weekly_hours":6.88,"unavailability_periods":[]},{"id":"857241ca-ac58-40e6-8592-bea380f1d9af","name":" Claudia Cheng","weekly_hours":4.88,"unavailability_periods":[]},{"id":"a9b6a2f2-5394-43e1-90b7-a4706bc4c4a9","name":" Pip Costley","weekly_hours":2.63,"unavailability_periods":[]},{"id":"eb9275da-eeac-4c5d-acae-07cf191e9f3b","name":" Isabela dos Anjos","weekly_hours":3.5,"unavailability_periods":[]},{"id":"07298a79-2237-490e-af02-f07fe30eb47b","name":" Hugo Fernandes","weekly_hours":6.88,"unavailability_periods":[]},{"id":"f47b12dd-c999-4706-9b60-7d25b73540b2","name":" Kylie Goh","weekly_hours":4.63,"unavailability_periods":[]},{"id":"a567494f-e3d7-4237-ae61-90ded2948a59","name":" Felicity Gould","weekly_hours":8,"unavailability_periods":[]},{"id":"05ec33f5-82e3-400c-862a-c790984e4daa","name":" Sam Hargreaves","weekly_hours":5.25,"unavailability_periods":[]},{"id":"68287ffe-2d25-487b-b373-f84099d59641","name":" Martin Healey","weekly_hours":11.5,"unavailability_periods":[]},{"id":"e349ae3a-3015-476d-872e-b396292f235f","name":" Lauren Hicks","weekly_hours":3.38,"unavailability_periods":[]},{"id":"746286cc-995a-4446-99e1-113465e73f3c","name":" Weiqing Huang","weekly_hours":12,"unavailability_periods":[]},{"id":"bf254b10-cf6c-4ff5-a2ce-bceef8b2315a","name":" Kym Jansen","weekly_hours":11,"unavailability_periods":[]},{"id":"311b2bf9-47f7-484a-9484-7629883c82fc","name":" Carly Jennings","weekly_hours":0,"unavailability_periods":[]},{"id":"a9fc49d9-2ec9-4f5c-a57f-85c0818e2cba","name":" Shami Kathurusinghe","weekly_hours":5.5,"unavailability_periods":[]},{"id":"ebdeaf21-941f-40c3-a8c2-3ec44a109b25","name":" Harvinder Kaur","weekly_hours":8.13,"unavailability_periods":[]},{"id":"263178dd-202d-47ab-b66b-ce841e5cd778","name":" Stephen Lee","weekly_hours":38,"unavailability_periods":[]},{"id":"3c458974-a1ad-4c2a-be89-112465a5c721","name":" Tarana Lucky","weekly_hours":5.5,"unavailability_periods":[]},{"id":"bdade4d3-2e33-4ecc-9a11-2af1ebc45343","name":" Brett Marshall","weekly_hours":2.63,"unavailability_periods":[]},{"id":"e2740729-27fc-41de-9319-24318c814547","name":" Helen McNamara","weekly_hours":4.88,"unavailability_periods":[]},{"id":"1fd0cb00-a15c-456b-a0ea-8836e990d920","name":" Vadim Mirmilstein","weekly_hours":9.25,"unavailability_periods":[]},{"id":"313e5530-41fe-4604-9aa8-63473b654ff0","name":" Amber Moore","weekly_hours":3.5,"unavailability_periods":[]},{"id":"2662fc8f-25ab-46e8-b257-62f9424a67aa","name":" Pavitra Nanayakkara","weekly_hours":3.38,"unavailability_periods":[]},{"id":"988c5744-32b3-41fe-be48-08e94738f144","name":" John Negri","weekly_hours":8,"unavailability_periods":[]},{"id":"7e5acfd0-8a74-478e-967a-2ed6f345549b","name":" Jonathan Nettle","weekly_hours":0.88,"unavailability_periods":[]},{"id":"568c3dc5-c9c9-42a3-bc0e-250b5802b2b5","name":" Kim Norton-Old","weekly_hours":0,"unavailability_periods":[]},{"id":"9f0575e3-aed8-4fbb-b0ca-39cac64c5de4","name":" Huon O'Sullivan","weekly_hours":8,"unavailability_periods":[]},{"id":"6d1ea17c-1de1-4b4d-bf81-3f29b6c5b238","name":" Alex Polyakov","weekly_hours":5.28,"unavailability_periods":[]},{"id":"fd8f1368-7ebe-451e-8e21-878a106ec744","name":" Inge Putri","weekly_hours":2.88,"unavailability_periods":[]},{"id":"12748412-d573-4a80-85ef-a064db95bb1e","name":" Charlotte Reddington","weekly_hours":11.38,"unavailability_periods":[]},{"id":"c2fcf04e-0a27-45b5-b286-42432eceaeda","name":" Sam  Soo","weekly_hours":2.63,"unavailability_periods":[]},{"id":"ee688bde-1337-401e-a3ad-419eac80bce0","name":" Owen Stock","weekly_hours":15,"unavailability_periods":[]},{"id":"433399eb-5cc5-456f-82e9-29aec72cdcef","name":" Eashan Tambimuttu","weekly_hours":4,"unavailability_periods":[]},{"id":"d91ec0e8-0fe4-48ee-86af-5586b0bb5c1a","name":" Emily Twidale","weekly_hours":3.75,"unavailability_periods":[]},{"id":"1643c905-9eb0-4ca3-8035-400973a6c987","name":" Avelyn Wong","weekly_hours":7.5,"unavailability_periods":[]},{"id":"0d0bc2bb-cccf-4266-9f4d-7e8974d4fc73","name":" Chin Yong","weekly_hours":6.38,"unavailability_periods":[]}]

// Sample public holiday history
const publicHolidayHistory = [{"doctor_id":"988c5744-32b3-41fe-be48-08e94738f144","date":"2026-12-28","units":2},{"doctor_id":"263178dd-202d-47ab-b66b-ce841e5cd778","date":"2025-03-10","units":2},{"doctor_id":"eb9275da-eeac-4c5d-acae-07cf191e9f3b","date":"2026-04-06","units":2},{"doctor_id":"67d47300-fe2f-402d-bd1a-e8c0d1525210","date":"2026-04-04","units":2},{"doctor_id":"f47b12dd-c999-4706-9b60-7d25b73540b2","date":"2025-04-25","units":2},{"doctor_id":"50936d85-58ec-499a-8c08-bf494d896a4b","date":"2026-06-08","units":2},{"doctor_id":"d0eb4131-f9f5-4e68-825f-51adf6ed2f34","date":"2026-12-26","units":2},{"doctor_id":"50936d85-58ec-499a-8c08-bf494d896a4b","date":"2025-04-21","units":2},{"doctor_id":"2662fc8f-25ab-46e8-b257-62f9424a67aa","date":"2025-04-18","units":2},{"doctor_id":"17428f66-3e63-47de-b6e9-fe5f6a20f14a","date":"2026-04-04","units":2},{"doctor_id":"a567494f-e3d7-4237-ae61-90ded2948a59","date":"2025-12-26","units":2},{"doctor_id":"3c458974-a1ad-4c2a-be89-112465a5c721","date":"2025-01-01","units":2},{"doctor_id":"263178dd-202d-47ab-b66b-ce841e5cd778","date":"2026-11-03","units":2},{"doctor_id":"1643c905-9eb0-4ca3-8035-400973a6c987","date":"2026-12-25","units":2},{"doctor_id":"0ce7469a-f61e-4085-9c17-88e6a0bd4169","date":"2025-04-20","units":2},{"doctor_id":"3eafbee8-6741-4832-ae58-c24c70eb80da","date":"2026-01-01","units":2},{"doctor_id":"d91ec0e8-0fe4-48ee-86af-5586b0bb5c1a","date":"2025-04-19","units":2},{"doctor_id":"3eafbee8-6741-4832-ae58-c24c70eb80da","date":"2025-04-25","units":2},{"doctor_id":"bdade4d3-2e33-4ecc-9a11-2af1ebc45343","date":"2025-12-26","units":2},{"doctor_id":"263178dd-202d-47ab-b66b-ce841e5cd778","date":"2025-04-20","units":2}]

// Shifts with nested shift_assignments data
const shifts = [{"id":143,"created_at":1743416550908,"shift_id":373,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-01","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":144,"created_at":1743416550908,"shift_id":373,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-01","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":145,"created_at":1743416550908,"shift_id":373,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-02","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":146,"created_at":1743416550908,"shift_id":373,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-02","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":147,"created_at":1743416550908,"shift_id":374,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-03","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":148,"created_at":1743416550908,"shift_id":374,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-04","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":149,"created_at":1743416550908,"shift_id":375,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-05","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":150,"created_at":1743416550908,"shift_id":375,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-06","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":151,"created_at":1743416550908,"shift_id":376,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-07","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":152,"created_at":1743416550908,"shift_id":376,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-08","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":153,"created_at":1743416550908,"shift_id":376,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-08","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":154,"created_at":1743416550908,"shift_id":376,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-09","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":155,"created_at":1743416550908,"shift_id":376,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-09","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":156,"created_at":1743416550908,"shift_id":377,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-10","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":157,"created_at":1743416550908,"shift_id":377,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-11","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":158,"created_at":1743416550908,"shift_id":378,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-12","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":159,"created_at":1743416550908,"shift_id":378,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-13","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":160,"created_at":1743416550908,"shift_id":379,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-14","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":161,"created_at":1743416550908,"shift_id":379,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-15","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":162,"created_at":1743416550908,"shift_id":379,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-15","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":163,"created_at":1743416550908,"shift_id":379,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-16","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":164,"created_at":1743416550908,"shift_id":379,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-16","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":165,"created_at":1743416550908,"shift_id":380,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-17","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":166,"created_at":1743416550908,"shift_id":380,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-18","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":167,"created_at":1743416550908,"shift_id":381,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-19","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":168,"created_at":1743416550908,"shift_id":381,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-20","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":169,"created_at":1743416550908,"shift_id":382,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-21","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":170,"created_at":1743416550908,"shift_id":382,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-22","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":171,"created_at":1743416550908,"shift_id":382,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-22","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":172,"created_at":1743416550908,"shift_id":382,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-23","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":173,"created_at":1743416550908,"shift_id":382,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-23","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":174,"created_at":1743416550908,"shift_id":383,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-24","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":175,"created_at":1743416550908,"shift_id":383,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-25","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":176,"created_at":1743416550908,"shift_id":384,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-26","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":177,"created_at":1743416550908,"shift_id":384,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-27","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":178,"created_at":1743416550908,"shift_id":385,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-02-28","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":179,"created_at":1743416550908,"shift_id":385,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-01","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":180,"created_at":1743416550908,"shift_id":385,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-01","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":181,"created_at":1743416550908,"shift_id":385,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-02","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":182,"created_at":1743416550908,"shift_id":385,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-02","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":183,"created_at":1743416550908,"shift_id":386,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-03","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":184,"created_at":1743416550908,"shift_id":386,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-04","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":185,"created_at":1743416550908,"shift_id":387,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-05","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":186,"created_at":1743416550908,"shift_id":387,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-06","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":187,"created_at":1743416550908,"shift_id":388,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-07","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":188,"created_at":1743416550908,"shift_id":388,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-08","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":189,"created_at":1743416550908,"shift_id":388,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-08","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":190,"created_at":1743416550908,"shift_id":388,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-09","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":191,"created_at":1743416550908,"shift_id":388,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-09","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":192,"created_at":1743416550908,"shift_id":389,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-10","status":"pending","is_public_holiday_shift":true,"units_assigned":1},{"id":193,"created_at":1743416550908,"shift_id":389,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-10","status":"pending","is_public_holiday_shift":true,"units_assigned":1},{"id":194,"created_at":1743416550908,"shift_id":389,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-11","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":195,"created_at":1743416550908,"shift_id":390,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-12","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":196,"created_at":1743416550908,"shift_id":390,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-13","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":197,"created_at":1743416550908,"shift_id":391,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-14","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":198,"created_at":1743416550908,"shift_id":391,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-15","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":199,"created_at":1743416550908,"shift_id":391,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-15","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":200,"created_at":1743416550908,"shift_id":391,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-16","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":201,"created_at":1743416550908,"shift_id":391,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-16","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":202,"created_at":1743416550908,"shift_id":392,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-17","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":203,"created_at":1743416550908,"shift_id":392,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-18","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":204,"created_at":1743416550908,"shift_id":393,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-19","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":205,"created_at":1743416550908,"shift_id":393,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-20","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":206,"created_at":1743416550908,"shift_id":394,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-21","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":207,"created_at":1743416550908,"shift_id":394,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-22","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":208,"created_at":1743416550908,"shift_id":394,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-22","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":209,"created_at":1743416550908,"shift_id":394,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-23","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":210,"created_at":1743416550908,"shift_id":394,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-23","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":211,"created_at":1743416550908,"shift_id":395,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-24","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":212,"created_at":1743416550908,"shift_id":395,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-25","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":213,"created_at":1743416550908,"shift_id":396,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-26","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":214,"created_at":1743416550908,"shift_id":396,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-27","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":215,"created_at":1743416550908,"shift_id":397,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-28","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":216,"created_at":1743416550908,"shift_id":397,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-29","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":217,"created_at":1743416550908,"shift_id":397,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-29","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":218,"created_at":1743416550908,"shift_id":397,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-30","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":219,"created_at":1743416550908,"shift_id":397,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-30","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":220,"created_at":1743416550908,"shift_id":398,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-03-31","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":221,"created_at":1743416550908,"shift_id":398,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-01","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":222,"created_at":1743416550908,"shift_id":399,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-02","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":223,"created_at":1743416550908,"shift_id":399,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-03","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":224,"created_at":1743416550908,"shift_id":400,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-04","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":225,"created_at":1743416550908,"shift_id":400,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-05","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":226,"created_at":1743416550908,"shift_id":400,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-05","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":227,"created_at":1743416550908,"shift_id":400,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-06","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":228,"created_at":1743416550908,"shift_id":400,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-06","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":229,"created_at":1743416550908,"shift_id":401,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-07","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":230,"created_at":1743416550908,"shift_id":401,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-08","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":231,"created_at":1743416550908,"shift_id":402,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-09","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":232,"created_at":1743416550908,"shift_id":402,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-10","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":233,"created_at":1743416550908,"shift_id":403,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-11","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":234,"created_at":1743416550908,"shift_id":403,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-12","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":236,"created_at":1743416550908,"shift_id":403,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-13","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":237,"created_at":1743416550908,"shift_id":403,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-13","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":235,"created_at":1743416550908,"shift_id":403,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-12","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":238,"created_at":1743416550908,"shift_id":404,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-14","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":239,"created_at":1743416550908,"shift_id":404,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-15","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":240,"created_at":1743416550908,"shift_id":405,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-16","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":241,"created_at":1743416550908,"shift_id":405,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-17","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":242,"created_at":1743416550908,"shift_id":406,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-18","status":"pending","is_public_holiday_shift":true,"units_assigned":1},{"id":243,"created_at":1743416550908,"shift_id":406,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-18","status":"pending","is_public_holiday_shift":true,"units_assigned":1},{"id":244,"created_at":1743416550908,"shift_id":406,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-19","status":"pending","is_public_holiday_shift":true,"units_assigned":1},{"id":245,"created_at":1743416550908,"shift_id":406,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-19","status":"pending","is_public_holiday_shift":true,"units_assigned":1},{"id":246,"created_at":1743416550908,"shift_id":406,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-20","status":"pending","is_public_holiday_shift":true,"units_assigned":1},{"id":247,"created_at":1743416550908,"shift_id":406,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-20","status":"pending","is_public_holiday_shift":true,"units_assigned":1},{"id":248,"created_at":1743416550908,"shift_id":407,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-21","status":"pending","is_public_holiday_shift":true,"units_assigned":1},{"id":249,"created_at":1743416550908,"shift_id":407,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-21","status":"pending","is_public_holiday_shift":true,"units_assigned":1},{"id":250,"created_at":1743416550908,"shift_id":407,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-22","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":251,"created_at":1743416550908,"shift_id":408,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-23","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":252,"created_at":1743416550908,"shift_id":408,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-24","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":253,"created_at":1743416550908,"shift_id":409,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-25","status":"pending","is_public_holiday_shift":true,"units_assigned":1},{"id":254,"created_at":1743416550908,"shift_id":409,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-25","status":"pending","is_public_holiday_shift":true,"units_assigned":1},{"id":255,"created_at":1743416550908,"shift_id":409,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-26","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":256,"created_at":1743416550908,"shift_id":409,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-26","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":257,"created_at":1743416550908,"shift_id":409,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-27","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":258,"created_at":1743416550908,"shift_id":409,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-27","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":259,"created_at":1743416550908,"shift_id":410,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-28","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":260,"created_at":1743416550908,"shift_id":410,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-29","status":"pending","is_public_holiday_shift":false,"units_assigned":1},{"id":261,"created_at":1743416550908,"shift_id":411,"doctor_id":null,"draft_assignment_doctor_id":null,"date":"2025-04-30","status":"pending","is_public_holiday_shift":false,"units_assigned":1}]

/**
 * Extract all shift assignments from the shifts data structure
 * @param {Object[]} shifts - Array of shift objects with nested shift_assignments
 * @returns {Object[]} - Flat array of all shift assignments
 */
function extractAllShiftAssignments(shifts) {
  const allAssignments = [];
  
  shifts.forEach(shift => {
    if (shift.shift_assignments && Array.isArray(shift.shift_assignments)) {
      allAssignments.push(...shift.shift_assignments);
    }
  });
  
  return allAssignments;
}

/**
 * Update the shifts data structure with the assigned doctors
 * @param {Object[]} shifts - Array of shift objects with nested shift_assignments
 * @param {Object[]} updatedAssignments - Array of updated shift assignments with doctor_id set
 */
function updateShiftsWithAssignments(shifts, updatedAssignments) {
  // Create lookup map for updated assignments
  const assignmentMap = {};
  updatedAssignments.forEach(assignment => {
    assignmentMap[assignment.id] = assignment;
  });
  
  // Update each shift's assignments
  shifts.forEach(shift => {
    if (shift.shift_assignments && Array.isArray(shift.shift_assignments)) {
      shift.shift_assignments = shift.shift_assignments.map(assignment => {
        const updatedAssignment = assignmentMap[assignment.id];
        if (updatedAssignment) {
          return {
            ...assignment,
            doctor_id: updatedAssignment.doctor_id
          };
        }
        return assignment;
      });
    }
  });
}

/**
 * Generate text report for doctor allocation summary
 * @param {Object[]} doctors - Array of doctor objects
 * @param {Object[]} assignments - Array of shift assignments
 * @returns {string} Summary report
 */
function generateAllocationSummary(doctors, assignments) {
  let summary = "\nUnit Allocation Summary:\n";
  summary += "======================\n";
  
  // Calculate assigned units per doctor
  const doctorUnits = {};
  doctors.forEach(doctor => {
    doctorUnits[doctor.id] = 0;
  });
  
  // Count assigned units
  assignments.forEach(assignment => {
    if (assignment.doctor_id) {
      doctorUnits[assignment.doctor_id] += assignment.units_assigned;
    }
  });
  
  // Calculate total units
  const totalUnits = assignments.reduce((sum, a) => sum + a.units_assigned, 0);
  
  // Calculate total weekly hours
  const totalWeeklyHours = doctors.reduce((sum, doctor) => sum + doctor.weekly_hours, 0);
  
  // Calculate pro-rata targets and show allocation
  doctors.forEach(doctor => {
    const proRataTarget = (doctor.weekly_hours / totalWeeklyHours) * totalUnits;
    const actualUnits = doctorUnits[doctor.id];
    const deviation = actualUnits - proRataTarget;
    
    summary += `${doctor.name} (${doctor.weekly_hours} hours):\n`;
    summary += `  Target Units: ${proRataTarget.toFixed(1)}\n`;
    summary += `  Assigned Units: ${actualUnits.toFixed(1)}\n`;
    summary += `  Deviation: ${deviation.toFixed(1)} units\n`;
    
    // Flag significant deviations
    if (Math.abs(deviation) > 2) {
      summary += `  ⚠️ Significant deviation in allocation\n`;
    }
    summary += "\n";
  });
  
  // Count public holiday assignments
  const publicHolidayUnits = {};
  doctors.forEach(doctor => {
    publicHolidayUnits[doctor.id] = 0;
  });
  
  assignments.forEach(assignment => {
    if (assignment.doctor_id && assignment.is_public_holiday_shift) {
      publicHolidayUnits[assignment.doctor_id] += assignment.units_assigned;
    }
  });
  
  summary += "Public Holiday Allocation:\n";
  summary += "=========================\n";
  
  doctors.forEach(doctor => {
    summary += `${doctor.name}: ${publicHolidayUnits[doctor.id]} units\n`;
  });
  
  return summary;
}

/**
 * Run the doctor assignment algorithm and generate a report
 * @param {Object[]} doctors - Array of doctor objects
 * @param {Object[]} shifts - Array of shift objects with nested shift_assignments
 * @param {Object[]} publicHolidayHistory - Array of public holiday history objects
 * @returns {string} Detailed report of the assignment results
 */
function runExample(doctors, shifts, publicHolidayHistory) {
  let report = "DOCTOR ROSTER ASSIGNMENT REPORT\n";
  report += "===============================\n\n";
  report += "Running doctor assignment algorithm with nested shift_assignments data...\n";
  
  // Extract all shift assignments into a single flat array
  const allShiftAssignments = extractAllShiftAssignments(shifts);
  
  const updatedAssignments = assignDoctorsToShiftAssignments(
    doctors,
    allShiftAssignments,
    publicHolidayHistory
  );
  
  // Update the shifts with the assigned doctors
  updateShiftsWithAssignments(shifts, updatedAssignments);
  
  // Add shift assignments to report
  report += "\nShift Assignments Results:\n";
  report += "=========================\n";
  
  // Add each shift and its assignments to report
  shifts.forEach(shift => {
    report += `\nShift ID: ${shift.id}\n`;
    report += `Date Range: ${shift.start_date} to ${shift.end_date}\n`;
    report += `Pattern: ${shift.shift_pattern}\n`;
    
    if (shift.containing_public_holiday) {
      report += `Contains Public Holidays: Yes\n`;
    }
    
    report += "Assignments:\n";
    
    // Group by date for better display
    const assignmentsByDate = {};
    
    shift.shift_assignments.forEach(assignment => {
      if (!assignmentsByDate[assignment.date]) {
        assignmentsByDate[assignment.date] = [];
      }
      assignmentsByDate[assignment.date].push(assignment);
    });
    
    // Display assignments by date
    Object.keys(assignmentsByDate).sort().forEach(date => {
      report += `\n  Date: ${new Date(date).toLocaleDateString()}\n`;
      
      if (assignmentsByDate[date][0].is_public_holiday_shift) {
        report += "  Public Holiday: Yes\n";
      }
      
      assignmentsByDate[date].forEach(assignment => {
        const doctor = assignment.doctor_id ? 
          doctors.find(d => d.id === assignment.doctor_id) : 
          { name: "UNASSIGNED" };
        
        report += `    ID: ${assignment.id}, Doctor: ${doctor.name}, Doctor ID: ${assignment.doctor_id}, Units: ${assignment.units_assigned}\n`;
      });
    });
  });
  
  // Add allocation summary to report
  report += generateAllocationSummary(doctors, extractAllShiftAssignments(shifts));
  
  return report;
}

// Run the example with the sample data
const report = runExample(doctors, shifts, publicHolidayHistory);
console.log(report); 