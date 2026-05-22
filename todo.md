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
- [ ] Email notifications for enrollment and completion

## Active Work
- [ ] Style course content viewer (LearnCourse page) to match SkillSphere brand
- [ ] Add visual progress tracker sidebar with per-module completion and overall percentage
- [ ] Build completion certificate with Dr. Vicki Bealman as issuer, SkillSphere logo and tagline
- [ ] Certificate download as printable HTML/PDF when learner reaches 100% completion
- [ ] Subscription management UI
- [ ] Bundle purchase flow
- [ ] AI-powered course recommendations
