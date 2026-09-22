import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Phone,
  RefreshCw,
  UserRound,
  LogOut,
} from "lucide-react";

const LEADS_API = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000"
}/api/leads`;
function LeadInbox() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const handleLogout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("admin");

  window.location.href = "/login";
};
  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("authToken");

const response = await fetch(LEADS_API, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

if (!response.ok) {
  throw new Error("Unable to load leads");
}

      const data = await response.json();

      setLeads(data.leads || []);
    } catch (error) {
      console.error("❌ Lead fetch error:", error);
      setError("Unable to load patient inquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  // =========================================
  // UPDATE LEAD STATUS
  // =========================================

  const updateLeadStatus = async (leadId, status) => {
    try {
      const response = await fetch(
        `${LEADS_API}/${leadId}/status`,
        {
          method: "PATCH",
          headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
},
          body: JSON.stringify({
            status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update lead status");
      }

      await fetchLeads();
    } catch (error) {
      console.error(
        `❌ Failed to update lead to ${status}:`,
        error
      );
    }
  };

  return (
    <div className="lead-inbox">

      {/* =========================================
          HEADER
      ========================================= */}

      <header className="inbox-header">
        <div className="inbox-brand">

          <a
            href="/"
            className="inbox-back"
            aria-label="Back to website"
          >
            <ArrowLeft size={17} />
          </a>

          <div className="brand-mark">
            S
          </div>

          <div>
            <span className="brand-name">
              SmileCare
            </span>

            <span className="brand-subtitle">
              Reception Workspace
            </span>
          </div>

        </div>

        <div className="inbox-header-actions">
  <button
    className="refresh-button"
    onClick={fetchLeads}
    disabled={loading}
  >
    <RefreshCw
      size={15}
      className={
        loading ? "refresh-spin" : ""
      }
    />

    Refresh
  </button>

  <button
    className="logout-button"
    onClick={handleLogout}
  >
    <LogOut size={15} />
    Log out
  </button>
</div>
      </header>


      {/* =========================================
          MAIN
      ========================================= */}

      <main className="inbox-main">

        {/* =========================================
            INTRO + SUMMARY
        ========================================= */}

        <div className="inbox-intro">

          <div>

            <div className="section-label">
              PATIENT INQUIRIES
            </div>

            <h1>
              Your reception,
              <br />
              <em>at a glance.</em>
            </h1>

            <p>
              New appointment requests captured by
              your SmileCare AI receptionist.
            </p>

          </div>


          <div className="inbox-summary">

            <div>
              <strong>
                {newLeads.length}
              </strong>

              <span>
                New
              </span>
            </div>

            <div>
              <strong>
                {contactedLeads.length}
              </strong>

              <span>
                Contacted
              </span>
            </div>

            <div>
              <strong>
                {closedLeads.length}
              </strong>

              <span>
                Closed
              </span>
            </div>

          </div>

        </div>


        {/* =========================================
            NEW INQUIRIES
        ========================================= */}

        <section className="lead-list-section">

          <div className="lead-list-heading">
            <div>

              <span>
                NEW INQUIRIES
              </span>

              <strong>
                {newLeads.length}
              </strong>

            </div>
          </div>


          {/* Loading */}

          {loading && (
            <div className="inbox-empty">

              <RefreshCw
                className="refresh-spin"
                size={22}
              />

              <p>
                Loading inquiries...
              </p>

            </div>
          )}


          {/* Error */}

          {!loading && error && (
            <div className="inbox-empty inbox-error">

              <p>
                {error}
              </p>

              <button
                onClick={fetchLeads}
              >
                Try again
              </button>

            </div>
          )}


          {/* No new leads */}

          {!loading &&
            !error &&
            newLeads.length === 0 && (
              <div className="inbox-empty">

                <CheckCircle2 size={24} />

                <p>
                  No new inquiries right now.
                </p>

                <span>
                  New appointment requests
                  will appear here.
                </span>

              </div>
            )}


          {/* New lead cards */}

          {!loading &&
            !error &&
            newLeads.map((lead) => (

              <article
                className="lead-card"
                key={lead._id}
              >

                <div className="lead-card-top">

                  <div className="lead-person">

                    <div className="lead-avatar">
                      <UserRound size={19} />
                    </div>

                    <div>

                      <span className="lead-status">
                        <span />
                        NEW INQUIRY
                      </span>

                      <h2>
                        {lead.name}
                      </h2>

                    </div>

                  </div>


                  <time>
                    {new Date(
                      lead.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </time>

                </div>


                <div className="lead-details">

                  <div>
                    <span>
                      TREATMENT
                    </span>

                    <strong>
                      {lead.treatment}
                    </strong>
                  </div>


                  <div>
                    <span>
                      PHONE
                    </span>

                    <strong>
                      {lead.phone}
                    </strong>
                  </div>


                  <div>
                    <span>
                      RECEIVED
                    </span>

                    <strong>
                      {new Date(
                        lead.createdAt
                      ).toLocaleTimeString(
                        "en-IN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </strong>
                  </div>

                </div>


                {/* NEW LEAD ACTIONS */}

                <div className="lead-actions">

                  <a
                    href={`tel:${lead.phone}`}
                    className="call-lead"
                  >
                    <Phone size={15} />
                    Call patient
                  </a>


                  <button
                    className="contacted-button"
                    onClick={() =>
                      updateLeadStatus(
                        lead._id,
                        "contacted"
                      )
                    }
                  >
                    <Clock3 size={15} />
                    Mark contacted
                  </button>

                </div>

              </article>

            ))}

        </section>


        {/* =========================================
            CONTACTED PATIENTS
        ========================================= */}

        <section className="lead-list-section contacted-section">

          <div className="lead-list-heading">

            <div>

              <span>
                CONTACTED PATIENTS
              </span>

              <strong>
                {contactedLeads.length}
              </strong>

            </div>

          </div>


          {/* No contacted leads */}

          {contactedLeads.length === 0 ? (

            <div className="inbox-empty">

              <CheckCircle2 size={24} />

              <p>
                No contacted patients yet.
              </p>

              <span>
                Leads marked as contacted
                will appear here.
              </span>

            </div>

          ) : (

            contactedLeads.map((lead) => (

              <article
                className="lead-card"
                key={lead._id}
              >

                <div className="lead-card-top">

                  <div className="lead-person">

                    <div className="lead-avatar">
                      <CheckCircle2 size={19} />
                    </div>

                    <div>

                      <span className="lead-status">
                        <span />
                        CONTACTED
                      </span>

                      <h2>
                        {lead.name}
                      </h2>

                    </div>

                  </div>


                  <time>
                    {new Date(
                      lead.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </time>

                </div>


                <div className="lead-details">

                  <div>
                    <span>
                      TREATMENT
                    </span>

                    <strong>
                      {lead.treatment}
                    </strong>
                  </div>


                  <div>
                    <span>
                      PHONE
                    </span>

                    <strong>
                      {lead.phone}
                    </strong>
                  </div>


                  <div>
                    <span>
                      STATUS
                    </span>

                    <strong>
                      Contacted
                    </strong>
                  </div>

                </div>


                {/* CONTACTED LEAD ACTIONS */}

                <div className="lead-actions">

                  <a
                    href={`tel:${lead.phone}`}
                    className="call-lead"
                  >
                    <Phone size={15} />
                    Call patient
                  </a>


                  <button
                    className="contacted-button"
                    onClick={() =>
                      updateLeadStatus(
                        lead._id,
                        "closed"
                      )
                    }
                  >
                    <CheckCircle2 size={15} />
                    Close inquiry
                  </button>

                </div>

              </article>

            ))

          )}

        </section>


        {/* =========================================
            CLOSED INQUIRIES
        ========================================= */}

        <section className="lead-list-section closed-section">

          <div className="lead-list-heading">

            <div>

              <span>
                CLOSED INQUIRIES
              </span>

              <strong>
                {closedLeads.length}
              </strong>

            </div>

          </div>


          {/* No closed leads */}

          {closedLeads.length === 0 ? (

            <div className="inbox-empty">

              <CheckCircle2 size={24} />

              <p>
                No closed inquiries yet.
              </p>

              <span>
                Completed inquiries will
                appear here.
              </span>

            </div>

          ) : (

            closedLeads.map((lead) => (

              <article
                className="lead-card"
                key={lead._id}
              >

                <div className="lead-card-top">

                  <div className="lead-person">

                    <div className="lead-avatar">
                      <CheckCircle2 size={19} />
                    </div>

                    <div>

                      <span className="lead-status">
                        <span />
                        CLOSED
                      </span>

                      <h2>
                        {lead.name}
                      </h2>

                    </div>

                  </div>


                  <time>
                    {new Date(
                      lead.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </time>

                </div>


                <div className="lead-details">

                  <div>
                    <span>
                      TREATMENT
                    </span>

                    <strong>
                      {lead.treatment}
                    </strong>
                  </div>


                  <div>
                    <span>
                      PHONE
                    </span>

                    <strong>
                      {lead.phone}
                    </strong>
                  </div>


                  <div>
                    <span>
                      STATUS
                    </span>

                    <strong>
                      Closed
                    </strong>
                  </div>

                </div>


                <div className="lead-actions">
  <a
    href={`tel:${lead.phone}`}
    className="call-lead"
  >
    <Phone size={15} />
    Call patient
  </a>

  <button
    className="contacted-button"
    onClick={() =>
      updateLeadStatus(
        lead._id,
        "contacted"
      )
    }
  >
    <RefreshCw size={15} />
    Reopen inquiry
  </button>
</div>

              </article>

            ))

          )}

        </section>

      </main>

    </div>
  );
}

export default LeadInbox;