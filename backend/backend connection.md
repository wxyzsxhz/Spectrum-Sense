**Run Backend App**

Step 1 : Install dependencies in root directory --> npm i

Step 2 : Delete the certificate and key files.

If you already have a certificate and a key, use them and skip Step 3

Step 3.1 : Install certificate maker (directory doesn't matter) --> npm i mkcert

Step 3.2 : Make certificate for the server in root directory --> mkcert localhost 127.0.0.1 ::1

That will create certificate file and key file in the root directory.

Step 4 : Run the app --> node app.js (or) nodemon app.js

______________________________________________________________________________________________________________________________

**Sign Up**

Send **POST** request with a **JSON** object of following structure to **https://localhost:8080/signup**.

{

 	"name" : "",

 	"email" : "",

 	"password" : ""

}

The server will responds with **status 201**, **success message** and a **jwt token** for every successful request.

{

 	"message" : "User registered successfully",

 	"token" : ""

}

If failed, the server will responds with **appropriate status** and **error message** without token.

{

 	"message" : ""

}

status 400 : Email already in use,

status 500 : Server error

_______________________________________________________________________________________________________________________________________

**Log In**

Send **POST** request with a **JSON** object of following structure to **https://localhost:8080/login**.

{

 	"email" : "",

 	"password" : ""

}

The server will responds with **status 201**, **success message** and a **jwt token** for every successful request.

{

 	"message" : "Logged in successfully",

 	"token" : ""

}

If failed, the server will responds with **appropriate status** and **error message** without token.

{

 	"message" : ""

}

status 401 : Invalid email or password,

status 500 : Server error

______________________________________________________________________________________________________________________

You may **store the token** obtained in **React State**, **Context API**, or **Redux store**

__________________________________________________________________________________________________________________________

**User Account Data on Dashboard**

Send **GET** request to **https://localhost:8080/account**.

Put the **token** stored into **request header** as **Bearer token**.

The server will responds with **status 200**, **success message** and a **user object** for every successful request.

{

 	"message" : "Fetched successfully",

 	"user" : {

 		"name" : "",

 		"email" : ""

 		}

}

If failed, the server will responds with **appropriate status** and **error message** without user object.

{

 	"message" : ""

}

status 401 : Unauthorized access

status 404 : User not found

status 500 : Server error

________________________________________________________________________________________________________________________

**Child Profile Creation on Dashboard**

Send **POST** request with a **JSON** object of following structure to **https://localhost:8080/child**.

{

	"name" : "",

	"dateOfBirth" : "YYYY-MM-DD",

	"relationship" : "",

	"gender" : "male" (or) "female",

	"jaundice" : true (or) false,

	"familyWithASD" : true (or) false,

	"region" : ""

}

Put the **token** stored into **request header** as **Bearer token**.

The server will responds with **status 201** and **success message** for every successful request.

{

	"message" : "Child profile created successfully"

}

If failed, the server will responds with **appropriate status** and **error message**.

{

	"message" : ""

}

status 401 : Unauthorized access

status 500 : Server error

_______________________________________________________________________________________________________________________________________

**Child Cards on Dashboard**

Send **GET** request to **https://localhost:8080/child-cards**.

Put the **token** stored into **request header** as **Bearer token**.

The server will responds with **status 200**, **success message** and an **array of child data** for every successful request.

{

	"message" : "Fetched successfully",

	"children" : [

			{

				"id" : "",

				"name" : "",

				"age" : ,

		
			},...

		]

}

If failed, the server will responds with **appropriate status** and **error message** without array of child data.

{

	"message" : ""

}

status 401 : Unauthorized access

status 404 : Children not found

status 500 : Server error

_____________________________________________________________________________________________________________________________________

**Child Profile**

Send **GET** request with **childId** as a request parameter to **https://localhost:8080/child/(childId)**

Put the **token** stored into **request header** as **Bearer token**.

The server will responds with **status 200**, **success message** and an **object of child data** for every successful request.

{

	"message" : "Fetched successfully",

	"child" : {

			"id" : "",
			
			"name" : "",

			"age" : ,

			"gender" : "",

			"relationship" : "",

			"jaundice" : "",

			"familyWithASD" : "",

			"region" : "",

			"hasASD" : 1 (or) 0 (or) undefined,

			"createdAt" : ""

	}

}

If failed, the server will responds with **appropriate status** and **error message** without child object.

{

	"message" : ""

}

status 401 : Unauthorized access

status 404 : Child not found

status 500 : Server error

_____________________________________________________________________________________________________________________________

**Parent Info on Child Profile**

Send **GET** request to **https://localhost:8080/account**.

Put the **token** stored into **request header** as **Bearer token**.

The server will responds with **status 200**, **success message** and a **user object** for every successful request.

{

 	"message" : "Fetched successfully",

 	"user" : {

 		"name" : "",

 		"email" : ""

 		}

}

If failed, the server will responds with **appropriate status** and **error message** without user object.

{

 	"message" : ""

}

status 401 : Unauthorized access

status 404 : User not found

status 500 : Server error

________________________________________________________________________________________________________________________

**Delete Child Profile**

Send **DELETE** request with **childId** as a request parameter to **https://localhost:8080/child/(childId)**.

Put the **token** stored into **request header** as **Bearer token**.

The server will responds with **status 200** and a **success message**.

{

	"message" : "Child profile deleted successfully",

}

If failed, the server will responds with **appropriate status** and **error message**.

{
	"message" : ""
}

status 401 : Unauthorized access

status 404 : Child not found

status 500 : Server error

___________________________________________________________________________________________________________________________________________________

**Edit Child Profile**

Send **PUT** request with a **JSON** object containing fields that need to be updated and **childId** as a request parameterto **https://localhost:8080/child/(childId)**.

{
	
	"name" : "",
	...
}

Put the **token** stored into **request header** as **Bearer token**.

The server will responds with **status 201**, a **success message** and an object of updated child data.

{

	"message" : "Child profile updated successfully",
	
	"child" : {

		"id" : "",
		
		"name" : "",
		...

	}

}

If failed, the server will responds with **appropriate status** and **error message**.

{
	"message" : ""
}

status 401 : Unauthorized access

status 404 : Child not found

status 500 : Server error

___________________________________________________________________________________________________________________________________________________

**Test ASD**

Send **POST** request with a **JSON** object of following structure and **childId** as a request parameter to **https://localhost:8080/child/(childId)**.

**For M-Chat**

{
  
  	"Q1": "yes",                  // All questions are "yes" or "no"
  
  	"Q2": "no",
  
  	"Q3": "yes",
  	// ... continue Q4 through Q23
  
  	"Q23": "yes"

}

**For AQ-10**

{
  
  	"Q1": 2,                      // Questions are scored 0-3
  
  	"Q2": 1,                      // 0 = Definitely disagree
  
  	"Q3": 0,                      // 1 = Slightly disagree
  	// ... continue Q4 through Q30 // 2 = Slightly agree
  
  	"Q30": 3                      // 3 = Definitely agree

}

Put the **token** stored into **request header** as **Bearer token**.

The server will responds with **status 201**, a **success message** and an object of result.

{
  	
	"model_used": "aq",              // Which model was used
  	
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
	"percentPerCategory": {

		"exampleCategory" : 50,

		"exampleCategory2" : 30,

		"exampleCategory3" : 20

	}

}

If failed, the server will responds with **appropriate status** and **error message**.

{
	"message" : ""
}

status 400 : Please send JSON data in the request body || Age is required to determine which model to use || Child is too young (6 months / 0.5 years). M-CHAT is for 12-36 months minimum. || Child is too old (200 months / 16.7 years). Maximum supported: AQ for up to 11 years (132 months). Consider using adult ASD screening tools. || 

status 401 : Unauthorized access

status 404 : Child not found

status 500 : Server error

___________________________________________________________________________________________________________________________________________________

**Forgot Password**

Send **POST** request with a **JSON** object of following structure and **token** to **https://localhost:8080/forgot-password**.

{

 	"email" : "",

}

The server will responds with **status 201** and a **success message**for every successful request.

{

 	"message" : "Reset email sent",

}

And a link of following structure will be send via email.

**http://localhost:3000/reset-password/(token)**

If failed, the server will responds with **appropriate status** and **error message**.

{

 	"message" : ""

}

status 404 : There's no account for (email),

status 500 : Server error

___________________________________________________________________________________________________________________________________________________

**Reset Password**

Send **POST** request with a **JSON** object of following structure and the token from the emailed link to **https://localhost:8080/reset-password/(token)**.

{

 	"password" : "",

}

The server will responds with **status 201** and a **success message**for every successful request.

{

 	"message" : "Password reset successful ",

}

If failed, the server will responds with **appropriate status** and **error message**.

{

 	"message" : ""

}

status 400 : Invalid or expired token,

status 500 : Server error

___________________________________________________________________________________________________________________________________________________

**Get History from Parent Dashboard**

Send **GET** request to **https://localhost:8080/tests**.

Put the **token** stored into **request header** as **Bearer token**.

The server will responds with **status 200**, **success message** and a array of **child objects only if their test data exist** for every successful request.

{
    "message": "Fetched successfully",

    "children": [

        {

            "_id": "",
            "name": "",
            "tests": [

                {
                    "_id": "",
                    "prediction_label": "No ASD",
                    "risk_percentage": ,
                    "risk_category": "Low Risk",
                    "createdAt": ""
                },

                {
                    "_id": "",
                    "prediction_label": "No ASD",
                    "risk_percentage": ,
                    "risk_category": "Medium Risk",
                    "createdAt": ""
                },

                {
                    "_id": "",
                    "prediction_label": "ASD",
                    "risk_percentage": ,
                    "risk_category": "High Risk",
                    "createdAt": ""
                }

            ]
        
		}

    ]
}

If failed, the server will responds with **appropriate status** and **error message** without user object.

{

 	"message" : ""

}

status 401 : Unauthorized access

status 404 : Child not found

status 500 : Server error

___________________________________________________________________________________________________________________________________________________

**Get History from Child Profile**

Send **GET** request with **childId** as a request parameter to **https://localhost:8080/tests/(childId)**.

Put the **token** stored into **request header** as **Bearer token**.

The server will responds with **status 200**, **success message** and an **array of child's test data** for every successful request.

{

    "message": "Fetched successfully",

    "tests": [

        {
            "_id": "",
            "prediction_label": "No ASD",
            "risk_percentage": ,
            "risk_category": "Low Risk",
            "createdAt": ""
        },

        {
            "_id": "",
            "prediction_label": "No ASD",
            "risk_percentage": ,
            "risk_category": "Medium Risk",
            "createdAt": ""
        },

        {
            "_id": "699c788fd5abe537d0b98197",
            "prediction_label": "ASD",
            "risk_percentage": ,
            "risk_category": "High Risk",
            "createdAt": ""
        }

    ]

}

If failed, the server will responds with **appropriate status** and **error message** without user object.

{

 	"message" : ""

}

status 401 : Unauthorized access

status 404 : Child not found

status 500 : Server error

___________________________________________________________________________________________________________________________________________________

**Get Specific Test History**

Send **GET** request with **testId** as a request parameter to **https://localhost:8080/test/(testId)**.

Put the **token** stored into **request header** as **Bearer token**.

The server will responds with **status 200**, **success message** and an **Object of test data** for every successful request.

{
    "message": "Fetched successfully",
    "test": {
        "_id": "",
        "model_used": "mchat",
        "prediction_label": "No ASD",
        "risk_percentage": 32.33,
        "risk_category": "Medium Risk",
        "percentPerCategory": {
            "social": ,
            "communication": ,
            "behavior": ,
            "motor": 
        },
        "createdAt": ""
    }
}

If failed, the server will responds with **appropriate status** and **error message** without user object.

{

 	"message" : ""

}

status 401 : Unauthorized access

status 404 : Test not found

status 500 : Server error

___________________________________________________________________________________________________________________________________________________
