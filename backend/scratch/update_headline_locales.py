import re

file_path = r"c:\Users\User\Music\safego-design-system\backend\generate_translations.py"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Hindi
content = content.replace('"title": "आपकी सवारी, आपके नियम",', '"title": "अपनी यात्रा को बेहतरीन बनाएं",')
content = content.replace('"subtitle": "सभी के लिए सुरक्षित, विश्वसनीय और सुलभ परिवहन।",', '"subtitle": "अद्वितीय आराम और पूर्ण सुरक्षा के लिए डिज़ाइन किए गए एआई-संचालित पारगमन का अनुभव करें।",')

# Tamil
content = content.replace('"title": "உங்கள் பயணம், உங்கள் விதிகள்",', '"title": "உங்கள் பயணத்தை மேம்படுத்துங்கள்",')
content = content.replace('"subtitle": "அனைவருக்கும் பாதுகாப்பான, நம்பகமான மற்றும் அணுகக்கூடிய போக்குவரத்து.",', '"subtitle": "இணையற்ற வசதி மற்றும் முழுமையான பாதுகாப்பிற்காக வடிவமைக்கப்பட்ட AI-இயங்கும் போக்குவரத்தை அனுபவிக்கவும்.",')

# Telugu
content = content.replace('"title": "మీ ప్రయాణం, మీ నిబంధనలు",', '"title": "మీ ప్రయాణాన్ని మెరుగుపరచండి",')
content = content.replace('"subtitle": "అందరికీ సురక్షితమైన, నమ్మదగిన మరియు అందుబాటులో ఉండే రవాణా.",', '"subtitle": "సాటిలేని సౌలభ్యం మరియు సంపూర్ణ భద్రత కోసం రూపొందించబడిన AI-ఆధారిత రవాణాను అనుభవించండి.",')

# Kannada
content = content.replace('"title": "ನಿಮ್ಮ ಪ್ರಯಾಣ, ನಿಮ್ಮ ನಿಯಮಗಳು",', '"title": "ನಿಮ್ಮ ಪ್ರಯಾಣವನ್ನು ಉನ್ನತೀಕರಿಸಿ",')
content = content.replace('"subtitle": "ಎಲ್ಲರಿಗೂ ಸುರಕ್ಷಿತ, ವಿಶ್ವಾಸಾರ್ಹ ಮತ್ತು ಪ್ರವೇಶಿಸಬಹುದಾದ ಸಾರಿಗೆ.",', '"subtitle": "ಅಪ್ರತಿಮ ಸೌಕರ್ಯ ಮತ್ತು ಸಂಪೂರ್ಣ ಸುರಕ್ಷತೆಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ AI-ಚಾಲಿತ ಸಾರಿಗೆಯನ್ನು ಅನುಭವಿಸಿ.",')

# Malayalam
content = content.replace('"title": "നിങ്ങളുടെ യാത്ര, നിങ്ങളുടെ നിയമങ്ങൾ",', '"title": "നിങ്ങളുടെ യാത്ര മികച്ചതാക്കുക",')
content = content.replace('"subtitle": "എല്ലാവർക്കും സുരക്ഷിതവും വിശ്വസനീയവും ആക്സസ് ചെയ്യാവുന്നതുമായ ഗതാഗതം.",', '"subtitle": "സമാനതകളില്ലാത്ത സുഖസൗകര്യങ്ങൾക്കും പൂർണ്ണ സുരക്ഷയ്ക്കുമായി രൂപകൽപ്പന ചെയ്‌തിരിക്കുന്ന AI- പവർ ട്രാൻസിറ്റ് അനുഭവിക്കുക.",')


with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

import subprocess
# Regenerate the JSON files
subprocess.run(["python", "generate_translations.py"], cwd=r"c:\Users\User\Music\safego-design-system\backend")
