import React, { useState, useEffect } from "react";
import styles from "../Contacts/Contacts.module.css";
import AddContactModal from "./AddContactModal/AddContactModal";
import ConfirmDeleteModal from "../Contacts/ConfirmDeleteModal/ConfirmDeleteModal";
const apiUrl = process.env.REACT_APP_API_URL;

function ContactsModal({ user, onClose }) {
  const [contacts, setContacts] = useState([]);
  const [editContact, setEditContact] = useState(null);
  const [deleteContactId, setDeleteContactId] = useState(null); // State for contact to be deleted
  const [contactDetails, setContactDetails] = useState({
    name: "",
    phone_number: "",
    note: "",
  });
  const [showAddContactModal, setShowAddContactModal] = useState(false); // State for showing add contact modal
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [expandedContactId, setExpandedContactId] = useState(null); // State for expanded contact details

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`${apiUrl}/contacts/${user.id}/`);
        if (response.ok) {
          const data = await response.json();
          setContacts(data);
        } else {
          console.error("Failed to fetch contacts");
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, [user.id]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleEditClick = (contact) => {
    setEditContact(contact);
    setContactDetails({
      name: contact.name,
      phone_number: contact.phone_number,
      note: contact.note,
    });
  };

  const handleDeleteClick = (contactId) => {
    setDeleteContactId(contactId);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/contacts/${user.id}/${deleteContactId}/`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        setContacts(
          contacts.filter((contact) => contact.id !== deleteContactId),
        );
        setDeleteContactId(null); // Close confirmation popup
      } else {
        console.error("Failed to delete contact");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactDetails({ ...contactDetails, [name]: value });
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/contacts/${user.id}/${editContact.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactDetails),
        },
      );
      if (response.ok) {
        const updatedContact = await response.json();
        setContacts(
          contacts.map((contact) =>
            contact.id === updatedContact.id ? updatedContact : contact,
          ),
        );
        setEditContact(null);
      } else {
        console.error("Failed to update contact");
      }
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const handleAddContactClick = () => {
    setShowAddContactModal(true);
    setEditContact(null);
    setContactDetails({
      name: "",
      phone_number: "",
      note: "",
    });
  };

  const handleAddNewContact = (newContact) => {
    setContacts([...contacts, newContact]);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleToggleDetails = (contactId) => {
    if (expandedContactId === contactId) {
      setExpandedContactId(null);
    } else {
      setExpandedContactId(contactId);
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className={styles["contacts-modal"]}>
      <div
        className={styles["contacts-modal-content"]}
        style={{ marginTop: "10%" }}
      >
        <span className={styles["contacts-close"]} onClick={onClose}>
          &times;
        </span>
        <h2>Contacts</h2>
        <button
          className={styles["contacts-add-button"]}
          onClick={handleAddContactClick}
        >
          Add New Contact
        </button>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles["contacts-search-input"]}
        />
        <div className={styles["contacts-list-container"]}>
          {filteredContacts.length > 0 ? (
            <ul className={styles["contacts-list"]}>
              {filteredContacts.map((contact) => (
                <li key={contact.id} className={styles["contacts-item"]}>
                  <div
                    onClick={() => handleToggleDetails(contact.id)}
                    className={styles["contact-summary"]}
                  >
                    <p>
                      <strong>Name:</strong> {contact.name}
                    </p>
                    <span className={styles["expand-arrow"]}>
                      &#9660; Click for full info
                    </span>
                  </div>
                  {expandedContactId === contact.id && (
                    <div className={styles["contact-details"]}>
                      <p>
                        <strong>Phone Number:</strong> {contact.phone_number}
                      </p>
                      <p>
                        <strong>Note:</strong> {contact.note}
                      </p>
                      <button onClick={() => handleEditClick(contact)}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteClick(contact.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No contacts found.</p>
          )}
        </div>
        {editContact && (
          <div className={styles["contacts-edit-form"]}>
            <h3>Edit Contact</h3>
            <input
              type="text"
              name="name"
              value={contactDetails.name}
              onChange={handleInputChange}
              placeholder="Name"
            />
            <input
              type="text"
              name="phone_number"
              value={contactDetails.phone_number}
              onChange={handleInputChange}
              placeholder="Phone Number"
            />
            <input
              type="text"
              name="note"
              value={contactDetails.note}
              onChange={handleInputChange}
              placeholder="Note"
            />
            <button onClick={handleSaveClick}>Save</button>
            <button
              className={styles["cancel-button"]}
              onClick={() => setEditContact(null)}
            >
              Cancel
            </button>
          </div>
        )}
        {showAddContactModal && (
          <AddContactModal
            user={user}
            onClose={() => setShowAddContactModal(false)}
            onSave={handleAddNewContact}
          />
        )}
        {deleteContactId && (
          <ConfirmDeleteModal
            onConfirm={confirmDelete}
            onCancel={() => setDeleteContactId(null)}
          />
        )}
      </div>
    </div>
  );
}

export default ContactsModal;
