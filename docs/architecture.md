# System Architecture

## Overview

The Community Emergency Response Network (CERN) is a full-stack application that connects citizens in emergency situations with nearby volunteers.

The system consists of:

* Mobile Application (React Native)
* Backend API (Spring Boot)
* PostgreSQL Database
* Admin Dashboard (React)
* Firebase Cloud Messaging

---

## High-Level Architecture
+-------------------+
|   Mobile App      |
|  (React Native)   |
+---------+---------+
          |
          | HTTPS / REST API
          |
+---------v---------+
|   Spring Boot     |
|      Backend      |
+---------+---------+
          |
          |
+---------v---------+
|   PostgreSQL      |
|     Database      |
+-------------------+

          ^
          |
+---------+---------+
|  Admin Dashboard  |
|      (React)      |
+-------------------+
```

---

## Components

### Mobile Application

Responsibilities:

* User Registration
* User Login
* Emergency Creation
* Emergency Status Tracking
* Volunteer Operations

Technology:

* React Native
* Axios
* React Navigation

---

### Backend API

Responsibilities:

* Authentication
* Emergency Management
* Volunteer Management
* User Management
* Notification Management

Technology:

* Java 21
* Spring Boot
* Spring Security
* JWT Authentication

---

### Database

Responsibilities:

* Store Users
* Store Emergencies
* Store Volunteer Responses
* Store Notifications

Technology:

* PostgreSQL

---

### Admin Dashboard

Responsibilities:

* View Users
* View Volunteers
* Monitor Emergencies
* View Statistics

Technology:

* React
* Material UI

---

### Notification Service

Responsibilities:

* Emergency Alerts
* Volunteer Notifications
* Status Updates

Technology:

* Firebase Cloud Messaging

---

## MVP Scope

The initial version will include:

* User Registration
* User Login
* Emergency Creation
* Volunteer Acceptance
* Emergency Resolution
* Admin Dashboard
* Push Notifications

The following features are planned for future releases:

* Live Location Tracking
* WebSocket Updates
* SMS Fallback
* Offline Emergency Support
* AI-based Emergency Classification
* Disaster Response Mode

---

## Technology Stack

Frontend Mobile:

* React Native

Frontend Admin:

* React

Backend:

* Spring Boot
* Spring Security
* JWT

Database:

* PostgreSQL

Notifications:

* Firebase Cloud Messaging

Deployment:

* Docker
