package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/shjung-dev/JWTAuthentication/config"
	"github.com/shjung-dev/JWTAuthentication/helpers"
	"github.com/shjung-dev/JWTAuthentication/routes"
)



func main(){
	err := godotenv.Load()

	if err != nil {
		log.Fatal(err)
	}

	port := os.Getenv("PORT")
	Key := os.Getenv("JWT_SECRET")
	
	//Connect to the database
	config.ConnectDatabase()

	helpers.SetJWTKey(Key)

	//Create the router using gin
	r := gin.Default()
	routes.SetUpRoutes(r)

	//Start the server using gin
	r.Run(":" + port)
	log.Println("Server is running on localhost:8080")
}
