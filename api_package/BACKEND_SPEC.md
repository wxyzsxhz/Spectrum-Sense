# API Specification for Backend Developer

### Request Format M-CHAT (12-36 months)

```json
{
  "Age": 24,                    // ALWAYS IN MONTHS (12-36)
  "Gender": "male",             // "male" or "female"
  "Jaundice": "no",             // "yes" or "no"
  "Family_ASD_History": "yes",  // "yes" or "no"
  "Q1": "yes",                  // All questions are "yes" or "no"
  "Q2": "no",
  "Q3": "yes",
  // ... continue Q4 through Q23
  "Q23": "yes"
}
```

**Total fields: 27**
- 4 demographic fields (Age in months, Gender, Jaundice, Family_ASD_History)
- 23 questions (Q1-Q23)

---

### Request Format AQ (36-132 months / 3-11 years)

```json
{
  "Age": 84,                    // ALWAYS IN MONTHS (84 months = 7 years)
  "Gender": "female",           // "male" or "female"
  "Jaundice": "no",             // "yes" or "no"
  "Family_ASD_History": "no",   // "yes" or "no"
  "Q1": 2,                      // Questions are scored 0-3
  "Q2": 1,                      // 0 = Definitely agree
  "Q3": 0,                      // 1 = Slightly agree
  // ... continue Q4 through Q30 // 2 = Slightly disagree
  "Q30": 3                      // 3 = Definitely disagree
}
```

**Total fields: 34**
- 4 demographic fields (Age in months, Gender, Jaundice, Family_ASD_History)
- 30 questions (Q1-Q30)

---

## ✨ What API Does Automatically

### 1. **Age-Based Routing**
You don't need to decide which model to use! The API automatically:
- Ages 12-36 months → M-CHAT model
- Ages 3-11 years → AQ model
- Ages outside range → Returns clear error

### 2. **Data Preprocessing**
- ✅ Converts "yes"/"no" to 1/0
- ✅ Encodes gender
- ✅ Handles all the messy ML stuff

---

## 📥 What API Returns (Output)

```json
{
  "model_used": "mchat",              // Which model was used
  "age": 24,                           // Age from input
  "age_unit": "months",                // "months" or "years"
  "prediction": 1,                     // 0 = No ASD, 1 = ASD
  "prediction_label": "ASD",           // Human-readable
  "confidence": 0.85,                  // Model confidence (0-1)
  "risk_percentage": 85.0,             // Risk as percentage (0-100)
  "risk_category": "High Risk",        // "Low Risk", "Medium Risk", or "High Risk"
  "probabilities": {
    "no_asd": 0.15,                    // Probability of no ASD
    "asd": 0.85                        // Probability of ASD
  }
}
```

---

## 🔌 API Endpoint

**Single endpoint for everything:**
```
POST http://localhost:5000/predict
Content-Type: application/json
```

No need to choose `/predict/mchat` or `/predict/aq` - the API figures it out!

---

**ALWAYS send age in MONTHS!**

The API will:
1. Check the age
2. Route to the correct model automatically
3. Convert units if needed internally

### Age Ranges:
- **12-36 months** → M-CHAT model
- **37-132 months (3-11 years)** → AQ model
- **< 12 months** → Error (too young)
- **> 132 months** → Error (too old)

### Examples:
```javascript
// 2-year-old child (24 months) → M-CHAT
{ "Age": 24, ... }  ✅

// 7-year-old child (84 months) → AQ  
{ "Age": 84, ... }  ✅

// 1-year-old (12 months) → M-CHAT (minimum)
{ "Age": 12, ... }  ✅

// 3-year-old (36 months) → M-CHAT (maximum)
{ "Age": 36, ... }  ✅

// 3-year-old + 1 day (37 months) → AQ (minimum)
{ "Age": 37, ... }  ✅

// 11-year-old (132 months) → AQ (maximum)
{ "Age": 132, ... }  ✅

// 6-month-old → Error (too young)
{ "Age": 6, ... }  ❌

// 12-year-old (144 months) → Error (too old)
{ "Age": 144, ... }  ❌
```

---

## 💻 Complete Integration Example (Node.js)

```javascript
const axios = require('axios');

async function getASDScreening(formData) {
  try {
    // Just send the raw form data - API handles everything!
    const response = await axios.post(
      'http://localhost:5000/predict',
      formData,
      { headers: { 'Content-Type': 'application/json' } }
    );

    // Response has everything you need
    const result = response.data;
    
    console.log(`Risk: ${result.risk_percentage}%`);
    console.log(`Category: ${result.risk_category}`);
    console.log(`Recommendation: ${result.interpretation.recommendation}`);
    
    return result;
    
  } catch (error) {
    if (error.response) {
      // API returned an error
      console.error('API Error:', error.response.data);
    } else {
      // Network error
      console.error('Cannot connect to ML API');
    }
    throw error;
  }
}

// Example usage - M-CHAT (24 months old)
await getASDScreening({
  Age: 24,  // Always in months!
  Gender: "male",
  Jaundice: "no",
  Family_ASD_History: "yes",
  Q1: "yes",
  Q2: "no",
  // ... Q3-Q23
});

// Example usage - AQ (7 years = 84 months)
await getASDScreening({
  Age: 84,  // Always in months! (7 years × 12 = 84 months)
  Gender: "female", 
  Jaundice: "no",
  Family_ASD_History: "no",
  Q1: 2,
  Q2: 1,
  // ... Q3-Q30
});
```

---

## ❌ Error Responses

### Missing Fields
```json
{
  "error": "Missing required fields",
  "missing_fields": ["Q15", "Q16", "Q23"]
}
```

### Age Out of Range
```json
{
  "error": "Age out of range",
  "message": "Child is too young (age 8). M-CHAT is for 12-36 months..."
}
```

### API Not Running
```
Connection refused / Network error
```
Make sure Flask API is running: `python app.py`

---

## 🎯 Key Takeaways

1. **Age is ALWAYS in months** - No conversion needed on your end!
2. **You only send raw questionnaire data** - No feature engineering needed!
3. **One endpoint** - API routes automatically based on age
4. **Simple format** - JSON in, JSON out
5. **Clear errors** - API tells you exactly what's wrong

---

The API is designed to be simple for you - just send the form data and get predictions back! 🚀
