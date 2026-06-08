# Entity Relationship Diagram (ERD)

## Overview

The MVP database consists of four main entities:

1. Users
2. Emergencies
3. Volunteer Responses
4. Notifications

---

## Users

Stores citizens, volunteers, and administrators.

| Field      | Type      |
| ---------- | --------- |
| id         | UUID      |
| name       | VARCHAR   |
| email      | VARCHAR   |
| password   | VARCHAR   |
| phone      | VARCHAR   |
| role       | ENUM      |
| created_at | TIMESTAMP |

Role Values:

* CITIZEN
* VOLUNTEER
* ADMIN

---

## Emergencies

Stores emergency requests.

| Field          | Type      |
| -------------- | --------- |
| id             | UUID      |
| citizen_id     | UUID      |
| emergency_type | VARCHAR   |
| description    | TEXT      |
| status         | ENUM      |
| created_at     | TIMESTAMP |
| resolved_at    | TIMESTAMP |

Status Values:

* PENDING
* ACCEPTED
* RESOLVED

---

## Volunteer Responses

Stores volunteer assignments.

| Field        | Type      |
| ------------ | --------- |
| id           | UUID      |
| emergency_id | UUID      |
| volunteer_id | UUID      |
| accepted_at  | TIMESTAMP |

---

## Notifications

Stores user notifications.

| Field      | Type      |
| ---------- | --------- |
| id         | UUID      |
| user_id    | UUID      |
| title      | VARCHAR   |
| message    | TEXT      |
| is_read    | BOOLEAN   |
| created_at | TIMESTAMP |

---

## Relationships

User (Citizen)
1
|
| creates
|
N
Emergency

Emergency
1
|
| assigned to
|
N
VolunteerResponse

User (Volunteer)
1
|
| accepts
|
N
VolunteerResponse

User
1
|
| receives
|
N
Notification
