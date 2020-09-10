import React, { useState } from 'react';
import './App.scss';

import CSVReader from 'react-csv-reader';
import { CSVLink } from 'react-csv';

function App() {
  const [selectedTab, setSelectedTab] = useState('billing');

  return (
    <div className='App'>
      <div className='header'>
        <p className={selectedTab === 'billing' ? 'active-header-tab' : ''} onClick={() => setSelectedTab('billing')}>
          BILLING
        </p>
        <p className={selectedTab === 'payments' ? 'active-header-tab' : ''} onClick={() => setSelectedTab('payments')}>
          PAYMENTS
        </p>
      </div>

      <div className='main-content'>
        <div className='file-upload-container'>
          <div className='file-upload'>
            <div className='file-upload-header'>
              <div className='number-circle'>1</div>
              <div>Upload DSPD File</div>
            </div>
          </div>
          <div className='file-upload'>
            <div className='file-upload-header'>
              <div className='number-circle'>2</div>
              <div>Upload Keystone File</div>
            </div>
          </div>
          <div className='file-upload'>
            <div className='file-upload-header'>
              <div className='number-circle'>3</div>
              <div>Check for discrepancies</div>
            </div>
          </div>
        </div>

        <div className='results-container'>
          <div className='results-container-header'>
            <div className='number-circle'>4</div>
            <div>View / Export Results</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
