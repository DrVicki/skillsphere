# SkillSphere TODO

## Phase 1 – Schema & Stripe
- [x] Extend drizzle/schema.ts with all tables (courses, modules, enrollments, progress, payments, coupons, discussions, messages, chat)
- [x] Run migration and apply SQL via webdev_execute_sql
- [x] Add Stripe integration via webdev_add_feature

## Phase 2 – Backend API
- [x] Auth router: role-based access (admin/trainer/learner), role upgrade
- [x] Courses router: CRUD, publish/unpublish, search, filter
- [x] Modules router: create/edit/delete video/text/assessment modules, reorder
- [x] Enrollments router: enroll, list enrolled courses
- [x] Progress router: mark module complete, get course progress
- [x] Payments router: Stripe checkout, webhook, subscriptions, bundles, coupons
- [x] Discussions router: threads and replies per course
- [x] Chat router: real-time messages per course (polling every 5s)
- [x] Analytics router: learner progress, engagement, revenue data
- [x] File upload router: signed upload to S3 storage

## Phase 3 – Public Pages
- [x] Landing page with brand identity (gradient blue #2A63BF, gold #F5B942, Poppins/Lato)
- [x] Course marketplace with search and filtering
- [x] Individual course detail/marketing page
- [x] Top navigation with login/signup CTA

## Phase 4 – Learner Dashboard
- [x] My Courses page
- [x] Course player with module navigation
- [x] Progress indicators (module-level and overall)
- [x] Assessment module UI

## Phase 5 – Trainer Dashboard
- [x] Course creation wizard
- [x] Course editor (modules: video, text, assessment)
- [x] File/video upload UI
- [x] Course publishing controls

## Phase 6 – Discussion & Chat
- [x] Per-course discussion board (threads + replies)
- [x] Real-time chat panel within course player

## Phase 7 – Analytics Dashboard
- [x] Admin: revenue, enrollments, top courses
- [x] Trainer: per-course learner progress and engagement

## Phase 8 – Polish & Delivery
- [x] Consistent SkillSphere branding across all pages
- [x] Responsive design (mobile-first)
- [x] Vitest unit tests (18 tests passing)
- [x] TypeScript zero errors
- [x] Checkpoint and delivery

## Future Enhancements
- [x] Email notifications for enrollment and completion (deferred until an email-service connection is approved)

## Active Work
- [x] Style course content viewer (LearnCourse page) to match SkillSphere brand
- [x] Add visual progress tracker sidebar with per-module completion and overall percentage
- [x] Build completion certificate with Dr. Vicki Bealman as issuer, SkillSphere logo and tagline
- [x] Certificate download as printable HTML/PDF when learner reaches 100% completion
- [x] Subscription management UI
- [x] Bundle purchase flow (deferred at user request; individual-course enrollment remains the only purchase option)
- [x] AI-powered course recommendations
- [x] Make AI recommendation cards independent of catalog search and filter state
- [x] Add prominent external Dr. Vicki Tech Talk blog links in the main navigation and footer
- [x] Add the course and source lessons from drvickidatacenter.org to the SkillSphere catalog
- [x] Add the course and source lessons from gamedesigncert.org to the SkillSphere catalog (verified existing course with 24 lessons)
- [x] Add the course and source lessons from pyforgecourse.org to the SkillSphere catalog
- [x] Add the course and source lessons from chatgptbiz-ret84r8p.manus.space to the SkillSphere catalog
- [x] Add the course and source lessons from drvickidatacenter.org to the SkillSphere catalog (duplicate task entry)
- [x] Fix course curriculum Preview buttons so they open the selected preview lesson
- [x] Restrict non-enrolled learners to preview lessons and show an enrollment call to action for locked content
- [x] Gate preview-mode completion, discussion, and chat actions behind sign-in and enrollment

## Admin Dashboard
- [x] Admin dashboard layout with dark sidebar navigation
- [x] Dashboard overview with stat cards (courses, users, revenue, enrollments, blog posts)
- [x] Courses admin page: list all courses, add/edit/delete, publish/unpublish toggle, featured toggle
- [x] Module/lesson editor per course: add/edit/delete lessons with Markdown content editor
- [x] Blog admin page: list all posts, publish/unpublish, feature toggle
- [x] Blog post editor: Markdown write + live preview, metadata (category, tags, cover image, excerpt)
- [x] Users admin page: list all users, change role (user/learner/trainer/admin)
- [x] Auth guard: redirect unauthenticated users to login, block non-admin role
- [x] isFeatured field added to courses.update procedure

## Rich Text Editor
- [x] Install Tiptap and required extensions
- [x] Build RichTextEditor component with formatting toolbar (bold, italic, underline, headings H1-H3, bullet list, ordered list, blockquote, code block, link, image, table, horizontal rule, undo/redo)
- [x] Integrate RichTextEditor into blog post editor (replace plain textarea)
- [x] Integrate RichTextEditor into course lesson editor (replace plain textarea)
- [x] Ensure editor output is stored as HTML and rendered correctly in lesson viewer and blog reader
