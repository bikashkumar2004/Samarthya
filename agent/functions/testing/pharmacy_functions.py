"""
Pharmacy functions and drug database for AI assistant function calling.
Provides comprehensive drug information, smart alias search, symptom lookup, and order management.
"""

# Simple in-memory storage for orders
ORDERS_DB = {"orders": {}, "next_id": 1}

# Comprehensive Drug Database (35+ medications across all major categories)
DRUG_DB = {
    "aspirin": {
        "name": "Aspirin 325mg",
        "generic_name": "Acetylsalicylic Acid",
        "brand_names": ["Bayer", "Bufferin", "Ecotrin"],
        "category": "Pain Relief / NSAID / Antiplatelet",
        "price": 5.99,
        "quantity": 30,
        "dosage_form": "Tablets",
        "indications": "Pain relief, fever reduction, inflammation, heart attack prevention",
        "dosage": "325mg to 650mg every 4 to 6 hours as needed with food",
        "side_effects": "Stomach upset, heartburn, increased bleeding tendency",
        "prescription_required": False,
        "description": "Non-steroidal anti-inflammatory drug (NSAID) used for pain relief, fever reduction, and cardiovascular protection."
    },
    "ibuprofen": {
        "name": "Ibuprofen 400mg",
        "generic_name": "Ibuprofen",
        "brand_names": ["Advil", "Motrin", "Nurofen", "Brufen"],
        "category": "Pain Relief / NSAID",
        "price": 7.99,
        "quantity": 20,
        "dosage_form": "Tablets / Softgels",
        "indications": "Headaches, toothaches, menstrual cramps, arthritis, muscle aches, fever",
        "dosage": "200mg to 400mg every 4 to 6 hours with food; maximum 1200mg/day OTC",
        "side_effects": "Stomach irritation, nausea, dizziness",
        "prescription_required": False,
        "description": "Effective anti-inflammatory pain reliever that reduces swelling, fever, and acute pain."
    },
    "acetaminophen": {
        "name": "Acetaminophen 500mg",
        "generic_name": "Paracetamol / Acetaminophen",
        "brand_names": ["Tylenol", "Panadol", "Calpol", "Crocin", "Dolo"],
        "category": "Pain Relief / Antipyretic",
        "price": 6.99,
        "quantity": 25,
        "dosage_form": "Caplets",
        "indications": "Headache, mild to moderate body pain, fever, post-vaccination soreness",
        "dosage": "500mg to 1000mg every 4 to 6 hours; do not exceed 3000mg-4000mg in 24 hours",
        "side_effects": "Rare at normal doses; risk of liver toxicity if taken with alcohol or overdosed",
        "prescription_required": False,
        "description": "Gentle-on-stomach analgesic and fever reducer suitable for headaches, fever, and sore throats."
    },
    "tramadol": {
        "name": "Tramadol 50mg",
        "generic_name": "Tramadol Hydrochloride",
        "brand_names": ["Ultram", "ConZip"],
        "category": "Opioid Analgesic",
        "price": 18.5,
        "quantity": 30,
        "dosage_form": "Tablets",
        "indications": "Moderate to moderately severe chronic or postoperative pain",
        "dosage": "50mg to 100mg every 4 to 6 hours as needed; maximum 400mg/day",
        "side_effects": "Dizziness, drowsiness, constipation, nausea, risk of dependence",
        "prescription_required": True,
        "description": "Centrally acting prescription analgesic for severe pain that does not respond to OTC painkillers."
    },
    "amoxicillin": {
        "name": "Amoxicillin 500mg",
        "generic_name": "Amoxicillin Trihydrate",
        "brand_names": ["Amoxil", "Moxatag", "Trimox"],
        "category": "Antibiotic (Penicillin class)",
        "price": 14.25,
        "quantity": 30,
        "dosage_form": "Capsules",
        "indications": "Bacterial infections including strep throat, ear infections, bronchitis, dental infections, pneumonia, UTIs",
        "dosage": "500mg every 8 hours or 875mg every 12 hours for 7 to 10 days",
        "side_effects": "Mild diarrhea, nausea, skin rash; avoid if allergic to penicillin",
        "prescription_required": True,
        "description": "Broad-spectrum penicillin antibiotic widely prescribed for respiratory, ear, throat, and dental bacterial infections."
    },
    "azithromycin": {
        "name": "Azithromycin 250mg",
        "generic_name": "Azithromycin",
        "brand_names": ["Zithromax", "Z-Pak"],
        "category": "Antibiotic (Macrolide class)",
        "price": 22.0,
        "quantity": 6,
        "dosage_form": "Tablets",
        "indications": "Chest infections, sinus infections, pneumonia, strep throat, chlamydia",
        "dosage": "500mg on day 1, followed by 250mg once daily on days 2 through 5",
        "side_effects": "Abdominal cramping, diarrhea, mild headache",
        "prescription_required": True,
        "description": "Fast-acting macrolide antibiotic commonly prescribed in 5-day Z-Pak courses for respiratory and sinus infections."
    },
    "ciprofloxacin": {
        "name": "Ciprofloxacin 500mg",
        "generic_name": "Ciprofloxacin Hydrochloride",
        "brand_names": ["Cipro", "Ciloxan"],
        "category": "Antibiotic (Fluoroquinolone)",
        "price": 19.75,
        "quantity": 20,
        "dosage_form": "Tablets",
        "indications": "Urinary tract infections (UTIs), severe kidney infections, infectious diarrhea, skin infections",
        "dosage": "500mg twice daily every 12 hours for 7 to 14 days",
        "side_effects": "Nausea, tendon discomfort, photosensitivity; drink plenty of water",
        "prescription_required": True,
        "description": "Potent broad-spectrum fluoroquinolone antibiotic targeting severe urinary and bacterial gastrointestinal infections."
    },
    "doxycycline": {
        "name": "Doxycycline 100mg",
        "generic_name": "Doxycycline Hyclate",
        "brand_names": ["Vibramycin", "Doryx"],
        "category": "Antibiotic (Tetracycline)",
        "price": 16.5,
        "quantity": 20,
        "dosage_form": "Capsules",
        "indications": "Bacterial acne, rosacea, Lyme disease, respiratory infections, malaria prevention",
        "dosage": "100mg once or twice daily with a full glass of water; avoid lying down for 30 mins",
        "side_effects": "Sunlight sensitivity, stomach irritation, esophageal irritation",
        "prescription_required": True,
        "description": "Versatile tetracycline antibiotic effective for skin conditions, Lyme disease, and bacterial respiratory issues."
    },
    "cetirizine": {
        "name": "Cetirizine 10mg",
        "generic_name": "Cetirizine Hydrochloride",
        "brand_names": ["Zyrtec", "Reactine", "Cetzine"],
        "category": "Antihistamine (2nd Generation)",
        "price": 12.99,
        "quantity": 30,
        "dosage_form": "Tablets",
        "indications": "Hay fever, seasonal allergies, allergic rhinitis, watery eyes, sneezing, hives and itching",
        "dosage": "One 10mg tablet once daily with or without food",
        "side_effects": "Low drowsiness risk, dry mouth",
        "prescription_required": False,
        "description": "24-hour fast-acting allergy relief medication that combats sneezing, runny nose, and itchy hives."
    },
    "loratadine": {
        "name": "Loratadine 10mg",
        "generic_name": "Loratadine",
        "brand_names": ["Claritin", "Alavert"],
        "category": "Antihistamine (Non-drowsy)",
        "price": 11.5,
        "quantity": 30,
        "dosage_form": "Tablets",
        "indications": "Allergic rhinitis, pollen allergies, pet dander allergies, skin hives",
        "dosage": "10mg once daily in the morning",
        "side_effects": "Non-drowsy formula, occasional mild headache or dry mouth",
        "prescription_required": False,
        "description": "Non-drowsy 24-hour antihistamine ideal for daytime allergy relief without feeling sleepy."
    },
    "diphenhydramine": {
        "name": "Diphenhydramine 25mg",
        "generic_name": "Diphenhydramine Hydrochloride",
        "brand_names": ["Benadryl", "Unisom", "Sominex"],
        "category": "Antihistamine / Sleep Aid",
        "price": 6.5,
        "quantity": 24,
        "dosage_form": "Tablets / Capsules",
        "indications": "Acute allergic reactions, insect bites, itching, motion sickness, temporary insomnia",
        "dosage": "25mg to 50mg every 4 to 6 hours as needed; 50mg at bedtime for sleep",
        "side_effects": "Marked drowsiness, dry mouth, dizziness, grogginess",
        "prescription_required": False,
        "description": "Fast-acting first-generation antihistamine that relieves acute allergic flare-ups and doubles as an OTC sleep aid."
    },
    "fexofenadine": {
        "name": "Fexofenadine 180mg",
        "generic_name": "Fexofenadine Hydrochloride",
        "brand_names": ["Allegra", "Telfast"],
        "category": "Antihistamine (True Non-drowsy)",
        "price": 15.99,
        "quantity": 30,
        "dosage_form": "Tablets",
        "indications": "Severe seasonal outdoor and indoor allergies, allergic skin itching",
        "dosage": "180mg once daily with water; avoid taking with fruit juices (grapefruit/orange)",
        "side_effects": "Minimal side effects; does not cross blood-brain barrier",
        "prescription_required": False,
        "description": "Pure non-drowsy antihistamine that delivers all-day relief without interfering with driving or work."
    },
    "albuterol": {
        "name": "Albuterol Inhaler 90mcg",
        "generic_name": "Albuterol Sulfate / Salbutamol",
        "brand_names": ["Ventolin", "ProAir", "Proventil", "Asthalin"],
        "category": "Bronchodilator (Rescue Inhaler)",
        "price": 28.0,
        "quantity": 1,
        "dosage_form": "Metered Dose Inhaler (200 actuations)",
        "indications": "Acute asthma attacks, wheezing, shortness of breath, exercise-induced bronchospasm, COPD",
        "dosage": "1 to 2 inhalations every 4 to 6 hours as needed for shortness of breath",
        "side_effects": "Mild tremor, temporary rapid heart rate (palpitations), nervousness",
        "prescription_required": True,
        "description": "Fast-acting rescue inhaler that opens airways in the lungs within minutes during acute breathing difficulty."
    },
    "fluticasone": {
        "name": "Fluticasone Nasal Spray 50mcg",
        "generic_name": "Fluticasone Propionate",
        "brand_names": ["Flonase", "Flovent"],
        "category": "Corticosteroid Nasal Spray",
        "price": 16.99,
        "quantity": 1,
        "dosage_form": "Nasal Spray (120 sprays)",
        "indications": "Chronic nasal congestion, sinus inflammation, seasonal runny nose, itchy sneezing",
        "dosage": "1 to 2 sprays in each nostril once daily",
        "side_effects": "Mild nasal dryness, occasional nosebleed, unpleasant taste",
        "prescription_required": False,
        "description": "Anti-inflammatory corticosteroid spray that treats the root cause of chronic sinus blockage and allergic congestion."
    },
    "montelukast": {
        "name": "Montelukast 10mg",
        "generic_name": "Montelukast Sodium",
        "brand_names": ["Singulair"],
        "category": "Leukotriene Receptor Antagonist",
        "price": 21.0,
        "quantity": 30,
        "dosage_form": "Tablets",
        "indications": "Long-term asthma prevention, exercise-induced asthma, allergic rhinitis",
        "dosage": "One 10mg tablet taken once daily in the evening",
        "side_effects": "Headache, mood changes (rare), abdominal discomfort",
        "prescription_required": True,
        "description": "Daily preventive oral medication that blocks leukotrienes to prevent airway swelling and chronic asthma attacks."
    },
    "pseudoephedrine": {
        "name": "Pseudoephedrine 30mg",
        "generic_name": "Pseudoephedrine Hydrochloride",
        "brand_names": ["Sudafed", "Sinutab"],
        "category": "Nasal & Sinus Decongestant",
        "price": 8.99,
        "quantity": 24,
        "dosage_form": "Tablets",
        "indications": "Severe sinus pressure, blocked nasal passages, common cold congestion",
        "dosage": "30mg to 60mg every 4 to 6 hours; maximum 240mg/day",
        "side_effects": "Elevated blood pressure, restlessness, insomnia; avoid before sleep",
        "prescription_required": False,
        "description": "Powerful oral decongestant that shrinks swollen nasal membranes to clear clogged sinuses."
    },
    "dextromethorphan": {
        "name": "Dextromethorphan Syrup 15mg/5mL",
        "generic_name": "Dextromethorphan HBr",
        "brand_names": ["Delsym", "Robitussin DM", "Benylin"],
        "category": "Cough Suppressant (Antitussive)",
        "price": 9.49,
        "quantity": 1,
        "dosage_form": "Cough Syrup (150mL)",
        "indications": "Dry irritating cough, tickling throat cough, nighttime coughing fits",
        "dosage": "10mL to 20mL every 4 to 6 hours as needed; maximum 120mg/day",
        "side_effects": "Dizziness, mild drowsiness, nausea",
        "prescription_required": False,
        "description": "Targeted cough suppressant that calms the cough reflex center in the brain for dry, non-productive coughs."
    },
    "guaifenesin": {
        "name": "Guaifenesin 600mg",
        "generic_name": "Guaifenesin",
        "brand_names": ["Mucinex", "Robitussin Mucus"],
        "category": "Expectorant",
        "price": 13.5,
        "quantity": 20,
        "dosage_form": "Extended-Release Tablets",
        "indications": "Chest congestion, thick bronchial mucus, productive wet cough",
        "dosage": "600mg to 1200mg every 12 hours with a large glass of water",
        "side_effects": "Stomach upset, nausea (rare); stay well-hydrated",
        "prescription_required": False,
        "description": "Chest decongestant expectorant that thins and loosens heavy mucus, making wet coughs more productive."
    },
    "omeprazole": {
        "name": "Omeprazole 20mg",
        "generic_name": "Omeprazole",
        "brand_names": ["Prilosec", "Losec", "Omez"],
        "category": "Proton Pump Inhibitor (PPI)",
        "price": 11.99,
        "quantity": 28,
        "dosage_form": "Delayed-Release Capsules",
        "indications": "GERD, frequent heartburn, acid indigestion, stomach ulcers, gastritis",
        "dosage": "One 20mg capsule once daily in the morning 30 minutes before breakfast",
        "side_effects": "Headache, mild abdominal pain, constipation or diarrhea",
        "prescription_required": False,
        "description": "Long-lasting stomach acid reducer that shuts down acid pumps to heal ulcers and stop severe heartburn."
    },
    "pantoprazole": {
        "name": "Pantoprazole 40mg",
        "generic_name": "Pantoprazole Sodium",
        "brand_names": ["Protonix", "Pantocid", "Pan"],
        "category": "Proton Pump Inhibitor (PPI)",
        "price": 14.75,
        "quantity": 30,
        "dosage_form": "Enteric-Coated Tablets",
        "indications": "Erosive esophagitis, persistent acid reflux, Zollinger-Ellison syndrome",
        "dosage": "40mg once daily taken before a meal with water",
        "side_effects": "Headache, nausea, joint pain",
        "prescription_required": True,
        "description": "Prescription-grade acid suppressor designed to heal acid-eroded esophageal tissue and prevent chronic reflux."
    },
    "ranitidine": {
        "name": "Famotidine 20mg",
        "generic_name": "Famotidine (Ranitidine alternative)",
        "brand_names": ["Pepcid AC", "Zantac 360"],
        "category": "H2 Receptor Blocker",
        "price": 8.5,
        "quantity": 30,
        "dosage_form": "Tablets",
        "indications": "Immediate relief and prevention of heartburn, acid indigestion, sour stomach",
        "dosage": "10mg to 20mg taken 15-60 minutes before eating food or beverages that cause heartburn",
        "side_effects": "Headache, dizziness, mild constipation",
        "prescription_required": False,
        "description": "Fast-acting H2 blocker that reduces acid within 30 minutes, ideal for meal-triggered indigestion."
    },
    "ondansetron": {
        "name": "Ondansetron 4mg",
        "generic_name": "Ondansetron Hydrochloride",
        "brand_names": ["Zofran", "Emeset"],
        "category": "Antiemetic (5-HT3 Antagonist)",
        "price": 18.0,
        "quantity": 10,
        "dosage_form": "Orally Disintegrating Tablets (ODT)",
        "indications": "Nausea, vomiting, post-operative sickness, chemotherapy or gastroenteritis nausea",
        "dosage": "4mg to 8mg dissolved on tongue 30 minutes before anticipated nausea or as prescribed",
        "side_effects": "Headache, constipation, sensation of warmth",
        "prescription_required": True,
        "description": "Gold-standard fast-dissolving antiemetic that blocks serotonin signals in the gut to stop severe nausea and vomiting."
    },
    "loperamide": {
        "name": "Loperamide 2mg",
        "generic_name": "Loperamide Hydrochloride",
        "brand_names": ["Imodium", "Diamode"],
        "category": "Antidiarrheal",
        "price": 7.25,
        "quantity": 24,
        "dosage_form": "Caplets",
        "indications": "Acute diarrhea, traveler's diarrhea, sudden loose stools",
        "dosage": "4mg initially (2 caplets), followed by 2mg after each unformed loose stool; max 8mg/day OTC",
        "side_effects": "Constipation, mild abdominal cramps, drowsiness",
        "prescription_required": False,
        "description": "Fast-acting antimotility medication that slows digestive contractions to quickly halt watery diarrhea."
    },
    "lisinopril": {
        "name": "Lisinopril 10mg",
        "generic_name": "Lisinopril",
        "brand_names": ["Prinivil", "Zestril"],
        "category": "ACE Inhibitor (Blood Pressure)",
        "price": 8.75,
        "quantity": 30,
        "dosage_form": "Tablets",
        "indications": "High blood pressure (hypertension), congestive heart failure, post-myocardial infarction recovery",
        "dosage": "10mg to 20mg once daily; maintain consistent timing every day",
        "side_effects": "Persistent dry cough, dizziness, elevated potassium levels",
        "prescription_required": True,
        "description": "Widely used ACE inhibitor that relaxes blood vessels to lower blood pressure and protect the heart and kidneys."
    },
    "amlodipine": {
        "name": "Amlodipine 5mg",
        "generic_name": "Amlodipine Besylate",
        "brand_names": ["Norvasc", "Amlong"],
        "category": "Calcium Channel Blocker (CCB)",
        "price": 9.5,
        "quantity": 30,
        "dosage_form": "Tablets",
        "indications": "Hypertension, chronic stable angina, coronary artery disease",
        "dosage": "5mg once daily; can be increased to 10mg if needed under medical direction",
        "side_effects": "Swelling in ankles/feet (peripheral edema), flushing, fatigue",
        "prescription_required": True,
        "description": "Calcium channel blocker that dilates blood vessels, improving blood flow and reducing heart strain."
    },
    "metoprolol": {
        "name": "Metoprolol 50mg",
        "generic_name": "Metoprolol Tartrate / Succinate",
        "brand_names": ["Lopressor", "Toprol-XL"],
        "category": "Beta-Blocker (Cardioselective)",
        "price": 7.25,
        "quantity": 30,
        "dosage_form": "Tablets",
        "indications": "High blood pressure, tachycardia, angina, heart failure, migraine prevention",
        "dosage": "25mg to 100mg daily with or immediately after meals",
        "side_effects": "Bradycardia (slow heart rate), tiredness, cold hands and feet",
        "prescription_required": True,
        "description": "Beta-blocker that slows resting heart rate and reduces force of cardiac contraction to ease cardiovascular workload."
    },
    "losartan": {
        "name": "Losartan 50mg",
        "generic_name": "Losartan Potassium",
        "brand_names": ["Cozaar"],
        "category": "Angiotensin II Receptor Blocker (ARB)",
        "price": 12.0,
        "quantity": 30,
        "dosage_form": "Tablets",
        "indications": "Hypertension, diabetic nephropathy, stroke risk reduction in cardiac patients",
        "dosage": "50mg once daily, with or without food",
        "side_effects": "Dizziness, back pain, nasal congestion (no dry cough unlike ACE inhibitors)",
        "prescription_required": True,
        "description": "Effective blood pressure reducer and kidney protector for patients who develop a cough from ACE inhibitors."
    },
    "hydrochlorothiazide": {
        "name": "Hydrochlorothiazide (HCTZ) 25mg",
        "generic_name": "Hydrochlorothiazide",
        "brand_names": ["Microzide", "Esidrix"],
        "category": "Thiazide Diuretic (Water Pill)",
        "price": 6.99,
        "quantity": 30,
        "dosage_form": "Tablets",
        "indications": "High blood pressure, fluid retention and swelling (edema) from heart failure",
        "dosage": "12.5mg to 25mg once daily in the morning to avoid nighttime urination",
        "side_effects": "Increased urination, low potassium, dehydration, mild dizziness",
        "prescription_required": True,
        "description": "First-line diuretic that helps kidneys remove extra water and salt from the body to lower vascular pressure."
    },
    "furosemide": {
        "name": "Furosemide 40mg",
        "generic_name": "Furosemide",
        "brand_names": ["Lasix"],
        "category": "Loop Diuretic",
        "price": 8.5,
        "quantity": 30,
        "dosage_form": "Tablets",
        "indications": "Severe fluid overload, congestive heart failure edema, pulmonary edema, liver cirrhosis ascites",
        "dosage": "20mg to 80mg once daily in the morning",
        "side_effects": "Frequent urination, electrolyte loss (potassium/magnesium), low blood pressure",
        "prescription_required": True,
        "description": "Potent loop diuretic that rapidly eliminates excess fluid accumulation in patients with heart or renal conditions."
    },
    "atorvastatin": {
        "name": "Atorvastatin 20mg",
        "generic_name": "Atorvastatin Calcium",
        "brand_names": ["Lipitor", "Atorva"],
        "category": "Statin (Cholesterol Reducer)",
        "price": 15.25,
        "quantity": 30,
        "dosage_form": "Tablets",
        "indications": "High cholesterol (hyperlipidemia), atherosclerosis, cardiovascular risk and stroke prevention",
        "dosage": "10mg to 40mg once daily in the evening",
        "side_effects": "Muscle aches, mild digestive upset; avoid grapefruit products",
        "prescription_required": True,
        "description": "Leading statin therapy that lowers LDL ('bad') cholesterol and triglycerides while raising HDL ('good') cholesterol."
    },
    "metformin": {
        "name": "Metformin 500mg",
        "generic_name": "Metformin Hydrochloride",
        "brand_names": ["Glucophage", "Fortamet", "Glycomet"],
        "category": "Oral Antidiabetic (Biguanide)",
        "price": 12.5,
        "quantity": 60,
        "dosage_form": "Extended-Release Tablets",
        "indications": "Type 2 diabetes mellitus, insulin resistance, polycystic ovary syndrome (PCOS)",
        "dosage": "500mg once or twice daily taken with meals to minimize stomach upset",
        "side_effects": "Nausea, diarrhea, metallic taste; take with meals",
        "prescription_required": True,
        "description": "Cornerstone medication for type 2 diabetes that improves insulin sensitivity and decreases liver glucose output."
    },
    "glipizide": {
        "name": "Glipizide 5mg",
        "generic_name": "Glipizide",
        "brand_names": ["Glucotrol", "Glucotrol XL"],
        "category": "Sulfonylurea Antidiabetic",
        "price": 10.25,
        "quantity": 30,
        "dosage_form": "Tablets",
        "indications": "Type 2 diabetes glycemic management alongside diet and exercise",
        "dosage": "5mg taken 30 minutes before the first meal of the day",
        "side_effects": "Hypoglycemia (low blood sugar), hunger, weight gain",
        "prescription_required": True,
        "description": "Stimulates pancreatic beta cells to produce and secrete more natural insulin into the bloodstream after meals."
    },
    "levothyroxine": {
        "name": "Levothyroxine 50mcg",
        "generic_name": "Levothyroxine Sodium",
        "brand_names": ["Synthroid", "Levoxyl", "Eltroxin", "Thyronorm"],
        "category": "Thyroid Hormone Replacement",
        "price": 13.99,
        "quantity": 30,
        "dosage_form": "Tablets",
        "indications": "Hypothyroidism (underactive thyroid), enlarged thyroid gland (goiter)",
        "dosage": "Taken once daily on an empty stomach with water 30-60 minutes before breakfast",
        "side_effects": "Palpitations or sweating if dose is too high; requires periodic TSH blood tests",
        "prescription_required": True,
        "description": "Exact synthetic replica of the natural T4 thyroid hormone, restoring energy, metabolism, and endocrine balance."
    },
    "sertraline": {
        "name": "Sertraline 50mg",
        "generic_name": "Sertraline Hydrochloride",
        "brand_names": ["Zoloft", "Daxid"],
        "category": "SSRI Antidepressant",
        "price": 13.75,
        "quantity": 30,
        "dosage_form": "Tablets",
        "indications": "Major depression, panic disorder, obsessive-compulsive disorder (OCD), social anxiety, PTSD",
        "dosage": "50mg once daily in morning or evening; full therapeutic benefit in 4 to 6 weeks",
        "side_effects": "Transient nausea, insomnia, sexual dysfunction, mild tremor",
        "prescription_required": True,
        "description": "Standard selective serotonin reuptake inhibitor (SSRI) that rebalances brain serotonin levels for mood and anxiety."
    },
    "escitalopram": {
        "name": "Escitalopram 10mg",
        "generic_name": "Escitalopram Oxalate",
        "brand_names": ["Lexapro", "Cipralex"],
        "category": "SSRI Antidepressant",
        "price": 16.0,
        "quantity": 30,
        "dosage_form": "Tablets",
        "indications": "Generalized anxiety disorder (GAD), clinical depression",
        "dosage": "10mg once daily in morning or evening",
        "side_effects": "Mild nausea, sleep disturbances, fatigue",
        "prescription_required": True,
        "description": "Highly selective serotonin reuptake inhibitor known for its high tolerability and efficacy in anxiety and depression."
    },
    "gabapentin": {
        "name": "Gabapentin 300mg",
        "generic_name": "Gabapentin",
        "brand_names": ["Neurontin", "Gralise"],
        "category": "Anticonvulsant / Neuropathic Analgesic",
        "price": 14.5,
        "quantity": 30,
        "dosage_form": "Capsules",
        "indications": "Neuropathic nerve pain, diabetic nerve damage, post-shingles neuralgia, restless legs syndrome",
        "dosage": "300mg once to three times daily as directed",
        "side_effects": "Drowsiness, dizziness, unsteadiness, peripheral edema",
        "prescription_required": True,
        "description": "Targeted nerve pain stabilizer that calms overactive nerve firing caused by diabetes, shingles, or spinal compression."
    },
    "melatonin": {
        "name": "Melatonin 5mg",
        "generic_name": "Melatonin",
        "brand_names": ["Natrol Melatonin", "Nature Made"],
        "category": "Natural Sleep Supplement",
        "price": 8.99,
        "quantity": 60,
        "dosage_form": "Gummies / Fast-Dissolve Tablets",
        "indications": "Insomnia, delayed sleep phase syndrome, jet lag, irregular sleep schedule",
        "dosage": "3mg to 5mg taken 30 to 60 minutes before desired bedtime",
        "side_effects": "Vivid dreams, morning grogginess if taken too late",
        "prescription_required": False,
        "description": "Natural neurohormone supplement that signals the body it is time to sleep and resets disrupted circadian rhythms."
    },
    "vitamin_d3": {
        "name": "Vitamin D3 2000 IU",
        "generic_name": "Cholecalciferol",
        "brand_names": ["Nature's Bounty D3", "Centrum D3"],
        "category": "Essential Vitamin",
        "price": 9.99,
        "quantity": 100,
        "dosage_form": "Softgels",
        "indications": "Vitamin D deficiency, bone health, calcium absorption, immune system support, fatigue",
        "dosage": "1 softgel (2000 IU) daily with a meal containing healthy fats",
        "side_effects": "Safe when taken as directed",
        "prescription_required": False,
        "description": "Crucial fat-soluble vitamin that strengthens bone density, supports cardiovascular health, and boosts immune defenses."
    },
    "multivitamin": {
        "name": "Daily Complete Multivitamin",
        "generic_name": "Multivitamin & Minerals Complex",
        "brand_names": ["Centrum", "One A Day"],
        "category": "Nutritional Supplement",
        "price": 14.99,
        "quantity": 90,
        "dosage_form": "Tablets",
        "indications": "Daily nutritional insurance, general vitality, metabolic support, immune wellness",
        "dosage": "1 tablet daily with a full meal and water",
        "side_effects": "Mild stomach upset if taken on an empty stomach; bright yellow urine (harmless B-vitamins)",
        "prescription_required": False,
        "description": "Balanced daily dietary supplement delivering essential vitamins A, C, D, E, B-complex, Zinc, and Iron."
    }
}

