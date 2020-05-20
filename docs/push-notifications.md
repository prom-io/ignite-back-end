# Push notifications API

## Table of contents

- [Register user device](#resister-user-device)
- [Basic structure of Ignite Firebase push notification](#basic-structure-of-ignite-firebase-push-notification)
- [Types of notifications](#types-of-notifications)
  - [Payload types](#payload-types)
    - [NEW_STATUS](#new_status)
    - [STATUS_REPLY](#status_reply)
    - [STATUS_LIKE](#status_like)
    - [FOLLOW](#follow)

## Resister user device

Register user device. Requires access token to be present in headers

### HTTP request

```
POST /api/v1/user-devices
```

### Request body parameters

| Parameter | Type   | Description                                  | Required |
|-----------|--------|----------------------------------------------|----------|
| fcm_token | string | Firebase cloud messaging token of the device | yes      |


### Sample request

```
POST /api/v1/user-devices
```

```
{
    "fcm_token": "FCM token goes here"
}
```

### Sample response

```
201 CREATED
```

## Basic structure of Ignite Firebase push notification

Ignite Firebase push notifications have the following structure:

```
{
    id: string, //ID of notification
    type: string, //Type of notification,
    json_payload: string //JSON-formatted string which contains notification payload
}
```

Firebase cloud messages can only include string values,
thus we have to send the payload of notification as JSON-formatted string
as the payload may contain complex nested objects.

## Types of notifications

Currently we have the following types of push notifications:

`NEW_STATUS` - notifications with this type are sent to subscribers of any user who publishes a new status;

`STATUS_REPLY` - notifications with this type are sent to authors of statuses which have been replied;

`STATUS_LIKE` - notifications with this type are sent to authors of statuses which have been liked;

`FOLLOW` - notifications with this type are sent to users which have been followed by someone.

### Payload types

This section describes the content of `json_payload` field of push notifications
depending of their type. Again, **this payload is sent as JSON-formatted string, so you have to parse
it first in order to access its fields.**

#### NEW_STATUS

`NEW_STATUS` notifications have a payload with `Status` type which structure is described
in [api-entities](https://github.com/Prometeus-Network/ignite-back-end/blob/master/docs/api-entities.md#status)
document.

#### STATUS_REPLY

`STATUS_REPLY` notifications have a payload with `Status` type which structure is described
in [api-entities](https://github.com/Prometeus-Network/ignite-back-end/blob/master/docs/api-entities.md#status)
document.

#### STATUS_LIKE

Fields of `STATUS_LIKE` notifications payload are described in the table below.

| Field        | Type                                                                                                     |
|--------------|----------------------------------------------------------------------------------------------------------|
| liked_status | [Status](https://github.com/Prometeus-Network/ignite-back-end/blob/master/docs/api-entities.md#status)   |
| liked_by     | [Account](https://github.com/Prometeus-Network/ignite-back-end/blob/master/docs/api-entities.md#account) |

#### FOLLOW

`FOLLOW` notification have a payload with `Account` type which structure is described
in [api-entities](https://github.com/Prometeus-Network/ignite-back-end/blob/master/docs/api-entities.md#account)
document.
