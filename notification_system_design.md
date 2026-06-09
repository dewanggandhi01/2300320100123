
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

# Stage 3

## Query Analysis

### Given Query

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

The query is logically correct because it retrieves unread notifications for a specific student and sorts them by creation time.

## Why Is This Query Slow?

Assume:

* 50,000 students
* 5,000,000 notifications

Without proper indexing, the database may perform a full table scan to find matching records.

The query also performs sorting on the `createdAt` column, which becomes expensive when millions of records exist.

### Time Complexity

Without Index:

O(N)

With Sorting:

O(N log N)

As the dataset grows, query response time increases significantly.

## Recommended Optimization

Instead of indexing every column, I would create a composite index that matches the query pattern.

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt);
```

### Benefits

* Fast lookup by student ID.
* Efficient filtering of unread notifications.
* Reduced sorting overhead.
* Better query execution performance.

## Why Not Index Every Column?

Indexing every column is not recommended.

### Disadvantages

* Increased storage usage.
* Slower INSERT operations.
* Slower UPDATE operations.
* Higher maintenance overhead.

Indexes should only be created on frequently filtered, searched, joined, or sorted columns.

## Computational Cost

### Without Index

O(N)

### With Composite Index

O(log N)

The optimized query reduces the number of scanned rows and improves response time significantly.

## Placement Notifications in Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 DAYS';
```

This query returns all unique students who received placement notifications in the last seven days.

## Additional Index Recommendation

```sql
CREATE INDEX idx_notifications_type_created
ON notifications(notificationType, createdAt);
```

### Reason

Improves filtering for placement notifications and date-range searches.

## Logging

All query execution failures, slow query detections, index creation activities, and optimization-related events will be tracked using the custom Log() middleware.
