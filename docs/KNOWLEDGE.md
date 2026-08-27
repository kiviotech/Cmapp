# Cmapp knowledge base

Construction management app for Kivio. Field contractors execute tasks and upload proof; project managers create projects, assign work, and approve registrations and submissions.

This repo is the **mobile/web client**. The API is a separate Strapi app: `/Users/prithvirajpillai/Documents/work/cmapp-backend2`.

| | Frontend (`Cmapp`) | Backend (`cmapp-backend2`) |
|---|---|---|
| Stack | Expo 52, React Native 0.74, Expo Router, Zustand, NativeWind, Axios | Strapi 4.25.9, SQLite (dev), Users & Permissions |
| Branch | `asha` | `latestwithcustom` |
| Remote | https://github.com/kiviotech/Cmapp | https://github.com/kiviotech/cmapp-backend2 |
| Run | `yarn start` / `yarn web` (port **8085**) | `npm run develop` (port **1339**) |
| Node | current 20.x is fine | **18–20 only** |

There is no project README in this repo. Use this file plus `.cursor/rules/` as the source of truth.

---

## Users and workflows

**Contractor**

1. Sign up (`/(auth)/SignUp`) against `/registrations` (pending approval).
2. After approval, log in (`POST /api/auth/local`).
3. Home: assigned projects and ongoing tasks.
4. Open a task → upload proof (`uploadProof`) → creates a **submission**.
5. Track activity, notifications, submission history.

**Project Manager / Project Supervisor / Site Supervisor**

1. Log in; dashboard renders `projectTeam/ProjectTeam`.
2. Create a project (`ProjectForm`) — backend also generates tasks from **standard-tasks**.
3. Assign contractors (`AssignContractors`) and project team (`AssignProjectTeam`).
4. Review **Requests**: contractor registrations and task submissions; approve or decline.

Designation is `user.user_group.designation.Name` (e.g. `"Contractor"`, `"Project Manager"`).

---

## App structure

```
app/                         Expo Router screens
  (auth)/                    login, signup, password reset
  (pages)/                   authenticated flows
    contractor/              contractor home, profile, submissions
    projectTeam/             PM home, project list/details
src/api/                     Axios client, endpoint paths, repositories
src/services/                business logic over repositories
src/stores/                  fileUploadStore
useAuthStore.js              auth Zustand store (repo root)
projectStore.js              project Zustand store (repo root)
components/                  FileUpload, Loader, cards
```

Call chain: **screen → service → repository → endpoints → apiClient**.

---

## API configuration

`src/api/apiClient.js` reads `EXPO_PUBLIC_API_URL` / `EXPO_PUBLIC_MEDIA_URL` (see `.env.example`). Defaults:

- Web / iOS: `http://localhost:1339`
- Android emulator: `http://10.0.2.2:1339`

Copy `.env.example` to `.env`. Production host `cmappapi.kivio.in` was down when this project was restarted (Aug 2026).

Auth endpoints: `/auth/local`, `/auth/local/register`, forgot/reset/change password.

---

## How to run (local)

Prerequisites: Node 20, Yarn 1.x, Expo CLI via the project.

```bash
# backend
cd /Users/prithvirajpillai/Documents/work/cmapp-backend2
npm run develop          # http://localhost:1339  admin: /admin

# frontend
cd /Users/prithvirajpillai/Documents/work/Cmapp
yarn install
yarn web                 # http://localhost:8085
# or: yarn start         # Expo Dev Tools / Expo Go
```

Admin login is whatever was created in the local SQLite DB (`.tmp/data.db`). Production API does not need the local backend running.

---

## Known issues (fix these early)

1. **Auth header** — must be `` `Bearer ${token}` ``. A tagged-template bug was fixed on `asha`.
2. **Token storage** — Zustand uses `localStorage`; AsyncStorage keys `userToken` vs `token` do not match; login never `saveToken()`.
3. **Layout gating** — `_layout.jsx` ignores Zustand and redirects when `designation !== "Contractor"`, which can eject project managers. `LayoutWrapper.jsx` is unused.
4. **No iOS API URL** in `apiClient.js`.
5. **AddTasks** screen exists but is not registered in the Stack.
6. Filename `app/(pages)/contractor/BottomNavigation .jsx` has a trailing space.
7. An older WIP stash may still exist on this clone (`git stash list`).

---

## Domain entities (Strapi)

`projects`, `tasks`, `standard-tasks`, `contractors`, `sub-contractors`, `registrations`, `submissions`, `project-teams`, `user-groups`, `designations`, `access-controls`, `stages`, `categories`, `subcategories`, inspection forms/sections/items/responses, `directories`, `records`.
