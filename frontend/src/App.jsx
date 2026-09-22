import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Menu,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { Routes, Route } from "react-router-dom";
import LeadInbox from "./LeadInbox";
import Login from "./Login";
import "./App.css";
import business from "./data/business";
import ProtectedRoute from "./ProtectedRoute";
import Signup from "./Signup";
import Dashboard from "./Dashboard";




const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000"
}/api/chat`;

const LEADS_API = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000"
}/api/leads`;
function SmileCareWebsite() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingMode, setBookingMode] = useState(false);
  const [bookingStep, setBookingStep] = useState(null);

const [lead, setLead] = useState({
  name: "",
  phone: "",
  treatment: "",
});

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        `Hi! 👋 I'm ${business.brandName}'s AI Receptionist. How can I help you today?`,
    },
  ]);


const services = business.services;

  // =========================
  // SEND MESSAGE TO BACKEND
  // =========================

  const startBooking = () => {
  setBookingMode(true);
  setBookingStep("name");

  setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      content:
        "Absolutely! I'd be happy to help you get started. 😊 May I have your name?",
    },
  ]);
};

const handleBookingMessage = async (text) => {
  const cleanText = text.trim();

  if (!cleanText) return;

  // STEP 1 — NAME
  if (bookingStep === "name") {
    setLead((prev) => ({
      ...prev,
      name: cleanText,
    }));

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: cleanText,
      },
      {
        role: "assistant",
        content:
          `Thanks, ${cleanText}! What's the best phone number for the clinic to reach you?`,
      },
    ]);

    setBookingStep("phone");
    setMessage("");
    return;
  }

  // STEP 2 — PHONE
  if (bookingStep === "phone") {
    const phone = cleanText.replace(/\D/g, "");

    if (phone.length < 10) {
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: cleanText,
        },
        {
          role: "assistant",
          content:
            "Could you please provide a valid 10-digit phone number?",
        },
      ]);

      setMessage("");
      return;
    }

    setLead((prev) => ({
      ...prev,
      phone,
    }));

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: cleanText,
      },
      {
        role: "assistant",
        content:
          "Perfect. What treatment or service are you interested in?",
      },
    ]);

    setBookingStep("treatment");
    setMessage("");
    return;
  }

  // STEP 3 — TREATMENT
  if (bookingStep === "treatment") {
  const updatedLead = {
    ...lead,
    treatment: cleanText,
  };

  setLead(updatedLead);

  setMessages((prev) => [
    ...prev,
    { role: "user", content: cleanText },
    {
      role: "assistant",
      content:
        `Thank you, ${updatedLead.name}! ✨ I've captured your request for ${cleanText}. Our team can contact you at ${updatedLead.phone}.`,
    },
  ]);

  setBookingStep("complete");
  setMessage("");

  console.log("🎯 NEW LEAD:", updatedLead);

  // Save lead to MongoDB
  try {
    const response = await fetch(LEADS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedLead),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to save lead");
    }

    console.log("✅ Lead saved to MongoDB:", data);

    // Booking is complete; return to normal AI chat mode.
    setBookingMode(false);
    setBookingStep("complete");
    setLead({
      name: "",
      phone: "",
      treatment: "",
    });
  } catch (error) {
    console.error("❌ Failed to save lead:", error);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "I couldn't save your appointment request right now. Please try again in a moment.",
      },
    ]);
  }

  return;
}
};

  const sendMessage = async (text = message) => {
    const cleanMessage = text.trim();

    if (!cleanMessage || loading) return;
    if (bookingMode) {
      await handleBookingMessage(cleanMessage);
      return;
    }

const bookingKeywords = [
  "book",
  "appointment",
  "schedule",
  "visit",
];

const wantsBooking = bookingKeywords.some((keyword) =>
  cleanMessage.toLowerCase().includes(keyword)
);

if (wantsBooking) {
  setMessages((prev) => [
    ...prev,
    {
      role: "user",
      content: cleanMessage,
    },
  ]);

  setBookingMode(true);
  setBookingStep("name");
  setMessage("");

  setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      content:
        "Absolutely! I'd be happy to help you get started. 😊 May I have your name?",
    },
  ]);

  return;
}

    // Add customer's message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: cleanMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: cleanMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to connect to AI receptionist.");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ||
            "I'm sorry, I couldn't generate a response right now.",
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // QUICK ACTIONS
  // =========================

  const handleQuickAction = (text) => {
    sendMessage(text);
  };

  // =========================
  // ENTER KEY
  // =========================

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="site">
      {/* =========================
          NAVBAR
      ========================= */}

      <header className="navbar">
        <div className="nav-inner">
          <a href="#" className="brand">
            <div className="brand-mark">S</div>

            <div>
