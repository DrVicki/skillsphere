import { useState } from "react";
import { Star, Users, BookOpen, Loader2 } from "lucide-react";
import { Link } from "wouter";

interface CourseCardProps {
  id: number;
  slug: string;
  title: string;
  shortDescription?: string | null;
  thumbnailUrl?: string | null;
  price?: string | null;
  isFree?: boolean | null;
  level?: string | null;
  category?: string | null;
  rating?: string | null;
  ratingCount?: number | null;
  enrollmentCount?: number | null;
  totalModules?: number | null;
  trainerName?: string | null;
}

export default function CourseCard({
  slug,
  title,
  shortDescription,
  thumbnailUrl,
  price,
  isFree,
  level,
  category,
  rating,
  ratingCount,
  enrollmentCount,
  totalModules,
  trainerName,
}: CourseCardProps) {
  const [enrolling, setEnrolling] = useState(false);

  const levelColors: Record<string, string> = {
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-yellow-100 text-yellow-700",
    advanced: "bg-red-100 text-red-700",
  };

  function handleEnrollClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.stopPropagation();
    e.preventDefault();
    if (enrolling) return;
    setEnrolling(true);
    // Brief delay so the spinner is visible before navigation
    setTimeout(() => {
      window.location.href = `/courses/${slug}`;
    }, 700);
  }

  return (
    <Link href={`/courses/${slug}`}>
      <div className="group bg-card border border-border rounded-xl overflow-hidden card-hover cursor-pointer h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-500 ease-out will-change-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-primary/30" />
            </div>
          )}

          {/* Hover overlay with Enroll Now button */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
            <a
              href={`/courses/${slug}`}
              onClick={handleEnrollClick}
              className={`inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-full shadow-lg translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out active:scale-95 min-w-[120px] justify-center
                ${enrolling
                  ? "bg-primary text-white cursor-not-allowed"
                  : "bg-white text-primary hover:bg-primary hover:text-white"
                }`}
            >
              {enrolling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading…</span>
                </>
              ) : (
                "Enroll Now"
              )}
            </a>
          </div>

          {/* Price badge */}
          <div className="absolute top-3 right-3">
            {isFree ? (
              <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">FREE</span>
            ) : (
              <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-bold px-2.5 py-1 rounded-full shadow-sm">
                ${parseFloat(price ?? "0").toFixed(2)}
              </span>
            )}
          </div>
          {level && (
            <div className="absolute top-3 left-3">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelColors[level] ?? "bg-gray-100 text-gray-600"}`}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {category && (
            <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">{category}</p>
          )}
          <h3 className="font-semibold text-foreground text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {shortDescription && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">{shortDescription}</p>
          )}
          {trainerName && (
            <p className="text-xs text-muted-foreground mb-2">by {trainerName}</p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-2 border-t border-border">
            {rating && parseFloat(rating) > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-foreground">{parseFloat(rating).toFixed(1)}</span>
                {ratingCount && <span>({ratingCount})</span>}
              </span>
            )}
            {enrollmentCount !== null && enrollmentCount !== undefined && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {enrollmentCount.toLocaleString()}
              </span>
            )}
            {totalModules !== null && totalModules !== undefined && (
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {totalModules} lessons
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
