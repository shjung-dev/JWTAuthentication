package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/shjung-dev/JWTAuthentication/controllers"
	"github.com/shjung-dev/JWTAuthentication/middleware"
)

func SetUpRoutes(r *gin.Engine) {
	r.POST("/signup", controllers.Signup())
	r.POST("/login", controllers.Login())
	r.POST("/refresh", controllers.RefreshTokenHandler())

	protected := r.Group("/")

	protected.Use(middleware.Authenticate())
	{
		protected.GET("/users", controllers.GetUsers())
		protected.GET("/user/:id", controllers.GetUser())
	}

}