<span className="brand-name">{business.brandName}</span>            </div>
          </a>

          <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#services" onClick={() => setMenuOpen(false)}>
              Treatments
            </a>

            <a href="#experience" onClick={() => setMenuOpen(false)}>
              Our Approach
            </a>

            <a href="#reviews" onClick={() => setMenuOpen(false)}>
              Patient Stories
            </a>

            <a href="#contact" onClick={() => setMenuOpen(false)}>
              Contact
            </a>

            <button
              className="nav-book"
              onClick={() => setChatOpen(true)}
            >
              Book a Visit
              <ArrowRight size={16} />
            </button>
          </nav>

          <button
            className="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* =========================
          HERO
      ========================= */}

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              {business.tagline}
            </div>

            <h1>
              Your smile deserves
              <span> exceptional care.</span>
            </h1>

            <p className="hero-description">
              Thoughtful dental care, modern technology, and a comfortable
              experience designed around you.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={() => setChatOpen(true)}
              >
                Book your visit
                <ArrowRight size={18} />
              </button>

              <button
                className="secondary-button"
                onClick={() => setChatOpen(true)}
              >
                <MessageCircle size={18} />
                Ask our AI Receptionist
              </button>
            </div>

            <div className="trust-row">
              <div className="trust-item">
                <CheckCircle2 size={18} />
                <span>Patient-first care</span>
              </div>

              <div className="trust-item">
                <CheckCircle2 size={18} />
                <span>Modern treatment</span>
              </div>

              <div className="trust-item">
                <CheckCircle2 size={18} />
                <span>Easy appointments</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-card">
              <div className="image-overlay" />

              <div className="hero-floating-card">
                <div className="floating-icon">
                  <CalendarDays size={20} />
                </div>

                <div>
                  <span>Appointments</span>
<strong>
  {business.appointment.available
    ? "Now available"
    : "Currently unavailable"}
</strong>                </div>

                <ArrowRight size={18} />
              </div>

              <div className="hero-location">
                <MapPin size={15} />
<span>{business.location}</span>              </div>
            </div>

            <div className="hero-stat">
              <strong>4.9</strong>

              <div>
                <div className="stars">
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                </div>

                <span>Trusted patient experience</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            INTRO
        ========================= */}

        <section className="intro" id="experience">
          <div className="section-label">{business.brandName.toUpperCase()} DIFFERENCE</div>

          <div className="intro-grid">
            <h2>
              Dentistry that feels
              <em> genuinely human.</em>
            </h2>

            <div className="intro-copy">
              <p>
                We believe great dentistry isn't only about treatment. It's
                about listening, explaining your options clearly, and making
                every visit feel comfortable.
              </p>

              <a href="#services" className="text-link">
                Explore our treatments
                <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </section>

        {/* =========================
            SERVICES
        ========================= */}

        <section className="services-section" id="services">
          <div className="section-heading">
            <div>
              <div className="section-label">WHAT WE DO</div>

              <h2>
                Care for every
                <br />
                <em>stage of your smile.</em>
              </h2>
            </div>

            <p>
              From preventive care to restorative treatments, our services are
              designed around your comfort and long-term oral health.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service) => (
              <article className="service-card" key={service.title}>
                <span className="service-number">{service.icon}</span>

                <div className="service-arrow">
                  <ArrowRight size={19} />
                </div>

                <div className="service-content">
                  <h3>{service.title}</h3>

                  <p>{service.description}</p>

                  <button onClick={() => setChatOpen(true)}>
                    Learn more
                    <ArrowRight size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* =========================
            EXPERIENCE
        ========================= */}

        <section className="experience">
          <div className="experience-card">
            <div className="experience-content">
              <div className="section-label">YOUR VISIT</div>

              <h2>
                Simple from
                <br />
                <em>start to smile.</em>
              </h2>

              <p>
                From your first question to your appointment, we make getting
                care straightforward.
              </p>

              <div className="experience-points">
                <div>
                  <div className="point-icon">
                    <MessageCircle size={18} />
                  </div>

                  <div>
                    <strong>Ask anything</strong>
                    <span>Our AI receptionist is available anytime.</span>
                  </div>
                </div>

                <div>
                  <div className="point-icon">
                    <CalendarDays size={18} />
                  </div>

                  <div>
                    <strong>Find your time</strong>
