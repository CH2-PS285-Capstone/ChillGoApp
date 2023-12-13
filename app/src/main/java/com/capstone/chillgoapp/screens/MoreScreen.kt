package com.capstone.chillgoapp.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.capstone.chillgoapp.ViewModelFactory
import com.capstone.chillgoapp.components.MoreItem
import com.capstone.chillgoapp.components.MoreSearch
import com.capstone.chillgoapp.components.NormalTextComponent
import com.capstone.chillgoapp.data.more.MoreViewModel
import com.capstone.chillgoapp.model.FakeTravelDataSource
import com.capstone.chillgoapp.model.OrderTravel
import com.capstone.chillgoapp.ui.common.UiState
import com.capstone.chillgoapp.ui.theme.PrimaryBody
import com.capstone.chillgoapp.ui.theme.PrimaryMain

@Composable
fun MoreScreen(
    modifier: Modifier = Modifier,
    moreViewModel: MoreViewModel = viewModel(
        factory = ViewModelFactory()
    ),
    navigateToDetail: (Long) -> Unit = {},
    navigateToDetailReview: (Long) -> Unit = {},
) {
    moreViewModel.uiState.collectAsState(initial = UiState.Loading).value.let { uiState ->
        when (uiState) {
            is UiState.Loading -> {
                moreViewModel.getAllTravels()
            }

            is UiState.Success -> {
                Column(
                    modifier = Modifier.background(PrimaryBody)
                ) {
                    MoreSearch()
                    MoreChips()
                    Spacer(modifier = Modifier.height(15.dp))
                    MoreContent(
                        orderTravel = uiState.data,
                        navigateToDetail = navigateToDetail,
                        navigateToDetailReview = navigateToDetailReview,
                        moreViewModel = moreViewModel)
                }
            }

            is UiState.Error -> {}
        }
    }
}

@Composable
fun MoreChips() {
    var selectedChip by remember {
        mutableStateOf("Sukabumi")
    }

    Row {
        MoreChip(
            modifier = Modifier.padding(start = 16.dp),
            label = "Sukabumi",
            selectedChip = selectedChip,
            onChoiceChip = {
                selectedChip = it
            },
            leadingIcon = {
                Icon(
                    modifier = Modifier.height(18.dp),
                    imageVector = Icons.Default.LocationOn,
                    contentDescription = "Location",
                    tint = if(selectedChip == "Sukabumi") Color.White else PrimaryMain
                )
            }
        )
        MoreChip(
            modifier = Modifier.padding(start = 16.dp),
            label = "Yang sering dikunjungi",
            selectedChip = selectedChip,
            onChoiceChip = {
                selectedChip = it
            }
        )
    }
}

@Composable
fun MoreChip(
    modifier: Modifier = Modifier,
    label: String = "Label",
    selectedChip: String = "",
    leadingIcon: @Composable (() -> Unit)? = {},
    onChoiceChip: (String) -> Unit
) {
    OutlinedButton(
        modifier = modifier,
        border = BorderStroke(1.dp, PrimaryMain),
        colors = ButtonDefaults.outlinedButtonColors(
            containerColor =
            if(selectedChip == label) PrimaryMain
            else Color.Transparent
        ),
        contentPadding = PaddingValues(vertical = 6.dp, horizontal = 14.dp),
        onClick = { onChoiceChip(label) }) {
        Row {
            if (leadingIcon != null) leadingIcon()
            if (leadingIcon != null) Spacer(modifier = Modifier.width(5.dp))
            NormalTextComponent(
                value = label,
                fontSize = 15.sp,
                color = if(selectedChip == label) Color.White
                else PrimaryMain
            )
        }
    }
}

@Composable
fun MoreContent(
    orderTravel: List<OrderTravel>,
    modifier: Modifier = Modifier,
    navigateToDetail: (Long) -> Unit,
    navigateToDetailReview: (Long) -> Unit,
    moreViewModel: MoreViewModel = viewModel(),
) {
    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        modifier = modifier.testTag("TravelList")
    ) {
        items(orderTravel.size) { index ->
            val data = orderTravel[index]
            var orderCount by remember {
                mutableIntStateOf(data.count)
            }

            MoreItem(
                id = data.travel.id,
                image = data.travel.image,
                title = data.travel.title,
                orderCount = orderCount,
                description = data.travel.description,
                requiredPoint = data.travel.requiredPoint,
                modifier = Modifier.clickable {
                    navigateToDetail(data.travel.id)
                },
                onFavClick = {
                    if(orderCount == 0) {
                        orderCount += 1
                    } else {
                        orderCount = 0
                    }

                    moreViewModel.updateOrderTravel(data.travel, orderCount)
                },
                onReviewClick = {
                    navigateToDetailReview(it)
                }
            )
        }
    }
}

@Preview
@Composable
fun MoreScreenPreview() {
    val orders = arrayListOf<OrderTravel>()
    FakeTravelDataSource.dummyTravels.forEach {
        orders.add(OrderTravel(it, 0))
    }

    Column(
        modifier = Modifier.background(PrimaryBody)
    ) {
        MoreSearch()
        MoreChips()
        Spacer(modifier = Modifier.height(15.dp))
    }
}