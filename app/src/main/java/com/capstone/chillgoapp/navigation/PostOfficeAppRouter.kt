package com.capstone.chillgoapp.navigation

sealed class Screen(
    val route: String = ""
) {

    object SignUpScreen : Screen("signup")
    object TermsAndConditionsScreen : Screen("terms")
    object LoginScreen : Screen("login")
    object HomeScreen : Screen("home")

    object Splash : Screen("splash")
    object OnBoarding : Screen("onBoarding")
    object OnBoardingSecond : Screen("onBoardingSecond")
    object Dashboard : Screen("dashboard")
    object Favorite : Screen("cart")
    object Profile : Screen("profile")
    object More : Screen("more")
    object Reviews : Screen("reviews")
    object UmkmDetail : Screen("umkmDetail")
    object UmkmForm : Screen("umkmForm")
    object DetailTravel : Screen("home/{ticketId}/{review}") {
        fun createRoute(ticketId: Long, review: Boolean) = "home/$ticketId/$review"
    }
}


//object PostOfficeAppRouter {
//
//    var currentScreen: MutableState<Screen> = mutableStateOf(Screen.LoginScreen)
//
//    fun navigateTo(destination : Screen){
//        currentScreen.value = destination
//    }
//
//
//}