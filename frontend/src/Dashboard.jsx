import { ArrowRight, LogOut, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import business from "./data/business";
import { useEffect, useState } from "react";


function Dashboard() {
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin") || "null");
    const [leads, setLeads] = useState([]);


      useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/leads",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "authToken"
              )}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch leads");
        }

        const data = await response.json();

        setLeads(data.leads || []);
      } catch (error) {
        console.error("❌ Dashboard lead fetch error:", error);
      }
    };

    fetchLeads();
  }, []);
    const newLeads = leads.filter(
    (lead) => lead.status === "new"
  );

  const contactedLeads = leads.filter(
    (lead) => lead.status === "contacted"
  );

  const closedLeads = leads.filter(
    (lead) => lead.status === "closed"
  );
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("admin");

    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="dashboard-logo">
            <Sparkles size={18} />
          </div>

          <div>
            <strong>{business.brandName}</strong>
            <span>Owner Workspace</span>
          </div>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          <LogOut size={15} />
          Log out
        </button>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-intro">
          <span>OWNER DASHBOARD</span>

          <h1>
            Good to see you,
            <br />
            <em>{admin?.name || "Owner"}.</em>
          </h1>

          <p>
            Manage your {business.brandName} inquiries,
            appointments, and customer conversations.
          </p>
        </div>
        <div className="dashboard-stats">
  <div className="dashboard-stat">
    <span>NEW</span>
    <strong>{newLeads.length}</strong>
    <p>Awaiting response</p>
  </div>

  <div className="dashboard-stat">
    <span>CONTACTED</span>
    <strong>{contactedLeads.length}</strong>
    <p>Follow-ups in progress</p>
  </div>

  <div className="dashboard-stat">
    <span>CLOSED</span>
    <strong>{closedLeads.length}</strong>
    <p>Completed inquiries</p>
  </div>
</div>

        <section className="dashboard-card">
          <div>
            <span className="dashboard-card-label">
              APPOINTMENT INQUIRIES
            </span>

            <h2>Lead Inbox</h2>

            <p>
              View customer inquiries and manage their
              appointment status.
            </p>
          </div>

          <Link to="/leads" className="dashboard-card-link">
            View leads
            <ArrowRight size={16} />
          </Link>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;