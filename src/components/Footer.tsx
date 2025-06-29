import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--color-background-secondary)] text-[var(--color-text-secondary)] py-12 mt-20 shadow-lg transition-colors duration-300 border-t border-[var(--color-border)]">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">

        {/* Company Info */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Knovia AI</h3>
          <p className="text-sm leading-relaxed">
            Empowering intelligent learning and personalized paths for a brighter future. Discover knowledge, master subjects, and achieve your academic goals with cutting-edge AI.
          </p>
          <p className="text-sm mt-2">
            &copy; {new Date().getFullYear()} Knovia AI. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Quick Links</h3>
          <ul className="space-y-3">
            <li><a href="#home" className="text-sm hover:text-[var(--color-text-accent)] transition-colors duration-200">Home</a></li>
            <li><a href="#features" className="text-sm hover:text-[var(--color-text-accent)] transition-colors duration-200">Features</a></li>
            <li><a href="#how-it-works" className="text-sm hover:text-[var(--color-text-accent)] transition-colors duration-200">How It Works</a></li>
            <li><a href="#testimonials" className="text-sm hover:text-[var(--color-text-accent)] transition-colors duration-200">Testimonials</a></li>
            <li><a href="#about" className="text-sm hover:text-[var(--color-text-accent)] transition-colors duration-200">About Us</a></li>
          </ul>
        </div>

        {/* Support & Legal */}
        <div>
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Support</h3>
          <ul className="space-y-3">
            <li><a href="#faq" className="text-sm hover:text-[var(--color-text-accent)] transition-colors duration-200">FAQ</a></li>
            <li><a href="#help" className="text-sm hover:text-[var(--color-text-accent)] transition-colors duration-200">Help Center</a></li>
            <li><a href="#contact" className="text-sm hover:text-[var(--color-text-accent)] transition-colors duration-200">Contact Us</a></li>
            <li><a href="#privacy" className="text-sm hover:text-[var(--color-text-accent)] transition-colors duration-200">Privacy Policy</a></li>
            <li><a href="#terms" className="text-sm hover:text-[var(--color-text-accent)] transition-colors duration-200">Terms of Service</a></li>
          </ul>
        </div>

        {/* Connect With Us */}
        <div>
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Connect With Us</h3>
          <ul className="flex justify-center md:justify-start space-x-6 mb-4">
            <li>
              <a href="https://twitter.com/KnoviaAI" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)] transition-colors duration-200">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.37-.83.5-1.75.85-2.73 1.04C18.44 3.74 17.26 3 15.95 3c-2.26 0-4.09 1.83-4.09 4.09 0 .32.04.63.11.93-3.4-.17-6.43-1.8-8.45-4.29-.35.6-.55 1.3-.55 2.05 0 1.42.72 2.68 1.82 3.42-.67-.02-1.3-.2-1.85-.5v.05c0 1.98 1.41 3.62 3.29 4-.34.09-.7.14-1.07.14-.26 0-.52-.03-.77-.07.52 1.63 2.03 2.81 3.82 2.85-1.4 1.1-3.17 1.76-5.09 1.76-.33 0-.66-.02-.98-.06 1.81 1.16 3.96 1.84 6.27 1.84 7.52 0 11.63-6.23 11.63-11.63v-.53c.8-.59 1.49-1.32 2.04-2.15z"/>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://linkedin.com/company/KnoviaAI" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)] transition-colors duration-200">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.51V14.61h-0.023c-0.08-0.14-0.267-0.457-0.627-0.897c-0.34-0.44-0.787-0.957-1.377-1.48c-0.59-0.523-1.287-0.983-2.097-1.38c-0.81-0.397-1.74-0.6-2.827-0.6c-2.327 0-3.493 1.47-3.493 4.397v6.86h-3.51V7.948h3.51v1.656h0.023c0.47-0.72 1.05-1.3 1.74-1.74c0.69-0.44 1.43-0.66 2.22-0.66c1.687 0 2.96 0.543 3.817 1.63c0.857 1.087 1.287 2.56 1.287 4.417v8.08zM4.321 6.365C3.397 6.365 2.652 5.62 2.652 4.696C2.652 3.773 3.397 3.028 4.321 3.028C5.245 3.028 5.99 3.773 5.99 4.696C5.99 5.62 5.245 6.365 4.321 6.365z"/>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://facebook.com/KnoviaAI" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)] transition-colors duration-200">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.505 1.493-3.89 3.776-3.89 1.094 0 2.24.195 2.24.195v2.459h-1.261c-1.247 0-1.624.776-1.624 1.572V12h2.775l-.444 2.891h-2.331v6.987C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://instagram.com/KnoviaAI" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)] transition-colors duration-200">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07c3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.148 3.252-1.691 4.771-4.919 4.919-.265.058-.646.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.07-1.646-.07-4.85s.012-3.584.07-4.85c.148-3.252 1.691-4.771 4.919-4.919.265-.058.646-.07 4.85-.07zm0 2.88c-3.265 0-3.66.014-4.945.07c-2.355.107-3.639 1.381-3.746 3.746-.056 1.285-.07 1.68-.07 4.945s.014 3.66.07 4.945c.107 2.355 1.381 3.639 3.746 3.746 1.285.056 1.68.07 4.945.07s3.66-.014 4.945-.07c2.355-.107 3.639-1.381 3.746-3.746.056-1.285.07-1.68.07-4.945s-.014-3.66-.07-4.945c-.107-2.355-1.381-3.639-3.746-3.746-1.285-.056-1.68-.07-4.945-.07zm0 4.38a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 2.21a2.29 2.29 0 110 4.58 2.29 2.29 0 010-4.58zm7.3-6.52c-.72 0-1.3.58-1.3 1.3s.58 1.3 1.3 1.3 1.3-.58 1.3-1.3-.58-1.3-1.3-1.3z"/>
                </svg>
              </a>
            </li>
          </ul>
          <p className="text-sm">
            Email: <a href="mailto:support@knovia.ai" className="hover:text-[var(--color-text-accent)] transition-colors duration-200">support@knovia.ai</a>
          </p>
          <p className="text-sm">
            Phone: <a href="tel:+1234567890" className="hover:text-[var(--color-text-accent)] transition-colors duration-200">+1 (234) 567-890</a>
          </p>
        </div>

      </div>
      <div className="container mx-auto px-6 mt-10 border-t border-[var(--color-border)] pt-8 text-center text-xs">
        <p>
          "Knowledge is power. Knovia AI empowers you to unlock it."
        </p>
      </div>
    </footer>
  );
};

export default Footer;