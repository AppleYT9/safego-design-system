import json
import os

base_dir = r"c:\Users\User\Music\safego-design-system\src\locales"

translations = {
    "en": {
        "dashboard": {
            "nav": {
                "dashboard": "Dashboard",
                "my_rides": "My Rides",
                "safety_reports": "Safety Reports",
                "emergency_contacts": "Emergency Contacts",
                "settings": "Settings",
                "available_rides": "Available Rides",
                "my_history": "My History",
                "documents": "Documents",
                "earnings": "Earnings"
            },
            "tabs": {
                "dashboard": "Dashboard",
                "my_rides": "My Rides",
                "safety_reports": "Safety Reports",
                "emergency_contacts": "Emergency Contacts",
                "settings": "Settings",
                "available_rides": "Available Rides",
                "my_history": "My History",
                "documents": "Documents",
                "earnings": "Earnings"
            }
        },
        "nav": {
            "home": "Home",
            "dashboard": "Dashboard",
            "drive_with_us": "Drive with Us",
            "safety": "Safety",
            "about": "About",
            "login": "Login",
            "signup": "Sign Up",
            "signout": "Sign Out",
            "book": "Book"
        },
        "home": {
            "title": "Elevate Your Journey",
            "subtitle": "SafeGo ensures every woman, elderly citizen, and differently-abled passenger travels with safety, dignity, and confidence.",
            "book_now": "Book Now",
            "schedule": "Schedule Later"
        },
        "safety": {
            "title": "Safety Command Center",
            "sos_button": "TRIGGER SOS",
            "emergency_contacts": "Emergency Contacts",
            "add_contact": "Add Contact"
        },
        "auth": {
            "welcome": "Welcome Back",
            "create_account": "Create Account",
            "email": "Email",
            "password": "Password",
            "signin": "Sign In"
        },
        "booking": {
            "ready_for": "Ready for a",
            "safe_journey": "Safe Journey?",
            "configure_pickup": "Configure your pickup and destination for a secure ride.",
            "route_details": "Route Details",
            "pickup_location": "Pickup location",
            "destination": "Destination",
            "date": "Date",
            "time": "Time",
            "passengers": "Passengers",
            "how_many": "How many people?",
            "service_type": "Service Type",
            "tap_switch": "Tap to switch",
            "standard_safety": "Standard safety protocols active",
            "finding_location": "Finding your location…",
            "allow_access": "Please allow location access if prompted"
        }
    },
    "hi": {
        "dashboard": {
            "nav": {
                "dashboard": "डैशबोर्ड",
                "my_rides": "मेरी सवारी",
                "safety_reports": "सुरक्षा रिपोर्ट",
                "emergency_contacts": "आपातकालीन संपर्क",
                "settings": "सेटिंग्स",
                "available_rides": "उपलब्ध सवारी",
                "my_history": "मेरा इतिहास",
                "documents": "दस्तावेज़",
                "earnings": "कमाई"
            },
            "tabs": {
                "dashboard": "डैशबोर्ड",
                "my_rides": "मेरी सवारी",
                "safety_reports": "सुरक्षा रिपोर्ट",
                "emergency_contacts": "आपातकालीन संपर्क",
                "settings": "सेटिंग्स",
                "available_rides": "उपलब्ध सवारी",
                "my_history": "मेरा इतिहास",
                "documents": "दस्तावेज़",
                "earnings": "कमाई"
            }
        },
        "nav": {
            "home": "होम",
            "dashboard": "डैशबोर्ड",
            "drive_with_us": "हमारे साथ चलाएं",
            "safety": "सुरक्षा",
            "about": "हमारे बारे में",
            "login": "लॉग इन",
            "signup": "साइन अप",
            "signout": "साइन आउट",
            "book": "बुक करें"
        },
        "home": {
            "title": "अपनी यात्रा को बेहतरीन बनाएं",
            "subtitle": "SafeGo यह सुनिश्चित करता है कि प्रत्येक महिला, बुजुर्ग नागरिक और दिव्यांग यात्री सुरक्षा, गरिमा और आत्मविश्वास के साथ यात्रा करें।",
            "book_now": "अभी बुक करें",
            "schedule": "बाद में शेड्यूल करें"
        },
        "safety": {
            "title": "सुरक्षा कमांड सेंटर",
            "sos_button": "SOS ट्रिगर करें",
            "emergency_contacts": "आपातकालीन संपर्क",
            "add_contact": "संपर्क जोड़ें"
        },
        "auth": {
            "welcome": "वापसी पर स्वागत है",
            "create_account": "खाता बनाएं",
            "email": "ईमेल",
            "password": "पासवर्ड",
            "signin": "साइन इन करें"
        },
        "booking": {
            "ready_for": "के लिए तैयार हैं एक",
            "safe_journey": "सुरक्षित यात्रा?",
            "configure_pickup": "सुरक्षित सवारी के लिए अपना पिकअप और गंतव्य कॉन्फ़िगर करें।",
            "route_details": "मार्ग विवरण",
            "pickup_location": "पिकअप स्थान",
            "destination": "मंज़िल",
            "date": "तारीख",
            "time": "समय",
            "passengers": "यात्री",
            "how_many": "कितने लोग?",
            "service_type": "सेवा का प्रकार",
            "tap_switch": "बदलने के लिए टैप करें",
            "standard_safety": "मानक सुरक्षा प्रोटोकॉल सक्रिय",
            "finding_location": "आपका स्थान खोजा जा रहा है…",
            "allow_access": "यदि कहा जाए तो कृपया स्थान पहुंच की अनुमति दें"
        }
    },
    "ta": {
        "dashboard": {
            "nav": {
                "dashboard": "கட்டுப்பாட்டு அறை",
                "my_rides": "என் பயணங்கள்",
                "safety_reports": "பாதுகாப்பு அறிக்கைகள்",
                "emergency_contacts": "அவசர தொடர்புகள்",
                "settings": "அமைப்புகள்",
                "available_rides": "கிடைக்கும் பயணங்கள்",
                "my_history": "என் வரலாறு",
                "documents": "ஆவணங்கள்",
                "earnings": "வருமானம்"
            },
            "tabs": {
                "dashboard": "கட்டுப்பாட்டு அறை",
                "my_rides": "என் பயணங்கள்",
                "safety_reports": "பாதுகாப்பு அறிக்கைகள்",
                "emergency_contacts": "அவசர தொடர்புகள்",
                "settings": "அமைப்புகள்",
                "available_rides": "கிடைக்கும் பயணங்கள்",
                "my_history": "என் வரலாறு",
                "documents": "ஆவணங்கள்",
                "earnings": "வருமானம்"
            }
        },
        "nav": {
            "home": "முகப்பு",
            "dashboard": "கட்டுப்பாட்டு அறை",
            "drive_with_us": "எங்களுடன் ஓட்டுங்கள்",
            "safety": "பாதுகாப்பு",
            "about": "பற்றி",
            "login": "உள்நுழை",
            "signup": "பதிவு செய்",
            "signout": "வெளியேறு",
            "book": "முன்பதிவு"
        },
        "home": {
            "title": "உங்கள் பயணத்தை மேம்படுத்துங்கள்",
            "subtitle": "ஒவ்வொரு பெண்ணும், முதியவர்களும், மாற்றுத்திறனாளி பயணிகளும் பாதுகாப்பு, கண்ணியம் மற்றும் நம்பிக்கையுடன் பயணிப்பதை SafeGo உறுதி செய்கிறது.",
            "book_now": "இப்போது முன்பதிவு செய்",
            "schedule": "பின்னர் திட்டமிடு"
        },
        "safety": {
            "title": "பாதுகாப்பு கட்டுப்பாட்டு மையம்",
            "sos_button": "SOS ஐத் தூண்டு",
            "emergency_contacts": "அவசர தொடர்புகள்",
            "add_contact": "தொடர்பைச் சேர்"
        },
        "auth": {
            "welcome": "மீண்டும் வரவேற்கிறோம்",
            "create_account": "கணக்கை உருவாக்கு",
            "email": "மின்னஞ்சல்",
            "password": "கடவுச்சொல்",
            "signin": "உள்நுழைக"
        },
        "booking": {
            "ready_for": "தயாரா",
            "safe_journey": "பாதுகாப்பான பயணத்திற்கு?",
            "configure_pickup": "பாதுகாப்பான பயணத்திற்கு உங்கள் பிக்அப் மற்றும் இலக்கை உள்ளிடவும்.",
            "route_details": "பாதை விவரங்கள்",
            "pickup_location": "ஏறும் இடம்",
            "destination": "இலக்கு",
            "date": "தேதி",
            "time": "நேரம்",
            "passengers": "பயணிகள்",
            "how_many": "எத்தனை நபர்கள்?",
            "service_type": "சேவை வகை",
            "tap_switch": "மாற்ற தட்டவும்",
            "standard_safety": "நிலையான பாதுகாப்பு நெறிமுறைகள் செயலில் உள்ளன",
            "finding_location": "உங்கள் இருப்பிடம் கண்டறியப்படுகிறது…",
            "allow_access": "கேட்கப்பட்டால் இருப்பிட அணுகலை அனுமதிக்கவும்"
        }
    },
    "te": {
        "dashboard": {
            "nav": {
                "dashboard": "డాష్‌బోర్డ్",
                "my_rides": "నా రైడ్‌లు",
                "safety_reports": "భద్రతా నివేదికలు",
                "emergency_contacts": "అత్యవసర పరిచయాలు",
                "settings": "సెట్టింగులు",
                "available_rides": "అందుబాటులో ఉన్న రైడ్‌లు",
                "my_history": "నా చరిత్ర",
                "documents": "పత్రాలు",
                "earnings": "సంపాదన"
            },
            "tabs": {
                "dashboard": "డాష్‌బోర్డ్",
                "my_rides": "నా రైడ్‌లు",
                "safety_reports": "భద్రతా నివేదికలు",
                "emergency_contacts": "అత్యవసర పరిచయాలు",
                "settings": "సెట్టింగులు",
                "available_rides": "అందుబాటులో ఉన్న రైడ్‌లు",
                "my_history": "నా చరిత్ర",
                "documents": "పత్రాలు",
                "earnings": "సంపాదన"
            }
        },
        "nav": {
            "home": "హోమ్",
            "dashboard": "డాష్‌బోర్డ్",
            "drive_with_us": "మాతో డ్రైవ్ చేయండి",
            "safety": "భద్రత",
            "about": "గురించి",
            "login": "లాగిన్",
            "signup": "సైన్ అప్",
            "signout": "సైన్ అవుట్",
            "book": "బుక్ చేయండి"
        },
        "home": {
            "title": "మీ రైడ్, మీ నియమాలు",
            "subtitle": "అందరికీ సురక్షితమైన, నమ్మదగిన మరియు అందుబాటులో ఉన్న రవాణా.",
            "book_now": "ఇప్పుడే బుక్ చేయండి",
            "schedule": "తరువాత షెడ్యూల్ చేయండి"
        },
        "safety": {
            "title": "భద్రతా కమాండ్ సెంటర్",
            "sos_button": "SOS ని ట్రిగ్గర్ చేయండి",
            "emergency_contacts": "అత్యవసర పరిచయాలు",
            "add_contact": "పరిచయాన్ని జోడించండి"
        },
        "auth": {
            "welcome": "మళ్లీ స్వాగతం",
            "create_account": "ఖాతాను సృష్టించండి",
            "email": "ఇమెయిల్",
            "password": "పాస్ వర్డ్",
            "signin": "సైన్ ఇన్ చేయండి"
        },
        "booking": {
            "ready_for": "సిద్ధంగా ఉన్నారా",
            "safe_journey": "సురక్షిత ప్రయాణానికి?",
            "configure_pickup": "సురక్షిత రైడ్ కోసం మీ పికప్ మరియు గమ్యాన్ని కాన్ఫిగర్ చేయండి.",
            "route_details": "మార్గం వివరాలు",
            "pickup_location": "పికప్ స్థానం",
            "destination": "గమ్యం",
            "date": "తేదీ",
            "time": "సమయం",
            "passengers": "ప్రయాణీకులు",
            "how_many": "ఎంత మంది?",
            "service_type": "సేవ రకం",
            "tap_switch": "మార్చడానికి నొక్కండి",
            "standard_safety": "ప్రామాణిక భద్రతా ప్రోటోకాల్స్ యాక్టివ్",
            "finding_location": "మీ స్థానాన్ని కనుగొంటున్నాము…",
            "allow_access": "అడిగితే దయచేసి స్థాన ప్రాప్యతను అనుమతించండి"
        }
    },
    "kn": {
        "dashboard": {
            "nav": {
                "dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
                "my_rides": "ನನ್ನ ಸವಾರಿಗಳು",
                "safety_reports": "ಸುರಕ್ಷತಾ ವರದಿಗಳು",
                "emergency_contacts": "ತುರ್ತು ಸಂಪರ್ಕಗಳು",
                "settings": "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
                "available_rides": "ಲಭ್ಯವಿರುವ ಸವಾರಿಗಳು",
                "my_history": "ನನ್ನ ಇತಿಹಾಸ",
                "documents": "ದಾಖಲೆಗಳು",
                "earnings": "ಗಳಿಕೆ"
            },
            "tabs": {
                "dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
                "my_rides": "ನನ್ನ ಸವಾರಿಗಳು",
                "safety_reports": "ಸುರಕ್ಷತಾ ವರದಿಗಳು",
                "emergency_contacts": "ತುರ್ತು ಸಂಪರ್ಕಗಳು",
                "settings": "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
                "available_rides": "ಲಭ್ಯವಿರುವ ಸವಾರಿಗಳು",
                "my_history": "ನನ್ನ ಇತಿಹಾಸ",
                "documents": "ದಾಖಲೆಗಳು",
                "earnings": "ಗಳಿಕೆ"
            }
        },
        "nav": {
            "home": "ಮುಖಪುಟ",
            "dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
            "drive_with_us": "ನಮ್ಮೊಂದಿಗೆ ಚಾಲನೆ ಮಾಡಿ",
            "safety": "ಸುರಕ್ಷತೆ",
            "about": "ಬಗ್ಗೆ",
            "login": "ಲಾಗಿನ್",
            "signup": "ಸೈನ್ ಅಪ್",
            "signout": "ಸೈನ್ ಔಟ್",
            "book": "ಬುಕ್ ಮಾಡಿ"
        },
        "home": {
            "title": "ನಿಮ್ಮ ಸವಾರಿ, ನಿಮ್ಮ ನಿಯಮಗಳು",
            "subtitle": "ಪ್ರತಿ ಮಹಿಳೆ, ವಯಸ್ಸಾದ ನಾಗರಿಕರು ಮತ್ತು ವಿಭಿನ್ನ ಸಾಮರ್ಥ್ಯದ ಪ್ರಯಾಣಿಕರು ಸುರಕ್ಷತೆ, ಘನತೆ ಮತ್ತು ವಿಶ್ವಾಸದಿಂದ ಪ್ರಯಾಣಿಸುವುದನ್ನು SafeGo ಖಚಿತಪಡಿಸುತ್ತದೆ.",
            "book_now": "ಈಗ ಬುಕ್ ಮಾಡಿ",
            "schedule": "ನಂತರ ನಿಗದಿಪಡಿಸಿ"
        },
        "safety": {
            "title": "ಸುರಕ್ಷತಾ ಕಮಾಂಡ್ ಸೆಂಟರ್",
            "sos_button": "SOS ಪ್ರಚೋದಿಸಿ",
            "emergency_contacts": "ತುರ್ತು ಸಂಪರ್ಕಗಳು",
            "add_contact": "ಸಂಪರ್ಕವನ್ನು ಸೇರಿಸಿ"
        },
        "auth": {
            "welcome": "ಮತ್ತೆ ಸ್ವಾಗತ",
            "create_account": "ಖಾತೆಯನ್ನು ರಚಿಸಿ",
            "email": "ಇಮೇಲ್",
            "password": "ಗುಪ್ತಪದ",
            "signin": "ಸೈನ್ ಇನ್ ಮಾಡಿ"
        },
        "booking": {
            "ready_for": "ಸಿದ್ಧರಿದ್ದೀರಾ",
            "safe_journey": "ಸುರಕ್ಷಿತ ಪ್ರಯಾಣಕ್ಕೆ?",
            "configure_pickup": "ಸುರಕ್ಷಿತ ಸವಾರಿಗಾಗಿ ನಿಮ್ಮ ಪಿಕ್ಅಪ್ ಮತ್ತು ಗಮ್ಯಸ್ಥಾನವನ್ನು ಕಾನ್ಫಿಗರ್ ಮಾಡಿ.",
            "route_details": "ಮಾರ್ಗ ವಿವರಗಳು",
            "pickup_location": "ಪಿಕ್ಅಪ್ ಸ್ಥಳ",
            "destination": "ಗಮ್ಯಸ್ಥಾನ",
            "date": "ದಿನಾಂಕ",
            "time": "ಸಮಯ",
            "passengers": "ಪ್ರಯಾಣಿಕರು",
            "how_many": "ಎಷ್ಟು ಜನರು?",
            "service_type": "ಸೇವೆ ಪ್ರಕಾರ",
            "tap_switch": "ಬದಲಾಯಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
            "standard_safety": "ಪ್ರಮಾಣಿತ ಸುರಕ್ಷತಾ ಪ್ರೋಟೋಕಾಲ್ಗಳು ಸಕ್ರಿಯವಾಗಿವೆ",
            "finding_location": "ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ…",
            "allow_access": "ಕೇಳಿದರೆ ದಯವಿಟ್ಟು ಸ್ಥಳ ಪ್ರವೇಶವನ್ನು ಅನುಮತಿಸಿ"
        }
    },
    "ml": {
        "dashboard": {
            "nav": {
                "dashboard": "ഡാഷ്‌ബോർഡ്",
                "my_rides": "എന്റെ യാത്രകൾ",
                "safety_reports": "സുരക്ഷാ റിപ്പോർട്ടുകൾ",
                "emergency_contacts": "അടിയന്തര കോൺടാക്റ്റുകൾ",
                "settings": "ക്രമീകരണങ്ങൾ",
                "available_rides": "ലഭ്യമായ യാത്രകൾ",
                "my_history": "എന്റെ ചരിത്രം",
                "documents": "രേഖകൾ",
                "earnings": "വരുമാനം"
            },
            "tabs": {
                "dashboard": "ഡാഷ്‌ബോർഡ്",
                "my_rides": "എന്റെ യാത്രകൾ",
                "safety_reports": "സുരക്ഷാ റിപ്പോർട്ടുകൾ",
                "emergency_contacts": "അടിയന്തര കോൺടാക്റ്റുകൾ",
                "settings": "ക്രമീകരണങ്ങൾ",
                "available_rides": "ലഭ്യമായ യാത്രകൾ",
                "my_history": "എന്റെ ചരിത്രം",
                "documents": "രേഖകൾ",
                "earnings": "വരുമാനം"
            }
        },
        "nav": {
            "home": "ഹോം",
            "dashboard": "ഡാഷ്‌ബോർഡ്",
            "drive_with_us": "ഞങ്ങളോടൊപ്പം ഓടിക്കുക",
            "safety": "സുരക്ഷ",
            "about": "കുറിച്ച്",
            "login": "ലോഗിൻ",
            "signup": "സൈൻ അപ്പ്",
            "signout": "സൈൻ ഔട്ട്",
            "book": "ബുക്ക് ചെയ്യുക"
        },
        "home": {
            "title": "നിങ്ങളുടെ യാത്ര മികച്ചതാക്കുക",
            "subtitle": "ഓരോ സ്ത്രീയും മുതിർന്ന പൗരനും ഭിന്നശേഷിക്കാരനായ യാത്രക്കാരനും സുരക്ഷിതത്വത്തോടും അന്തസ്സോടും ആത്മവിശ്വാസത്തോടും കൂടി യാത്ര ചെയ്യുന്നുവെന്ന് SafeGo ഉറപ്പാക്കുന്നു.",
            "book_now": "ഇപ്പോൾ ബുക്ക് ചെയ്യുക",
            "schedule": "പിന്നീട് ഷെഡ്യൂൾ ചെയ്യുക"
        },
        "safety": {
            "title": "സുരക്ഷാ കമാൻഡ് സെന്റർ",
            "sos_button": "SOS ട്രിഗർ ചെയ്യുക",
            "emergency_contacts": "അടിയന്തര കോൺടാക്റ്റുകൾ",
            "add_contact": "കോൺടാക്റ്റ് ചേർക്കുക"
        },
        "auth": {
            "welcome": "വീണ്ടും സ്വാഗതം",
            "create_account": "അക്കൗണ്ട് സൃഷ്ടിക്കുക",
            "email": "ഇമെയിൽ",
            "password": "പാസ്‌വേഡ്",
            "signin": "സൈൻ ഇൻ ചെയ്യുക"
        },
        "booking": {
            "ready_for": "തയ്യാറാണോ",
            "safe_journey": "സുരക്ഷിതമായ യാത്രയ്ക്ക്?",
            "configure_pickup": "സുരക്ഷിതമായ യാത്രയ്ക്കായി നിങ്ങളുടെ പിക്കപ്പും ലക്ഷ്യസ്ഥാനവും കോൺഫിഗർ ചെയ്യുക.",
            "route_details": "റൂട്ട് വിശദാംശങ്ങൾ",
            "pickup_location": "പിക്കപ്പ് സ്ഥലം",
            "destination": "ലക്ഷ്യസ്ഥാനം",
            "date": "തീയതി",
            "time": "സമയം",
            "passengers": "യാത്രക്കാർ",
            "how_many": "എത്ര പേർ?",
            "service_type": "സേവന തരം",
            "tap_switch": "മാറ്റാൻ ടാപ്പ് ചെയ്യുക",
            "standard_safety": "സ്റ്റാൻഡേർഡ് സുരക്ഷാ പ്രോട്ടോക്കോളുകൾ സജീവമാണ്",
            "finding_location": "നിങ്ങളുടെ സ്ഥാനം കണ്ടെത്തുന്നു…",
            "allow_access": "ആവശ്യപ്പെടുകയാണെങ്കിൽ ദയവായി ലൊക്കേഷൻ ആക്സസ് അനുവദിക്കുക"
        }
    }
}

for lang, data in translations.items():
    lang_dir = os.path.join(base_dir, lang)
    os.makedirs(lang_dir, exist_ok=True)
    with open(os.path.join(lang_dir, "translation.json"), "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
print("Translations generated!")
