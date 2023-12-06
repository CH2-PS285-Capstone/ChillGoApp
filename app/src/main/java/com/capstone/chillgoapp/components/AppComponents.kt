@file:OptIn(ExperimentalMaterial3Api::class)

package com.capstone.chillgoapp.components

import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.ClickableText
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.Divider
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.capstone.chillgoapp.R
import com.capstone.chillgoapp.ui.theme.PrimaryBody
import com.capstone.chillgoapp.ui.theme.PrimaryBorder
import com.capstone.chillgoapp.ui.theme.PrimaryMain
import com.capstone.chillgoapp.ui.theme.TextColor
import com.capstone.chillgoapp.ui.theme.Yellow700
import com.capstone.chillgoapp.ui.theme.componentShapes

@Composable
fun LogoTextComponent(value: String) {
    Text(
        text = value,
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 40.dp),
        style = TextStyle(
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            fontStyle = FontStyle.Normal,
            fontFamily = FontFamily(Font(R.font.calistoga_regular))
        )
        ,color = PrimaryMain
        ,textAlign = TextAlign.Center
    )
}

@Composable
fun HeadingTextComponent(value: String) {
    Text(
        text = value,
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 40.dp),
        style = TextStyle(
            fontSize = 30.sp,
            fontWeight = FontWeight.Bold,
            fontStyle = FontStyle.Normal
        )
        ,color = PrimaryMain
        ,textAlign = TextAlign.Center
    )
}

