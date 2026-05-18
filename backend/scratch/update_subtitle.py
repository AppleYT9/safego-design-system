import re

file_path = r"c:\Users\User\Music\safego-design-system\backend\generate_translations.py"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace English subtitle
content = content.replace(
    '"subtitle": "Experience seamless, AI-powered transit designed for unparalleled comfort and absolute safety.",', 
    '"subtitle": "SafeGo ensures every woman, elderly citizen, and differently-abled passenger travels with safety, dignity, and confidence.",'
)

# Replace Hindi subtitle
content = content.replace(
    '"subtitle": "अद्वितीय आराम और पूर्ण सुरक्षा के लिए डिज़ाइन किए गए एआई-संचालित पारगमन का अनुभव करें।",',
    '"subtitle": "SafeGo यह सुनिश्चित करता है कि प्रत्येक महिला, बुजुर्ग नागरिक और दिव्यांग यात्री सुरक्षा, गरिमा और आत्मविश्वास के साथ यात्रा करें।",'
)

# Replace Tamil subtitle
content = content.replace(
    '"subtitle": "இணையற்ற வசதி மற்றும் முழுமையான பாதுகாப்பிற்காக வடிவமைக்கப்பட்ட AI-இயங்கும் போக்குவரத்தை அனுபவிக்கவும்.",',
    '"subtitle": "ஒவ்வொரு பெண்ணும், முதியவர்களும், மாற்றுத்திறனாளி பயணிகளும் பாதுகாப்பு, கண்ணியம் மற்றும் நம்பிக்கையுடன் பயணிப்பதை SafeGo உறுதி செய்கிறது.",'
)

# Replace Telugu subtitle
content = content.replace(
    '"subtitle": "సాటిలేని సౌలభ్యం మరియు సంపూర్ణ భద్రత కోసం రూపొందించబడిన AI-ఆధారిత రవాణాను అనుభవించండి.",',
    '"subtitle": "ప్రతి మహిళ, వృద్ధ పౌరులు మరియు వికలాంగ ప్రయాణీకులు భద్రత, గౌరవం మరియు విశ్వాసంతో ప్రయాణించేలా SafeGo నిర్ధారిస్తుంది.",'
)

# Replace Kannada subtitle
content = content.replace(
    '"subtitle": "ಅಪ್ರತಿಮ ಸೌಕರ್ಯ ಮತ್ತು ಸಂಪೂರ್ಣ ಸುರಕ್ಷತೆಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ AI-ಚಾಲಿತ ಸಾರಿಗೆಯನ್ನು ಅನುಭವಿಸಿ.",',
    '"subtitle": "ಪ್ರತಿ ಮಹಿಳೆ, ವಯಸ್ಸಾದ ನಾಗರಿಕರು ಮತ್ತು ವಿಭಿನ್ನ ಸಾಮರ್ಥ್ಯದ ಪ್ರಯಾಣಿಕರು ಸುರಕ್ಷತೆ, ಘನತೆ ಮತ್ತು ವಿಶ್ವಾಸದಿಂದ ಪ್ರಯಾಣಿಸುವುದನ್ನು SafeGo ಖಚಿತಪಡಿಸುತ್ತದೆ.",'
)

# Replace Malayalam subtitle
content = content.replace(
    '"subtitle": "സമാനതകളില്ലാത്ത സുഖസൗകര്യങ്ങൾക്കും പൂർണ്ണ സുരക്ഷയ്ക്കുമായി രൂപകൽപ്പന ചെയ്‌തിരിക്കുന്ന AI- പവർ ട്രാൻസിറ്റ് അനുഭവിക്കുക.",',
    '"subtitle": "ഓരോ സ്ത്രീയും മുതിർന്ന പൗരനും ഭിന്നശേഷിക്കാരനായ യാത്രക്കാരനും സുരക്ഷിതത്വത്തോടും അന്തസ്സോടും ആത്മവിശ്വാസത്തോടും കൂടി യാത്ര ചെയ്യുന്നുവെന്ന് SafeGo ഉറപ്പാക്കുന്നു.",'
)


with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

import subprocess
# Regenerate the JSON files
subprocess.run(["python", "generate_translations.py"], cwd=r"c:\Users\User\Music\safego-design-system\backend")
