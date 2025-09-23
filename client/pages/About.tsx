import React from "react";
import { Leaf, Heart, Award, Users, MapPin, Clock } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const About: React.FC = () => {
  const { language, t } = useLanguage();

  const productCategories = [
    {
      icon: "🌿",
      titleAr: "البهارات والتوابل",
      titleEn: "Spices & Seasonings",
      itemsAr:
        "الكبسة، البرياني، المسالا، الطواجن، المكسيكية، اليونانية، والشوربة",
      itemsEn:
        "Kabsa, Biryani, Masala, Tagines, Mexican, Greek, and Soup blends",
    },
    {
      icon: "🍃",
      titleAr: "الأعشاب الطبيعية",
      titleEn: "Natural Herbs",
      itemsAr:
        "الزعتر، المورينجا، الأوريجانو، الكركم، الزنجبيل، القرفة، وجوزة الطيب",
      itemsEn:
        "Thyme, Moringa, Oregano, Turmeric, Ginger, Cinnamon, and Nutmeg",
    },
    {
      icon: "🫒",
      titleAr: "الزيوت الطبيعية",
      titleEn: "Natural Oils",
      itemsAr: "زيت الزيتون البكر المستخلص من أفضل محاصيل الزيتون المحلي",
      itemsEn:
        "Extra virgin olive oil extracted from the finest local olive crops",
    },
    {
      icon: "🥒",
      titleAr: "المخللات التراثية",
      titleEn: "Traditional Pickles",
      itemsAr: "الفلفل، البندورة، الزيتون، اللفت، الملفوف، والمخللات المكسيكية",
      itemsEn:
        "Peppers, Tomatoes, Olives, Turnips, Cabbage, and Mexican pickles",
    },
    {
      icon: "☀️",
      titleAr: "المنتجات المجففة",
      titleEn: "Dried Products",
      itemsAr: "الجزر، قشر البرتقال، البصل، الثوم، والليمون الناشف",
      itemsEn: "Carrots, Orange peel, Onions, Garlic, and Dried lemon",
    },
    {
      icon: "🌾",
      titleAr: "الحبوب والبقوليات",
      titleEn: "Grains & Legumes",
      itemsAr: "العدس، البرغل، الفريكة، والحلبة",
      itemsEn: "Lentils, Bulgur, Freekeh, and Fenugreek",
    },
    {
      icon: "🧀",
      titleAr: "منتجات الألبان",
      titleEn: "Dairy Products",
      itemsAr: "اللبنة بالنكهات والجبنة البيضاء البلدية",
      itemsEn: "Flavored Labneh and Traditional white cheese",
    },
    {
      icon: "☕",
      titleAr: "المشروبات التراثية",
      titleEn: "Traditional Beverages",
      itemsAr: "الشاي الكرك والقهوة الخليجية",
      itemsEn: "Karak tea and Gulf coffee",
    },
    {
      icon: "🍯",
      titleAr: "العسل الطبيعي",
      titleEn: "Natural Honey",
      itemsAr: "عسل السدر، الطلح، وعسل الطاقة",
      itemsEn: "Sidr honey, Acacia honey, and Energy honey",
    },
  ];

  const values = [
    {
      icon: Leaf,
      titleAr: "منتجات طبيعية",
      titleEn: "Natural Products",
      descAr: "نختار المواد الخام الطبيعية دون إضافات صناعية",
      descEn: "We select natural raw materials without artificial additives",
    },
    {
      icon: Heart,
      titleAr: "الجودة من المصدر",
      titleEn: "Quality from Source",
      descAr: "نؤمن أن الجودة تبدأ من المصدر والمزارع المحلية",
      descEn: "We believe quality starts from the source and local farms",
    },
    {
      icon: Award,
      titleAr: "وصفات تراثية",
      titleEn: "Traditional Recipes",
      descAr: "نتبع أساليب تحضير تقليدية موروثة عبر الأجيال",
      descEn:
        "We follow traditional preparation methods inherited through generations",
    },
    {
      icon: Users,
      titleAr: "للعائلة العربية",
      titleEn: "For Arab Families",
      descAr: "نحافظ على الهوية الغذائية التي تربينا عليها",
      descEn: "We preserve the food identity we grew up with",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-olive-50 to-olive-100">
      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-olive-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-3xl">
                  {language === "ar" ? "إ" : "I"}
                </span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {language === "ar" ? "إرث بلادي" : "Irth Biladi"}
            </h1>

            <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse mb-8">
              <MapPin className="w-5 h-5 text-olive-600" />
              <span className="text-lg text-olive-700 font-medium">
                {language === "ar"
                  ? "مشروع أردني محلي"
                  : "Local Jordanian Project"}
              </span>
            </div>

            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {language === "ar"
                ? "مشروع أردني محلي يهتم بإنتاج وتوزيع منتجات طبيعية، تقليدية، وصحية مستمدة من تراث الأرض الأردنية والعربية."
                : "A local Jordanian project focused on producing and distributing natural, traditional, and healthy products derived from the heritage of Jordan and the Arab lands."}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                {language === "ar" ? "رؤيتنا ورسالتنا" : "Our Vision & Mission"}
              </h2>
            </div>

            <div className="bg-gradient-to-r from-olive-50 to-olive-100 rounded-3xl p-8 mb-12">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {language === "ar"
                  ? "نعمل على إعادة إحياء النكهات الأصيلة والعادات الغذائية القديمة من خلال تقديم منتجات مختارة بعناية من مزارع ومناطق محلية. فريقنا يضم أشخاصًا يؤمنون بأن الجودة تبدأ من المصدر، ولهذا نختار المواد الخام الطبيعية ونتبع أساليب تحضير تقليدية دون إضافات صناعية."
                  : "We work to revive authentic flavors and traditional food customs by offering carefully selected products from local farms and regions. Our team consists of people who believe that quality starts from the source, which is why we choose natural raw materials and follow traditional preparation methods without artificial additives."}
              </p>

              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <h3 className="text-xl font-bold text-olive-800 mb-4">
                  {language === "ar" ? "هدفنا" : "Our Goal"}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {language === "ar"
                    ? "هدفنا هو أن نوصل منتجات صحية، طبيعية، وآمنة إلى كل بيت أردني وعربي، وأن نحافظ على الهوية الغذائية التي تربينا عليها. نؤمن أن الطعام ليس مجرد منتج استهلاكي، بل تجربة وهوية وثقافة، لذلك نحرص على توفير كل منتج بأعلى جودة وضمن معايير نظافة صارمة."
                    : "Our goal is to deliver healthy, natural, and safe products to every Jordanian and Arab home, and to preserve the food identity we grew up with. We believe that food is not just a consumer product, but an experience, identity, and culture, so we ensure that every product is provided with the highest quality and strict hygiene standards."}
                </p>
              </div>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-olive-100 rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-olive-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {language === "ar" ? value.titleAr : value.titleEn}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {language === "ar" ? value.descAr : value.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-olive-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                {language === "ar" ? "مجموعة منتجاتنا" : "Our Product Range"}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {language === "ar"
                  ? "نغطي مجموعة كبيرة من الأصناف التراثية المختارة بعناية"
                  : "We cover a wide range of carefully selected traditional varieties"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productCategories.map((category, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {language === "ar" ? category.titleAr : category.titleEn}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {language === "ar" ? category.itemsAr : category.itemsEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-olive-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              {language === "ar"
                ? "نكهة زمان، جودة اليوم"
                : "Yesterday's Flavor, Today's Quality"}
            </h2>
            <p className="text-xl text-olive-100 mb-8 leading-relaxed">
              {language === "ar"
                ? "إذا كنت تبحث عن نكهة زمان، جودة اليوم، وسعر يناسب كل بيت، فـ إرث بلادي هو اختيارك."
                : "If you're looking for yesterday's flavor, today's quality, and prices that suit every home, Irth Biladi is your choice."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/products">
                <button className="bg-white text-olive-600 hover:bg-olive-50 font-medium px-8 py-3 rounded-xl transition-colors duration-200">
                  {language === "ar" ? "تسوق الآن" : "Shop Now"}
                </button>
              </a>
              <a href="/contact">
                <button className="border-2 border-white text-white hover:bg-white hover:text-olive-600 font-medium px-8 py-3 rounded-xl transition-all duration-200">
                  {language === "ar" ? "تواصل معنا" : "Contact Us"}
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <div className="w-16 h-16 bg-olive-100 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8 text-olive-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">100%</h3>
                <p className="text-gray-600">
                  {language === "ar" ? "منتجات طبيعية" : "Natural Products"}
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-16 h-16 bg-olive-100 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="w-8 h-8 text-olive-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">100%</h3>
                <p className="text-gray-600">
                  {language === "ar" ? "مصادر محلية" : "Local Sources"}
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-16 h-16 bg-olive-100 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-olive-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">100%</h3>
                <p className="text-gray-600">
                  {language === "ar" ? "وصفات تراثية" : "Heritage Recipes"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
