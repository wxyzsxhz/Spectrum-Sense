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
    MCHAT_MODEL = joblib.load('outputs/mchat_model.pkl')
    MCHAT_FEATURES = joblib.load('outputs/mchat_feature_names.pkl')
    print("✓ M-CHAT model loaded successfully")
    print(f"  Expected features: {len(MCHAT_FEATURES)}")
except Exception as e:
    print(f"⚠ Warning: Could not load M-CHAT model: {e}")
    MCHAT_MODEL = None
    MCHAT_FEATURES = None

try:
    # Load AQ model (for 3-11 years)
    AQ_MODEL = joblib.load('outputs/aq_model.pkl')
    AQ_FEATURES = joblib.load('outputs/aq_feature_names.pkl')
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
    
    # 3. FEATURE ENGINEERING (must match training exactly)

    # Define M-CHAT clinical parameters

    BEST7_QUESTIONS = [2, 5, 7, 9, 14, 15, 20]
    INVERTED_QUESTIONS = [11, 18, 20, 22]
    
    # Create failure indicators
    failure_cols = []
    for i in range(1, 24):
        q_col = f'Q{i}'
        fail_col = f'Q{i}_Failed'
        
        if i in INVERTED_QUESTIONS:
            df[fail_col] = df[q_col]
        else:
            df[fail_col] = (df[q_col] == 0).astype(int)
        
        failure_cols.append(fail_col)
    
    # Best7 features
    best7_fail_cols = [f'Q{i}_Failed' for i in BEST7_QUESTIONS]
    df['Best7_Failed_Count'] = df[best7_fail_cols].sum(axis=1)
    df['Total_Failed_Count'] = df[failure_cols].sum(axis=1)
    df['MCHAT_Risk_Flag'] = (
        (df['Best7_Failed_Count'] >= 2) | 
        (df['Total_Failed_Count'] >= 3)
    ).astype(int)
    df['Best7_Pass_Rate'] = 1 - (df['Best7_Failed_Count'] / len(BEST7_QUESTIONS))
    df['Total_Pass_Rate'] = 1 - (df['Total_Failed_Count'] / 23)
    
    non_best7_fail_cols = [f'Q{i}_Failed' for i in range(1, 24) if i not in BEST7_QUESTIONS]
    df['NonBest7_Failed_Count'] = df[non_best7_fail_cols].sum(axis=1)
    df['Best7_to_NonBest7_Ratio'] = df['Best7_Failed_Count'] / (df['NonBest7_Failed_Count'] + 1)
    
    # Domain-specific features
    social_questions = [2, 7, 9, 14, 15, 17, 19, 21, 23]
    social_fail_cols = [f'Q{i}_Failed' for i in social_questions]
    df['Social_Failed_Count'] = df[social_fail_cols].sum(axis=1)
    df['Social_Pass_Rate'] = 1 - (df['Social_Failed_Count'] / len(social_questions))
    
    joint_attention = [6, 7, 9, 15]
    joint_attention_cols = [f'Q{i}_Failed' for i in joint_attention]
    df['JointAttention_Failed_Count'] = df[joint_attention_cols].sum(axis=1)
    
    df['PretendPlay_Failed'] = df['Q5_Failed']
    
    sensory_questions = [11, 18, 22]
    sensory_fail_cols = [f'Q{i}_Failed' for i in sensory_questions]
    df['Sensory_Failed_Count'] = df[sensory_fail_cols].sum(axis=1)
    
    # Interaction features
    df['Q9_Q14_Interaction'] = df['Q9_Failed'] * df['Q14_Failed']
    df['Q9_Q15_Interaction'] = df['Q9_Failed'] * df['Q15_Failed']
    df['Q7_Q14_Interaction'] = df['Q7_Failed'] * df['Q14_Failed']
    
    df['Risk_Factors_Sum'] = df['Family_ASD_History'] + df['Jaundice']
    df['Male_With_Family_History'] = df['Gender'] * df['Family_ASD_History']
    df['High_Risk_Profile'] = (
        (df['Family_ASD_History'] == 1) & 
        (df['Best7_Failed_Count'] >= 1)
    ).astype(int)
    
    df['Best7_All_Passed'] = (df['Best7_Failed_Count'] == 0).astype(int)
    df['Best7_Multiple_Failed'] = (df['Best7_Failed_Count'] >= 2).astype(int)
    
    # Age-based features
    df['Age_Squared'] = df['Age'] ** 2
    df['Age_Group'] = pd.cut(
        df['Age'], 
        bins=[0, 18, 24, 30, 100], 
        labels=[0, 1, 2, 3]
    ).astype(int)
    
    # Statistical pattern features
    question_fail_cols = [f'Q{i}_Failed' for i in range(1, 24)]
    df['Failure_Mean'] = df[question_fail_cols].mean(axis=1)
    df['Failure_Std'] = df[question_fail_cols].std(axis=1)
    
    # Consecutive failures
    consecutive_failures = []
    for _, row in df[question_fail_cols].iterrows():
        max_consecutive = 0
        current_consecutive = 0
        for val in row:
            if val == 1:
                current_consecutive += 1
                max_consecutive = max(max_consecutive, current_consecutive)
            else:
                current_consecutive = 0
        consecutive_failures.append(max_consecutive)
    
    df['Max_Consecutive_Failures'] = consecutive_failures
    
    for feature in MCHAT_FEATURES:
        if feature not in df.columns:
            df[feature] = 0
    
    return df[MCHAT_FEATURES]


