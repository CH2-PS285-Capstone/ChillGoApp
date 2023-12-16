package com.capstone.chillgoapp.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.capstone.chillgoapp.R
import com.capstone.chillgoapp.ViewModelFactory
import com.capstone.chillgoapp.components.CityItem
import com.capstone.chillgoapp.components.HomeSection
import com.capstone.chillgoapp.components.PlaceItem
import com.capstone.chillgoapp.components.Search
import com.capstone.chillgoapp.data.home.HomeViewModel
import com.capstone.chillgoapp.model.FakeTravelDataSource
import com.capstone.chillgoapp.model.OrderTravel
import com.capstone.chillgoapp.ui.common.UiState
import com.capstone.chillgoapp.ui.theme.PrimaryBody

@Composable
fun Banner(
    modifier: Modifier = Modifier,
    onNavigateToMore: () -> Unit) {
    Box(modifier = modifier) {
        Image(
            painter = painterResource(id = R.drawable.banner),
            contentDescription = "Banner Image",
            contentScale = ContentScale.Crop,
            modifier = Modifier.height(160.dp),
        )
        Search(
            onNavigateToMore = onNavigateToMore
        )
    }
}

@Composable
fun HomeScreen(
    modifier: Modifier = Modifier,
    homeViewModel: HomeViewModel = viewModel(
        factory = ViewModelFactory()
    ),
    navigateToDetail: (Long) -> Unit = {},
    navigateToMore: () -> Unit = {},
) {
    homeViewModel.uiState.collectAsState(initial = UiState.Loading).value.let { uiState ->
        when (uiState) {
            is UiState.Loading -> {
                homeViewModel.getAllTravels()
            }

            is UiState.Success -> {
                Surface(modifier = Modifier
                    .fillMaxSize()
                    .background(PrimaryBody)) {
                    Column (
                        modifier = Modifier
                            .fillMaxSize()
                            .background(PrimaryBody)
                    ){
                        Banner(
                            onNavigateToMore = navigateToMore
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        HomeSection(
                            title = stringResource(R.string.by_city),
                            content = {
                                HomeCity(
                                    modifier = modifier,
                                    navigateToDetail = navigateToDetail,
                                )
                            }
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        HomeSection(
                            title = stringResource(R.string.top_rating),
                            /*showLocation = true,*/
                            content = {
                                HomeContent(
                                    orderTravel = uiState.data,
                                    modifier = modifier,
                                    navigateToDetail = navigateToDetail,
                                    homeViewModel = homeViewModel
                                )
                            },
                            onTextSelected = {
                                navigateToMore()
                            }
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        HomeSection(
                            title = stringResource(R.string.top_place),
                            content = {
                                HomeContent(
                                    orderTravel = uiState.data,
                                    modifier = modifier.background(PrimaryBody),
                                    navigateToDetail = navigateToDetail,
                                    homeViewModel = homeViewModel
                                )
                            },
                            onTextSelected = {
                                navigateToMore()
                            }
                        )
                    }
                }
            }

            is UiState.Error -> {}
        }
    }
}

@Composable
fun HomeCity(
    modifier: Modifier = Modifier,
    navigateToDetail: (Long) -> Unit,
) {
    val cities = listOf(
        "Bandung", "Jakarta", "Yogyakarta", "Semarang", "Surabaya", "Malang"
    )

    LazyRow(
        contentPadding = PaddingValues(16.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        modifier = modifier.testTag("TravelList")
    ) {
        items(cities.size) { index ->
            val data = cities[index]

            CityItem(
                image = R.drawable.bukit_bintang_bandung,
                title = data,
                modifier = Modifier.clickable {
                    navigateToDetail(1)
                }
            )
        }
    }
}

@Composable
fun HomeContent(
    orderTravel: List<OrderTravel>,
    modifier: Modifier = Modifier,
    navigateToDetail: (Long) -> Unit,
    homeViewModel: HomeViewModel
) {
    LazyRow(
        contentPadding = PaddingValues(16.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        modifier = modifier
            .testTag("TravelList")
            .background(PrimaryBody)
    ) {
        items(orderTravel.size) { index ->
            val data = orderTravel[index]
            var orderCount by remember {
                mutableIntStateOf(data.count)
            }

            PlaceItem(
                travel = data.travel,
                orderCount = orderCount,
                modifier = Modifier.clickable {
                    navigateToDetail(data.travel.id)
                },
                onFavClick = {
                    if(orderCount == 0) {
                        orderCount += 1
                    } else {
                        orderCount = 0
                    }

                    homeViewModel.updateOrderTravel(
                        travel = data.travel,
                        count = orderCount
                    )
                }
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun HomeScreenPreview(homeViewModel: HomeViewModel = viewModel(),
                      navigateToMore: () -> Unit = {}) {
    val orders = arrayListOf<OrderTravel>()
    FakeTravelDataSource.dummyTravels.forEach {
        orders.add(OrderTravel(it, 0))
    }

    HomeContent(
        homeViewModel = homeViewModel,
        orderTravel = orders,
        navigateToDetail = {},
    )
}