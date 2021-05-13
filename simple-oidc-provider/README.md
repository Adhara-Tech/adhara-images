# Simple OIDC Provider

A node implementation of [oidc provider](https://github.com/panva/node-oidc-provider)

> ### Do not run this in production
> This simple OIDC provider is intended for testing purposes only

## Configuration

1. Execute `npm install` to install node dependencies.

2. Specify a list of users in a users.yaml file.

```yaml
users:
  - id: '23121d3c-84df-44ac-b458-3d63a9a05497'
    email: 'foo@example.com'
    password : '1234'
    email_verified: true
  - id: 'c2ac2b4a-2262-4e2f-847a-a40dd3c4dcd5'
    email: 'bar@example.com'
    email_verified: true
    password: '1234'
```
3. Specify a list of clients in a clients.yaml file.

```yaml
clients:
  - client_id: *************************
    client_secret: **********************
    redirect_uris:
      - http://localhost:4180/oauth2/callback
    post_logout_redirect_uris:
      - http://localhost:4180
    end_session_redirect_uri: http://localhost:4180
    response_types:
      - code
    application_type: web
    grant_types:
    - authorization_code
```

4. Generate the jwks keys
`npm generate_keys.js`

5. Execute `PROVIDER_URL=http://localhost:3000 CLIENTS_CONFIG_FILE=./clients.yaml USERS_CONFIG_FILE=./users.yaml JWKS_FILE=./jwks.json PORT=3000 node index.js`
  * `PROVIDER_URL` -> Provider Domain (must match with oidc provider in oaut2-proxy configuration)
  * `PORT` -> Provider server port
  * `CLIENTS_CONFIG_FILE` -> Path to clients config file
  * `USERS_CONFIG_FILE` -> Path to users config file
  * `JWKS_FILE` -> Path to jwks keys file.


### Templating

You can use [EJS](https://ejs.co/) templates in the string values of clients and users config files. Example:

```yaml
clients:
  - client_id: "<%= env.CLIENT_ID; %>"
    client_secret: "<%= env.CLIENT_SECRET; %>"

    . . .
```