def preprocess_aq_data(data):
    df = pd.DataFrame([data])
    
    # 1. Encode binary columns
    df['Jaundice'] = (df['Jaundice'].str.lower() == 'yes').astype(int) if df['Jaundice'].dtype == 'object' else df['Jaundice'].astype(int)
    df['Family_ASD_History'] = (df['Family_ASD_History'].str.lower() == 'yes').astype(int) if df['Family_ASD_History'].dtype == 'object' else df['Family_ASD_History'].astype(int)
    
    # 2. Encode gender
    if df['Gender'].dtype == 'object':
        df['Gender'] = (df['Gender'].str.lower() == 'male').astype(int)
    else:
        df['Gender'] = df['Gender'].astype(int)
    
    # 3. FEATURE ENGINEERING (must match training exactly)
    
    # AQ subscales
    social = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6']
    switching = ['Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12']
    detail = ['Q13', 'Q14', 'Q15', 'Q16', 'Q17', 'Q18']
    communication = ['Q19', 'Q20', 'Q21', 'Q22', 'Q23', 'Q24', 'Q25']
    imagination = ['Q26', 'Q27', 'Q28', 'Q29', 'Q30']
    
    # Subscale means
    df['Social_Mean'] = df[social].mean(axis=1)
    df['Switching_Mean'] = df[switching].mean(axis=1)
    df['Detail_Mean'] = df[detail].mean(axis=1)
    df['Communication_Mean'] = df[communication].mean(axis=1)
    df['Imagination_Mean'] = df[imagination].mean(axis=1)
    
    # Total AQ score
    df['AQ_Total'] = df[[f'Q{i}' for i in range(1, 31)]].sum(axis=1)
    
    # High score count
    df['High_Score_Count'] = (df[[f'Q{i}' for i in range(1, 31)]] >= 2).sum(axis=1)
    
    # Variability
    df['Score_STD'] = df[[f'Q{i}' for i in range(1, 31)]].std(axis=1)
    
    # Interaction features
    df['Comm_x_Family'] = df['Communication_Mean'] * df['Family_ASD_History']
    df['Social_x_Family'] = df['Social_Mean'] * df['Family_ASD_History']
    
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
    
    # Categorize risk
    risk_category = categorize_risk(risk_percentage)
    
    return jsonify({
        'model_used': 'mchat',
        'age': data['Age'],
        'age_unit': 'months',
        'prediction': int(prediction),
        'prediction_label': 'ASD' if prediction == 1 else 'No ASD',
        'confidence': float(risk_probability),
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
    
    # Categorize risk
    risk_category = categorize_risk(risk_percentage)
    
    return jsonify({
        'model_used': 'aq',
        'age': data['Age'],
        'age_unit': 'years',
        'prediction': int(prediction),
        'prediction_label': 'ASD' if prediction == 1 else 'No ASD',
        'confidence': float(risk_probability),
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
