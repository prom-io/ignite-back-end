# API entities

## Table of contents

- [Account](#account)
- [MediaAttachment](#mediaattachment)
- [BtfsInfo](#btfsinfo)
- [Status](#status)
- [Topic](#topic)

Note: responses of API may contain other fields that are not specified in this documents, but they are insignificant and should be ignored.

### Account

| Parameter       | Type    | Description                                                                                                          |
|-----------------|---------|----------------------------------------------------------------------------------------------------------------------|
| avatar          | string  | Link to user's avatar                                                                                                |
| display_name    | string  | User's displayed name                                                                                                |
| id              | string  | ID of user. It's not the actual UUID of user stored in database but rather their Ethereum Address they use to log in |
| created_at      | string  | Date of creation of this account represented in ISO-formatted string                                                 |
| followers_count | number  | Number of users who follow this user                                                                                 |
| follows_count   | number  | Number of users which this user follows                                                                              |
| statuses_count  | number  | Number of statuses (a.k.a. posts) created by this user                                                               |
| following       | boolean | Whether current user follows this user                                                                               |
| followed_by     | boolean | Whether current user is followed by this user                                                                        |

### MediaAttachment

| Parameter | Type       | Description                                                                                                                                                                                                                                                |
|-----------|------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id        | string     | ID of media attachment                                                                                                                                                                                                                                     |
| url       | string     | URL to media attachment                                                                                                                                                                                                                                    |
| type      | string     | Type of media attachment. Currently Ignite only supports images, so this field is always set to "image"                                                                                                                                                    |
| meta      | <br>object | Metadata of media attachments. Currently Ignite only supports images, so metadata is always present in the following format:<br><code><br>{<br>width: number, //width of image in pixels<br>    height: number //height of image in pixels<br>}<br></code> |

### BtfsInfo

| Parameter   | Type    | Description                                                           |
|-------------|---------|-----------------------------------------------------------------------|
| cid         | string  | BTFS CID of the block                                                 |
| soter_link  | string  | Link to zip file with data                                            |
| created_at  | string  | Date of receiving this BTFS block represented as ISO-formatted string |
| synced      | boolean | Indicates whether this BTFS block has been synchronized               |
| peer_ip     | string  | IP address of node which generated this block                         |
| peer_wallet | String  | ETH wallet address of node which generated this block                 |

### Status

| Parameter             | Type                                           | Description                                                                                                                                                                                                                        |
|-----------------------|------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                    | string                                         | ID of status                                                                                                                                                                                                                       |
| created_at            | string                                         | Date of status creation represented as ISO-formatted string                                                                                                                                                                        |
| account               | [Account](#account)                            | User who created this status                                                                                                                                                                                                       |
| content               | string?                                        | Text of status                                                                                                                                                                                                                     |
| favourited            | boolean                                        | Indicates whether current user liked this status                                                                                                                                                                                   |
| favourite_count       | number                                         | Number of users who liked this status                                                                                                                                                                                              |
| media_attachments     | [MediaAttachment[]](#mediaattachment)          | Media attachments of this status                                                                                                                                                                                                   |
| referred_status       | [Status?](#status)                             | Status which this status refers to                                                                                                                                                                                                 |
| status_reference_type | enum("REPOST, "COMMENT")?                      | Type of status reference. If this field is set to "REPOST" then this status reposts status specified in referred_status field. If this field is set to "COMMENT" then this status has been created as a comment to referred status |
| referred_status_id    | string?                                        | ID of referred status. This field is only set to status specified in referred_status field, if this status also refers to other status                                                                                             |
| reposts_count         | number                                         | Number of reposts of this status                                                                                                                                                                                                   |
| comments_count        | number                                         | Number of comments left to this status                                                                                                                                                                                             |
| btfs_info             | [BtfsInfo?](#btfsinfo)                         | Info about BTFS block                                                                                                                                                                                                              |
| hash_tags             | [Topic](#topic)                                | Array of hash tags                                                                                                                                                                                                                 |

### Topic

| Parameter             | Type                                              | Description                                                                                                                                                                                                                        |
|-----------------------|---------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                    | string                                            | ID of topic                                                                                                                                                                                                                        |
| language              | enum("en", "ko")                                  | Language of topic                                                                                                                                                                                                                  |
| title                 | string                                            | Title of the topic                                                                                                                                                                                                                 |
| posts_count           | number                                            | How many statuses with this topic have been created                                                                                                                                                                                |
