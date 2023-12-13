package com.capstone.chillgoapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.capstone.chillgoapp.R
import com.capstone.chillgoapp.components.ButtonComponent
import com.capstone.chillgoapp.components.MyTextFieldComponent
import com.capstone.chillgoapp.data.signup.SignupUIEvent
import com.capstone.chillgoapp.data.signup.SignupViewModel
import com.capstone.chillgoapp.ui.theme.PrimaryBody
import com.capstone.chillgoapp.ui.theme.PrimaryMain

@OptIn(ExperimentalMaterial3Api::class)
@Preview(showBackground = true, showSystemUi = true)
@Composable
fun UmkmFormScreen(onBackPressed: () -> Unit = {},
                   signupViewModel: SignupViewModel = viewModel(),) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .background(PrimaryBody)
                .padding(18.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .background(PrimaryBody)
                    .verticalScroll(rememberScrollState())
            ) {
                TopAppBar(
                    title = {
                        Text(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(PrimaryBody),
                            text = "MSME Submission Form",
                            color = PrimaryMain,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.W700,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                            textAlign = TextAlign.Center
                        )
                    },
                    colors = TopAppBarDefaults.smallTopAppBarColors(containerColor = PrimaryBody),
                    navigationIcon = {
                        Icon(
                            modifier = Modifier
                                .background(PrimaryBody)
                                .clickable { onBackPressed() },
                            imageVector = Icons.Default.ArrowBack,
                            contentDescription = "Back",
                            tint = PrimaryMain
                        )
                    }
                )
                Spacer(modifier = Modifier.height(8.dp))
                MyTextFieldComponent(
                    labelValue = stringResource(id = R.string.name_msme),
                    onTextChanged = {
                        signupViewModel.onEvent(SignupUIEvent.FirstNameChanged(it))
                    },
                    errorStatus = signupViewModel.registUIState.value.firstNameError
                )
                Spacer(modifier = Modifier.height(8.dp))
                MyTextFieldComponent(
                    labelValue = stringResource(id = R.string.product_price),
                    onTextChanged = {
                        signupViewModel.onEvent(SignupUIEvent.FirstNameChanged(it))
                    },
                    errorStatus = signupViewModel.registUIState.value.firstNameError
                )
                Spacer(modifier = Modifier.height(8.dp))
                MyTextFieldComponent(
                    labelValue = stringResource(id = R.string.address),
                    onTextChanged = {
                        signupViewModel.onEvent(SignupUIEvent.FirstNameChanged(it))
                    },
                    errorStatus = signupViewModel.registUIState.value.firstNameError
                )
                Spacer(modifier = Modifier.height(8.dp))
                MyTextFieldComponent(
                    labelValue = stringResource(id = R.string.ratings),
                    onTextChanged = {
                        signupViewModel.onEvent(SignupUIEvent.FirstNameChanged(it))
                    },
                    errorStatus = signupViewModel.registUIState.value.firstNameError
                )
                Spacer(modifier = Modifier.height(8.dp))
                MyTextFieldComponent(
                    labelValue = stringResource(id = R.string.description),
                    onTextChanged = {
                        signupViewModel.onEvent(SignupUIEvent.FirstNameChanged(it))
                    },
                    errorStatus = signupViewModel.registUIState.value.firstNameError
                )
                Spacer(modifier = Modifier.height(8.dp))
                MyTextFieldComponent(
                    labelValue = stringResource(id = R.string.category),
                    onTextChanged = {
                        signupViewModel.onEvent(SignupUIEvent.FirstNameChanged(it))
                    },
                    errorStatus = signupViewModel.registUIState.value.firstNameError
                )
                Spacer(modifier = Modifier.height(8.dp))
                MyTextFieldComponent(
                    labelValue = stringResource(id = R.string.number_phone),
                    onTextChanged = {
                        signupViewModel.onEvent(SignupUIEvent.FirstNameChanged(it))
                    },
                    errorStatus = signupViewModel.registUIState.value.firstNameError
                )
                Spacer(modifier = Modifier.height(8.dp))
                MyTextFieldComponent(
                    labelValue = stringResource(id = R.string.schedule_ops),
                    onTextChanged = {
                        signupViewModel.onEvent(SignupUIEvent.FirstNameChanged(it))
                    },
                    errorStatus = signupViewModel.registUIState.value.firstNameError
                )
                Spacer(modifier = Modifier.height(22.dp))
                ButtonComponent(
                    value = stringResource(id = R.string.submit),
                    onButtonClicked = {

                    },
                    isEnabled = signupViewModel.allValidationsPassed.value
                )
            }
        }
    }
}