# Precomputed alias mapping for fast natural language matching
_ALIAS_MAP = {}
for key, drug in DRUG_DB.items():
    _ALIAS_MAP[key] = key
    _ALIAS_MAP[drug["name"].lower()] = key
    _ALIAS_MAP[drug["generic_name"].lower()] = key
    for brand in drug.get("brand_names", []):
        _ALIAS_MAP[brand.lower()] = key

# Common informal and spoken aliases
_EXTRA_ALIASES = {
    "paracetamol": "acetaminophen",
    "crocin": "acetaminophen",
    "dolo": "acetaminophen",
    "calpol": "acetaminophen",
    "panadol": "acetaminophen",
    "tylenol": "acetaminophen",
    "advil": "ibuprofen",
    "motrin": "ibuprofen",
    "nurofen": "ibuprofen",
    "bayer": "aspirin",
    "z-pak": "azithromycin",
    "zpak": "azithromycin",
    "zithromax": "azithromycin",
    "zyrtec": "cetirizine",
    "claritin": "loratadine",
    "allegra": "fexofenadine",
    "benadryl": "diphenhydramine",
    "ventolin": "albuterol",
    "proair": "albuterol",
    "inhaler": "albuterol",
    "flonase": "fluticasone",
    "singulair": "montelukast",
    "sudafed": "pseudoephedrine",
    "mucinex": "guaifenesin",
    "prilosec": "omeprazole",
    "protonix": "pantoprazole",
    "pepcid": "ranitidine",
    "zantac": "ranitidine",
    "zofran": "ondansetron",
    "imodium": "loperamide",
    "lasix": "furosemide",
    "lipitor": "atorvastatin",
    "glucophage": "metformin",
    "synthroid": "levothyroxine",
    "zoloft": "sertraline",
    "lexapro": "escitalopram",
    "neurontin": "gabapentin",
    "vitamin d": "vitamin_d3",
    "d3": "vitamin_d3",
    "vit d": "vitamin_d3",
    "multi": "multivitamin"
}
_ALIAS_MAP.update(_EXTRA_ALIASES)


