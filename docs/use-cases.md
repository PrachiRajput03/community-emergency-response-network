# Use Cases

## UC-01: User Registration

### Actors

* Citizen
* Volunteer

### Description

A new user registers on the platform.

### Flow

1. User opens the application.
2. User selects Register.
3. User enters required details.
4. System validates the information.
5. System creates the account.
6. User is redirected to Login.

---

## UC-02: User Login

### Actors

* Citizen
* Volunteer
* Administrator

### Description

A registered user logs into the system.

### Flow

1. User enters email and password.
2. System validates credentials.
3. System generates JWT token.
4. User is redirected to dashboard.

---

## UC-03: Create Emergency

### Actors

* Citizen

### Description

A citizen creates an emergency request.

### Flow

1. Citizen logs in.
2. Citizen presses SOS button.
3. Citizen selects emergency type.
4. Citizen enters description.
5. System creates emergency request.
6. Emergency status becomes "PENDING".

---

## UC-04: View Active Emergencies

### Actors

* Volunteer

### Description

Volunteers view active emergencies.

### Flow

1. Volunteer logs in.
2. Volunteer opens emergencies screen.
3. System displays active emergencies.
4. Volunteer selects an emergency.

---

## UC-05: Accept Emergency

### Actors

* Volunteer

### Description

A volunteer accepts an emergency request.

### Flow

1. Volunteer selects emergency.
2. Volunteer presses Accept.
3. System updates emergency status.
4. Citizen is notified.

---

## UC-06: Resolve Emergency

### Actors

* Volunteer

### Description

A volunteer marks an emergency as resolved.

### Flow

1. Volunteer opens assigned emergency.
2. Volunteer presses Resolve.
3. System updates status to RESOLVED.
4. Emergency is closed.

---

## UC-07: Monitor Emergencies

### Actors

* Administrator

### Description

Administrator monitors emergency activity.

### Flow

1. Administrator logs in.
2. Administrator opens dashboard.
3. System displays active and resolved emergencies.
4. Administrator views emergency details.
