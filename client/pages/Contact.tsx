import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const Contact: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // محاكاة إرسال النموذج
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // إعادة تعيين النموذج بعد 3 ثواني
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      titleAr: 'الهاتف',
      titleEn: 'Phone',
      valueAr: '+962 79 960 0750',
      valueEn: '+962 79 960 0750',
      linkPrefix: 'tel:'
    },
    {
      icon: Mail,
      titleAr: 'البريد الإلكتروني',
      titleEn: 'Email',
      valueAr: 'cilkamt@gmail.com',
      valueEn: 'cilkamt@gmail.com',
      linkPrefix: 'mailto:'
    },
    {
      icon: MapPin,
      titleAr: 'العنوان',
      titleEn: 'Address',
      valueAr: 'عمان، الأردن ',
      valueEn: 'Amman, Jordan',
        linkPrefix: 'https://www.google.com/maps/place/Amman/@31.8359188,35.6179637,10z/data=!3m1!4b1!4m6!3m5!1s0x151b5fb85d7981af:0x631c30c0f8dc65e8!8m2!3d31.9543786!4d35.9105776!16zL20vMGM3emY?entry=ttu&g_ep=EgoyMDI1MDczMC4wIKXMDSoASAFQAw%3D%3D'
    },
    {
      icon: Clock,
      titleAr: 'ساعات العمل',
      titleEn: 'Working Hours',
      valueAr: 'كل الأيام: 8:00 ص - 6:00 م',
      valueEn: 'All Days: 8:00 AM - 6:00 PM',
      linkPrefix: ''
    }
  ];

  const socialMedia = [
    {
      name: 'WhatsApp',
      icon: '📱',
          link: 'https://wa.me/0799600750',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'Facebook',
      icon: '📘',
      link: 'https://www.facebook.com/share/19xANKWK8i/',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Instagram',
      icon: '📷',
      link: 'https://www.instagram.com/irthbiladi?igsh=NWkyemQ5czF0cWJ6',
      color: 'bg-pink-500 hover:bg-pink-600'
    },
    {
      name: 'Twitter',
      icon: '🐦',
      link: 'https://twitter.com/turathfoods',
      color: 'bg-blue-400 hover:bg-blue-500'
    }
  ];

  const subjects = [
    { value: 'general', labelAr: 'استفسار عام', labelEn: 'General Inquiry' },
    { value: 'products', labelAr: 'استفسار عن المنتجات', labelEn: 'Product Inquiry' },
    { value: 'orders', labelAr: 'استفسار عن الطلبات', labelEn: 'Order Inquiry' },
    { value: 'wholesale', labelAr: 'طلبات الجملة', labelEn: 'Wholesale Orders' },
    { value: 'partnership', labelAr: 'الشراكة والتوزيع', labelEn: 'Partnership & Distribution' },
    { value: 'complaints', labelAr: 'شكاوى ومقترحات', labelEn: 'Complaints & Suggestions' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-olive-50 to-olive-100">
      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-olive-600 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {language === 'ar' 
                ? 'نحن هنا للإجابة على استفساراتكم ومساعدتكم في الحصول على أفضل المنتجات التراثية الطبيعية'
                : 'We\'re here to answer your questions and help you get the best natural heritage products'
              }
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
              </h2>
              
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="w-12 h-12 bg-olive-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-olive-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {language === 'ar' ? info.titleAr : info.titleEn}
                      </h3>
                      {info.linkPrefix ? (
                        <a 
                          href={`${info.linkPrefix}${info.valueEn}`}
                          className="text-olive-600 hover:text-olive-700 transition-colors duration-200"
                          target={info.linkPrefix.includes('http') ? '_blank' : undefined}
                          rel={info.linkPrefix.includes('http') ? 'noopener noreferrer' : undefined}
                        >
                          {language === 'ar' ? info.valueAr : info.valueEn}
                        </a>
                      ) : (
                        <p className="text-gray-600">
                          {language === 'ar' ? info.valueAr : info.valueEn}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'تابعونا على' : 'Follow Us'}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${social.color} text-white p-3 rounded-xl text-center transition-all duration-200 hover:scale-105`}
                  >
                    <div className="text-2xl mb-1">{social.icon}</div>
                    <div className="text-sm font-medium">{social.name}</div>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-olive-600 to-olive-700 rounded-2xl shadow-soft p-6 text-white">
              <h3 className="text-xl font-bold mb-4">
                {language === 'ar' ? 'نصائح سريعة' : 'Quick Tips'}
              </h3>
              <ul className="space-y-3 text-olive-100">
                <li className="flex items-start space-x-2 rtl:space-x-reverse">
                  <span className="text-olive-200">•</span>
                  <span className="text-sm">
                    {language === 'ar' 
                      ? 'للطلبات العاجلة، تواصل معنا عبر الواتساب'
                      : 'For urgent orders, contact us via WhatsApp'
                    }
                  </span>
                </li>
                <li className="flex items-start space-x-2 rtl:space-x-reverse">
                  <span className="text-olive-200">•</span>
                  <span className="text-sm">
                    {language === 'ar' 
                      ? 'نرد على جميع الاستفسارات خلال 24 ساعة'
                      : 'We respond to all inquiries within 24 hours'
                    }
                  </span>
                </li>
                <li className="flex items-start space-x-2 rtl:space-x-reverse">
                  <span className="text-olive-200">•</span>
                  <span className="text-sm">
                    {language === 'ar' 
                      ? 'خدمة العملاء متاحة من الأحد للخميس'
                      : 'Customer service available Sunday to Thursday'
                    }
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'ar' ? 'أرسل لنا رسالة' : 'Send us a Message'}
              </h2>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-600 mb-2">
                    {language === 'ar' ? 'تم إرسال رسالتك بنجاح!' : 'Message Sent Successfully!'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'ar' 
                      ? 'شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.'
                      : 'Thank you for contacting us. We\'ll get back to you as soon as possible.'
                    }
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        {language === 'ar' ? 'الاسم الكامل' : 'Full Name'} 
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-gray-700 font-medium">
                        {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} 
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email address'}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-gray-700 font-medium">
                        {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder={language === 'ar' ? 'أدخل رقم هاتفك' : 'Enter your phone number'}
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-gray-700 font-medium">
                        {language === 'ar' ? 'موضوع الرسالة' : 'Subject'} 
                      </Label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-md bg-white text-gray-900 focus:border-olive-400 focus:ring-olive-400"
                        required
                      >
                        <option value="">
                          {language === 'ar' ? 'اختر موضوع الرسالة' : 'Select message subject'}
                        </option>
                        {subjects.map(subject => (
                          <option key={subject.value} value={subject.value}>
                            {language === 'ar' ? subject.labelAr : subject.labelEn}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-gray-700 font-medium">
                      {language === 'ar' ? 'الرسالة' : 'Message'} 
                    </Label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md bg-white text-gray-900 focus:border-olive-400 focus:ring-olive-400 resize-vertical"
                      placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-olive-600 hover:bg-olive-700 text-white font-medium py-3 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        {language === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Send className="w-5 h-5 mr-2" />
                        {language === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
                      </div>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {language === 'ar' ? 'موقعنا على الخريطة' : 'Find Us on Map'}
              </h2>
              <p className="text-gray-600 mt-2">
                {language === 'ar' 
                  ? 'يمكنكم زيارتنا في مقرنا الرئيسي في عمان، الأردن'
                  : 'You can visit us at our headquarters in Amman, Jordan'
                }
              </p>
            </div>
            <div className="h-64 bg-olive-100 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-olive-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'ar' ? 'خريطة تفاعلية' : 'Interactive Map'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === 'ar' 
                    ? ' - عمان الأردن'
                    : 'Amman, Jordan'
                  }
                </p>
                <a 
                                  href="https://www.google.com/maps/place/Amman/@31.8359188,35.6179637,10z/data=!3m1!4b1!4m6!3m5!1s0x151b5fb85d7981af:0x631c30c0f8dc65e8!8m2!3d31.9543786!4d35.9105776!16zL20vMGM3emY?entry=ttu&g_ep=EgoyMDI1MDczMC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-olive-600 hover:text-olive-700 font-medium"
                >
                  {language === 'ar' ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
