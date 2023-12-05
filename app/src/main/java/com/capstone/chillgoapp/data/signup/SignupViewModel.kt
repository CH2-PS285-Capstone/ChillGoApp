package com.capstone.chillgoapp.data.signup

import android.util.Log
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import com.capstone.chillgoapp.data.rules.Validator

class SignupViewModel: ViewModel() {

    private val TAG = SignupViewModel::class.simpleName

    var registUIState = mutableStateOf(RegistrationUIState())

    var allValidationsPassed = mutableStateOf(false)

    var signUpInProgress = mutableStateOf(false)

    fun onEvent(event: SignupUIEvent){
        when(event) {
            is SignupUIEvent.FirstNameChanged -> {
                registUIState.value = registUIState.value.copy(
                    firstName = event.firstName
                )
                printState()
            }
            is SignupUIEvent.LastNameChanged -> {
                registUIState.value = registUIState.value.copy(
                    lastName = event.lastName
                )
                printState()
            }
            is SignupUIEvent.EmailChanged -> {
                registUIState.value = registUIState.value.copy(
                    email = event.email
                )
                printState()
            }
            is SignupUIEvent.PasswordChanged -> {
                registUIState.value = registUIState.value.copy(
                    password = event.password
                )
                printState()
            }
            is SignupUIEvent.PrivacyPolicyCheckBoxClicked -> {
                registUIState.value = registUIState.value.copy(
                    privacyPolicyAccepted = event.status
                )
            }
            is SignupUIEvent.RegisterButtonClicked -> {
                signUp()
            }
        }
        validateDataWithRules()
    }

    private fun signUp(){
        Log.d(TAG, "InsideSignUp")
        printState()

        validateDataWithRules()
    }

    private fun validateDataWithRules() {
        val fNameResult = Validator.validFirstName(
            fName = registUIState.value.firstName
        )
        val lNameResult = Validator.validLastName(
            lName = registUIState.value.lastName
        )
        val emailResult = Validator.validEmail(
            email = registUIState.value.email
        )
        val pwdResult = Validator.validPassword(
            password = registUIState.value.password
        )
        val privacyPolicyResult = Validator.validatePrivacyPolicyAcceptance(
            statusValue = registUIState.value.privacyPolicyAccepted
        )

        Log.d(TAG, "InsideValidateDataWithRules")
        Log.d(TAG, "fNameResult = $fNameResult")
        Log.d(TAG, "lNameResult = $lNameResult")
        Log.d(TAG, "emailResult = $emailResult")
        Log.d(TAG, "pwdResult = $pwdResult")
        Log.d(TAG, "privacyPolicyResult = $privacyPolicyResult")

        registUIState.value = registUIState.value.copy(
            firstNameError = fNameResult.status,
            lastNameError = lNameResult.status,
            emailError = emailResult.status,
            passwordError = pwdResult.status,
            privacyPolicyAccepted = privacyPolicyResult.status
        )

    }

    private fun printState(){
        Log.d(TAG, "InsidePrintState")
        Log.d(TAG, registUIState.value.toString())
    }
}