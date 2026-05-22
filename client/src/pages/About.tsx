import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { Target, Eye, Heart, Users, BookOpen, Globe, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const LOGO_URL = "/manus-storage/skillsphere-logo-circle_8ea1006a.png";

const VALUES = [
  { icon: Target, title: "Excellence", desc: "We hold ourselves to the highest standards in every course, interaction, and outcome." },
  { icon: Eye, title: "Transparency", desc: "Open communication and honest feedback build the trust our community depends on." },
  { icon: Heart, title: "Inclusion", desc: "Every professional deserves access to quality education, regardless of background." },
  { icon: Globe, title: "Impact", desc: "We measure success by the real-world skills and careers we help transform." },
];

export default function About() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="brand-gradient text-white py-16 md:py-24">
        <div className="container text-center">
          <img src={LOGO_URL} alt="SkillSphere" className="h-20 w-20 rounded-full object-cover mx-auto mb-6 drop-shadow-2xl bg-white/10" />
          <Badge className="mb-4 bg-white/20 text-white border-white/30">Our Mission</Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 max-w-3xl mx-auto leading-tight">
            Empowering Skills.<br />
            <span style={{ color: "#F5B942" }}>Building Futures.</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed">
            SkillSphere is a secure, interactive platform where professionals and organizations learn, collaborate, and advance workforce capabilities through world-class education.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Who We Are</Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4">A Platform Built for Workforce Excellence</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                SkillSphere was founded on the belief that professional development should be accessible, engaging, and measurable. We partner with expert trainers and organizations to deliver courses that create real, lasting impact in the workplace.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Whether you're an individual looking to advance your career or an organization building a more capable workforce, SkillSphere provides the tools, content, and community to make it happen.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Users className="h-5 w-5 text-primary" /> 10,000+ Active Learners
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <BookOpen className="h-5 w-5 text-primary" /> 200+ Expert Courses
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Globe className="h-5 w-5 text-primary" /> 500+ Organizations
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-border">
              <h3 className="font-bold text-foreground mb-4 text-xl">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed italic text-lg">
                "To provide a secure, interactive platform where professionals and organizations can learn, collaborate, and advance workforce capabilities — empowering every learner to build a better future."
              </p>
              <div className="mt-6 flex gap-2">
                <div className="h-1 w-12 rounded-full" style={{ background: "#2A63BF" }} />
                <div className="h-1 w-6 rounded-full" style={{ background: "#F5B942" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-secondary/20 text-yellow-700 border-secondary/30">Our Values</Badge>
            <h2 className="text-3xl font-bold text-foreground">What Drives Us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value, i) => (
              <div key={value.title} className={`bg-white rounded-xl border border-border p-6 text-center animate-fade-in-up stagger-${i + 1}`}>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 brand-gradient text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Join the SkillSphere Community</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Start your learning journey today or share your expertise as a trainer.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold" asChild>
              <Link href="/courses">Browse Courses <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            {!isAuthenticated && (
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent" asChild>
                <a href={getLoginUrl("/dashboard")}>Create Free Account</a>
              </Button>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
