# API Design

## Base URL

```text
/api/v1
```

---

# Authentication APIs

## Register User

### Endpoint

```http
POST /api/v1/auth/register
```

### Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "CITIZEN"
}
```

### Response

```json
{
  "message": "User registered successfully"
}
```

---

## Login User

### Endpoint

```http
POST /api/v1/auth/login
```

### Request

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "token": "jwt-token"
}
```

---

# Emergency APIs

## Create Emergency

### Endpoint

```http
POST /api/v1/emergencies
```

### Request

```json
{
  "emergencyType": "MEDICAL",
  "description": "Need immediate assistance"
}
```

### Response

```json
{
  "id": "uuid",
  "status": "PENDING"
}
```

---

## Get All Emergencies

### Endpoint

```http
GET /api/v1/emergencies
```

### Response

```json
[
  {
    "id": "uuid",
    "emergencyType": "MEDICAL",
    "status": "PENDING"
  }
]
```

---

## Get Emergency By ID

### Endpoint

```http
GET /api/v1/emergencies/{id}
```

---

## Resolve Emergency

### Endpoint

```http
PATCH /api/v1/emergencies/{id}/resolve
```

---

# Volunteer APIs

## Accept Emergency

### Endpoint

```http
POST /api/v1/volunteers/accept
```

### Request

```json
{
  "emergencyId": "uuid"
}
```

### Response

```json
{
  "message": "Emergency accepted"
}
```

---

# Notification APIs

## Get Notifications

### Endpoint

```http
GET /api/v1/notifications
```

---

## Mark Notification As Read

### Endpoint

```http
PATCH /api/v1/notifications/{id}
```

---

# Admin APIs

## Get All Users

### Endpoint

```http
GET /api/v1/admin/users
```

---

## Get Dashboard Statistics

### Endpoint

```http
GET /api/v1/admin/stats
```

### Response

```json
{
  "totalUsers": 100,
  "totalVolunteers": 40,
  "totalEmergencies": 25
}
```
