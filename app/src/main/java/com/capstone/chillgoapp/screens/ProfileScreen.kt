package com.capstone.chillgoapp.screens

import androidx.compose.foundation.Image
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
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AddCircle
import androidx.compose.material.icons.filled.Logout
import androidx.compose.material.icons.outlined.Email
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.capstone.chillgoapp.R
import com.capstone.chillgoapp.ViewModelFactory
import com.capstone.chillgoapp.data.home.HomeViewModel
import com.capstone.chillgoapp.data.signup.SignupViewModel
import com.capstone.chillgoapp.model.FakeTravelDataSource
import com.capstone.chillgoapp.model.OrderTravel
import com.capstone.chillgoapp.ui.common.UiState
import com.capstone.chillgoapp.ui.theme.ChillGoAppTheme
import com.capstone.chillgoapp.ui.theme.PrimaryBody
import com.capstone.chillgoapp.ui.theme.PrimaryMain

@Composable
fun ProfileScreen(
    viewModel: HomeViewModel = viewModel(
        factory = ViewModelFactory()
    ),
    onNavigateToLogin: () -> Unit = {},
    navigateToDetail: (Long) -> Unit = {},
    navigateToUmkmForm: () -> Unit = {}
) {

    viewModel.uiState.collectAsState(initial = UiState.Loading).value.let { uiState ->
        when (uiState) {
            is UiState.Loading -> {
                viewModel.getAllTravels()
            }

            is UiState.Success -> {
                ProfilContent(navigateToDetail, navigateToUmkmForm, onNavigateToLogin)
            }

            is UiState.Error -> {}
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfilContent(
    navigateToDetail: (Long) -> Unit = {},
    navigateToUmkmForm: () -> Unit = {},
    onNavigateToLogin: () -> Unit = {},
    signupViewModel: SignupViewModel = viewModel()
) {
    val orderTravels = arrayListOf<OrderTravel>()
    FakeTravelDataSource.dummyBestTravel.forEach {
        orderTravels.add(OrderTravel(it, 0))
    }
    Surface(
        modifier = Modifier
            .fillMaxSize()
            .background(PrimaryBody)
            .padding(top = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .background(PrimaryBody),
            horizontalAlignment = Alignment.Start
        ) {
            TopAppBar(
                title = {
                    Text(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(PrimaryBody),
                        text = "",
                        color = PrimaryMain,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.W700,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        textAlign = TextAlign.Center
                    )
                },
                colors = TopAppBarDefaults.smallTopAppBarColors(containerColor = PrimaryBody),
                actions = {
                    IconButton(onClick = {
                        signupViewModel.logout(onNavigateToLogin)
                    }) {
                        Icon(
                            modifier = Modifier
                                .background(PrimaryBody),
                            tint = PrimaryMain,
                            imageVector = Icons.Filled.Logout,
                            contentDescription = stringResource(R.string.logout)
                        )
                    }
                }
            )
            Surface(
                modifier = Modifier
                    .size(114.dp)
                    .align(Alignment.CenterHorizontally)
                    .background(PrimaryBody),
                color = Color(0XCCC7CEBE),
                shape = CircleShape,
            ) {
                Image(
                    painter = painterResource(id = R.drawable.account),
                    contentDescription = "Profile Picture",
                    modifier = Modifier.padding(32.dp)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                modifier = Modifier.fillMaxWidth(),
                text = "Adi",
                fontSize = 32.sp,
                fontWeight = FontWeight.W600,
                color = PrimaryMain,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Center
            ) {
                Icon(
                    imageVector = Icons.Outlined.Email,
                    contentDescription = "Email",
                    tint = PrimaryMain
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "adi@gmail.com",
                    color = PrimaryMain,
                    fontSize = 16.sp,
                    textAlign = TextAlign.Center
                )
            }

            Spacer(modifier = Modifier.height(22.dp))
            Spacer(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(2.dp)
                    .background(Color.LightGray)
            )
            Spacer(modifier = Modifier.height(16.dp))
            Button(
                modifier = Modifier.padding(horizontal = 13.dp),
                shape = RoundedCornerShape(15.dp),
                contentPadding = PaddingValues(horizontal = 24.dp, vertical = 9.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0X80C7CEBE)
                ),
                onClick = { navigateToUmkmForm() }) {
                Icon(
                    imageVector = Icons.Default.AddCircle,
                    contentDescription = "",
                    tint = PrimaryMain
                )
                Text(
                    modifier = Modifier.fillMaxWidth(),
                    text = stringResource(R.string.msme_submission),
                    color = PrimaryMain,
                    fontWeight = FontWeight.W600,
                    textAlign = TextAlign.Center
                )
            }
            Spacer(modifier = Modifier.height(22.dp))
            Text(
                modifier = Modifier.padding(start = 16.dp),
                text = stringResource(R.string.data_of_your_msme),
                color = PrimaryMain,
                fontSize = 15.sp,
                fontWeight = FontWeight.W600
            )
            Spacer(modifier = Modifier.height(26.dp))
            LastContent(
                orderTravel = orderTravels,
                navigateToDetail = {
                    navigateToDetail(it)
                })
        }
    }
}

@Composable
fun LastContent(
    orderTravel: List<OrderTravel>,
    modifier: Modifier = Modifier,
    navigateToDetail: (Long) -> Unit,
) {
    LazyColumn(
        modifier = modifier
            .testTag("TravelList")
            .background(PrimaryBody)
    ) {
        items(orderTravel.size) { index ->
            val data = orderTravel[index]

            Card(
                modifier = Modifier
                    .padding(horizontal = 16.dp, vertical = 8.dp)
                    .fillMaxWidth()
                    .clickable {
                        navigateToDetail(data.travel.id)
                    },
                shape = RoundedCornerShape(16.dp),
                elevation = CardDefaults.cardElevation(4.dp),
                colors = CardDefaults.cardColors(
                    containerColor = Color.White
                )
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Image(
                        modifier = Modifier
                            .clip(RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp))
                            .fillMaxWidth()
                            .height(110.dp),
                        painter = painterResource(id = data.travel.image),
                        contentDescription = "",
                        contentScale = ContentScale.Crop
                    )
                    Spacer(modifier = Modifier.height(14.dp))
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(start = 8.dp, end = 8.dp, bottom = 28.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = data.travel.title,
                            color = PrimaryMain,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.W700,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                            textAlign = TextAlign.Center
                        )
                        Text(
                            text = stringResource(
                                R.string.required_point,
                                data.travel.requiredPoint
                            ),
                            color = PrimaryMain,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.W700,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            }
        }
    }
}

@Preview(showBackground = true, showSystemUi = true)
@Composable
fun DefaultPreview() {
    ChillGoAppTheme {
        ProfilContent()
    }
}