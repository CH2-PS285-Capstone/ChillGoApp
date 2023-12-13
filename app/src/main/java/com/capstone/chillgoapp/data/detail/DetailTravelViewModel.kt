package com.capstone.chillgoapp.data.detail

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.capstone.chillgoapp.data.TravelRepository
import com.capstone.chillgoapp.model.OrderTravel
import com.capstone.chillgoapp.ui.common.UiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class DetailTravelViewModel(
    private val repository: TravelRepository
) : ViewModel() {
    private val _uiState: MutableStateFlow<UiState<OrderTravel>> =
        MutableStateFlow(UiState.Loading)
    val uiState: StateFlow<UiState<OrderTravel>>
        get() = _uiState

    fun getTravelById(travelId: Long) {
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            _uiState.value = UiState.Success(repository.getOrderTravelById(travelId))
        }
    }

}