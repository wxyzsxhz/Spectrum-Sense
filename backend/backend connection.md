**Run Backend App**


Step 1 : Install dependencies in root directory --> npm i

Step 2 : Install certificate maker (directory doesn't matter) --> mkcert -install

Step 3 : Make certificate for the server in root directory --> mkcert localhost 127.0.0.1 ::1

That will create localhost.pem and localhost-key.pem in the root directory.

Step 4 : Run the app --> node app.js



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

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_



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

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_



You may **store the token** obtained in **React State**, **Context API**, or **Redux store**

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_



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

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_



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

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_



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

