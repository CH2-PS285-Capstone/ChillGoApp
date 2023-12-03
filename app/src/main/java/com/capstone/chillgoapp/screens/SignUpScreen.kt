package com.capstone.chillgoapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
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
import com.capstone.chillgoapp.app.PostOfficeApp
import com.capstone.chillgoapp.components.ButtonComponent
import com.capstone.chillgoapp.components.CheckboxComponent
import com.capstone.chillgoapp.components.ClickableLoginTextComponent
import com.capstone.chillgoapp.components.DividerTextComponent
import com.capstone.chillgoapp.components.HeadingTextComponent
import com.capstone.chillgoapp.components.MyTextFieldComponent
import com.capstone.chillgoapp.components.NormalTextComponent
import com.capstone.chillgoapp.components.PasswordTextFieldComponent
import com.capstone.chillgoapp.navigation.PostOfficeAppRouter
import com.capstone.chillgoapp.navigation.Screen
import com.capstone.chillgoapp.ui.theme.PrimaryBody

@Composable
fun SignUpScreen() {
    Surface(
        modifier = Modifier
            .fillMaxSize()
            .background(PrimaryBody)
            .padding(28.dp)
    ) {
        Column(modifier = Modifier
            .fillMaxSize()
            .background(PrimaryBody))
        {

            HeadingTextComponent(value = stringResource(id = R.string.chill_go_app))
            NormalTextComponent(value = stringResource(id = R.string.setup_your_account))
            Spacer(modifier = Modifier.height(20.dp))
            MyTextFieldComponent(
                labelValue = stringResource(id = R.string.first_name),
                painterResource(id = R.drawable.identity_24)
            )
            MyTextFieldComponent(
                labelValue = stringResource(id = R.string.last_name),
                painterResource = painterResource(id = R.drawable.identity_24)
            )
            MyTextFieldComponent(
                labelValue = stringResource(id = R.string.email),
                painterResource = painterResource(id = R.drawable.email_24)
            )
            PasswordTextFieldComponent(
                labelValue = stringResource(id = R.string.password),
                painterResource = painterResource(id = R.drawable.lock_24)
            )
            CheckboxComponent(value = stringResource(id = R.string.terms_conditions),
                onTextSelected = {
                    PostOfficeAppRouter.navigateTo(Screen.TermsAndConditionsScreen)
                })

            Spacer(modifier = Modifier.height(50.dp))

            ButtonComponent(value = stringResource(id = R.string.register))

            DividerTextComponent()

            ClickableLoginTextComponent(onTextSelected = {

            })
        }
    }
}

@Preview
@Composable
fun DefaultPreviewOfSignUpScreen() {
    SignUpScreen()
}