import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  courses, modules, enrollments, moduleProgress,
  payments, subscriptions, bundles, bundleCourses, coupons,
  discussionThreads, discussionReplies, chatMessages, courseReviews,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];
  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };
  textFields.forEach(assignNullable);
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt, lastSignedIn: users.lastSignedIn }).from(users).orderBy(desc(users.createdAt));
}

export async function updateUserProfile(userId: number, data: { name?: string; bio?: string; avatarUrl?: string }) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set(data).where(eq(users.id, userId));
}

export async function updateUserRole(userId: number, role: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ role: role as any }).where(eq(users.id, userId));
}

export async function updateUserStripeCustomerId(userId: number, stripeCustomerId: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ stripeCustomerId }).where(eq(users.id, userId));
}

// ─── Courses ──────────────────────────────────────────────────────────────────

export async function getCourses(opts: {
  search?: string; category?: string; level?: string; isFree?: boolean; isFeatured?: boolean;
  limit?: number; offset?: number; publishedOnly?: boolean; trainerId?: number;
} = {}) {
  const db = await getDb();
  if (!db) return [];
  const conditions: any[] = [];
  if (opts.publishedOnly !== false) conditions.push(eq(courses.isPublished, true));
  if (opts.search) conditions.push(or(like(courses.title, `%${opts.search}%`), like(courses.shortDescription, `%${opts.search}%`)));
  if (opts.category) conditions.push(eq(courses.category, opts.category));
  if (opts.level) conditions.push(eq(courses.level, opts.level as any));
  if (opts.isFree !== undefined) conditions.push(eq(courses.isFree, opts.isFree));
  if (opts.isFeatured !== undefined) conditions.push(eq(courses.isFeatured, opts.isFeatured));
  if (opts.trainerId) conditions.push(eq(courses.trainerId, opts.trainerId));
  return db.select({
    id: courses.id, slug: courses.slug, title: courses.title,
    shortDescription: courses.shortDescription, thumbnailUrl: courses.thumbnailUrl,
    price: courses.price, comparePrice: courses.comparePrice, isFree: courses.isFree,
    level: courses.level, category: courses.category, rating: courses.rating,
    ratingCount: courses.ratingCount, enrollmentCount: courses.enrollmentCount,
    totalModules: courses.totalModules, totalDuration: courses.totalDuration,
    isPublished: courses.isPublished,
    isFeatured: courses.isFeatured,
    trainerId: courses.trainerId, tags: courses.tags, createdAt: courses.createdAt,
    trainerName: users.name,
  }).from(courses).leftJoin(users, eq(courses.trainerId, users.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(courses.enrollmentCount))
    .limit(opts.limit ?? 20)
    .offset(opts.offset ?? 0);
}

export async function getCourseBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select({
    id: courses.id, slug: courses.slug, title: courses.title,
    shortDescription: courses.shortDescription, description: courses.description,
    thumbnailUrl: courses.thumbnailUrl, previewVideoUrl: courses.previewVideoUrl,
    price: courses.price, comparePrice: courses.comparePrice, isFree: courses.isFree,
    level: courses.level, category: courses.category, rating: courses.rating,
    ratingCount: courses.ratingCount, enrollmentCount: courses.enrollmentCount,
    totalModules: courses.totalModules, totalDuration: courses.totalDuration,
    isPublished: courses.isPublished,
    isFeatured: courses.isFeatured,
    trainerId: courses.trainerId, tags: courses.tags, createdAt: courses.createdAt,
    trainerName: users.name, trainerBio: users.bio, trainerAvatar: users.avatarUrl,
  }).from(courses).leftJoin(users, eq(courses.trainerId, users.id))
    .where(eq(courses.slug, slug)).limit(1);
  return result[0];
}

export async function getCourseById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result[0];
}

export async function getCoursesByTrainer(trainerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courses).where(eq(courses.trainerId, trainerId)).orderBy(desc(courses.createdAt));
}

export async function createCourse(data: {
  title: string; slug: string; trainerId: number; description?: string;
  shortDescription?: string; category?: string; level?: string; price?: string;
  isFree?: boolean; thumbnailUrl?: string; tags?: string[];
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(courses).values({
    ...data,
    level: (data.level ?? "beginner") as any,
    isPublished: false,
  });
  return (result as any)[0]?.insertId ?? 0;
}

export async function updateCourse(id: number, data: Record<string, any>) {
  const db = await getDb();
  if (!db) return;
  await db.update(courses).set(data).where(eq(courses.id, id));
}

export async function deleteCourse(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(courses).where(eq(courses.id, id));
}

// ─── Modules ──────────────────────────────────────────────────────────────────

export async function getModulesByCourse(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(modules).where(eq(modules.courseId, courseId)).orderBy(modules.sortOrder);
}

export async function getModuleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(modules).where(eq(modules.id, id)).limit(1);
  return result[0];
}

