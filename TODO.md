# TODO

| Color | Status      |
| ----- | ----------- |
| ⬛    | backlog     |
| 🟥    | not started |
| 🟨    | in progress |
| 🟩    | done        |

## MVP 🚀

- 🟩 Settings slide-out menu
  - 🟩 Accessible from user nav in navbar
  - 🟩 Two navigation tabs :
    - 🟩 Credentials
      - 🟩 View my credentials
      - 🟩 Create new credentials
      - 🟩 Update name and scope of existing credentials
    - 🟩 Sessions
      - 🟩 View my active sessions
      - 🟩 Revoke a session
      - 🟩 Revoke all sessions
- 🟨 Clan page
  - 🟩 Show clan information with actions
  - 🟨 Show clan players
    - 🟩 Recent players
    - 🟩 Inactive players (with pagination)
    - 🟥 All players (with pagination)

## Polishing ✨

- ⬛ Implement websocket
  - ⬛ Onboarding channel
    - ⬛ Listen for when clan is Synced for the first time (`/onboarding/sync-clan`)
  - ⬛ Sessions channel
    - ⬛ Listen for when the session is revoked
  - ⬛ Notifications channel (only for Multiple users per clan project)
    - ⬛ Show notifications for clan invitations
- ⬛ Multiple users per clan / clans per user
  - ⬛ Invitations
  - ⬛ Promotion / demotion (only original admin may demote other admins or demote themselves)
