# Authorization

## Table of contents

- [Create account](#create-account)
- [Get access token](#get-access-token)

### Create account

Creates new account. Returns empty response with `201 CREATED` status

#### HTTP request

```
POST /api/v3/account
```

#### Request body parameters

```
{
    address: string, // Ethereum wallet address
    privateKey: string // Ethereum wallet private key
}
```

#### Sample request

```
POST /api/v3/accounts

{
	"address": "0x39875a02842372F54B50E572251a4e9dfFB0f5d8",
	"privateKey": "0x833fe1840ef2cf8844b98466447f60b7d2c342681d7baff4cef01c2609371c97"
}
```

#### Sample response

```
201 CREATED
```


### Get access token

Returns new JWT access token

#### HTTP request

```
POST /api/v3/auth/login
```

#### Request body parameters

```
{
    username: string, // Place ethereum wallet address here
    password: string // Place ethereum wallet private key here
}
```

#### Response body parameters

```
{
    access_token: string // JWT token which can be later used for authorization
}
```

#### Sample request

```
POST /api/v3/auth/login

{
	"username": "0x39875a02842372F54B50E572251a4e9dfFB0f5d8",
	"password": "0x833fe1840ef2cf8844b98466447f60b7d2c342681d7baff4cef01c2609371c97"
}
```

#### Sample response

```
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVcmkiOm51bGwsImRpc3BsYXllZE5hbWUiOiIweDM5ODc1YTAyODQyMzcyRjU0QjUwRTU3MjI1MWE0ZTlkZkZCMGY1ZDgiLCJldGhlcmV1bUFkZHJlc3MiOiIweDM5ODc1YTAyODQyMzcyRjU0QjUwRTU3MjI1MWE0ZTlkZkZCMGY1ZDgiLCJpZCI6IjB4Mzk4NzVhMDI4NDIzNzJGNTRCNTBFNTcyMjUxYTRlOWRmRkIwZjVkOCIsInJlbW90ZSI6ZmFsc2UsImlhdCI6MTU4MjA0NTM1MiwiZXhwIjoxNTgyMDQ4OTUyfQ.pczAy828dTMS0GV84dvrEyVqz6eXxn5hrxZdpyQJOnc"
}
```

#### Sending access token

Obtained access token must be sent with every request in headers as shown below for any requests
that require authorization.

```
Authorization: Bearer your_token
```

For example: 

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVcmkiOm51bGwsImRpc3BsYXllZE5hbWUiOiIweDM5ODc1YTAyODQyMzcyRjU0QjUwRTU3MjI1MWE0ZTlkZkZCMGY1ZDgiLCJldGhlcmV1bUFkZHJlc3MiOiIweDM5ODc1YTAyODQyMzcyRjU0QjUwRTU3MjI1MWE0ZTlkZkZCMGY1ZDgiLCJpZCI6IjB4Mzk4NzVhMDI4NDIzNzJGNTRCNTBFNTcyMjUxYTRlOWRmRkIwZjVkOCIsInJlbW90ZSI6ZmFsc2UsImlhdCI6MTU4MjA0NTM1MiwiZXhwIjoxNTgyMDQ4OTUyfQ.pczAy828dTMS0GV84dvrEyVqz6eXxn5hrxZdpyQJOnc
```
