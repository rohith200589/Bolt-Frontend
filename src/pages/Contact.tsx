import React, { useState } from 'react';
import MessageModal from '../components/MessageModal'; // Correct path

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Contact form submitted:', formData);
    setAlertMessage('Your message has been sent successfully!');
    setAlertType('success');
    setShowAlert(true);
    setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
  };

  const closeAlert = () => {
    setShowAlert(false);
    setAlertMessage('');
  };

  return (
    <div className="bg-[var(--color-background-secondary)] p-8 rounded-2xl shadow-lg fade-in max-w-2xl mx-auto">
      {showAlert && <MessageModal message={alertMessage} type={alertType} onClose={closeAlert} />}

      <h1 className="text-4xl font-bold mb-8 text-[var(--color-text-primary)] text-center">Contact Us</h1>
      <p className="text-lg leading-relaxed mb-8 text-[var(--color-text-secondary)] text-center">
        Have questions, feedback, or just want to say hello? We'd love to hear from you!
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-[var(--color-input-border)]
                       bg-[var(--color-input-bg)] text-[var(--color-text-primary)]
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)]
                       transition-colors duration-200 shadow-sm"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-[var(--color-input-border)]
                       bg-[var(--color-input-bg)] text-[var(--color-text-primary)]
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)]
                       transition-colors duration-200 shadow-sm"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-[var(--color-input-border)]
                       bg-[var(--color-input-bg)] text-[var(--color-text-primary)]
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)]
                       transition-colors duration-200 shadow-sm"
            placeholder="Regarding..."
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-[var(--color-input-border)]
                       bg-[var(--color-input-bg)] text-[var(--color-text-primary)]
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)]
                       transition-colors duration-200 shadow-sm resize-y"
            placeholder="Your message goes here..."
          ></textarea>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-[var(--color-button-primary-bg)] hover:bg-[var(--color-button-primary-hover)] text-white font-semibold py-3 px-8 rounded-full text-lg
                       transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background-secondary)]"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

export default Contact;