def find_drug_key(query: str):
    """Smart lookup helper that resolves drug names, brand names, or aliases."""
    if not query:
        return None

    cleaned = query.strip().lower()

    # 1. Direct alias match
    if cleaned in _ALIAS_MAP:
        return _ALIAS_MAP[cleaned]

    # 2. Check if query is contained in key or vice-versa
    for alias, target_key in _ALIAS_MAP.items():
        if cleaned == alias or cleaned in alias or alias in cleaned:
            return target_key

    # 3. Check within names, descriptions, or indications
    for key, drug in DRUG_DB.items():
        searchable_text = f"{drug['name']} {drug['generic_name']} {drug.get('indications', '')} {drug.get('category', '')}".lower()
        if cleaned in searchable_text:
            return key

    return None


def get_drug_info(drug_name: str):
    """
    Get detailed drug information by generic name, brand name, or medical condition.
    Returns: name, category, indications, dosage, price, quantity, side effects, prescription status.
    """
    target_key = find_drug_key(drug_name)

    if target_key and target_key in DRUG_DB:
        drug = DRUG_DB[target_key]
        return {
            "name": drug["name"],
            "generic_name": drug["generic_name"],
            "brand_names": drug.get("brand_names", []),
            "category": drug["category"],
            "indications": drug.get("indications", ""),
            "description": drug["description"],
            "dosage": drug.get("dosage", "As directed by physician"),
            "dosage_form": drug.get("dosage_form", "Tablets"),
            "side_effects": drug.get("side_effects", "None noted"),
            "prescription_required": drug.get("prescription_required", False),
            "price": drug["price"],
            "quantity": drug["quantity"]
        }

    # If not found directly, check for symptom suggestions
    symptom_matches = search_by_symptom(drug_name)
    if symptom_matches and "matching_drugs" in symptom_matches:
        return {
            "error": f"Drug '{drug_name}' was not found as a specific medication name.",
            "suggestion": f"Did you mean one of these treatments for '{drug_name}'?",
            "recommendations": symptom_matches["matching_drugs"]
        }

    return {"error": f"Drug or medication '{drug_name}' not found in pharmacy database."}


