# JWT Authentication using Go

A Golang backend implementing JWT authentication with access tokens and refresh tokens, supporting secure login, signup, token renewal, and protected API routes.

## Purpose of this project
This project showcases my understanding of implementing JWT-based authentication using access tokens and refresh tokens, following real-world security practices commonly used in modern backend systems. It demonstrates the authentication lifecycle, including secure user registration, login, token validation, token renewal, and protected API routes.

## Cases
1. Sign-Up: Generates initial access and refresh tokens for the user.
2. Login: Rotates and updates access and refresh tokens in the database.
3. When a user attempts to access a protected API route, the backend performs the following validation steps on the access token:
- Expiration Check
  - Ensures the access token has not expired.
- Integrity & Signature Verification
  - Confirms the token has not been tampered with or altered.
- Token Matching & Revocation Protection
  - Verifies that the provided access token matches the one currently stored in the database for the user, preventing the use of revoked or rotated tokens.
4. Access Token Expiry & Token Refresh Flow
- Access Token Expired
  - When the access token expires, the frontend automatically sends a POST /refresh request.
- Refresh Token Validation
  - The refresh token is extracted from the Authorization header.
  - The server validates the refresh token to ensure it:
    - Has not expired
    - Has not been tampered with
  - If the refresh token is expired or invalid, the server responds with an error, prompting the user to re-authenticate (login again).
- Token Regeneration
  - If the refresh token is valid, the server generates a new access token and a new refresh token.
    - The newly generated tokens are stored in the database, replacing the previous ones (token rotation).
   

## Demonstration with Simple Frontend
## A simple Login Page
<img width="1339" height="796" alt="loginPage" src="https://github.com/user-attachments/assets/035c9d1d-f03a-4e36-ba96-86deb0bb7753" />

<br><br>
<br><br>
<br><br>

## A simple Sign Up Page
<img width="1339" height="796" alt="signupPage" src="https://github.com/user-attachments/assets/e404155f-7725-4150-bdc8-8a9e9f1b8992" />

<br><br>
<br><br>
<br><br>

## Upon signing up, the user is redirected to the Home page, where a new access token and refresh token are generated.

<img width="1208" height="566" alt="homePage" src="https://github.com/user-attachments/assets/8272de34-cecf-455f-94fa-713d33d7323d" />

<img width="799" height="265" alt="database" src="https://github.com/user-attachments/assets/aaa71830-b247-47fc-bf45-ec0694951b6a" />

<br><br>
<br><br>
<br><br>

## Upon re-login, both the access token and refresh token are regenerated for the user.
<img width="888" height="536" alt="reLogin" src="https://github.com/user-attachments/assets/a6c41d7d-6398-4c57-8913-744b2a71e5fa" />

<img width="1742" height="601" alt="tokenRefreshAfterLogin" src="https://github.com/user-attachments/assets/c50bc1c8-acbc-4562-96f2-db40a477f649" />

<br><br>
<br><br>
<br><br>

## To demonstrate access token expiration, the access token is configured to expire after 5 seconds. After logging in again, if we wait 5 seconds and then attempt to access the protected /users endpoint via the button, the request will fail because the token has expired.

<img width="577" height="76" alt="token5seconds" src="https://github.com/user-attachments/assets/2f477f62-2177-4957-831f-9018c11efd22" />
<br><br>
<img width="799" height="265" alt="tokenExpired" src="https://github.com/user-attachments/assets/eeae202c-ef32-47fe-bded-fdf1a72dbd3c" />

<br><br>
<br><br>
<br><br>

# Refer to the homepage.tsx file in the frontend folder to understand the flow of API calls from the frontend
## When the access token expires, the frontend should automatically call the /refresh endpoint to obtain a new access token using the refresh token.
## Case 1: Both Access and Refresh Token are expired
The refresh token is now set to expire after 5 seconds as well. When the /refresh endpoint is called, the server verifies that the refresh token is valid and not expired. If it has expired, the user is automatically redirected to the login page
<br><br>
Both Access and Refresh Tokens are configured to expire after 5 seconds
<img width="552" height="79" alt="refreshToken5seconds" src="https://github.com/user-attachments/assets/0561ad9b-d39a-4b42-a199-9bb7cd4a0cf3" />
<br><br>
Upon clicking the button after 5 seconds, the user is automatically redirected to the login page, and the local storage is cleared upon redirection.
<img width="1539" height="441" alt="ONE" src="https://github.com/user-attachments/assets/150c81f8-2a60-4786-9b3f-0f311f35aad7" />
<br><br>
<img width="1539" height="533" alt="TWO" src="https://github.com/user-attachments/assets/96ff9282-484d-419c-9396-99a00449c1bc" />

## Case 2: Refresh Token is not expired
The refresh token is now configured to expire after 1 week. Upon clicking the button after 5 seconds, the server verifies that the refresh token is still valid, it generates new access and refresh tokens, then automatically retries the original `/users` request, allowing the frontend to display all users from the database.
<br><br>
<img width="602" height="77" alt="Screenshot 2025-12-24 at 9 57 32 PM" src="https://github.com/user-attachments/assets/e0d36b68-accb-4c4b-ab34-49b579c28bcf" />
<br><br>
<img width="795" height="464" alt="Screenshot 2025-12-24 at 10 02 25 PM" src="https://github.com/user-attachments/assets/17be1a9f-1f15-44f2-95f4-b9e21474f687" />

## Case 3: Both Access Token and Refresh Token are not expired
Both the access and refresh tokens are now configured with longer lifetimes, so they do not expire immediately. When a protected route is accessed with a valid, unexpired access token, all users are displayed without any errors.
<br><br>
<img width="587" height="86" alt="Screenshot 2025-12-24 at 10 06 06 PM" src="https://github.com/user-attachments/assets/9fc17ff2-90d2-4020-a38e-cf59522c4cf7" />
<br><br>
<img width="684" height="433" alt="Screenshot 2025-12-24 at 10 07 22 PM" src="https://github.com/user-attachments/assets/b52b3739-bf26-4aee-8534-8c89a924eb3d" />






