import React, { useEffect, useState } from 'react';
import './ChangeControlDetailModal.css';

const fieldLabels = {
  date_submitted: "📅 Date Submitted",
  date_implemented: "📅 Date Implemented",
  implementation_time: "⏰ Time of Implementation",
  it_team: "🧑‍💻 IT Team",
  scr_ticket_number: "🎫 SCR Ticket #",
  submitter: "📝 Submitter",
  project_name: "📁 Project Name",
  system_impacted: "💻 System Impacted",
  sox_control: "🛡️ SOX Control",
  description: "🧾 Project Description",
  programs_or_jobs_modified: "🧮 Modified Programs/Jobs",
  business_and_users_impacted: "🏢 Impacted Users/Business",
  scope_change_benefit: "📈 Scope Change Benefit",
  chief_record_officer_required: "📋 CRO Required",
  information_security_required: "🔒 InfoSec Required",
  operation_manager_required: "👔 Ops Manager Required",
  emergency_ok: "🚨 Emergency Change?",
  rollback_plan: "🔄 Rollback Plan",
  tested_in_uat: "✅ Tested in UAT",
  production_test_account_used: "🔍 Prod Test Account Used",
  test_account_transactions_reversed: "↩️ Test Txns Reversed",
  zena_manifest_update: "📜 Zena Manifest Updated",
  desk_aid_modification: "🗂️ Desk Aid Modified",
  submitter_approval: "✔️ Submitter Approval",
  manager_approval: "✔️ Manager Approval",
  operations_manager_approval: "✔️ Ops Manager Approval",
  information_security_approval: "✔️ InfoSec Approval",
  chief_record_officer_approval: "✔️ CRO Approval",
  head_of_applications: "✔️ Head of Apps",
  head_of_infrastructure: "✔️ Head of Infrastructure",
  implemented_in_production_by: "✔️ Implemented by Ops"
};

const ChangeControlDetailModal = ({ formId, onBack }) => {
  const [form, setForm] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    fetch(`http://127.0.0.1:8000/change-forms/${formId}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setForm(data))
      .catch(err => console.error("Error fetching form details:", err));
  }, [formId]);

  const patchField = async (field, type = "text") => {
    let newValue = "";

    if (type === "date" || type === "time") {
      const input = document.createElement("input");
      input.type = type;
      input.onchange = async () => {
        newValue = input.value;
        await submitPatch();
      };
      input.click();
      return;
    } else {
      newValue = prompt(`Enter new value for ${fieldLabels[field] || field}:`, form[field]);
      if (!newValue) return;
    }

    const token = sessionStorage.getItem("authToken");

    const submitPatch = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/change-forms/${formId}/`, {
          method: 'PATCH',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ [field]: newValue })
        });

        if (response.ok) {
          const updated = await response.json();
          setForm(updated);
        }
      } catch (error) {
        console.error("Failed to patch form:", error);
      }
    };

    await submitPatch();
  };

  const getInputType = (field) => {
    if (field.includes("date")) return "date";
    if (field.includes("time")) return "time";
    return "text";
  };

  if (!form) return null;

  return (
    <div className="change-detail-wrapper">
      <div className="change-detail-card">
        <div className="change-detail-header">
          <h2>Change Control Form #{form.change_control_form_id}</h2>
          <button className="change-back-button" onClick={onBack}>← Back to List</button>
        </div>

        <div className="change-detail-table">
          {Object.entries(form).map(([field, value]) => (
            <div key={field} className="change-detail-row">
              <div className="change-label">{fieldLabels[field] || field}:</div>
              <div className="change-value">{value?.toString()}</div>
              <div className="change-action">
                <button
                  className="edit-field-btn"
                  onClick={() => patchField(field, getInputType(field))}
                >
                  ✏️ Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChangeControlDetailModal;