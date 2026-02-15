# 🚀 QUICK START GUIDE - Flask API for ASD Screening

## ⏱️ 5-Minute Setup

### Step 1: Check Your Files ✅
Make sure you have:
```
outputs/
  ├── mchat_model.pkl
  ├── mchat_feature_names.pkl
  ├── aq_model.pkl
  └── aq_feature_names.pkl
```

### Step 2: Install Packages 📦
```bash
pip install Flask flask-cors pandas numpy scikit-learn joblib
```

### Step 3: Start the API 🎯
```bash
python app.py
```

You should see:
```
✓ M-CHAT model loaded successfully
✓ AQ model loaded successfully
API will be available at: http://localhost:5000
```

✅ **Done! Your API is running!**

---

## 🧪 Test It (2 minutes)

Open a NEW terminal and run:
```bash
python test_api.py
```

You should see test results with predictions!

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port already in use | Change port: `app.run(port=5001)` |
| Models not found | Check outputs/ folder has .pkl files |
| Can't connect | Make sure `python app.py` is running |
| Missing packages | Run `pip install -r requirements.txt` |

---

## ✨ You're Done!
