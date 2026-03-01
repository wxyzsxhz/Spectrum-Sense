import requests
import json

API_URL = "http://localhost:5000"

def print_section(title):
    print("\n" + "="*80)
    print(title)
    print("="*80)

def test_home():
    """Test the home endpoint"""
    print_section("TEST 1: HOME ENDPOINT")
    
    try:
        response = requests.get(f"{API_URL}/")
        print(f"Status Code: {response.status_code}")
        print("\nResponse:")
        print(json.dumps(response.json(), indent=2))
        
        if response.status_code == 200:
            print("\n✓ Home endpoint working!")
        else:
            print("\n⚠ Unexpected status code")
    except Exception as e:
        print(f"\n✗ Error: {e}")
        print("Make sure the API is running (python asd_api.py)")

def test_health():
    """Test the health check endpoint"""
    print_section("TEST 2: HEALTH CHECK ENDPOINT")
    
    try:
        response = requests.get(f"{API_URL}/health")
        print(f"Status Code: {response.status_code}")
        print("\nResponse:")
        print(json.dumps(response.json(), indent=2))
        
        if response.status_code == 200:
            data = response.json()
            if data.get('models', {}).get('mchat_loaded') and data.get('models', {}).get('aq_loaded'):
                print("\n✓ Health check passed! Both models loaded.")
            else:
                print("\n⚠ Models not loaded properly")
        else:
            print("\n⚠ Unexpected status code")
    except Exception as e:
        print(f"\n✗ Error: {e}")

def test_mchat_prediction():
    """Test M-CHAT prediction"""
    print_section("TEST 3: M-CHAT PREDICTION (24 months old)")
    
    # Sample M-CHAT data
    mchat_data = {
        "Age": 24,
        "Gender": "male",
        "Jaundice": "no",
        "Family_ASD_History": "no",
        "Q1": "yes",
        "Q2": "yes",
        "Q3": "yes",
        "Q4": "yes",
        "Q5": "no",
        "Q6": "yes",
        "Q7": "no",
        "Q8": "yes",
        "Q9": "no",
        "Q10": "yes",
        "Q11": "yes",
        "Q12": "yes",
        "Q13": "yes",
        "Q14": "no",
        "Q15": "no",
        "Q16": "yes",
        "Q17": "yes",
        "Q18": "yes",
        "Q19": "yes",
        "Q20": "no",
        "Q21": "yes",
        "Q22": "yes",
        "Q23": "yes"
    }
    
    try:
        response = requests.post(
            f"{API_URL}/predict",
            json=mchat_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        print("\nRequest Data (first few fields):")
        print(json.dumps({k: v for k, v in list(mchat_data.items())[:6]}, indent=2))
        print("  ... (and 17 more questions)")
        
        print("\nResponse:")
        print(json.dumps(response.json(), indent=2))
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n✓ M-CHAT prediction successful!")
            print(f"   Model: {data['model_used']}")
            print(f"   Risk: {data['risk_percentage']}% ({data['risk_category']})")
        else:
            print("\n⚠ Prediction failed")
    except Exception as e:
        print(f"\n✗ Error: {e}")

def test_aq_prediction():
    """Test AQ prediction"""
    print_section("TEST 4: AQ PREDICTION (6 years old / 72 months)")
    
    # Sample AQ data
    aq_data = {
        "Age": 72,
        "Gender": "female",
        "Jaundice": "no",
        "Family_ASD_History": "yes",
        "Q1": 2,
        "Q2": 1,
        "Q3": 3,
        "Q4": 0,
        "Q5": 2,
        "Q6": 1,
        "Q7": 2,
        "Q8": 3,
        "Q9": 1,
        "Q10": 2,
        "Q11": 2,
        "Q12": 0,
        "Q13": 3,
        "Q14": 1,
        "Q15": 2,
        "Q16": 2,
        "Q17": 1,
        "Q18": 2,
        "Q19": 3,
        "Q20": 0,
        "Q21": 2,
        "Q22": 1,
        "Q23": 2,
        "Q24": 1,
        "Q25": 3,
        "Q26": 0,
        "Q27": 2,
        "Q28": 1,
        "Q29": 2,
        "Q30": 2
    }
    
    try:
        response = requests.post(
            f"{API_URL}/predict",
            json=aq_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        print("\nRequest Data (first few fields):")
        print(json.dumps({k: v for k, v in list(aq_data.items())[:6]}, indent=2))
        print("  ... (and 24 more questions)")
        
        print("\nResponse:")
        print(json.dumps(response.json(), indent=2))
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n✓ AQ prediction successful!")
            print(f"   Model: {data['model_used']}")
            print(f"   Risk: {data['risk_percentage']}% ({data['risk_category']})")
        else:
            print("\n⚠ Prediction failed")
    except Exception as e:
        print(f"\n✗ Error: {e}")

def test_invalid_age():
    """Test with invalid age"""
    print_section("TEST 5: INVALID AGE (should return error)")
    
    invalid_data = {
        "Age": 200,  # Too old
        "Gender": "male",
        "Jaundice": "no",
        "Family_ASD_History": "no"
    }
    
    try:
        response = requests.post(
            f"{API_URL}/predict",
            json=invalid_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        print("\nResponse:")
        print(json.dumps(response.json(), indent=2))
        
        if response.status_code == 400:
            print("\n✓ Error handling working correctly!")
        else:
            print("\n⚠ Expected status code 400")
    except Exception as e:
        print(f"\n✗ Error: {e}")

def main():
    print("\n" + "="*80)
    print("ASD SCREENING API TEST SUITE")
    print("="*80)
    print("\nMake sure the API is running before running these tests!")
    print("Start it with: python asd_api.py")
    print("\nPress Enter to continue...")
    input()
    
    # Run all tests
    test_home()
    test_health()
    test_mchat_prediction()
    test_aq_prediction()
    test_invalid_age()
    
    print_section("ALL TESTS COMPLETED")
    print("\nIf all tests passed (✓), your API is ready to use!")
    print("\nYou can now share the API_DOCUMENTATION.md file with your backend developer.")

if __name__ == "__main__":
    main()
