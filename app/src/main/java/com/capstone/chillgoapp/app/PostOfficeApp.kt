package com.capstone.chillgoapp.app

import androidx.compose.animation.Crossfade
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.capstone.chillgoapp.navigation.PostOfficeAppRouter
import com.capstone.chillgoapp.navigation.Screen
import com.capstone.chillgoapp.screens.HomeScreen
import com.capstone.chillgoapp.screens.LoginScreen
import com.capstone.chillgoapp.screens.SignUpScreen
import com.capstone.chillgoapp.screens.TermAndConditionsScreen

@Composable
fun PostOfficeApp() {
    Surface (
        modifier = Modifier.fillMaxSize(),
        color = Color.White
    ){
        
        Crossfade(targetState = PostOfficeAppRouter.currentScreen, label = "") { currentState->
            when(currentState.value) {
                is Screen.LoginScreen -> {
                    LoginScreen()
                }
                is Screen.SignUpScreen -> {
                    SignUpScreen()
                }
                is Screen.TermsAndConditionsScreen -> {
                    TermAndConditionsScreen()
                }
                is Screen.HomeScreen -> {
                    HomeScreen()
                }
                else -> {}
            }
            
        }

    }
    
}