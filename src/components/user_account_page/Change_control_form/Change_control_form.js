import React, { useEffect, useState } from 'react';
import ChangeControlDetailModal from './ChangeControlDetailModal';
import './ChangeControlModal.css';

const ChangeControlListModal = ({ onClose }) => {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      const token = sessionStorage.getItem("authToken");
      try {
        const response = await fetch("http://127.0.0.1:8000/change-forms/", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setForms(data);
        }
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };
    fetchForms();
  }, []);

  return (
    <div className="change-control-overlay">
      {!selectedForm ? (
        <div className="change-control-modal">
          <span className="change-control-close" onClick={onClose}>&times;</span>
          <h2>Change Control Forms</h2>
          <div className="change-control-button-list">
            {forms.map((form) => (
              <button
                key={`form-${form.id}`}
                onClick={() => {
  console.log("Clicked form ID:", form.id); // check log
  setSelectedForm(form.id); // use correct ID
}}
                className="change-control-button"
              >
                Form #{form.change_control_form_id} (ID: {form.id})
              </button>
            ))}
          </div>
        </div>
      ) : (
        <ChangeControlDetailModal
          formId={selectedForm}
          onBack={() => setSelectedForm(null)}
        />
      )}
    </div>
  );
};

export default ChangeControlListModal;