# Health & Safety Knowledge Verification

A lightweight web-based quiz system built to verify **Health & Safety policy and procedure knowledge** for McDonald’s managers and Health & Safety Committee (HSC) members.

This tool replaces paper quizzes and SurveyMonkey-style forms with a **centralized, auditable, Firebase-backed system** that allows leadership to **identify training gaps by topic** and improve compliance.

**Made by Abcedi – Facilities Manager**

---

## Why This Exists

- Ensure managers and HSC members understand **critical safety policies**
- Track **who completed the quiz**
- Identify **which topics are most frequently missed**
- Target future **training and coaching**
- Prevent answer memorization by **randomizing questions and choices**

---

## Key Features

- 🔐 **Badge Number Login**
  - Uses employee badge numbers (no email required from user)
  - PIN-based login with Firebase compatibility
- 📋 **JSON-Driven Questions**
  - All quiz content lives in one file: `questions.json`
- 🔀 **Randomized Quiz**
  - Question order is randomized on every attempt
  - Answer choices are randomized per question
- 🧠 **Smart Scoring**
  - Supports scored and non-scored questions
  - Tracks wrong answers with topic metadata
- 📊 **Training-Focused Results**
  - Firestore stores missed questions + topics
  - Admin dashboard can identify training needs
- 📱 **Mobile Friendly**
  - Works reliably on iPhone, iPad, and desktop
- ☁️ **Serverless**
  - Hosted on GitHub Pages
  - Firebase handles auth + data

---

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (no framework)
- **Hosting:** GitHub Pages
- **Authentication:** Firebase Authentication
- **Database:** Firebase Firestore
- **SDK:** Firebase JS SDK (v10+ CDN)

---

## Project Structure

```
/
├─ index.html            # Login page (badge + PIN)
├─ quiz.html             # Quiz page (randomized questions)
├─ results.html          # Results summary page
├─ admin.html            # Admin dashboard (analytics)
├─ firebase.js           # Firebase configuration
└─ data/
   └─ questions.json     # Quiz source of truth
```


## Authentication Design

### Badge Number Login

Users log in using their **7-digit badge number** and a **4-digit PIN**.

Internally:

- Badge number → Email
xxxxxxx@hsquiz.local

- PIN → Firebase password
hs-xxxx


This satisfies Firebase’s 6-character password rule while keeping the experience simple.

---

## Question Types Supported

### 1. Text (Not Scored)

Used for required information like name and restaurant.

```json
{
  "id": "meta_name",
  "topic": "Admin",
  "type": "text",
  "question": "Name (First & Last Name)",
  "required": true,
  "scored": false
}
```

---

### 2. Multiple Choice (Scored)

```json
{
  "id": "whmis_001",
  "topic": "WHMIS 2015",
  "type": "mc",
  "question": "Under what condition is a workplace label required?",
  "choices": [
    "When a product is used for the first time",
    "When a hazardous product is decanted",
    "When stored in a locked cabinet",
    "When used by a contractor"
  ],
  "answerIndex": 1
}
```

⚠️ **answerIndex is zero-based**

- `0` = first choice  
- `1` = second choice  
- `2` = third choice
- `3` = fourth choice  

---

## Randomization Logic

On every quiz load:

- Questions are shuffled  
- Answer choices are shuffled  
- Correct answer index is remapped automatically  

This prevents memorization and ensures a fair assessment every time.

---

## Firestore Data Model

**Collection:** `attempts`

Each quiz submission creates one document:

```json
{
  "uid": "firebase-auth-uid",
  "badge": "1655919",
  "profile": {
    "name": "John Smith",
    "restaurant": "Provost"
  },
  "answers": [
    { "id": "meta_name", "type": "text", "value": "John Smith" },
    { "id": "whmis_001", "type": "mc", "chosenIndex": 2 }
  ],
  "score": 26,
  "total": 30,
  "wrong": [
    {
      "questionId": "whmis_001",
      "topic": "WHMIS 2015",
      "chosenIndex": 2,
      "correctIndex": 1
    }
  ],
  "createdAt": "serverTimestamp"
}
```

This structure makes it easy to:

- Count wrong answers  
- Group mistakes by topic  
- Identify training gaps  

---

## Admin Access

Admins are defined in Firestore:

```
admins/{UID}
```

If a document exists for a user’s UID, they can:

- View all quiz attempts  
- Analyze performance by topic  
- Identify coaching opportunities  

---

## Firebase Security Rules (Recommended)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function signedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return signedIn() &&
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    match /attempts/{docId} {
      allow create: if signedIn();
      allow read, update, delete: if isAdmin();
    }

    match /admins/{uid} {
      allow read: if isAdmin();
      allow write: if false;
    }
  }
}
```

---

## Deployment (GitHub Pages)

1. Push repo to GitHub  
2. Go to **Settings → Pages**  
3. Source: **Deploy from a branch**  
4. Branch: **main / root**  
5. Save  

Your quiz is now live.

---

## Common Issues & Fixes

**Quiz stuck submitting**
- Check Firestore rules allow `create`
- Ensure device is online
- Verify Firebase config

**Infinite reload loop**
- Caused by redirects firing too early
- Only redirect after login success

**Git error: `index.lock`**
```bash
rm -f .git/index.lock
```

**Restore remote version of a file**
```bash
git restore quiz.html
git pull --ff-only
```

---

## Future Improvements

- Topic-specific quizzes  
- Minimum pass score enforcement  
- Required retakes  
- CSV export for audits  
- Automatic training recommendations  
- Quiz expiration / re-certification logic  

---

## Disclaimer

This project is for internal training and verification purposes.  
Ensure compliance with company privacy policies and local regulations before production use.