def search_by_symptom(symptom_or_condition: str):
    """
    Search for recommended medications based on a patient's symptom or condition
    (e.g., headache, fever, cough, allergies, blood pressure, acid reflux).
    """
    query = symptom_or_condition.strip().lower()
    matches = []

    for key, drug in DRUG_DB.items():
        search_blob = f"{drug.get('indications', '')} {drug.get('category', '')} {drug.get('description', '')}".lower()
        if query in search_blob:
            matches.append({
                "drug": drug["name"],
                "category": drug["category"],
                "best_for": drug.get("indications", ""),
                "price": f"${drug['price']:.2f}",
                "prescription_required": drug.get("prescription_required", False)
            })

    if matches:
        return {
            "query": symptom_or_condition,
            "total_found": len(matches),
            "matching_drugs": matches[:4]
        }

    return {"message": f"No specific medications found for condition '{symptom_or_condition}'."}


def place_order(customer_name: str, drug_name: str, quantity: int = 1):
    """
    Place a pharmacy order for a specified customer and medication.
    Automatically resolves brand names and checks prescription requirements.
    """
    target_key = find_drug_key(drug_name)
    if not target_key or target_key not in DRUG_DB:
        return {"error": f"Cannot place order: Medication '{drug_name}' was not found in our catalog."}

    drug = DRUG_DB[target_key]
    order_id = ORDERS_DB["next_id"]
    ORDERS_DB["next_id"] += 1

    try:
        qty = int(quantity) if quantity and int(quantity) > 0 else 1
    except (ValueError, TypeError):
        qty = 1

    unit_price = drug["price"]
    total_price = round(unit_price * qty, 2)

    order = {
        "id": order_id,
        "customer": customer_name.strip(),
        "drug": drug["name"],
        "package_size": drug["quantity"],
        "order_quantity": qty,
        "unit_price": unit_price,
        "total": total_price,
        "prescription_required": drug.get("prescription_required", False),
        "status": "prescription_check" if drug.get("prescription_required") else "confirmed"
    }
    ORDERS_DB["orders"][order_id] = order

    rx_note = " (Prescription verification needed upon delivery)" if order["prescription_required"] else ""

    return {
        "order_id": order_id,
        "message": f"Order #{order_id} successfully created for {customer_name}: {qty} pack(s) of {drug['name']} for ${total_price:.2f}.{rx_note}",
        "customer": customer_name,
        "drug": drug["name"],
        "total": total_price,
        "status": order["status"]
    }


def lookup_order(order_id):
    """Look up an existing order by its Order ID."""
    try:
        oid = int(order_id)
    except (ValueError, TypeError):
        return {"error": f"Invalid Order ID format: '{order_id}'. Please provide a valid numeric ID."}

    order = ORDERS_DB["orders"].get(oid)
    if order:
        return {
            "order_id": order["id"],
            "customer": order["customer"],
            "drug": order["drug"],
            "quantity": order.get("order_quantity", 1),
            "total": f"${order['total']:.2f}",
            "status": order["status"],
            "prescription_required": order.get("prescription_required", False)
        }

    return {"error": f"Order #{order_id} not found in our records."}


# Function mapping dictionary for external tool invocation
FUNCTION_MAP = {
    'get_drug_info': get_drug_info,
    'place_order': place_order,
    'lookup_order': lookup_order,
    'search_by_symptom': search_by_symptom
}
