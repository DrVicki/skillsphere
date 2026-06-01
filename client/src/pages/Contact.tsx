import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HeadphonesIcon, Building2, HelpCircle } from "lucide-react";

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@myskillsphere.com",
    sub: "We reply within 24 hours",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+1 (800) SKILL-SP",
    sub: "Mon–Fri, 9 AM – 6 PM EST",
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    icon: MapPin,
    label: "Our Office",
    value: "New York, NY 10001",
    sub: "United States",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "24/7 Online Support",
    sub: "Live chat available",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
];

const CATEGORIES = [
  { value: "general", label: "General Inquiry", icon: MessageSquare },
  { value: "support", label: "Technical Support", icon: HeadphonesIcon },
  { value: "billing", label: "Billing & Payments", icon: Building2 },
  { value: "partnerships", label: "Partnerships", icon: Building2 },
  { value: "other", label: "Other", icon: HelpCircle },
];

const FAQ_ITEMS = [
  {
    q: "How do I enroll in a course?",
    a: "Browse our course catalog, click on any course, and select 'Enroll Now'. Free courses are instantly accessible; paid courses require checkout.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes — we offer a 30-day money-back guarantee on all paid courses if you are not satisfied with the content.",
  },
  {
    q: "Do you offer team or corporate plans?",
    a: "Absolutely. We have tailored plans for teams and organizations. Contact us via the Partnerships category and we'll set up a call.",
  },
  {
    q: "How do I become a trainer?",
    a: "Apply through your dashboard after signing in. Our team reviews applications within 3–5 business days.",
  },
];

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: "general" | "support" | "billing" | "partnerships" | "other";
};

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
  category: "general",
};

export default function Contact() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const submit = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setForm(INITIAL_FORM);
      toast.success("Message sent! We'll get back to you soon.");
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to send message. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    submit.mutate(form);
  };

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="brand-gradient text-white py-16 md:py-20">
        <div className="container text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">Get In Touch</Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            We'd Love to{" "}
            <span style={{ color: "#F5B942" }}>Hear From You</span>
          </h1>
          <p className="text-white/80 max-w-xl mx-auto text-lg leading-relaxed">
            Have a question, feedback, or partnership idea? Our team is ready to help you every step of the way.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CONTACT_INFO.map((item) => (
              <Card key={item.label} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-5 text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${item.bg} mb-3`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{item.label}</p>
                  <p className="font-semibold text-foreground text-sm leading-snug">{item.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main: Form + FAQ */}
      <section className="py-16 bg-white flex-1">
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="mb-8">
                <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Send a Message</Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Contact Our Team</h2>
                <p className="text-muted-foreground">Fill out the form below and we'll respond within one business day.</p>
              </div>

              {submitted ? (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <Send className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-green-700 mb-6 max-w-sm mx-auto">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <Button variant="outline" onClick={() => setSubmitted(false)} className="border-green-300 text-green-700 hover:bg-green-100">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name + Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground" htmlFor="contact-name">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="contact-name"
                        placeholder="Jane Smith"
                        value={form.name}
                        onChange={set("name")}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground" htmlFor="contact-email">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="jane@company.com"
                        value={form.email}
                        onChange={set("email")}
                        required
                        className="h-11"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={form.category}
                      onValueChange={(v) => setForm((p) => ({ ...p, category: v as FormState["category"] }))}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground" htmlFor="contact-subject">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="contact-subject"
                      placeholder="How can we help you?"
                      value={form.subject}
                      onChange={set("subject")}
                      required
                      className="h-11"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground" htmlFor="contact-message">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      id="contact-message"
                      placeholder="Tell us more about your question or request..."
                      value={form.message}
                      onChange={set("message")}
                      required
                      rows={6}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground text-right">{form.message.length} / 5000</p>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base font-semibold"
                    disabled={submit.isPending}
                    style={{ background: "linear-gradient(135deg, #1a3a6b 0%, #2563eb 100%)" }}
                  >
                    {submit.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Sending…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* FAQ Sidebar */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <Badge className="mb-3 bg-amber-100 text-amber-700 border-amber-200">Quick Answers</Badge>
                <h2 className="text-2xl font-bold text-foreground mb-2">Frequently Asked</h2>
                <p className="text-muted-foreground text-sm">Common questions answered instantly.</p>
              </div>

              <div className="space-y-4">
                {FAQ_ITEMS.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-5 hover:border-primary/30 hover:bg-primary/5 transition-colors duration-200"
                  >
                    <p className="font-semibold text-foreground text-sm mb-1.5">{item.q}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>

              {/* Response time badge */}
              <div className="mt-8 rounded-xl p-5 text-white text-sm" style={{ background: "linear-gradient(135deg, #1a3a6b 0%, #2563eb 100%)" }}>
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-amber-300 shrink-0" />
                  <span className="font-semibold">Average Response Time</span>
                </div>
                <p className="text-white/80 leading-relaxed">
                  Our support team typically responds within <strong className="text-white">2–4 hours</strong> during business hours and within <strong className="text-white">24 hours</strong> on weekends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
