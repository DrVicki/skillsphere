import { Link } from "wouter";

const LOGO_URL = "/manus-storage/skillsphere-logo_e90b0563.png";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <img src={LOGO_URL} alt="SkillSphere" className="h-12 w-auto mb-4 brightness-0 invert" />
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              Empowering professionals and organizations to learn, collaborate, and advance workforce capabilities through world-class online education.
            </p>
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
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
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
