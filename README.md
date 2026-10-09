# Messenger — Front End

A Persian-language messaging interface built with **Nuxt 3 / Vue 3**. It connects to the [Messenger back end](https://github.com/naderianaliakbar/Messenger-Back-End) for authentication, conversations, contacts, messages and real-time updates.

## Features

- Phone-number login flow with OTP/password screens.
- Conversation list, contact management and chat interface.
- Message replies, deletion dialogs and file upload/viewer components.
- Socket.IO real-time connection, notifications and persisted browser state.
- Responsive Vuetify interface with Persian-language styling.

## Technology

Nuxt 3, Vue 3, Vuetify 3, Pinia, Axios/`$fetch`, Socket.IO Client 4, Sass, VeeValidate and IndexedDB (client-side plugin).

## Run locally

Requires Node.js and npm or Yarn, plus a running [Messenger back end](https://github.com/naderianaliakbar/Messenger-Back-End).

```bash
git clone https://github.com/naderianaliakbar/Messenger-Front-End.git
cd Messenger-Front-End
npm install
```

Set environment variables for `nuxt.config.ts` (for example in a local `.env`):

```dotenv
API_BASE_URL=http://localhost:5000
SOCKET_URL=http://localhost:5000
STATICS_URL=http://localhost:5000/static
TOKEN_SECRET=replace-with-your-server-side-secret
```

`API_BASE_URL`, `SOCKET_URL` and `STATICS_URL` are exposed via Nuxt **public runtime config**. **Never put secrets into public variables.** `TOKEN_SECRET` is declared in private runtime config; examine its server-side use before supplying a value. The sample values are illustrative and must match the server's configuration, routes and static-file URL.

```bash
npm run dev
```

The development server is configured on port `3000` in `nuxt.config.ts`. To build and preview:

```bash
npm run build
npm run preview
```

Other supported scripts: `npm run generate`. No automated test script is defined.

## Project map

```text
pages/                 Login and messenger views
components/messenger/  Chat, contacts, conversations, attachments, dialogs
store/                 Messenger and notification state
plugins/               API, WebSocket, Pinia, Vuetify, IndexedDB
composables/           API helper
middleware/            Authentication check
nuxt.config.ts         Runtime settings, development server and security headers
```

## Integration notes

- `plugins/api.ts` attaches the token cookie to API requests as an Authorization bearer token.
- `plugins/websocket.client.ts` opens a WebSocket-only Socket.IO connection using `SOCKET_URL`.
- The UI depends on the back end's auth/session and messaging response formats; start both repositories together.
- `nuxt-security` sets security headers/CSP, so additional remote hosts may require explicitly reviewing the configuration.

## License

No license file is included in this repository.
