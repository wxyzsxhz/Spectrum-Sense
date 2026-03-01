from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os
import traceback

# ============================================================================
# FLASK APP INITIALIZATION
# ============================================================================

app = Flask(__name__)
CORS(app) 

# ============================================================================
# LOAD TRAINED MODELS AND FEATURE NAMES
# ============================================================================

print("Loading trained models...")

try:
    # Load M-CHAT model (for 12-36 months)
    MCHAT_MODEL = joblib.load('api_package/outputs/mchat_model.pkl')
    MCHAT_FEATURES = joblib.load('api_package/outputs/mchat_feature_names.pkl')
    print("✓ M-CHAT model loaded successfully")
    print(f"  Expected features: {len(MCHAT_FEATURES)}")
except Exception as e:
    print(f"⚠ Warning: Could not load M-CHAT model: {e}")
    MCHAT_MODEL = None
    MCHAT_FEATURES = None

try:
    # Load AQ model (for 3-11 years)
    AQ_MODEL = joblib.load('api_package/outputs/aq_model.pkl')
    AQ_FEATURES = joblib.load('api_package/outputs/aq_feature_names.pkl')
    print("✓ AQ model loaded successfully")
    print(f"  Expected features: {len(AQ_FEATURES)}")
except Exception as e:
    print(f"⚠ Warning: Could not load AQ model: {e}")
    AQ_MODEL = None
    AQ_FEATURES = None


# ============================================================================
# HELPER FUNCTIONS FOR DATA PREPROCESSING
# ============================================================================

def preprocess_mchat_data(data):
    """Preprocess M-CHAT data - MATCHES train_mchat_raw.py EXACTLY"""
    df = pd.DataFrame([data])
    
    # 1. Encode binary yes/no columns
    binary_columns = ['Jaundice', 'Family_ASD_History'] + [f'Q{i}' for i in range(1, 24)]
    for col in binary_columns:
        if col in df.columns:
            if df[col].dtype == 'object':
                df[col] = (df[col].str.lower() == 'yes').astype(int)
            else:
                df[col] = df[col].astype(int)
    
    # 2. Encode gender
    if 'Gender' in df.columns:
        if df['Gender'].dtype == 'object':
            df['Gender'] = (df['Gender'].str.lower() == 'male').astype(int)
        else:
            df['Gender'] = df['Gender'].astype(int)
    
    # 3. FEATURE ENGINEERING - EXACTLY AS IN train_mchat_raw.py
    
    # Define M-CHAT clinical parameters
    BEST7_QUESTIONS = [2, 5, 7, 9, 14, 15, 20]
    INVERTED_QUESTIONS = [11, 18, 20, 22]
    
    # Helper function to count failures
    def count_failures(row, questions, inverted):
        """Count failed responses for given questions"""
        count = 0
        for q in questions:
            q_col = f'Q{q}'
            if q in inverted:
                if row[q_col] == 1:  # Yes = Failed
                    count += 1
            else:
                if row[q_col] == 0:  # No = Failed
                    count += 1
        return count
    
    # Best7 scoring features - NOTE THE SIMPLE NAMES!
    df['Best7_Failed'] = df.apply(
        lambda row: count_failures(row, BEST7_QUESTIONS, INVERTED_QUESTIONS), 
        axis=1
    )
    
    all_questions = list(range(1, 24))
    df['Total_Failed'] = df.apply(
        lambda row: count_failures(row, all_questions, INVERTED_QUESTIONS),
        axis=1
    )
    
    # Domain-specific features - NOTE THE SIMPLE NAMES!
    domain_qs = {
        'Social': [2,9,10,12,19,23],
        'Communication': [6,7,14,15,17,21],
        'Imitation': [5,13],
        'Motor': [1,3,4,8,16],
        'Sensory': [11,18,20,22]
    }
    
    for domain, qs in domain_qs.items():
        df[f'{domain}_Failed'] = df.apply(
            lambda row: count_failures(row, qs, INVERTED_QUESTIONS),
            axis=1
        )
    
    # Ensure all expected features are present and in correct order
    for feature in MCHAT_FEATURES:
        if feature not in df.columns:
            df[feature] = 0
    
    return df[MCHAT_FEATURES]


