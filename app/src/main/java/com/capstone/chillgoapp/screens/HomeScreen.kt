package com.capstone.chillgoapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.capstone.chillgoapp.components.ButtonComponent
import com.capstone.chillgoapp.components.HeadingTextComponent
import com.capstone.chillgoapp.data.signup.SignupViewModel
import com.capstone.chillgoapp.ui.theme.PrimaryBody

@Composable
fun HomeScreen(signupViewModel: SignupViewModel = viewModel()) {
    Surface(
        modifier = Modifier
            .fillMaxSize()
            .background(PrimaryBody)
            .padding(28.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
        )
        {

            HeadingTextComponent(value = "Home")

            //Button Logout
            ButtonComponent(
                value = "Logout", onButtonClicked = {
                    signupViewModel.logout()
                },
                isEnabled = true
            )

        }
    }
}

@Preview
@Composable
fun HomeScreenPreview() {
    HomeScreen()
}