import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

function Popup({onClose, dataOne, dataTwo}) {
  return (
    <div className="popup">
        <div className="popup-content">
            <h2>Save Data</h2>
            <p>On which database you want to save?</p>
            <div className="buttons">
                <button className="btn" onClick={dataOne}>Database 1</button>
                <button className="btn" onClick={dataTwo}>Database 2</button>
            </div>
            <button className="close" onClick={onClose}>
                <FontAwesomeIcon
                icon={faClose}
                style={{ color: '#000', width: '25px', height: '25px' }}
                />
            </button>
        </div>
    </div>
  )
}

export default Popup