import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EnvelopeModal = ({ show, handleClose, handleSendEnvelope, handleDownloadEnvelopes }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    const sendEnvelope = () => {
        // Call the send envelope API
        handleSendEnvelope(email, name);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <button onClick={handleClose}>Close</button>
            <Modal.Header >
                <Modal.Title>Send Envelopes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Send a New Envelope</h5>
                <Form>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Recipient Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter recipient email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Recipient Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter recipient name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="primary" onClick={sendEnvelope}>
                        Send Envelope
                    </Button>
                </Form>

                <hr />

                {/* <h5>Download Completed Envelopes</h5>
                <Button variant="success" onClick={handleDownloadEnvelopes}>
                    Download Completed Envelopes
                </Button> */}
            </Modal.Body>
            {/* <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer> */}
        </Modal>
    );
};

export default EnvelopeModal;
