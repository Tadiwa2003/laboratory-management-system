import React from 'react';
import { ContactSection } from '../components/ui/ContactSection';
import { useNavigate } from 'react-router-dom';
import useNotificationStore from '../store/notificationStore';

const Contact = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  const handleFormSubmit = (data) => {
    // Here you would normally send the data to an API
    console.log("Contact form submitted:", data);

    // Show success notification
    addNotification({
      message: 'Thank you for your message! We will get back to you soon.',
      type: 'success'
    });

    // You could redirect to a thank you page or clear the form
    // For now, we'll just show the notification
  };

  const customSocialLinks = [
    {
      id: '1',
      name: 'Twitter',
      iconSrc: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/twitter.svg',
      href: 'https://twitter.com/linoslms'
    },
    {
      id: '2',
      name: 'LinkedIn',
      iconSrc: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/linkedin.svg',
      href: 'https://linkedin.com/company/linoslms'
    },
    {
      id: '3',
      name: 'GitHub',
      iconSrc: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/github.svg',
      href: 'https://github.com/linoslms'
    },
  ];

  return (
    <div className="min-h-screen">
      <ContactSection
        title="Transform Your Laboratory Management Today"
        mainMessage="Ready to get started? Let's connect! 🚀"
        contactEmail="contact@linoslms.com"
        socialLinks={customSocialLinks}
        onSubmit={handleFormSubmit}
        onBackToLogin={() => navigate('/login')}
      />
    </div>
  );
};

export default Contact;