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
   
## Explanations of Token Generation and Validation Codes
Among all the code, I found the token validation logic the most challenging to understand, and it took me some time to fully grasp what happens under the hood. If you are working with token validation using the golang-jwt package, this part can be particularly tricky to comprehend. I will focus on explaining this section of the code, with the hope that it will help anyone encountering it for the first time.
```
func ValidateToken(tokenString string) (*Claims, error) {
	secretKey := GetJWTKey()

	token, err := jwt.ParseWithClaims(
		tokenString,
		&Claims{},
		func(token *jwt.Token) (interface{}, error) {
			return secretKey, nil
		},
	)

	if err != nil {
		if ve, ok := err.(*jwt.ValidationError); ok {
			if ve.Errors&jwt.ValidationErrorExpired != 0 {
				//JWT validation error includes the ‘expired token’ flag
				//If the token isn't expired the bitwise operation will give 0
				return nil, ErrTokenExpired
			}
		}
		return nil, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}
```
A JWT (JSON Web Token) is a compact, URL-safe string that represents claims between two parties (usually server and client). It consists of three parts:
- Header.Payload/Claims.Signature

Payload / Claims: The main content of the token.
- Includes user-specific information (like userID and username) and standard claims such as expiry (exp).

Signature: Ensures the token has not been tampered.
- Created by taking base64UrlEncode(header) + "." + base64UrlEncode(payload) and signing it with a secret key using the algorithm specified in the header.
- Example: HMAC-SHA256 signature.
#### Purpose: When the server receives a token, it can verify the signature to ensure that the claims have not been altered and that the token is still valid.

The following code:
```
type Claims struct {
	UserID    string `json:"user_id"`
	Username  string `json:"username"`
	TokenType string `json:"token_type"`
	jwt.StandardClaims
}
```
Custom Claims (UserID, Username, TokenType): You define these to store user-specific data and distinguish between access and refresh tokens.
- jwt.StandardClaims is Predefined fields in JWT for common purposes:
  - ExpiresAt (exp): Token expiry timestamp.
  - IssuedAt (iat): Token issuance timestamp.
  - Issuer (iss): Identifies who issued the token.
  - Subject (sub): Subject of the token, often user ID.
  - Audience (aud): Intended recipient of the token.
  - Purpose: By embedding jwt.StandardClaims, you can leverage built-in expiration validation and standard JWT conventions while also including your custom user data.

#### Parsing the token
```
token, err := jwt.ParseWithClaims(
    tokenString,
    &Claims{},
    func(token *jwt.Token) (interface{}, error) {
        return secretKey, nil
    },
)
```
- jwt.ParseWithClaims:
  - Parses a JWT string and extracts the claims into the struct you provide (&Claims{} in this case).
  - Verifies the token’s signature using the secret key returned by the callback function.
  - Checks standard claims like exp (expiry) if present.

- Parameters:
  - tokenString: The JWT string received from the client.
  - &Claims{}: Pointer to a claims struct where the payload will be decoded.
  - Callback function: Returns the secret key used to verify the token signature.

- What happens internally:
  - Decode the JWT into its three parts:
    - Header , Payload/Claim , Signature 
  - Base64 decode the payload into the Claims struct.
  - Verify the signature using the secret key.
  - If signature verification fails or token is malformed, returns an error.
  - Validates standard claims (e.g., expiration).

## I have explained a little more detailed [HERE](https://dev.to/shjung-dev/token-validation-57id) so feel free to check it out


