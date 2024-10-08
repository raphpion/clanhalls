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
- 🟩 Clan Players widget
  - 🟩 Show clan information with actions
  - 🟩 Show clan players
    - 🟩 Recent players
    - 🟩 Inactive players (with pagination)
    - 🟩 All players (with pagination)
      - 🟩 Search by name
      - 🟩 Order by: username, title, last seen
- 🟥 Recent reports widget
  - 🟥 Show 10 most recent reports (1 tab per report type)
- 🟥 MembersListReport
  - 🟥 Payload: list of members and ranks
  - 🟥 Webhook: POST /webhooks/clans/members-list-report
  - 🟥 Apply: remove clan members that are not currently members of the clan

## Then, important DX features 🚧

- 🟥 Unit tests for the backend models and commands
  - 🟥 Use repository pattern to abstract db calls in test suites
  - 🟥 Validate if DDD is (mostly) respected
- 🟥 Fix ESLint errors in the frontend
- 🟥 CI workflow with lint and tests
- 🟥 Production Dockerfile and docker-compose files
- 🟥 CD workflow to deploy on my local server (or Droplet/AWS ECS)

## Exciting new features ✨

- ⬛ Add GraphQL!
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