@Composable
fun NormalTextComponent(value: String) {
    Text(
        text = value,
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(),
        style = TextStyle(
            fontSize = 18.sp,
            fontWeight = FontWeight.Normal,
            fontStyle = FontStyle.Normal
        )
        ,color = PrimaryMain
        ,textAlign = TextAlign.Center
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MyTextFieldComponent(labelValue: String, painterResource: Painter,
                         onTextChanged: (String) -> Unit,
                         errorStatus: Boolean = false) {

    val textValue = remember {
        mutableStateOf("")
    }

    CompositionLocalProvider(LocalContentColor provides TextColor) {
        OutlinedTextField(
            modifier = Modifier
                .fillMaxWidth()
                .clip(componentShapes.small),
            label = { Text(text = labelValue, color = TextColor) },
            colors = TextFieldDefaults.outlinedTextFieldColors(
                focusedBorderColor = PrimaryBorder,
                focusedLabelColor = PrimaryBody,
                cursorColor = PrimaryBorder,
                containerColor = Color.White,
                unfocusedBorderColor = Color.LightGray
            ),
            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
            singleLine = true,
            maxLines = 1,
            value = textValue.value,
            onValueChange = {
                textValue.value = it
                onTextChanged(it)
            },
            leadingIcon = {
                Icon(
                    painter = painterResource,
                    contentDescription = ""
                )
            },
            isError = !errorStatus
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PasswordTextFieldComponent(labelValue: String, painterResource: Painter,
                               onTextSelected: (String) -> Unit,
                               errorStatus: Boolean = false) {

    val localFocusManager = LocalFocusManager.current
    val pwd = remember {
        mutableStateOf("")
    }

    val pwdVisible = remember {
        mutableStateOf(false)
    }

    CompositionLocalProvider(LocalContentColor provides TextColor) {
        OutlinedTextField(
            modifier = Modifier
                .fillMaxWidth()
                .clip(componentShapes.small),
            label = { Text(text = labelValue, color = TextColor) },
            colors = TextFieldDefaults.outlinedTextFieldColors(
                focusedBorderColor = PrimaryBorder,
                focusedLabelColor = PrimaryBody,
                cursorColor = PrimaryBorder,
                containerColor = Color.White,
                unfocusedBorderColor = Color.LightGray
            ),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password, imeAction = ImeAction.Done),
            singleLine = true,
            maxLines = 1,
            keyboardActions = KeyboardActions{
                localFocusManager.clearFocus()
            },
            value = pwd.value,
            onValueChange = {
                pwd.value = it
                onTextSelected(it)
            },
            leadingIcon = {
                Icon(
                    painter = painterResource,
                    contentDescription = ""
                )
            },
            trailingIcon = {
                val iconImage = if (pwdVisible.value) {
                    Icons.Filled.Visibility
                } else {
                    Icons.Filled.VisibilityOff
                }

                var description = if (pwdVisible.value) {
                    stringResource(id = R.string.hide_password)
                } else {
                    stringResource(id = R.string.show_password)
                }

                IconButton(onClick = { pwdVisible.value =!pwdVisible.value }) {
                    Icon(imageVector = iconImage, contentDescription = description)
                }
            },
            visualTransformation = if (pwdVisible.value) VisualTransformation.None else PasswordVisualTransformation(),
            isError = !errorStatus
        )
    }
}

@Composable
fun CheckboxComponent(value: String, onTextSelected: (String)-> Unit,
                      onCheckedChange: (Boolean) -> Unit) {
    Row (
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(56.dp),
        verticalAlignment = Alignment.CenterVertically,
    ){

        val checkState = remember {
            mutableStateOf(false)
        }

        Checkbox(checked = checkState.value,
            onCheckedChange = {
                checkState.value =!checkState.value
                onCheckedChange.invoke(it)
            })

        ClickableTextComponent(value = value, onTextSelected)
    }
}

@Composable
fun ClickableTextComponent(value: String, onTextSelected: (String)-> Unit) {
    val initTxt = "By continuing you accept our "
    val privacyPolicyTxt = "Privacy Policy"
    val andTxt = " and "
    val termConditionTxt = "Term of Use"

    val annotatedString = buildAnnotatedString {
        append(initTxt)
        withStyle(style = SpanStyle(color = PrimaryMain, fontWeight = FontWeight.Bold)){
            pushStringAnnotation(tag = privacyPolicyTxt, annotation = privacyPolicyTxt)
            append(privacyPolicyTxt)
        }
        append(andTxt)
        withStyle(style = SpanStyle(color = PrimaryMain, fontWeight = FontWeight.Bold)){
            pushStringAnnotation(tag = termConditionTxt, annotation = termConditionTxt)
            append(termConditionTxt)
        }
    }

    ClickableText(
        style = TextStyle(color = TextColor),
        text = annotatedString, onClick = {offset ->

        annotatedString.getStringAnnotations(offset,offset)
            .firstOrNull()?.also {span ->
                Log.d("ClickableTextComponent", "{$span}")

                if ((span.item == termConditionTxt) || (span.item == privacyPolicyTxt)){
                    onTextSelected(span.item)
                }
            }
    })
}

@Composable
fun ButtonComponent(value: String, onButtonClicked :() -> Unit, isEnabled: Boolean = false) {
    Button(
        onClick = {
                  onButtonClicked.invoke()
        },
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(48.dp),
        contentPadding = PaddingValues(),
        colors = ButtonDefaults.buttonColors(Color.Transparent),
        enabled = isEnabled
    ) {

        Box(modifier = Modifier
            .fillMaxWidth()
            .heightIn(48.dp)
            .background(
                brush = Brush.horizontalGradient(listOf(Yellow700, PrimaryMain)),
                shape = RoundedCornerShape(50.dp)
            ),
            contentAlignment = Alignment.Center
        ){
            Text(text = value,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Composable
fun DividerTextComponent() {
    Row (modifier = Modifier
        .fillMaxWidth()
        .heightIn(min = 70.dp),
        verticalAlignment = Alignment.CenterVertically
        ){
        Divider(modifier = Modifier
            .fillMaxWidth()
            .weight(1f),
        color = Color.LightGray,
        thickness = 1.dp)

        Text(modifier = Modifier.padding(8.dp),
            text = stringResource(R.string.or_better_yet),
            fontSize = 14.sp,
            color = TextColor)
        Divider(modifier = Modifier
            .fillMaxWidth()
            .weight(1f),
            color = Color.LightGray,
            thickness = 1.dp)
    }
}

@Composable
fun ClickableLoginTextComponent(tryingToLogin: Boolean = true, onTextSelected: (String)-> Unit) {
    val initTxt = if (tryingToLogin) "Already have an account? " else "Don’t have an account? "
    val loginTxt = if (tryingToLogin) "Login" else "Register"

    val annotatedString = buildAnnotatedString {
        append(initTxt)
        withStyle(style = SpanStyle(color = PrimaryMain, fontWeight = FontWeight.Bold, textDecoration = TextDecoration.Underline)
        ){
            pushStringAnnotation(tag = loginTxt, annotation = loginTxt)
            append(loginTxt)
        }
    }

    ClickableText(
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 40.dp),
        style = TextStyle(
            fontSize = 16.sp,
            fontStyle = FontStyle.Normal,
            textAlign = TextAlign.Center,
            color = TextColor
        ),
        text = annotatedString, onClick = {offset ->

        annotatedString.getStringAnnotations(offset,offset)
            .firstOrNull()?.also {span ->
                Log.d("ClickableTextComponent", "{$span}")

                if (span.item == loginTxt){
                    onTextSelected(span.item)
                }
            }
    })
}

@Composable
fun UnderlineNormalTextComponent(value: String) {
    Text(
        text = value,
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 40.dp),
        style = TextStyle(
            fontSize = 14.sp,
            fontWeight = FontWeight.Normal,
            fontStyle = FontStyle.Normal
        )
        ,color = PrimaryMain
        ,textAlign = TextAlign.Center
        ,textDecoration = TextDecoration.Underline
    )
}
