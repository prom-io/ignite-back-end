# Status likes API

## Table of contents

- [Like status](#like-status)
- [Delete status like](#delete-status-like)

### Like status

Marks specified status as liked by current user. Requires
access token to be present in headers. Returns empty response
with `201 CREATED` status.

#### HTTP request

````
POST /api/v3/statuses/:statusId/like
````

#### Request parameters

`statusId` - ID of status which is to be liked.

#### Sample request

````
POST /api/v3/statuses/d26c7ea5-5c66-421e-8387-dec0271d67b8/like
````


#### Sample response

````
201 CREATED
````

#### Possible error response statuses

`401 UNAUTHORIZED` - access token is expired;

`403 FORBIDDEN` - Current user has already liked this status;

`404 NOT FOUND` - Status with the specified ID was not found.

### Delete status like

Removes like of current user from the specified status. Requires
access token to be present in headers. Returns
empty response with `204 NO CONTENT` status.

#### HTTP request

````
DELETE /api/v3/statuses/:statusId/like
````

#### Request parameters

`statusId` - ID of status which is to be unliked.

#### Sample request

````
DELETE /api/v3/statuses/d26c7ea5-5c66-421e-8387-dec0271d67b8/like
````

#### Sample response

````
204 NO CONTENT
````


#### Possible error responses

`401 UNAUTHORIZED` - Access token is expired;

`403 FORBIDDEN` - Current user has not liked status
with the specified ID and thus cannot remove like from it;

`404 NOT FOUND` - Status with the specified ID was not found.


