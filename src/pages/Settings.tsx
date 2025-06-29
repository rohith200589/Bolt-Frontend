import React, { useState } from 'react';
import MessageModal from '../components/MessageModal'; // Correct path

const Settings: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataSharingEnabled, setDataSharingEnabled] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');

  const handleSaveSettings = () => {
    // Simulate saving settings
    console.log('Settings saved:', { notificationsEnabled, dataSharingEnabled });
    setAlertMessage('Settings saved successfully!');
    setAlertType('success');
    setShowAlert(true);
  };

  const closeAlert = () => {
    setShowAlert(false);
    setAlertMessage('');
  };

  return (
    <div className="bg-[var(--color-background-secondary)] p-8 rounded-2xl shadow-lg fade-in max-w-3xl mx-auto">
      {showAlert && <MessageModal message={alertMessage} type={alertType} onClose={closeAlert} />}

      <h1 className="text-4xl font-bold mb-8 text-[var(--color-text-primary)] text-center">Settings</h1>

      <div className="space-y-8">
        {/* General Settings */}
        <div className="bg-[var(--color-background-primary)] p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">General Settings</h2>
          <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-b-0">
            <span className="text-lg text-[var(--color-text-primary)]">Enable Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--color-input-border)] rounded-full peer peer-focus:ring-2 peer-focus:ring-[var(--color-text-accent)] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-text-accent)]"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-b-0">
            <span className="text-lg text-[var(--color-text-primary)]">Share Anonymous Usage Data</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={dataSharingEnabled}
                onChange={() => setDataSharingEnabled(!dataSharingEnabled)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--color-input-border)] rounded-full peer peer-focus:ring-2 peer-focus:ring-[var(--color-text-accent)] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-text-accent)]"></div>
            </label>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-[var(--color-background-primary)] p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">Account Settings</h2>
          <button
            onClick={() => alert('Change Password functionality coming soon!')}
            className="w-full text-left py-3 px-4 rounded-lg border border-[var(--color-input-border)]
                       bg-[var(--color-input-bg)] text-[var(--color-text-primary)]
                       hover:bg-[var(--color-hover-light)] transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)]"
          >
            Change Password
          </button>
          <button
            onClick={() => alert('Manage Connected Accounts functionality coming soon!')}
            className="w-full text-left py-3 px-4 rounded-lg border border-[var(--color-input-border)]
                       bg-[var(--color-input-bg)] text-[var(--color-text-primary)]
                       hover:bg-[var(--color-hover-light)] transition-all duration-200 mt-4
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)]"
          >
            Manage Connected Accounts
          </button>
        </div>

        {/* Data Management */}
        <div className="bg-[var(--color-background-primary)] p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">Data Management</h2>
          <button
            onClick={() => alert('Export Data functionality coming soon!')}
            className="w-full text-left py-3 px-4 rounded-lg border border-[var(--color-input-border)]
                       bg-[var(--color-input-bg)] text-[var(--color-text-primary)]
                       hover:bg-[var(--color-hover-light)] transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)]"
          >
            Export My Data
          </button>
          <button
            onClick={() => alert('Delete Account functionality coming soon!')}
            className="w-full text-left py-3 px-4 rounded-lg border border-[var(--color-input-border)]
                       bg-[var(--color-input-bg)] text-red-500
                       hover:bg-[var(--color-hover-light)] transition-all duration-200 mt-4
                       focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete Account
          </button>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={handleSaveSettings}
            className="bg-[var(--color-button-primary-bg)] hover:bg-[var(--color-button-primary-hover)] text-white font-semibold py-3 px-8 rounded-full text-lg
                       transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background-secondary)]"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
