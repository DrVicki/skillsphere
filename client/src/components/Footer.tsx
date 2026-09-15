import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const LOGO_URL = "/manus-storage/skillsphere-logo-circle_8ea1006a.png";

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setEmail("");
      toast.success("You're subscribed! Welcome to the SkillSphere community.");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    subscribe.mutate({ email: email.trim() });
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-400 font-medium">
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Thanks for subscribing! We'll keep you updated.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-sm">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="flex-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
      />
      <button
        type="submit"
        disabled={subscribe.isPending}
        className="px-4 py-2 rounded-md text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-60"
        style={{ background: "#2A63BF" }}
      >
        {subscribe.isPending ? "Subscribing…" : "Subscribe"}
      </button>
    </form>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Banner */}
      <div className="border-b border-gray-800">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h3 className="text-white font-semibold text-base mb-1">Stay ahead with SkillSphere</h3>
              <p className="text-sm text-gray-400">Get the latest courses, tips, and workforce insights delivered to your inbox.</p>
            </div>
            <div className="shrink-0">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <img src={LOGO_URL} alt="SkillSphere" className="h-12 w-12 rounded-full object-cover mb-4" />
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              Empowering professionals and organizations to learn, collaborate, and advance workforce capabilities through world-class online education.
            </p>
            <a
              href="https://www.drvickitechtalk.org/"
              target="_blank"
              rel="noreferrer"
              className="group mt-5 inline-flex max-w-xs items-center gap-3 rounded-xl border border-blue-400/25 bg-blue-500/10 px-3.5 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-blue-300/45 hover:bg-blue-500/15"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-400/15 text-sm font-bold text-blue-200">V.</span>
              <span className="min-w-0">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-200/70">More from Dr. Vicki</span>
                <span className="flex items-center gap-1 text-sm font-semibold text-white">Tech Talk <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">↗</span></span>
              </span>
            </a>
            <div className="flex gap-3 mt-4">
              <div className="h-1 w-8 rounded-full" style={{ background: "#2A63BF" }} />
              <div className="h-1 w-4 rounded-full" style={{ background: "#F5B942" }} />
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courses" className="hover:text-white transition-colors">Browse Courses</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">My Learning</Link></li>
              <li><Link href="/trainer" className="hover:text-white transition-colors">Teach on SkillSphere</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><a href="https://www.drvickitechtalk.org/" target="_blank" rel="noreferrer" className="font-medium text-blue-300 hover:text-blue-200 transition-colors">Dr. Vicki's Tech Talk ↗</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} SkillSphere. All rights reserved.</p>
          <p className="italic" style={{ color: "#F5B942" }}>Empowering Skills. Building Futures.</p>
        </div>
      </div>
    </footer>
  );
}
