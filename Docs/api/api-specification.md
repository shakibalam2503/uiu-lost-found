# API Specification

## Base URL

```text
http://localhost:5000/api
```

---

# Authentication

Protected endpoints require a Firebase Authentication ID token.

### Request Header

```http
Authorization: Bearer <firebase-id-token>
```

## Roles

| Role | Description |
|---|---|
| `student` | University student |
| `faculty` | University faculty |
| `staff` | Lost & Found staff |
| `admin` | System administrator |

---

# Health API

## Check API Health

### `GET /health`

Checks whether the backend API is running.

### Response

```json
{
  "success": true,
  "message": "Lost & Found API is healthy"
}
```

---

# Authentication API

## Get Current User

### `GET /auth/me`

Returns the authenticated application user.

### Authentication

Required.

### Response

```json
{
  "success": true,
  "message": "Authenticated user retrieved successfully",
  "data": {
    "uid": "firebase-user-id",
    "name": "User Name",
    "email": "user@bscse.uiu.ac.bd",
    "role": "student",
    "photoURL": "https://..."
  }
}
```

---

# Lost Items API

## Create Lost Item

### `POST /lost-items`

Creates a new lost-item report.

### Authentication

Required.

### Allowed Roles

- `student`
- `faculty`

### Request Body

```json
{
  "title": "Black Wallet",
  "description": "Black leather wallet with several cards inside.",
  "category": "wallet",
  "color": "black",
  "lostDate": "2026-09-09",
  "building": "Main Building",
  "floor": "3",
  "locationDescription": "Near the CSE department office"
}
```

### Server-Generated Fields

The backend generates:

- `id`
- `reportedBy`
- `reporterName`
- `reporterEmail`
- `status`
- `imageUrls`
- `createdAt`
- `updatedAt`

Initial status:

```text
lost
```

### Response

```json
{
  "success": true,
  "message": "Lost item reported successfully",
  "data": {
    "id": "...",
    "reportedBy": "...",
    "title": "Black Wallet",
    "description": "Black leather wallet with several cards inside.",
    "category": "wallet",
    "color": "black",
    "lostDate": "2026-09-09",
    "building": "Main Building",
    "floor": "3",
    "locationDescription": "Near the CSE department office",
    "status": "lost",
    "imageUrls": [],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

## Get Lost Items

### `GET /lost-items`

Returns lost-item reports.

### Authentication

Required.

### Query Parameters

| Parameter | Description | Example |
|---|---|---|
| `limit` | Maximum number of results, 1–50 | `10` |
| `category` | Filter by category | `wallet` |
| `status` | Filter by status | `lost` |
| `color` | Filter by color | `black` |
| `building` | Filter by building | `Main Building` |
| `floor` | Filter by floor | `3` |

### Examples

```text
GET /lost-items
```

```text
GET /lost-items?category=wallet
```

```text
GET /lost-items?status=lost
```

```text
GET /lost-items?color=black
```

```text
GET /lost-items?building=Main%20Building&floor=3
```

### Multiple Filters

Filters can be combined.

```text
GET /lost-items?category=wallet&status=lost&color=black
```

Example with all available filters:

```text
GET /lost-items?category=wallet&status=lost&color=black&building=Main%20Building&floor=3
```

### Response

```json
{
  "success": true,
  "message": "Lost items retrieved successfully",
  "data": []
}
```

---

## Get My Lost Items

### `GET /lost-items/my`

Returns lost-item reports created by the currently authenticated user.

### Authentication

Required.

### Query Parameters

| Parameter | Description | Example |
|---|---|---|
| `limit` | Maximum number of results, 1–50 | `10` |

### Example

```text
GET /lost-items/my?limit=10
```

The backend determines the user from the Firebase ID token.

The client does not provide a user ID.

### Response

```json
{
  "success": true,
  "message": "Your lost items retrieved successfully",
  "data": []
}
```

---

## Get Lost Item by ID

### `GET /lost-items/:id`

Returns a specific lost-item report.

### Authentication

Required.

### Example

```text
GET /lost-items/ns0sExzEjNuzi7H2qEGJ
```

### Success Response

```json
{
  "success": true,
  "message": "Lost item retrieved successfully",
  "data": {}
}
```

### Not Found Response

```json
{
  "success": false,
  "message": "Lost item not found",
  "error": {
    "code": "LOST_ITEM_NOT_FOUND"
  }
}
```

---

## Update Lost Item

### `PUT /lost-items/:id`

Updates an existing lost-item report.

### Authentication

Required.

### Allowed Roles

- `student`
- `faculty`

### Authorization

Users can update **only their own** lost-item reports.

### Request Body

```json
{
  "title": "Wireless Mouse - Updated",
  "description": "Black Logitech wireless mouse with USB receiver",
  "category": "accessories",
  "color": "black",
  "lostDate": "2026-09-10",
  "building": "Canteen",
  "floor": "Ground Floor",
  "locationDescription": "Near the Olympia"
}
```

### Protected Fields

The client cannot modify:

- `reportedBy`
- `reporterName`
- `reporterEmail`
- `status`
- `createdAt`
- `updatedAt`

### Success Response

```json
{
  "success": true,
  "message": "Lost item updated successfully",
  "data": {}
}
```

### Authorization Failure

HTTP Status:

```text
403 Forbidden
```

```json
{
  "success": false,
  "message": "You can only update your own lost item",
  "error": {
    "code": "LOST_ITEM_UPDATE_FORBIDDEN"
  }
}
```

---

## Delete Lost Item

### `DELETE /lost-items/:id`

Deletes an existing lost-item report.

### Authentication

Required.

### Allowed Roles

- `student`
- `faculty`

### Authorization

Users can delete **only their own** lost-item reports.

### Example

```text
DELETE /lost-items/ns0sExzEjNuzi7H2qEGJ
```

### Success Response

```json
{
  "success": true,
  "message": "Lost item deleted successfully",
  "data": null
}
```

### Authorization Failure

HTTP Status:

```text
403 Forbidden
```

```json
{
  "success": false,
  "message": "You can only delete your own lost item",
  "error": {
    "code": "LOST_ITEM_DELETE_FORBIDDEN"
  }
}
```

---

# Lost Item Statuses

## Current Status

New lost-item reports initially have:

```text
lost
```

## Planned Status Workflow

```text
lost
  ↓