<span>{business.appointment.message}</span>                  </div>
                </div>

                <div>
                  <div className="point-icon">
                    <ShieldCheck size={18} />
                  </div>

                  <div>
                    <strong>Feel looked after</strong>
                    <span>Clear communication throughout your care.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="experience-visual">
              <div className="experience-badge">
                <Sparkles size={19} />
                <span>Thoughtful care</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            REVIEWS
        ========================= */}

        <section className="reviews" id="reviews">
          <div className="section-label">PATIENT STORIES</div>

          <div className="reviews-heading">
            <h2>
              A better dental
              <br />
              <em>experience.</em>
            </h2>

            <div className="rating-large">
              <strong>4.9</strong>

              <div>
                <div className="stars">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>

                <span>Patient rating</span>
              </div>
            </div>
          </div>

          <div className="review-card">
            <div className="quote-mark">“</div>

            <p>
              The entire experience felt calm and professional. Everything was
              explained clearly and I never felt rushed.
            </p>

            <div className="review-author">
              <div className="author-avatar">A</div>

              <div>
                <strong>{business.brandName} Patient</strong>
                <span>Verified patient experience</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            CTA
        ========================= */}

        <section className="final-cta" id="contact">
          <div>
            <div className="section-label">READY WHEN YOU ARE</div>

            <h2>
              Let's take care of
              <br />
              <em>your smile.</em>
            </h2>

            <p>
              Have a question? Need an appointment? Our AI receptionist can
              help you get started.
            </p>

            <button
              className="light-button"
              onClick={() => setChatOpen(true)}
            >
              Start a conversation
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="cta-hours">
            <Clock3 size={21} />

            <div>
              <span>Clinic hours</span>
<strong>{business.hours}</strong>            </div>
          </div>
        </section>
      </main>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="footer">
        <div>
          <strong>{business.brandName}</strong>
          <span>{business.brandSubtitle}</span>
        </div>

        <p>{business.tagline}</p>

        <span>© 2026 {business.brandName}</span>
      </footer>

      {/* =========================
          AI RECEPTIONIST BUTTON
      ========================= */}

      <button
        className="ai-fab"
        onClick={() => setChatOpen(true)}
        aria-label="Open AI Receptionist"
      >
        <Sparkles size={20} />
        <span>AI Receptionist</span>
      </button>

      {/* =========================
          AI RECEPTIONIST WINDOW
      ========================= */}

      {chatOpen && (
        <div className="chat-overlay">
          <div
            className="chat-backdrop"
            onClick={() => setChatOpen(false)}
          />

          <div className="chat-window">
            {/* HEADER */}

            <div className="chat-header">
              <div className="chat-brand">
                <div className="chat-logo">
                  <Sparkles size={18} />
                </div>

                <div>
                  <strong>{business.brandName} AI</strong>
                  <span>AI Receptionist · Online</span>
                </div>
              </div>

              <button
                className="chat-close"
                onClick={() => setChatOpen(false)}
              >
                <X size={19} />
              </button>
            </div>

            {/* MESSAGES */}

            <div className="chat-body">
              {bookingMode && bookingStep !== "complete" && (
  <div className="booking-progress">
    <div className="booking-progress-top">
      <span>APPOINTMENT REQUEST</span>
      <strong>
        {bookingStep === "name" && "1 / 3"}
        {bookingStep === "phone" && "2 / 3"}
        {bookingStep === "treatment" && "3 / 3"}
      </strong>
    </div>

    <div className="booking-progress-bar">
      <div
        style={{
          width:
            bookingStep === "name"
              ? "33%"
              : bookingStep === "phone"
              ? "66%"
              : "100%",
        }}
      />
    </div>
  </div>
)}
              {messages.map((item, index) => (
                <div
                  key={index}
                  className={
                    item.role === "user"
                      ? "user-message"
                      : "ai-message"
                  }
                >
                  {item.role === "assistant" && (
                    <span className="message-time">
                      AI RECEPTIONIST
                    </span>
                  )}

                  <p>{item.content}</p>
                </div>
              ))}

              {messages.length === 1 && !loading && (
                <div className="quick-actions">
                  <button
                    onClick={() =>
                      handleQuickAction(
                        "What treatments and services do you provide?"
                      )
                    }
                  >
                    🦷 Explore treatments
                  </button>

                  <button onClick={startBooking}>
  📅 Book an appointment
</button>
                  <button
                    onClick={() =>
                      handleQuickAction(
                        "How much does teeth whitening cost?"
                      )
                    }
                  >
                    💰 Ask about pricing
                  </button>

                  <button
                    onClick={() =>
                      handleQuickAction(
                        "Tell me your clinic location and opening hours."
                      )
                    }
                  >
                    📍 Clinic information
                  </button>
                </div>
              )}

              {loading && (
                <div className="ai-message">
                  <span className="message-time">
                    AI RECEPTIONIST
                  </span>

                  <p className="typing">
                    <span />
                    <span />
                    <span />
                  </p>
                </div>
              )}
            </div>

            {/* INPUT */}

            <form
              className="chat-input-area"
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
            >
              <input
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask us anything..."
                disabled={loading}
              />

              <button
                type="submit"
                disabled={!message.trim() || loading}
                aria-label="Send message"
              >
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="chat-powered">
              <Sparkles size={12} />
              Powered by {business.brandName} AI
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<SmileCareWebsite />} />
        <Route path="/login" element={<Login />} />
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
          <Route path="/signup" element={<Signup />} />


<Route
  path="/leads"
  element={
    <ProtectedRoute>
      <LeadInbox />
    </ProtectedRoute>
  }
/>    </Routes>
  );
}

export default App;