# community-emergency-response-network

# Community Emergency Response Network (CERN)

A full-stack emergency management platform that connects citizens, volunteers, professional responders, and administrators through a unified system for reporting, managing, and monitoring emergency incidents in real time.

---

## About the Project

Community Emergency Response Network (CERN) was built to explore how technology can improve coordination during emergency situations.

In many emergencies, reporting an incident is only the first step. Efficient communication between citizens, volunteers, emergency responders, and authorities is equally important. This project brings these stakeholders together on a single platform where incidents can be reported, assigned, tracked, and resolved through role-based workflows.

The application supports multiple user roles, secure authentication, real-time updates, live operational dashboards, and location-based visualization to simulate how an emergency response system could function in practice.

---

## Features

### Secure Authentication
- JWT-based authentication
- BCrypt password encryption
- Role-based authorization
- Protected routes

### Citizen Portal
- Register and log in
- Report emergencies
- Track emergency status
- View previously reported incidents

### Volunteer Portal
- View assigned emergencies
- Accept emergency requests
- Monitor ongoing cases

### Professional Responders
Separate dashboards for:

- Medical Responders
- Fire Responders
- Police Responders

Responders can:

- View assigned incidents
- Accept emergencies
- Mark emergencies as resolved

### Administration
- Live operations dashboard
- Emergency analytics
- Department-wise monitoring
- Manage responder accounts
- Export reports in CSV and PDF format

### Real-Time Features
- WebSocket-based live updates
- Browser notifications
- Live dashboard refresh

### Visualization
- Interactive emergency map
- Charts and analytics
- Department statistics

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- React Leaflet
- Recharts
- Lucide React
- SockJS
- STOMP

### Backend

- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT Authentication
- WebSocket (STOMP)

### Database

- PostgreSQL

---

## User Roles

The application supports six different user roles.

- Citizen
- Volunteer
- Medical Responder
- Fire Responder
- Police Responder
- Administrator

Each role has a dedicated dashboard and permissions based on its responsibilities within the system.

---

## Project Structure

```
frontend
│
├── components
├── context
├── hooks
├── pages
├── services
└── utils

backend
│
├── controller
├── service
├── repository
├── entity
├── dto
├── security
├── config
└── websocket
```

---

## Application Workflow

```
Citizen
   │
   ▼
Report Emergency
   │
   ▼
Emergency Created
   │
   ▼
Admin Dashboard Updates
   │
   ▼
Volunteer / Professional Responder
Accepts Emergency
   │
   ▼
Emergency In Progress
   │
   ▼
Emergency Resolved
   │
   ▼
Citizen Tracks Final Status
```

---

## Getting Started

### Clone the repository

```bash
git clone https://github.com/<your-username>/community-emergency-response-network.git
```

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The application will be available at:

- Frontend → http://localhost:5173
- Backend → http://localhost:8080

---

## Future Improvements

Some ideas for future versions include:

- Mobile application
- Push notifications
- SMS and email alerts
- AI-assisted emergency prioritization
- GPS-based responder tracking
- Multi-language support

---

## Author

**Prachi Rajput**

MCA Student  
Indira Gandhi Delhi Technical University for Women (IGDTUW)

GitHub: https://github.com/PrachiRajput03

LinkedIn: https://www.linkedin.com/in/prachi-rajput-66250a2ab/

---

## License

This project is available for learning and educational purposes.
