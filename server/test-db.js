// اختبار الاتصال بقاعدة البيانات
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔗 اختبار الاتصال بـ Supabase...');
console.log('URL:', supabaseUrl);
console.log('Key starts with:', supabaseKey?.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

// اختبار الاتصال
async function testConnection() {
  try {
    // اختبار قراءة جدول بسيط
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ الجداول غير موجودة:', error.message);
      console.log('📋 يجب تشغيل SQL script في Supabase أولاً');
      return false;
    }

    console.log('✅ الاتصال ناجح!');
    console.log('📊 البيانات:', data);
    return true;
  } catch (err) {
    console.log('❌ خطأ في الاتصال:', err.message);
    return false;
  }
}

testConnection();