matched
  ↓
claim_requested
  ↓
recovered
  ↓
closed
```

Status changes will be controlled by the appropriate backend workflow and staff/admin authorization.

Students and faculty cannot directly change the status through the normal update endpoint.

---

# Standard API Response Format

## Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

## Error Response

```json
{
  "success": false,
  "message": "Description of the error",
  "error": {
    "code": "ERROR_CODE"
  }
}
```

---

# Common HTTP Status Codes

| Status Code | Meaning |
|---|---|
| `200` | Request successful |
| `201` | Resource created successfully |
| `400` | Bad request |
| `401` | Authentication required or invalid |
| `403` | Insufficient permissions |
| `404` | Resource not found |
| `500` | Internal server error |

---

# Current API Endpoints

| Method | Endpoint | Authentication | Allowed Roles | Purpose |
|---|---|---|---|---|
| `GET` | `/health` | No | — | Check API health |
| `GET` | `/auth/me` | Yes | All authenticated users | Get current user |
| `POST` | `/lost-items` | Yes | Student, Faculty | Create lost-item report |
| `GET` | `/lost-items` | Yes | All authenticated users | Get/search lost items |
| `GET` | `/lost-items/my` | Yes | Student, Faculty | Get own lost items |
| `GET` | `/lost-items/:id` | Yes | All authenticated users | Get one lost item |
| `PUT` | `/lost-items/:id` | Yes | Student, Faculty | Update own lost item |
| `DELETE` | `/lost-items/:id` | Yes | Student, Faculty | Delete own lost item |

---

# Notes

- Firebase Authentication is used for user authentication.
- Firebase UID is used to identify users.
- Application roles are stored in Firestore.
- User roles are not selected by the client.
- Student and faculty roles are determined from university email domains.
- Staff and admin roles are controlled by the application.
- Lost-item ownership is determined using the authenticated user's Firebase UID.
- Protected fields cannot be modified through normal lost-item updates.
- Firestore composite indexes may be required for combinations of filters and ordering.
- Search across title and description will be implemented separately from the current exact-match filters.