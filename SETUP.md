# Autopilot Setup Guide

## Auth
Autopilot uses the [NextAuth.js](https://next-auth.js.org/) library for authentication with AA's PingFederate IDP. The setup requires configuring environment variables to connect to the IDP. All routes are protected by default, and users must authenticate to access the application.

#### Environment Variables

| Variable             | Description                                  | Example                                                   |
| -------------------- | -------------------------------------------- | --------------------------------------------------------- |
| `AUTH_WELLKNOWN`     | The well-known URL for the PingFederate IDP  | `https://idptest.aa.com/.well-known/openid-configuration` |
| `AUTH_CLIENT_ID`     | The PingFederate application ID              |                                                           |
| `AUTH_CLIENT_SECRET` | The PingFederate application secret          |                                                           |
| `NEXTAUTH_URL`       | The base URL for the application             | `http://localhost:3000`                                   |
| `NEXTAUTH_SECRET`    | A random string used to encrypt session data |                                                           |

#### Callback URLs
Callback URLs must be configured with PingFederate. If one of the URLs changes, it must be requested and approved by the IDP team via Runway.