export async function createModule(data: {
  courseId: number; title: string; type: "video" | "text" | "assessment";
  content?: string; videoUrl?: string; videoKey?: string; duration?: number;
  sortOrder?: number; isPreview?: boolean; assessmentData?: any;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(modules).values({
    courseId: data.courseId, title: data.title, type: data.type,
    content: data.content ?? null, videoUrl: data.videoUrl ?? null,
    videoKey: data.videoKey ?? null, duration: data.duration ?? 0,
    sortOrder: data.sortOrder ?? 0, isPreview: data.isPreview ?? false,
    assessmentData: data.assessmentData ?? null,
  });
  await db.update(courses).set({ totalModules: sql`${courses.totalModules} + 1` }).where(eq(courses.id, data.courseId));
  return (result as any)[0]?.insertId ?? 0;
}

export async function updateModule(id: number, data: Record<string, any>) {
  const db = await getDb();
  if (!db) return;
  await db.update(modules).set(data).where(eq(modules.id, id));
}

export async function deleteModule(id: number, courseId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(modules).where(eq(modules.id, id));
  await db.update(courses).set({ totalModules: sql`GREATEST(${courses.totalModules} - 1, 0)` }).where(eq(courses.id, courseId));
}

// ─── Enrollments ──────────────────────────────────────────────────────────────

export async function getEnrollment(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(enrollments).where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))).limit(1);
  return result[0];
}

export async function getEnrollmentsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(enrollments).where(eq(enrollments.userId, userId)).orderBy(desc(enrollments.enrolledAt));
}

export async function createEnrollment(data: { userId: number; courseId: number; amountPaid?: string; stripePaymentIntentId?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(enrollments).values({
    userId: data.userId, courseId: data.courseId,
    amountPaid: data.amountPaid ?? "0.00",
    stripePaymentIntentId: data.stripePaymentIntentId ?? null,
  });
  await db.update(courses).set({ enrollmentCount: sql`${courses.enrollmentCount} + 1` }).where(eq(courses.id, data.courseId));
  return (result as any)[0]?.insertId ?? 0;
}

// ─── Module Progress ──────────────────────────────────────────────────────────

export async function getModuleProgress(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(moduleProgress).where(and(eq(moduleProgress.userId, userId), eq(moduleProgress.courseId, courseId)));
}

export async function upsertModuleProgress(data: {
  userId: number; moduleId: number; courseId: number;
  isCompleted?: boolean; watchedSeconds?: number;
  assessmentScore?: number; assessmentPassed?: boolean;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(moduleProgress).values({
    userId: data.userId, moduleId: data.moduleId, courseId: data.courseId,
    isCompleted: data.isCompleted ?? false,
    watchedSeconds: data.watchedSeconds ?? 0,
    assessmentScore: data.assessmentScore ?? null,
    assessmentPassed: data.assessmentPassed ?? null,
    completedAt: data.isCompleted ? new Date() : null,
  }).onDuplicateKeyUpdate({
    set: {
      ...(data.isCompleted !== undefined ? { isCompleted: data.isCompleted } : {}),
      ...(data.watchedSeconds !== undefined ? { watchedSeconds: data.watchedSeconds } : {}),
      ...(data.assessmentScore !== undefined ? { assessmentScore: data.assessmentScore } : {}),
      ...(data.assessmentPassed !== undefined ? { assessmentPassed: data.assessmentPassed } : {}),
      ...(data.isCompleted ? { completedAt: new Date() } : {}),
    },
  });

  // Recalculate progress %
  const allModules = await getModulesByCourse(data.courseId);
  const completedMods = await getModuleProgress(data.userId, data.courseId);
  const completedCount = completedMods.filter((p) => p.isCompleted).length;
  const percent = allModules.length > 0 ? Math.round((completedCount / allModules.length) * 100) : 0;
  await db.update(enrollments).set({
    progressPercent: percent,
    lastAccessedAt: new Date(),
    ...(percent === 100 ? { completedAt: new Date() } : {}),
  }).where(and(eq(enrollments.userId, data.userId), eq(enrollments.courseId, data.courseId)));
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export async function createPayment(data: {
  userId: number; courseId?: number; bundleId?: number;
  stripeSessionId?: string; stripePaymentIntentId?: string;
  amount: string; status?: string; couponCode?: string; discountAmount?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(payments).values({
    userId: data.userId,
    courseId: data.courseId ?? null,
    bundleId: data.bundleId ?? null,
    stripeSessionId: data.stripeSessionId ?? null,
    stripePaymentIntentId: data.stripePaymentIntentId ?? null,
    amount: data.amount,
    status: (data.status ?? "pending") as any,
    couponCode: data.couponCode ?? null,
    discountAmount: data.discountAmount ?? "0.00",
  });
}

export async function updatePaymentBySessionId(sessionId: string, data: { status: string; stripePaymentIntentId?: string }) {
  const db = await getDb();
  if (!db) return;
  await db.update(payments).set(data as any).where(eq(payments.stripeSessionId, sessionId));
}

export async function getPaymentsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: payments.id, userId: payments.userId, courseId: payments.courseId,
    amount: payments.amount, status: payments.status, couponCode: payments.couponCode,
    stripeSessionId: payments.stripeSessionId, createdAt: payments.createdAt,
    courseTitle: courses.title, courseSlug: courses.slug,
  }).from(payments).leftJoin(courses, eq(payments.courseId, courses.id))
    .where(eq(payments.userId, userId)).orderBy(desc(payments.createdAt));
}

export async function getAllPayments() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: payments.id, userId: payments.userId, courseId: payments.courseId,
    amount: payments.amount, status: payments.status, createdAt: payments.createdAt,
    userName: users.name, courseTitle: courses.title,
  }).from(payments)
    .leftJoin(users, eq(payments.userId, users.id))
    .leftJoin(courses, eq(payments.courseId, courses.id))
    .orderBy(desc(payments.createdAt)).limit(200);
}

