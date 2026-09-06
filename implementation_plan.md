# Final Audit Implementation Plan

Based on a thorough end-to-end audit against the original Unified Mentor FinanceFlow requirements, I have identified a few missing or incomplete features that were skipped during the initial implementation phases. 

This plan outlines the fixes and additions I will make to ensure the project is 100% compliant with the requirements.

## User Review Required

> [!IMPORTANT]
> Please review the missing features identified below. Once you approve, I will implement them directly in the codebase and run a final build verification.

## Missing Features Identified

1. **Financial Health Score (Req 12)**: 
   - *Issue*: Not currently calculated or displayed.
   - *Fix*: Implement an algorithm in `dashboardController.js` to calculate the score (0-100) based on savings rate, streak consistency, and goal progress. Display this score prominently on the Dashboard UI.

2. **Notifications System (Req 15)**:
   - *Issue*: Model exists, but no API or UI dropdown.
   - *Fix*: Create `notificationController.js`, add `GET /api/notifications` and `PUT /api/notifications/:id/read`. Implement a dropdown in the `Header.jsx` to view and dismiss notifications.

3. **Financial Challenges (Req 14)**:
   - *Issue*: Model exists, but no API or UI.
   - *Fix*: Create `challengeController.js`. Add a "Challenges" section to the `Habits.jsx` page or Dashboard to let users join and track challenges.

4. **Profile & Settings (Req 17)**:
   - *Issue*: Pages do not exist.
   - *Fix*: Create `Profile.jsx` and `Settings.jsx`. Add the corresponding routes and sidebar links. Allow users to view their profile details.

5. **Dashboard Charts (Req 6 & 10)**:
   - *Issue*: The Cash Flow chart on the Dashboard is currently a placeholder text.
   - *Fix*: Replace the placeholder with a real `Recharts` Area/Bar chart using data from `GET /api/dashboard/analytics`.

## Proposed Execution Plan

1. **Backend Additions**:
   - Update `server.js` to include Notification, Challenge, and Profile routes.
   - Implement `notificationController.js`, `challengeController.js`, and `profileController.js`.
   - Update `dashboardController.js` to calculate the Financial Health Score and generate real chart data for Cash Flow.

2. **Frontend Additions**:
   - Update `Dashboard.jsx` to render the Financial Health Score and Cash Flow chart.
   - Update `Header.jsx` to include the Notifications dropdown.
   - Create `Profile.jsx` and `Settings.jsx` and wire them into `App.jsx`.
   - Update `Habits.jsx` to include a Challenges tab.

3. **Verification**:
   - Run `npm run build` in the frontend to ensure no compilation errors.
   - Start the backend and verify the endpoints using the seeder data.
   - Provide the Final Audit Report.
