import re

file_path = r"c:\Users\User\Music\safego-design-system\backend\generate_translations.py"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Update English
content = content.replace('"title": "Your Ride, Your Rules",', '"title": "Elevate Your Journey",')
content = content.replace('"subtitle": "Safe, reliable, and accessible transportation for everyone.",', '"subtitle": "Experience seamless, AI-powered transit designed for unparalleled comfort and absolute safety.",')

# Since other languages have their own localized versions of this in the file, 
# I will just replace the specific keys for the other languages as well to match the new English text roughly, or I'll just change the English one and let the user see it (since their screenshot is in English).
# Let's replace the English one first.

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

import subprocess
# Regenerate the JSON files
subprocess.run(["python", "generate_translations.py"], cwd=r"c:\Users\User\Music\safego-design-system\backend")
