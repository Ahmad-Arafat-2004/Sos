import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { t, language, isRTL } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    birthDate: ''
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first'}
          </h1>
          <Button onClick={() => window.location.href = '/login'}>
            {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log('Saving profile:', editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      birthDate: ''
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
          </h1>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
            className="flex items-center gap-2"
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4" />
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                {language === 'ar' ? 'تعديل' : 'Edit'}
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">
              {language === 'ar' ? 'المعلومات الشخصية' : 'Personal Info'}
            </TabsTrigger>
            <TabsTrigger value="settings">
              {language === 'ar' ? 'الإعدادات' : 'Settings'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">
                      {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
                    </CardTitle>
                    <CardDescription>
                      {language === 'ar' 
                        ? 'يمكنك تحديث معلوماتك الشخصية هنا' 
                        : 'Update your personal information here'
                      }
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {language === 'ar' ? 'الاسم' : 'Name'}
                    </Label>
                    <Input
                      id="name"
                      value={isEditing ? editedProfile.name : user.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={isEditing ? editedProfile.email : user.email}
                      onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                    </Label>
                    <Input
                      id="phone"
                      value={editedProfile.phone}
                      onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder={language === 'ar' ? 'أدخل رقم الهاتف' : 'Enter phone number'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {language === 'ar' ? 'تاريخ الميلاد' : 'Birth Date'}
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={editedProfile.birthDate}
                      onChange={(e) => setEditedProfile({ ...editedProfile, birthDate: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {language === 'ar' ? 'العنوان' : 'Address'}
                    </Label>
                    <Input
                      id="address"
                      value={editedProfile.address}
                      onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                      disabled={!isEditing}
                      placeholder={language === 'ar' ? 'أدخل العنوان الكامل' : 'Enter full address'}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4">
                    <Button variant="outline" onClick={handleCancel}>
                      {language === 'ar' ? 'إلغاء' : 'Cancel'}
                    </Button>
                    <Button onClick={handleSave} className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      {language === 'ar' ? 'حفظ' : 'Save'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'ar' ? 'إعدادات الحساب' : 'Account Settings'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' 
                    ? 'إدارة تفضيلات حسابك وإعدادات الخصوصية' 
                    : 'Manage your account preferences and privacy settings'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    {language === 'ar' ? 'إعدادات الإشعارات' : 'Notification Settings'}
                  </Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>
                        {language === 'ar' ? 'إشعارات الطلبات الجديدة' : 'New order notifications'}
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>
                        {language === 'ar' ? 'إشعارات العروض الخاصة' : 'Special offer notifications'}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium text-red-600 mb-2">
                    {language === 'ar' ? 'منطقة الخطر' : 'Danger Zone'}
                  </h3>
                  <Button variant="destructive" size="sm">
                    {language === 'ar' ? 'حذف الحساب' : 'Delete Account'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
