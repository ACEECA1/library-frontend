# Frontend Design Specification: Digital Library Management System

This document outlines the complete feature set, user workflows, and structural requirements for the Digital Library Management System. It is designed to provide a frontend design team (or AI agent) with all the necessary context to create a flawless, comprehensive user interface.

---

## 1. Global UI/UX Elements

### 1.1. Navigation & Layout
- **Top Navigation Bar:** Must include branding, a global search bar (for books/authors), user profile dropdown (settings, logout, bookmarks), and a notification bell.
- **Sidebar (Collapsible):** Quick links to Home, Browse (Categories/Series/Tags), My Collection (Bookmarks), and Admin/Moderator Dashboards (if the user has the respective roles).
- **Theme:** Support for Light/Dark mode.
- **Real-Time Notifications:** A toast notification system and a dropdown center (powered by WebSockets/STOMP) to alert users of replies to their comments, admin approvals, or system alerts.

---

## 2. Public & Authentication Workflows

### 2.1. Landing Page
- A welcoming hero section.
- Highlights of "Trending Books," "Recently Added," and "Top Rated."

### 2.2. Authentication flows
- **Login:** Standard email/username and password login.
- **Registration:** Account creation form. *Note: New accounts enter a `PENDING` state and require Admin approval before they can log in.*
- **Forgot Password:** Users can request a password reset. This sends a request to the Admin. Once the Admin approves, the user receives a secure token to enter their new password.

---

## 3. Core User Experience (The Reader's Journey)

### 3.1. Book Discovery & Catalog
- **Browse Page:** A grid or list view of books displaying the cover thumbnail, title, author, average star rating, and category.
- **Filters & Sorting:** Sidebar or top bar filters for Categories, Tags, Series, and sorting options (e.g., Newest, Highest Rated, Most Viewed).
- **Global Search:** Full-text search querying against book metadata and extracted PDF contents (powered by Lucene).

### 3.2. Book Details Page
- **Hero Section:** Large book cover thumbnail, title, author, publication date, Series information, and associated Tags/Category.
- **Action Buttons:** 
  - "Read Now" (or "Continue Reading" if progress exists).
  - "Add to Bookmarks" (saves to the user's personal collection).
- **Synopsis/Description:** Text description of the book.
- **Related Books:** A carousel of suggested books based on shared categories.
- **Reviews Section:** 
  - An aggregated 5-star rating display.
  - A form for the user to submit their own 1-5 star rating and written review.
  - A list of user reviews.

### 3.3. The Reading Interface (PDF Viewer)
- A distraction-free, immersive PDF reading view (fetching the PDF stream securely).
- **Reading Progress Tracking:** The system backend tracks the user's current page. The UI should automatically resume from the last read page and quietly save progress as the user flips pages.

### 3.4. Social Features: Comments & Badges
- **Nested Commenting:** Found on the Book Details page. Users can leave comments and reply to others (threaded conversations).
- **Voting:** Upvote and downvote buttons on comments.
- **Badges:** Users earn badges (e.g., "First Comment", "Reviewer") automatically. These badges must be visually displayed next to the user's avatar/name in the comment section.

### 3.5. Moderation & Reporting
- Every book and comment must have a subtle "Report" button (flag icon) allowing users to report inappropriate content to the moderators.

---

## 4. User Dashboard & Personalization

### 4.1. My Collection (Bookmarks)
- A dedicated page showing all the books the user has bookmarked.
- Visual indicators showing their reading progress (e.g., a progress bar showing "Page 45 / 300").

### 4.2. Profile Settings
- Update personal information (Name, Date of Birth).
- Manage password.

---

## 5. Admin & Moderator Dashboards

*These views are restricted via Role-Based Access Control (RBAC).*

### 5.1. User Management (Admin)
- **Pending Approvals:** A queue of newly registered users waiting for account approval.
- **User List:** View all users, assign Roles (Admin, Moderator, User), issue temporary Timeouts (bans for X minutes), or permanently Ban users.
- **Password Resets:** A queue of password reset requests needing approval or rejection.

### 5.2. Content Management (Admin/Moderator)
- **Book Upload Flow:** 
  - A dedicated form to upload a PDF. 
  - *Note:* The backend automatically extracts the title page for a thumbnail, scans for viruses (ClamAV), and extracts text for search indexing. The UI should show a loading/processing state during this.
  - Fields to assign Title, Author, Category, Series, and Tags.
- **Metadata Management:** CRUD (Create, Read, Update, Delete) interfaces for Categories, Series, and Tags to keep the catalog organized.

### 5.3. Moderation Queue (Moderator)
- A dashboard listing all user-submitted Reports.
- Actions to View the reported content (Comment/Book), Delete the offending content, or Mark the report as Resolved.

### 5.4. Audit Logs (Admin)
- A datagrid viewing system actions (e.g., who deleted what, who uploaded what) for accountability, fetched from the backend audit logs.

---

## 6. Technical UI Considerations
- **JWT Handling:** The frontend must handle short-lived JWT Access Tokens and implement a silent background refresh using Refresh Tokens. If a user is Banned or Timed Out, the refresh will fail, and the UI should force a logout.
- **WebSocket Integration:** Use STOMP over WebSockets (`/ws`) to subscribe to `/user/queue/notifications`. Unread notifications should update a badge counter in the top navigation bar.
- **Debouncing:** Interactions like updating reading progress or upvoting should be debounced to prevent backend spam.
