package com.capstone.chillgoapp.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.capstone.chillgoapp.ui.theme.PrimaryBody
import com.capstone.chillgoapp.ui.theme.PrimaryMain

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun OnBoardingScreen(
    onNavigateToLogin: () -> Unit,
    onNavigateToSecondScreen: () -> Unit
) {
    /*val scope = rememberCoroutineScope()
    val pageState = rememberPagerState { 2 }*/

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(PrimaryBody),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Where do you prefer to vacation?",
            fontSize = 16.sp,
            color = PrimaryMain,
            fontWeight = FontWeight.W700
        )
        Spacer(modifier = Modifier.height(67.dp))

            OnBoardingChips()

        Spacer(modifier = Modifier.height(142.dp))

        Spacer(modifier = Modifier.height(47.dp))
        OnBoardingButton(label = "Next") {
            onNavigateToSecondScreen()
        }
        Spacer(modifier = Modifier.height(32.dp))
        OnBoardingButton(label = "Skip", outlined = true) { onNavigateToLogin() }
    }
}

@Composable
fun OnBoardingChips() {
    var selectedChip by remember {
        mutableStateOf("")
    }

    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Row {
            OnBoardingChip(label = "Theme Park", selectedChip = selectedChip) {
                selectedChip = it
            }
            Spacer(modifier = Modifier.width(12.dp))
            OnBoardingChip(label = "Nature Reserve", selectedChip = selectedChip) {
                selectedChip = it
            }
        }
        Spacer(modifier = Modifier.height(12.dp))
        Row {
            Spacer(modifier = Modifier.width(12.dp))
            OnBoardingChip(label = "Place of Worship", selectedChip = selectedChip) {
                selectedChip = it
            }
            Spacer(modifier = Modifier.width(12.dp))
            OnBoardingChip(label = "Culture", selectedChip = selectedChip) {
                selectedChip = it
            }
        }
    }
}

@Composable
fun OnBoardingChip(
    label: String,
    selectedChip: String,
    onSelect: (String) -> Unit
) {
    Surface(
        modifier = Modifier
            .clickable { onSelect(label) },
        shape = RoundedCornerShape(100.dp),
        border = BorderStroke(width = 1.dp, color = PrimaryMain),
        color = if(label == selectedChip) PrimaryMain else Color.Transparent
    ) {
        Text(
            modifier = Modifier.padding(8.dp),
            text = label,
            color = if(label != selectedChip) PrimaryMain else Color.White,
            fontSize = 18.sp
        )
    }
}

@Composable
fun OnBoardingButton(
    label: String,
    outlined: Boolean = false,
    onButtonClick: () -> Unit
) {
    if (outlined) OutlinedButton(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 12.dp),
        border = BorderStroke(width = 1.dp, color = PrimaryMain),
        onClick = { onButtonClick() }) {
        Text(
            text = label,
            fontWeight = FontWeight.W600,
            color = PrimaryMain
        )
    } else Button(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 12.dp),
        contentPadding = PaddingValues(vertical = 12.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = PrimaryMain,
        ),
        onClick = { onButtonClick() }) {
        Text(
            text = label,
            fontWeight = FontWeight.W600
        )
    }
}


@Preview
@Composable
fun OnBoardingPreview() {
    OnBoardingScreen(onNavigateToLogin = { }) {

    }
}