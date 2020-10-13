import React, { useState } from 'react';
import './App.scss';
import CSVReader from 'react-csv-reader';

function App() {
  const [billingData, setBillingData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [missingPayments, setMissingPayments] = useState(null);
  const [missingBillings, setMissingBillings] = useState(null);

  const getDiscrepancies = () => {
    try {
      if (billingData.length === 0 || paymentData.length === 0) {
        throw new Error('Could not get data from one or more files. Please check files and try again.');
      }

      let billingMap = {};
      let paymentMap = {};

      billingData
        .filter(record => record['consumer_pid'])
        .forEach(record => {
          let pid = record['consumer_pid'];
          if (pid.length > 8) {
            pid = pid.substring(pid.length - 8);
          }
          billingMap[pid] = record;
        });
      paymentData
        .filter(record => record['PID'])
        .forEach(record => {
          let pid = record['PID'];
          if (pid.length > 8) {
            pid = pid.substring(pid.length - 8);
          }
          paymentMap[pid] = record;
        });

      let missingPayments = Object.entries(billingMap)
        .filter(([pid, client]) => !paymentMap[pid]) // appears in billing but not in payment
        .map(([pid, client]) => client);

      let missingBillings = Object.entries(paymentMap)
        .filter(([pid, client]) => !billingMap[pid]) // appears in payment but not in billing
        .map(([pid, client]) => client);

      setMissingPayments(missingPayments);
      setMissingBillings(missingBillings);

      setBillingData(null);
      setPaymentData(null);
    } catch (err) {
      console.log(err);
      alert('Something went wrong...');
    }
  };

  const displayMissingPayments = () => {
    return missingPayments.map((client, index) => {
      return (
        <div className='results-row' key={index}>
          <p>{client.consumer_name}</p>
          <p>{client.consumer_pid}</p>
          <p>{client.service_start_date}</p>
          <p>{client.service_end_date}</p>
          <p>{client.sce}</p>
        </div>
      );
    });
  };

  const displayMissingBillings = () => {
    return missingBillings.map((client, index) => {
      return (
        <div className='results-row' key={index}>
          <p>{client['Consumer']}</p>
          <p>{client['PID']}</p>
          <p>{client['Start Date']}</p>
          <p>{client['End Date']}</p>
        </div>
      );
    });
  };

  return (
    <div className='App'>
      <div className='header'>
        <p>BILLING RECONCILIATION</p>
      </div>

      <div className='content'>
        <div className='file-upload-container'>
          <div className='file-upload'>
            <div className='file-upload-header'>
              <div className='number-circle'>1</div>
              <div>Upload Billing File</div>
            </div>
            <div className='file-upload-content'>
              <CSVReader
                onFileLoaded={data => setBillingData(data)}
                parserOptions={{ header: true, skipEmptyLines: true }}
              />
            </div>
          </div>
          <span />
          <div className='file-upload'>
            <div className='file-upload-header'>
              <div className='number-circle'>2</div>
              <div>Upload Payment File</div>
            </div>
            <div className='file-upload-content'>
              <CSVReader
                onFileLoaded={data => setPaymentData(data)}
                parserOptions={{ header: true, skipEmptyLines: true }}
              />
            </div>
          </div>
          <span />
          <div className='file-upload'>
            <div className='file-upload-header'>
              <div className='number-circle'>3</div>
              <div>Check for discrepancies</div>
            </div>
            <div className='file-upload-content'>
              <button
                className='check-button'
                onClick={getDiscrepancies}
                disabled={!billingData || !paymentData ? true : false}
              >
                Check
              </button>
            </div>
          </div>
        </div>

        <div className='results-container'>
          <div className='results-container-header'>
            <div className='number-circle'>4</div>
            <div>View / Export Discrepancies</div>
          </div>
          <div className='results-container-content'>
            {missingPayments && missingBillings && (
              <>
                <div className='results-section'>
                  <div className='results-section-header'>
                    <p className='discrepancy-type'>Missing Payments</p>
                    <p className='discrepancy-type-description'>Billed for but no payment received</p>
                  </div>
                  <div className='results'>
                    {missingPayments.length > 0 ? (
                      <>
                        <div className='results-header'>
                          <p>Client Name</p>
                          <p>PID</p>
                          <p>Service Start</p>
                          <p>Service End</p>
                          <p>Support Coordinator</p>
                        </div>
                        <div className='results-row-container'>{displayMissingPayments()}</div>
                      </>
                    ) : (
                      <div className='no-discrepancies-container'>
                        <i className='far fa-check-square'></i>
                        <p>All good! No discrepancies.</p>
                      </div>
                    )}
                  </div>
                </div>

                <span className='section-divider'></span>

                <div className='results-section'>
                  <div className='results-section-header'>
                    <p className='discrepancy-type'>Missing Billings</p>
                    <p className='discrepancy-type-description'>Payment received but not billed for</p>
                  </div>
                  <div className='results'>
                    {missingBillings.length > 0 ? (
                      <>
                        <div className='results-header'>
                          <p>Client Name</p>
                          <p>PID</p>
                          <p>Service Start</p>
                          <p>Service End</p>
                        </div>
                        <div className='results-row-container'>{displayMissingBillings()}</div>
                      </>
                    ) : (
                      <div className='no-discrepancies-container'>
                        <i className='far fa-check-square'></i>
                        <p>All good! No discrepancies.</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className='made-with-container'>
            Made with{' '}
            <span className='heart-emoji' role='img' aria-label='heart-emoji'>
              ❤️
            </span>{' '}
            by{' '}
            <a href='https://github.com/motogoozy' target='_blank' rel='noopener noreferrer' className='signature-link'>
              motogoozy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
