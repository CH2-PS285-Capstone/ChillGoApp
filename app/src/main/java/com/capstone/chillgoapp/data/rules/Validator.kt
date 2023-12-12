package com.capstone.chillgoapp.data.rules

object Validator {

    fun validFirstName(fName: String): ValidationResult {
        return ValidationResult(
            (!fName.isNullOrEmpty() && fName.length >= 3)
        )
    }

    fun validLastName(lName: String): ValidationResult {
        return ValidationResult(
            (!lName.isNullOrEmpty())
        )
    }

    fun validEmail(email: String): ValidationResult {
        return ValidationResult(
            (!email.isNullOrEmpty())
        )
    }

    fun validPassword(password: String): ValidationResult {
        return ValidationResult(
            (!password.isNullOrEmpty() && password.length >= 6)
        )
    }

    fun validatePrivacyPolicyAcceptance(statusValue: Boolean): ValidationResult {
        return ValidationResult(
            statusValue
        )
    }

}

data class ValidationResult(
    val status: Boolean = false
)