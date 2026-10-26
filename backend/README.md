# User Registration API

## `POST /users/register`

Registers a new user, hashes the password, stores the user, and returns an authentication token with the created user.

### Request

Send a JSON body with these fields:

| Field | Type | Required | Rules |
|---|---|---:|---|
| `fullName.firstName` | string | Yes | Route validation requires at least 3 characters. |
| `fullName.lastName` | string | No by route validation | If provided, the model requires at least 2 characters. |
| `email` | string | Yes | Must be a valid email address; must be unique in the database. |
| `password` | string | Yes | At least 6 characters. It is hashed before being stored. |

Example:

```http
POST /users/register
Content-Type: application/json
```

```json
{
  "fullName": {
    "firstName": "Avery",
    "lastName": "Morgan"
  },
  "email": "avery@example.com",
  "password": "secure123"
}
```

### Responses

#### `201 Created`

Registration succeeded. The response includes a signed JWT and the created user document. Because the controller returns the document created by Mongoose directly, its `password` property contains the bcrypt hash (never the submitted plain-text password).

```json
{
  "token": "<jwt-token>",
  "user": {
    "fullName": {
      "firstName": "Avery",
      "lastName": "Morgan"
    },
    "email": "avery@example.com",
    "_id": "<user-id>"
  }
}
```

#### `400 Bad Request`

One or more route validations failed. The response contains the Express Validator errors:

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

The route returns `400` for invalid email, a first name shorter than 3 characters, or a password shorter than 6 characters. Database or other server errors are passed to Express error handling; no additional status code for those errors is defined in this controller.



## `GET /`

Returns a plain-text health check response.

### Response

#### `200 OK`

```text
Hello, World!
```
