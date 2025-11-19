import React from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Label } from './Label';
import { Checkbox } from './Checkbox';

const defaultSocialLinks = [
  { id: '1', name: 'X', iconSrc: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/x.svg', href: '#x' },
  { id: '2', name: 'Instagram', iconSrc: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/instagram.svg', href: '#instagram' },
  { id: '3', name: 'LinkedIn', iconSrc: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/linkedin.svg', href: '#linkedin' },
];

export const ContactSection = ({
  title = "We can turn your dream project into reality",
  mainMessage = "Let's talk! 👋",
  contactEmail = "hello@linoslms.com",
  socialLinks = defaultSocialLinks,
  backgroundImageSrc = "https://images.unsplash.com/photo-1742273330004-ef9c9d228530?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDY0fENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=900",
  onSubmit,
  onBackToLogin,
}) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: '',
    projectType: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (type, checked) => {
    setFormData((prev) => {
      const currentTypes = prev.projectType;
      if (checked) {
        return { ...prev, projectType: [...currentTypes, type] };
      } else {
        return { ...prev, projectType: currentTypes.filter((t) => t !== type) };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
    console.log("Form submitted:", formData);
    // You might want to add a success message or clear the form here
  };

  const projectTypeOptions = [
    'Laboratory Management', 'Patient Tracking', 'Specimen Management', 'Test Processing',
    'Result Management', 'User Management', 'Reporting & Analytics', 'API Integration',
    'HIPAA Compliance', 'Other'
  ];

  return (
    <section className="relative min-h-screen w-screen overflow-hidden bg-background">
      {/* Background Image and Animated Bubbles */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out"
        style={{ backgroundImage: `url(${backgroundImageSrc})` }}
      >
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Animated Bubbles */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/20 rounded-full animate-pulse opacity-60"
              style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${Math.random() * 20 + 10}s`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-between w-full h-full p-4 md:p-8 lg:p-12">
        {/* Top Navigation (simplified for this component) */}
        <nav className="w-full max-w-7xl flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg mb-8">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl text-white">Linos LMS</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {['Services', 'Features', 'About', 'Docs'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-white hover:text-blue-300 transition-colors">
                {item}
              </a>
            ))}
            {onBackToLogin && (
              <Button variant="outline" className="text-white border-white hover:bg-white/20" onClick={onBackToLogin}>
                Back to Login
              </Button>
            )}
            <Button variant="default">Get Started</Button>
          </div>
          <Button variant="default" className="md:hidden">Menu</Button>
        </nav>

        {/* Main Section - Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl p-4 md:p-8 rounded-xl flex-grow">
          {/* Left Side: Title */}
          <div className="flex flex-col justify-end p-4 lg:p-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg max-w-lg">
              {title}
            </h1>
          </div>

          {/* Right Side: Contact Form */}
          <div className="bg-white/90 p-6 md:p-8 rounded-lg shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{mainMessage}</h2>

            {/* Email & Socials */}
            <div className="mb-6">
              <p className="text-gray-600 mb-2">Mail us at</p>
              <a href={`mailto:${contactEmail}`} className="text-blue-600 hover:underline font-medium">
                {contactEmail}
              </a>
              <div className="flex items-center space-x-3 mt-4">
                <span className="text-gray-600">OR</span>
                {socialLinks.map((link) => (
                  <Button key={link.id} variant="outline" size="icon" asChild>
                    <a href={link.href} aria-label={link.name}>
                      <img src={link.iconSrc} alt={link.name} className="h-4 w-4" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            <hr className="my-6 border-gray-300" />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-gray-600">Leave us a brief message</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your name</Label>
                  <Input id="name" name="name" placeholder="Your name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Briefly describe your project idea...</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Briefly describe your project idea..."
                  className="min-h-[80px]"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">I'm looking for...</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {projectTypeOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.replace(/\s/g, '-').toLowerCase()}
                        checked={formData.projectType.includes(option)}
                        onCheckedChange={(checked) => handleCheckboxChange(option, checked)}
                      />
                      <Label htmlFor={option.replace(/\s/g, '-').toLowerCase()} className="text-sm font-normal text-gray-700">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Send a message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};