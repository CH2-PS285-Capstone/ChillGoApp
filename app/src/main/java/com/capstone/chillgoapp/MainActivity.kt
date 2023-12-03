package com.capstone.chillgoapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.capstone.chillgoapp.app.PostOfficeApp
import com.capstone.chillgoapp.ui.theme.ChillGoAppTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ChillGoAppTheme {
                PostOfficeApp()
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    ChillGoAppTheme {
        PostOfficeApp()
    }
}