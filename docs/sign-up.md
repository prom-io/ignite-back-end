# Sign up API

### Generate wallet

Generates new Prometeus wallet

#### HTTP request

````
POST /api/v1/wallet
````

#### Response

Response has the following structure:

| Parameter   | Type   | Description                         |
|-------------|--------|-------------------------------------|
| address     | string | Address of the generated wallet     |
| private_key | string | Private key of the generated wallet |
| public_key  | string | Public key of the generated wallet  |

#### Sample request

````
POST /api/v1/wallet
````

#### Sample response

````
{
    "address": "0xf858a5112B0dCb74D74ADF170d876dBdA1472902",
    "public_key": "f858a5112b0dcb74d74adf170d876dbda1472902",
    "private_key": "6496216a7ca85dcaab19c591af2a2ac485cd0862f7fc696227c16825f3db58de",
}
````

### Sign up

#### HTTP request

````
POST /api/v1/sign-up
````

#### Request body parameters

Request has the following structure:

| Parameter             | Type   | Description                                                                                                                                 | Required |
|-----------------------|--------|---------------------------------------------------------------------------------------------------------------------------------------------|----------|
| wallet_address        | string | Ethereum wallet address                                                                                                                     | yes      |
| private_key           | string | Private key of the wallet                                                                                                                   | yes      |
| password              | string | Password. It must be strong enough. We use this regex to validate password:  ^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,}) | yes      |
| password_confirmation | string | Password confirmation. Must be equal to 'password' field                                                                                    | yes      |

#### Response

In case of success empty response with `201 CREATED` status is returned.

#### Sample request

````
{
	"wallet_address": "0xf858a5112B0dCb74D74ADF170d876dBdA1472902",
	"private_key": "6496216a7ca85dcaab19c591af2a2ac485cd0862f7fc696227c16825f3db58de",
	"password": "Someverystrongpassword1!",
	"password_confirmation": "Someverystrongpassword1!"
}
````

#### Sample response

````
201 CREATED
````