// ─── Subscriptions ────────────────────────────────────────────────────────────

export async function getSubscriptionsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).orderBy(desc(subscriptions.createdAt));
}

export async function upsertSubscription(data: {
  userId: number; stripeSubscriptionId: string; stripePriceId?: string;
  status: string; currentPeriodEnd?: Date;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(subscriptions).values({
    userId: data.userId,
    stripeSubscriptionId: data.stripeSubscriptionId,
    stripePriceId: data.stripePriceId ?? null,
    status: data.status as any,
    currentPeriodEnd: data.currentPeriodEnd ?? null,
  }).onDuplicateKeyUpdate({
    set: { status: data.status as any, currentPeriodEnd: data.currentPeriodEnd ?? null },
  });
}

// ─── Bundles ──────────────────────────────────────────────────────────────────

export async function getBundles() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bundles).where(eq(bundles.isActive, true));
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export async function getCouponByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(coupons).where(eq(coupons.code, code.toUpperCase())).limit(1);
  return result[0];
}

export async function getAllCoupons() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(coupons).orderBy(desc(coupons.createdAt));
}

export async function createCoupon(data: {
  code: string; discountType: "percent" | "fixed"; discountValue: string;
  maxUses?: number; courseId?: number; expiresAt?: Date;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(coupons).values({
    code: data.code.toUpperCase(),
    discountType: data.discountType,
    discountValue: data.discountValue,
    maxUses: data.maxUses ?? null,
    courseId: data.courseId ?? null,
    expiresAt: data.expiresAt ?? null,
    isActive: true,
  });
}

export async function incrementCouponUsage(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(coupons).set({ usedCount: sql`${coupons.usedCount} + 1` }).where(eq(coupons.id, id));
}

// ─── Discussions ──────────────────────────────────────────────────────────────

export async function getThreadsByCourse(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: discussionThreads.id, courseId: discussionThreads.courseId,
    userId: discussionThreads.userId, title: discussionThreads.title,
    body: discussionThreads.body, isPinned: discussionThreads.isPinned,
    replyCount: discussionThreads.replyCount, createdAt: discussionThreads.createdAt,
  }).from(discussionThreads)
    .where(eq(discussionThreads.courseId, courseId))
    .orderBy(desc(discussionThreads.isPinned), desc(discussionThreads.createdAt));
}

export async function getThreadById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(discussionThreads).where(eq(discussionThreads.id, id)).limit(1);
  return result[0];
}

