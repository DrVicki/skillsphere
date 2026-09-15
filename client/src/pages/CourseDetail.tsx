import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Star, Users, BookOpen, Clock, Award, CheckCircle, Play, FileText,
  ClipboardList, Lock, ArrowRight, Tag
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

interface Props { params: { slug: string } }

export default function CourseDetail({ params }: Props) {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ discountType: string; discountValue: string } | null>(null);

  const { data: course, isLoading } = trpc.courses.bySlug.useQuery(params.slug);
  const { data: modules } = trpc.modules.byCourse.useQuery(course?.id ?? 0, { enabled: !!course?.id });
  const { data: enrollment } = trpc.enrollments.check.useQuery(course?.id ?? 0, { enabled: !!course?.id && isAuthenticated });
  const { data: reviews } = trpc.reviews.byCourse.useQuery(course?.id ?? 0, { enabled: !!course?.id });

  const { data: couponData, refetch: validateCoupon } = trpc.payments.validateCoupon.useQuery(
    { code: couponCode, courseId: course?.id },
    { enabled: false }
  );

  const enrollFree = trpc.enrollments.enrollFree.useMutation({
    onSuccess: () => { toast.success("Enrolled successfully!"); navigate(`/learn/${params.slug}`); },
    onError: (e) => toast.error(e.message),
  });

  const createCheckout = trpc.payments.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) { toast.info("Redirecting to checkout..."); window.open(data.url, "_blank"); }
    },
    onError: (e) => toast.error(e.message),
  });

  const handleApplyCoupon = async () => {
    const result = await validateCoupon();
    if (result.data?.valid && result.data.coupon) {
      setAppliedCoupon(result.data.coupon);
      toast.success("Coupon applied!");
    } else {
      toast.error(result.data?.message ?? "Invalid coupon");
    }
  };

  const getDiscountedPrice = () => {
    if (!course || !appliedCoupon) return parseFloat(course?.price ?? "0");
    const base = parseFloat(course.price ?? "0");
    if (appliedCoupon.discountType === "percent") return base * (1 - parseFloat(appliedCoupon.discountValue) / 100);
    return Math.max(0, base - parseFloat(appliedCoupon.discountValue));
  };

  const handleEnroll = () => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(`/courses/${params.slug}`); return; }
    if (!course) return;
    if (course.isFree) { enrollFree.mutate(course.id); return; }
    createCheckout.mutate({ courseId: course.id, couponCode: appliedCoupon ? couponCode : undefined, origin: window.location.origin });
  };

  const moduleTypeIcon = (type: string) => {
    if (type === "video") return <Play className="h-4 w-4 text-blue-500" />;
    if (type === "assessment") return <ClipboardList className="h-4 w-4 text-purple-500" />;
    return <FileText className="h-4 w-4 text-green-500" />;
  };

  if (isLoading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    </div>
  );

  if (!course) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center flex-col gap-4">
        <h2 className="text-xl font-semibold">Course not found</h2>
        <Button asChild><Link href="/courses">Browse Courses</Link></Button>
      </div>
    </div>
  );

  const isEnrolled = enrollment?.enrolled;
  const price = getDiscountedPrice();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="brand-gradient text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              {course.category && <Badge className="mb-3 bg-white/20 text-white border-white/30">{course.category}</Badge>}
              <h1 className="text-2xl md:text-3xl font-bold mb-3">{course.title}</h1>
              {course.shortDescription && <p className="text-white/80 mb-4">{course.shortDescription}</p>}
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                {course.rating && parseFloat(course.rating) > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <strong className="text-white">{parseFloat(course.rating).toFixed(1)}</strong>
                    <span>({course.ratingCount} reviews)</span>
                  </span>
                )}
                <span className="flex items-center gap-1"><Users className="h-4 w-4" />{course.enrollmentCount?.toLocaleString()} learners</span>
                {course.level && <Badge className="bg-white/20 text-white border-white/30 capitalize">{course.level}</Badge>}
                <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" />{course.totalModules} lessons</span>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="bg-white rounded-xl shadow-xl p-6 text-foreground">
              {course.thumbnailUrl && (
                <img src={course.thumbnailUrl} alt={course.title} className="w-full aspect-video object-cover rounded-lg mb-4" />
              )}
              <div className="mb-4">
                {course.isFree ? (
                  <p className="text-3xl font-bold text-green-600">Free</p>
                ) : (
                  <div>
                    <p className="text-3xl font-bold text-foreground">${price.toFixed(2)}</p>
                    {appliedCoupon && (
                      <p className="text-sm text-muted-foreground line-through">${parseFloat(course.price ?? "0").toFixed(2)}</p>
                    )}
                  </div>
                )}
              </div>

              {isEnrolled ? (
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white" asChild>
                  <Link href={`/learn/${course.slug}`}>
                    Continue Learning <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  {!course.isFree && (
                    <div className="mb-3">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                        <Button variant="outline" size="sm" onClick={handleApplyCoupon}>Apply</Button>
                      </div>
                      {appliedCoupon && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Coupon applied!
                        </p>
                      )}
                    </div>
                  )}
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
                    onClick={handleEnroll}
                    disabled={enrollFree.isPending || createCheckout.isPending}
                  >
                    {enrollFree.isPending || createCheckout.isPending ? "Processing..." : course.isFree ? "Enroll for Free" : `Enroll Now — $${price.toFixed(2)}`}
                  </Button>
                </>
              )}

              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Full lifetime access</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Certificate of completion</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Discussion board access</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Live chat with instructor</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-10 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {/* Description */}
              {course.description && (
                <div>
                  <h2 className="text-xl font-bold mb-3">About This Course</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{course.description}</p>
                </div>
              )}

              {/* Curriculum */}
              {modules && modules.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Course Curriculum</h2>
                  <div className="border border-border rounded-xl overflow-hidden">
                    {modules.map((mod, i) => (
                      <div key={mod.id} className={`flex items-center gap-3 p-4 ${i < modules.length - 1 ? "border-b border-border" : ""} ${isEnrolled || mod.isPreview ? "hover:bg-gray-50" : "opacity-60"}`}>
                        <div className="shrink-0">{moduleTypeIcon(mod.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{mod.title}</p>
                          <p className="text-xs text-muted-foreground capitalize">{mod.type}{mod.duration ? ` · ${Math.round(mod.duration / 60)} min` : ""}</p>
                        </div>
                        <div className="shrink-0">
                          {isEnrolled || mod.isPreview ? (
                            <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs" asChild>
                              <Link href={`/learn/${course.slug}?module=${mod.id}`}>
                                {mod.isPreview ? "Preview" : "Open"}
                              </Link>
                            </Button>
                          ) : (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {reviews && reviews.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Learner Reviews</h2>
                  <div className="space-y-4">
                    {reviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="border border-border rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className={`h-3.5 w-3.5 ${j < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        {review.review && <p className="text-sm text-foreground">{review.review}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar info */}
            <div className="space-y-4">
              <div className="border border-border rounded-xl p-5">
                <h3 className="font-semibold mb-3">Course Includes</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />{course.totalModules} lessons</li>
                  {course.level && <li className="flex items-center gap-2"><Award className="h-4 w-4 text-primary" />Level: {course.level}</li>}
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" />Certificate of completion</li>
                </ul>
              </div>
              {course.tags && Array.isArray(course.tags) && course.tags.length > 0 && (
                <div className="border border-border rounded-xl p-5">
                  <h3 className="font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {(course.tags as string[]).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