def preprocess_aq_data(data):
    """Preprocess AQ data - MATCHES train_aq_raw.py EXACTLY"""
    df = pd.DataFrame([data])
    
    # 1. Encode binary columns
    df['Jaundice'] = (df['Jaundice'].str.lower() == 'yes').astype(int) if df['Jaundice'].dtype == 'object' else df['Jaundice'].astype(int)
    df['Family_ASD_History'] = (df['Family_ASD_History'].str.lower() == 'yes').astype(int) if df['Family_ASD_History'].dtype == 'object' else df['Family_ASD_History'].astype(int)
    
    # 2. Encode gender
    if df['Gender'].dtype == 'object':
        df['Gender'] = (df['Gender'].str.lower() == 'male').astype(int)
    else:
        df['Gender'] = df['Gender'].astype(int)
    
    # 3. FEATURE ENGINEERING - EXACTLY AS IN train_aq_raw.py
    
    # Define AQ-Child subscales
    subscales = {
        'Social': ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'],
        'Switching': ['Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12'],
        'Detail': ['Q13', 'Q14', 'Q15', 'Q16', 'Q17', 'Q18'],
        'Communication': ['Q19', 'Q20', 'Q21', 'Q22', 'Q23', 'Q24', 'Q25'],
        'Imagination': ['Q26', 'Q27', 'Q28', 'Q29', 'Q30']
    }
    
    question_cols = [f'Q{i}' for i in range(1, 31)]
    
    # Subscale mean scores
    for subscale_name, questions in subscales.items():
        df[f'{subscale_name}_Mean'] = df[questions].mean(axis=1)
    
    # Total AQ score - NOTE THE NAME!
    df['AQ_Total_Score'] = df[question_cols].sum(axis=1)  # ← AQ_Total_Score, not AQ_Total!
    
    # High-score patterns (scores 2-3 indicate autistic-like responses)
    df['High_Score_Count'] = (df[question_cols] >= 2).sum(axis=1)
    
    # Variability (ASD shows uneven profile)
    df['Score_STD'] = df[question_cols].std(axis=1)
    
    # Subscale variability
    subscale_means = [df[f'{name}_Mean'] for name in subscales.keys()]
    df['Subscale_STD'] = pd.DataFrame(subscale_means).T.std(axis=1).values
    
    # Interaction features - EXACTLY AS IN TRAINING
    df['Social_x_Communication'] = df['Social_Mean'] * df['Communication_Mean']
    df['Family_x_HighScore'] = df['Family_ASD_History'] * df['High_Score_Count']
    df['Male_x_Family'] = df['Gender'] * df['Family_ASD_History']
    
    # Ensure all expected features are present and in correct order
    for feature in AQ_FEATURES:
        if feature not in df.columns:
            df[feature] = 0
    
    return df[AQ_FEATURES]


def categorize_risk(percentage):
    if percentage < 30:
        return 'Low Risk'
    elif percentage < 70:
        return 'Medium Risk'
    else:
        return 'High Risk'


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'ASD Screening API',
        'version': '1.0.0',
        'status': 'active',
        'models': {
            'mchat': {
                'status': 'loaded' if MCHAT_MODEL else 'not loaded',
                'age_range': '12-36 months',
                'questions': 23
            },
            'aq': {
                'status': 'loaded' if AQ_MODEL else 'not loaded',
                'age_range': '3-11 years',
                'questions': 30
            }
        },
        'endpoints': {
            '/predict': 'POST - Make ASD risk prediction (auto-routes to correct model)',
            '/predict/mchat': 'POST - M-CHAT prediction (12-36 months)',
            '/predict/aq': 'POST - AQ prediction (3-11 years)',
            '/health': 'GET - Check API health status'
        }
    })


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'mchat_model_loaded': MCHAT_MODEL is not None,
        'aq_model_loaded': AQ_MODEL is not None
    })


@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'No data provided',
                'message': 'Please send JSON data in the request body'
            }), 400
        
        # Validate age is provided
        if 'Age' not in data:
            return jsonify({
                'error': 'Missing required field: Age',
                'message': 'Age is required to determine which model to use'
            }), 400
        
        age_in_months = data['Age']
        
        # M-CHAT: 12-36 months (1-3 years)
        # AQ: 36-132 months (3-11 years)
        
        # Age validation and routing logic based on months:
        if age_in_months < 12:
            # Too young for both models
            return jsonify({
                'error': 'Age out of range',
                'message': f'Child is too young ({age_in_months} months / {age_in_months/12:.1f} years). M-CHAT is for 12-36 months minimum.'
            }), 400
        
        elif age_in_months <= 36:
            # Ages 12-36 months: Use M-CHAT model
            return predict_mchat_internal(data)
        
        elif age_in_months <= 132:
            # Ages 37-132 months (3-11 years): Use AQ model
            # Convert months to years for AQ model
            data['Age'] = age_in_months / 12
            return predict_aq_internal(data)
        
        else:
            # Age > 132 months (> 11 years): Too old for our models
            years = age_in_months / 12
            return jsonify({
                'error': 'Age out of range',
                'message': f'Child is too old ({age_in_months} months / {years:.1f} years). Maximum supported: AQ for up to 11 years (132 months). Consider using adult ASD screening tools.'
            }), 400
        
    except Exception as e:
        return jsonify({
            'error': 'Prediction failed',
            'message': str(e),
            'traceback': traceback.format_exc()
        }), 500


@app.route('/predict/mchat', methods=['POST'])
def predict_mchat():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate age range for M-CHAT
        if 'Age' in data and (data['Age'] < 12 or data['Age'] > 36):
            return jsonify({
                'error': 'Invalid age for M-CHAT',
                'message': f'M-CHAT is for ages 12-36 months. Provided: {data["Age"]} months.'
            }), 400
        
        return predict_mchat_internal(data)
    
    except Exception as e:
        return jsonify({
            'error': 'M-CHAT prediction failed',
            'message': str(e),
            'traceback': traceback.format_exc()
        }), 500