export async function createThread(data: { courseId: number; userId: number; title: string; body: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(discussionThreads).values(data);
  return (result as any)[0]?.insertId ?? 0;
}

export async function getRepliesByThread(threadId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: discussionReplies.id, threadId: discussionReplies.threadId,
    userId: discussionReplies.userId, body: discussionReplies.body,
    isAccepted: discussionReplies.isAccepted, createdAt: discussionReplies.createdAt,
  }).from(discussionReplies)
    .where(eq(discussionReplies.threadId, threadId))
    .orderBy(discussionReplies.createdAt);
}

export async function createReply(data: { threadId: number; courseId: number; userId: number; body: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(discussionReplies).values(data);
  await db.update(discussionThreads).set({ replyCount: sql`${discussionThreads.replyCount} + 1` }).where(eq(discussionThreads.id, data.threadId));
  return (result as any)[0]?.insertId ?? 0;
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export async function getChatMessages(courseId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: chatMessages.id, courseId: chatMessages.courseId,
    userId: chatMessages.userId, message: chatMessages.message,
    createdAt: chatMessages.createdAt,
  }).from(chatMessages)
    .where(eq(chatMessages.courseId, courseId))
    .orderBy(chatMessages.createdAt)
    .limit(limit);
}

export async function createChatMessage(data: { courseId: number; userId: number; message: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(chatMessages).values(data);
  return (result as any)[0]?.insertId ?? 0;
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function getReviewsByCourse(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: courseReviews.id, courseId: courseReviews.courseId,
    userId: courseReviews.userId, rating: courseReviews.rating,
    review: courseReviews.review, createdAt: courseReviews.createdAt,
    userName: users.name,
  }).from(courseReviews).leftJoin(users, eq(courseReviews.userId, users.id))
    .where(eq(courseReviews.courseId, courseId))
    .orderBy(desc(courseReviews.createdAt));
}

export async function createReview(data: { courseId: number; userId: number; rating: number; review?: string }) {
  const db = await getDb();
  if (!db) return;
  await db.insert(courseReviews).values({
    courseId: data.courseId, userId: data.userId,
    rating: data.rating, review: data.review ?? null,
  }).onDuplicateKeyUpdate({ set: { rating: data.rating, review: data.review ?? null } });
  // Update avg rating
  const allReviews = await getReviewsByCourse(data.courseId);
  const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
  await db.update(courses).set({ rating: avg.toFixed(2), ratingCount: allReviews.length }).where(eq(courses.id, data.courseId));
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function getAnalyticsOverview() {
  const db = await getDb();
  if (!db) return null;
  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [courseCount] = await db.select({ count: sql<number>`count(*)` }).from(courses).where(eq(courses.isPublished, true));
  const [enrollCount] = await db.select({ count: sql<number>`count(*)` }).from(enrollments);
  const [revenue] = await db.select({ total: sql<string>`COALESCE(SUM(amount), 0)` }).from(payments).where(eq(payments.status, "completed"));
  const topCourses = await db.select({
    id: courses.id, title: courses.title, enrollmentCount: courses.enrollmentCount,
    revenue: sql<string>`COALESCE(SUM(${payments.amount}), 0)`,
  }).from(courses).leftJoin(payments, and(eq(payments.courseId, courses.id), eq(payments.status, "completed")))
    .where(eq(courses.isPublished, true)).groupBy(courses.id).orderBy(desc(courses.enrollmentCount)).limit(5);
  return {
    totalUsers: userCount?.count ?? 0,
    totalCourses: courseCount?.count ?? 0,
    totalEnrollments: enrollCount?.count ?? 0,
    totalRevenue: revenue?.total ?? "0",
    topCourses,
  };
}

export async function getRevenueByMonth() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    month: sql<string>`DATE_FORMAT(createdAt, '%Y-%m')`,
    revenue: sql<string>`SUM(amount)`,
  }).from(payments).where(eq(payments.status, "completed"))
    .groupBy(sql`DATE_FORMAT(createdAt, '%Y-%m')`)
    .orderBy(sql`DATE_FORMAT(createdAt, '%Y-%m')`);
}

