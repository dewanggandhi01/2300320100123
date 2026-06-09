
# Notification System Design

## Stage 1

Pending

## Stage 2

Pending

## Stage 3

Pending

## Stage 4

Pending

## Stage 5

Pending

## Stage 6

Pending

# Notification System Design

# Stage 1

## Objective

Design a scalable notification platform that allows students to receive notifications related to Placements, Results, and Events in real-time.

---

## Notification Types

1. Placement
2. Result
3. Event

---

## Authentication

All APIs are protected and require Bearer Token authentication.

### Headers

Authorization: Bearer <token>

Content-Type: application/json

---

## Notification Schema

```json
{
  "id": "uuid",
  "studentId": "uuid",
  "type": "Placement",
  "message": "Amazon is hiring for SDE Intern",
  "isRead": false,
  "createdAt": "2026-06-09T10:30:00Z"
}
```

## REST APIs

### 1. Get Notifications

GET /api/v1/notifications

Purpose:
Fetch notifications for a student.

Example Request:

GET /api/v1/notifications?page=1&limit=10

Example Response:

```json
{
  "success": true,
  "notifications": [],
  "page": 1,
  "limit": 10
}
```

### 2. Filter Notifications

GET /api/v1/notifications?type=Placement

Purpose:
Fetch notifications by category.

### 3. Mark Notification as Read

PATCH /api/v1/notifications/{notificationId}/read

Purpose:
Mark a notification as viewed.

Example Response:

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### 4. Create Notification

POST /api/v1/notifications

Purpose:
Create a notification for a specific student.

Example Request:

```json
{
  "studentId": "123",
  "type": "Result",
  "message": "Mid Semester Results Published"
}
```

### 5. Broadcast Notification

POST /api/v1/notifications/broadcast

Purpose:
Send notification to all students.

Example Request:

```json
{
  "type": "Placement",
  "message": "Amazon Hiring Drive Open"
}
```

---

## Real-Time Notification Mechanism

Technology Chosen: WebSocket

Flow:

Admin
↓
Notification Service
↓
WebSocket Server
↓
Connected Students
↓
Instant Notification Delivery

Benefits:

* Real-time communication
* Low latency
* Reduced polling overhead
* Better user experience

---

## Logging Strategy

All API requests, notification creation events, notification read updates, broadcast operations, warnings, and errors will be recorded using the custom Log(stack, level, package, message) middleware provided in the assessment setup.
  

# Stage 2

## Database Choice

I recommend PostgreSQL as the primary database.

### Reasons

* Structured relational data.
* Strong indexing support.
* Efficient filtering and pagination.
* ACID compliance ensures data consistency.
* Mature ecosystem and scalability support.

## Students Table

| Column     | Type      |
| ---------- | --------- |
| id         | UUID      |
| name       | VARCHAR   |
| email      | VARCHAR   |
| created_at | TIMESTAMP |

## Notifications Table

| Column     | Type      |
| ---------- | --------- |
| id         | UUID      |
| student_id | UUID      |
| type       | ENUM      |
| message    | TEXT      |
| is_read    | BOOLEAN   |
| created_at | TIMESTAMP |

### Notification Types

* Placement
* Result
* Event

## Database Relationships

One Student can have many Notifications.

Relationship:

students.id → notifications.student_id

## Scaling Challenges

Assume:

* 50,000 students
* 5,000,000 notifications

Challenges:

1. Large table scans.
2. Heavy read traffic.
3. Sorting overhead for recent notifications.
4. Continuous storage growth.

## Scaling Solutions

### Indexing

Create indexes on:

* student_id
* is_read
* created_at
* type

### Read Replicas

Primary Database → Read Replica

Read operations can be served from replicas to reduce load.

### Table Partitioning

Partition notifications by month or year.

Examples:

* notifications_2026_01
* notifications_2026_02
* notifications_2026_03

### Redis Cache

Frequently accessed notifications can be cached in Redis.

## Logging

Database operations, query failures, cache misses, indexing updates, and scaling events will be logged using the custom Log() middleware.