@app.route('/predict/aq', methods=['POST'])
def predict_aq():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate age range for AQ and convert to years
        if 'Age' in data:
            age_in_months = data['Age']
            if age_in_months < 36 or age_in_months > 132:
                return jsonify({
                    'error': 'Invalid age for AQ',
                    'message': f'AQ is for ages 36-132 months (3-11 years). Provided: {age_in_months} months.'
                }), 400
            # Convert to years
            data['Age'] = age_in_months / 12
        
        return predict_aq_internal(data)
    
    except Exception as e:
        return jsonify({
            'error': 'AQ prediction failed',
            'message': str(e),
            'traceback': traceback.format_exc()
        }), 500


# ============================================================================
# INTERNAL PREDICTION FUNCTIONS
# ============================================================================

def predict_mchat_internal(data):
    if MCHAT_MODEL is None:
        return jsonify({
            'error': 'M-CHAT model not loaded',
            'message': 'The M-CHAT model file could not be loaded'
        }), 500
    
    # Note: Age is always in months for M-CHAT (12-36 months)
    
    # Validate required fields
    required_fields = ['Age', 'Gender', 'Jaundice', 'Family_ASD_History'] + [f'Q{i}' for i in range(1, 24)]
    missing_fields = [field for field in required_fields if field not in data]
    
    if missing_fields:
        return jsonify({
            'error': 'Missing required fields',
            'missing_fields': missing_fields
        }), 400
    
    # Preprocess data
    X = preprocess_mchat_data(data)
    
    # Make prediction
    prediction = MCHAT_MODEL.predict(X)[0]
    prediction_proba = MCHAT_MODEL.predict_proba(X)[0]
    
    # Get risk probability (probability of ASD class)
    risk_probability = prediction_proba[1]
    risk_percentage = risk_probability * 100
    model_confidence = max(prediction_proba[0], prediction_proba[1])
    
    # Categorize risk
    risk_category = categorize_risk(risk_percentage)
    
    return jsonify({
        'model_used': 'mchat',
        'age': data['Age'],
        'age_unit': 'months',
        'prediction': int(prediction),
        'prediction_label': 'ASD' if prediction == 1 else 'No ASD',
        'confidence': float(model_confidence),
        'risk_percentage': float(round(risk_percentage, 2)),
        'risk_category': risk_category,
        'probabilities': {
            'no_asd': float(prediction_proba[0]),
            'asd': float(prediction_proba[1])
        },
    })


def predict_aq_internal(data):
    if AQ_MODEL is None:
        return jsonify({
            'error': 'AQ model not loaded',
            'message': 'The AQ model file could not be loaded'
        }), 500
    
    # Note: Age has already been converted to years in the main predict() function
    
    # Validate required fields
    required_fields = ['Age', 'Gender', 'Jaundice', 'Family_ASD_History'] + [f'Q{i}' for i in range(1, 31)]
    missing_fields = [field for field in required_fields if field not in data]
    
    if missing_fields:
        return jsonify({
            'error': 'Missing required fields',
            'missing_fields': missing_fields
        }), 400
    
    # Preprocess data
    X = preprocess_aq_data(data)
    
    # Make prediction
    prediction = AQ_MODEL.predict(X)[0]
    prediction_proba = AQ_MODEL.predict_proba(X)[0]
    
    # Get risk probability
    risk_probability = prediction_proba[1]
    risk_percentage = risk_probability * 100
    model_confidence = max(prediction_proba[0], prediction_proba[1]) 

    # Categorize risk
    risk_category = categorize_risk(risk_percentage)
    
    return jsonify({
        'model_used': 'aq',
        'age': data['Age'],
        'age_unit': 'years',
        'prediction': int(prediction),
        'prediction_label': 'ASD' if prediction == 1 else 'No ASD',
        'confidence': float(model_confidence),
        'risk_percentage': float(round(risk_percentage, 2)),
        'risk_category': risk_category,
        'probabilities': {
            'no_asd': float(prediction_proba[0]),
            'asd': float(prediction_proba[1])
        },
    })


# ============================================================================
# RUN THE APPLICATION
# ============================================================================

if __name__ == '__main__':
    print("\n" + "=" * 80)
    print("ASD SCREENING API - Starting Server")
    print("=" * 80)
    print("\nAPI will be available at: http://localhost:5000")
    print("\nAvailable endpoints:")
    print("  - GET  /            : API information")
    print("  - GET  /health      : Health check")
    print("  - POST /predict     : Auto-route prediction based on age")
    print("  - POST /predict/mchat : M-CHAT prediction (12-36 months)")
    print("  - POST /predict/aq    : AQ prediction (3-11 years)")
    print("\n" + "=" * 80 + "\n")
    
    # Run Flask app
    # debug=True enables auto-reload when you change code
    # Set to False in production
    app.run(host='0.0.0.0', port=5000, debug=True)