export async function getTrainerAnalytics(trainerId: number) {
  const db = await getDb();
  if (!db) return null;
  const trainerCourses = await getCoursesByTrainer(trainerId);
  const courseIds = trainerCourses.map((c) => c.id);
  if (courseIds.length === 0) return { totalCourses: 0, totalEnrollments: 0, totalRevenue: "0", avgRating: "0", courses: [] };
  const idList = courseIds.join(",");
  const [enrollCount] = await db.select({ count: sql<number>`count(*)` }).from(enrollments).where(sql`${enrollments.courseId} IN (${sql.raw(idList)})`);
  const [revenue] = await db.select({ total: sql<string>`COALESCE(SUM(amount), 0)` }).from(payments).where(and(sql`${payments.courseId} IN (${sql.raw(idList)})`, eq(payments.status, "completed")));
  const [avgRating] = await db.select({ avg: sql<string>`AVG(rating)` }).from(courses).where(eq(courses.trainerId, trainerId));
  return {
    totalCourses: courseIds.length,
    totalEnrollments: enrollCount?.count ?? 0,
    totalRevenue: revenue?.total ?? "0",
    avgRating: avgRating?.avg ?? "0",
    courses: trainerCourses,
  };
}

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export async function getBlogPosts(opts: {
  publishedOnly?: boolean; limit?: number; offset?: number; category?: string;
} = {}) {
  const { blogPosts } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) return [];
  const conditions: any[] = [];
  if (opts.publishedOnly) conditions.push(eq(blogPosts.isPublished, true));
  if (opts.category) conditions.push(eq(blogPosts.category, opts.category));
  return db.select({
    id: blogPosts.id, title: blogPosts.title, slug: blogPosts.slug,
    excerpt: blogPosts.excerpt, coverImageUrl: blogPosts.coverImageUrl,
    category: blogPosts.category, tags: blogPosts.tags,
    isPublished: blogPosts.isPublished, isFeatured: blogPosts.isFeatured,
    viewCount: blogPosts.viewCount, publishedAt: blogPosts.publishedAt,
    createdAt: blogPosts.createdAt, updatedAt: blogPosts.updatedAt,
    authorId: blogPosts.authorId, authorName: users.name,
  }).from(blogPosts).leftJoin(users, eq(blogPosts.authorId, users.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(blogPosts.createdAt))
    .limit(opts.limit ?? 50)
    .offset(opts.offset ?? 0);
}

export async function getBlogPostBySlug(slug: string) {
  const { blogPosts } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select({
    id: blogPosts.id, title: blogPosts.title, slug: blogPosts.slug,
    excerpt: blogPosts.excerpt, content: blogPosts.content,
    coverImageUrl: blogPosts.coverImageUrl, category: blogPosts.category,
    tags: blogPosts.tags, isPublished: blogPosts.isPublished,
    isFeatured: blogPosts.isFeatured, viewCount: blogPosts.viewCount,
    publishedAt: blogPosts.publishedAt, createdAt: blogPosts.createdAt,
    updatedAt: blogPosts.updatedAt, authorId: blogPosts.authorId,
    authorName: users.name, authorAvatar: users.avatarUrl,
  }).from(blogPosts).leftJoin(users, eq(blogPosts.authorId, users.id))
    .where(eq(blogPosts.slug, slug)).limit(1);
  return result[0];
}

export async function getBlogPostById(id: number) {
  const { blogPosts } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result[0];
}

export async function createBlogPost(data: {
  authorId: number; title: string; slug: string; content: string;
  excerpt?: string; coverImageUrl?: string; category?: string;
  tags?: string[]; isPublished?: boolean; isFeatured?: boolean;
}) {
  const { blogPosts } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(blogPosts).values({
    ...data,
    isPublished: data.isPublished ?? false,
    isFeatured: data.isFeatured ?? false,
    publishedAt: data.isPublished ? new Date() : null,
  });
  return (result as any)[0]?.insertId ?? 0;
}

export async function updateBlogPost(id: number, data: Record<string, any>) {
  const { blogPosts } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) return;
  if (data.isPublished && !data.publishedAt) data.publishedAt = new Date();
  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
}

export async function deleteBlogPost(id: number) {
  const { blogPosts } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) return;
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

// ─── Contact Messages ─────────────────────────────────────────────────────────

export async function createContactMessage(data: {
  name: string; email: string; subject: string; message: string;
  category?: "general" | "support" | "billing" | "partnerships" | "other";
}) {
  const { contactMessages } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(contactMessages).values({
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
    category: data.category ?? "general",
    status: "new",
  });
  return (result as any)[0]?.insertId ?? 0;
}

export async function getContactMessages(opts: { limit?: number; offset?: number } = {}) {
  const { contactMessages } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactMessages)
    .orderBy(desc(contactMessages.createdAt))
    .limit(opts.limit ?? 50)
    .offset(opts.offset ?? 0);
}
