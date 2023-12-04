package com.capstone.chillgoapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.capstone.chillgoapp.R
import com.capstone.chillgoapp.components.ButtonComponent
import com.capstone.chillgoapp.components.ClickableLoginTextComponent
import com.capstone.chillgoapp.components.DividerTextComponent
import com.capstone.chillgoapp.components.HeadingTextComponent
import com.capstone.chillgoapp.components.LogoTextComponent
import com.capstone.chillgoapp.components.MyTextFieldComponent
import com.capstone.chillgoapp.components.NormalTextComponent
import com.capstone.chillgoapp.components.UnderlineNormalTextComponent
import com.capstone.chillgoapp.navigation.PostOfficeAppRouter
import com.capstone.chillgoapp.navigation.Screen
import com.capstone.chillgoapp.navigation.SystemBackButtonHandler
import com.capstone.chillgoapp.ui.theme.PrimaryBody

@Composable
fun LoginScreen() {

    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .background(PrimaryBody)
            .padding(28.dp)
    ) {
        Column(modifier = Modifier
            .fillMaxSize()
            .background(PrimaryBody))
        {
            LogoTextComponent(value = stringResource(id = R.string.chill_go_app))
            HeadingTextComponent(value = stringResource(id = R.string.welcome_back))
            NormalTextComponent(value = stringResource(id = R.string.setup_your_account))

            Spacer(modifier = Modifier.height(20.dp))
            MyTextFieldComponent(
                labelValue = stringResource(id = R.string.email),
                painterResource(id = R.drawable.email_24))
            MyTextFieldComponent(
                labelValue = stringResource(id = R.string.password),
                painterResource(id = R.drawable.lock_24))

            Spacer(modifier = Modifier.height(10.dp))
            UnderlineNormalTextComponent(value = stringResource(id = R.string.forgot_password))

            Spacer(modifier = Modifier.height(40.dp))
            ButtonComponent(value = stringResource(id = R.string.login))

            DividerTextComponent()
            ClickableLoginTextComponent(tryingToLogin = false, onTextSelected = {
                PostOfficeAppRouter.navigateTo(Screen.SignUpScreen)
            })
        }
    }

    SystemBackButtonHandler {
        PostOfficeAppRouter.navigateTo(Screen.SignUpScreen)
    }
}

@Preview(showSystemUi = true, showBackground = true)
@Composable
fun LoginScreenPreview() {
    LoginScreen()
}