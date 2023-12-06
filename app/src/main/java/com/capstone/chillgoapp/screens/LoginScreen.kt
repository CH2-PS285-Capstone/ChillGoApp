package com.capstone.chillgoapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.capstone.chillgoapp.R
import com.capstone.chillgoapp.components.ButtonComponent
import com.capstone.chillgoapp.components.ClickableLoginTextComponent
import com.capstone.chillgoapp.components.DividerTextComponent
import com.capstone.chillgoapp.components.HeadingTextComponent
import com.capstone.chillgoapp.components.LogoTextComponent
import com.capstone.chillgoapp.components.MyTextFieldComponent
import com.capstone.chillgoapp.components.NormalTextComponent
import com.capstone.chillgoapp.components.PasswordTextFieldComponent
import com.capstone.chillgoapp.components.UnderlineNormalTextComponent
import com.capstone.chillgoapp.data.login.LoginUIEvent
import com.capstone.chillgoapp.data.login.LoginViewModel
import com.capstone.chillgoapp.data.signup.SignupUIEvent
import com.capstone.chillgoapp.data.signup.SignupViewModel
import com.capstone.chillgoapp.navigation.PostOfficeAppRouter
import com.capstone.chillgoapp.navigation.Screen
import com.capstone.chillgoapp.navigation.SystemBackButtonHandler
import com.capstone.chillgoapp.ui.theme.PrimaryBody

@Composable
fun LoginScreen(loginViewModel: LoginViewModel = viewModel()) {
    Box(modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center) {
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .background(PrimaryBody)
                .padding(28.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .background(PrimaryBody)
            )
            {
                LogoTextComponent(value = stringResource(id = R.string.chill_go_app))
                HeadingTextComponent(value = stringResource(id = R.string.welcome_back))
                NormalTextComponent(value = stringResource(id = R.string.setup_your_account))

                Spacer(modifier = Modifier.height(20.dp))
                MyTextFieldComponent(
                    labelValue = stringResource(id = R.string.email),
                    painterResource(id = R.drawable.email_24),
                    onTextChanged = {
                        loginViewModel.onEvent(LoginUIEvent.EmailChanged(it))
                    },
                    errorStatus = loginViewModel.loginUIState.value.emailError
                )
                PasswordTextFieldComponent(
                    labelValue = stringResource(id = R.string.password),
                    painterResource(id = R.drawable.lock_24),
                    onTextSelected = {
                        loginViewModel.onEvent(LoginUIEvent.PasswordChanged(it))
                    },
                    errorStatus = loginViewModel.loginUIState.value.passwordError
                )

                Spacer(modifier = Modifier.height(10.dp))
                UnderlineNormalTextComponent(value = stringResource(id = R.string.forgot_password))

                Spacer(modifier = Modifier.height(40.dp))
                ButtonComponent(
                    value = stringResource(id = R.string.login),
                    onButtonClicked = {
                        loginViewModel.onEvent(LoginUIEvent.LoginButtonClicked)
                    },
                    isEnabled = loginViewModel.allValidationsPassed.value

                )

                DividerTextComponent()
                ClickableLoginTextComponent(tryingToLogin = false, onTextSelected = {
                    PostOfficeAppRouter.navigateTo(Screen.SignUpScreen)
                })
            }
        }

        if(loginViewModel.loginInProgress.value) {
            CircularProgressIndicator()
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