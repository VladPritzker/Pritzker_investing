import React from 'react';
import '../uploadPhoto/uploadphoto.css';

const PhotoUploadModal = ({ onClose, onUpload }) => {
    return (
        <div className="modal" >
            <div className="modal-content" style={{width: '20%', marginTop:'10%'}}>
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Upload Photo</h2>
                <input type="file" onChange={onUpload} />
            </div>
        </div>
    );
};

export default PhotoUploadModal;
