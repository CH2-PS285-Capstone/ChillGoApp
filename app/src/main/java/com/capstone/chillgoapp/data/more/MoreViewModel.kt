package com.capstone.chillgoapp.data.more

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.capstone.chillgoapp.data.TravelRepository
import com.capstone.chillgoapp.model.OrderTravel
import com.capstone.chillgoapp.model.Travel
import com.capstone.chillgoapp.ui.common.UiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.launch

class MoreViewModel(
    private val repository: TravelRepository
) : ViewModel() {
    private val _uiState: MutableStateFlow<UiState<List<OrderTravel>>> =
        MutableStateFlow(UiState.Loading)
    val uiState: StateFlow<UiState<List<OrderTravel>>>
        get() = _uiState

    fun getAllTravels() {
        viewModelScope.launch {
            repository.getAllTravels()
                .catch {
                    _uiState.value = UiState.Error(it.message.toString())
                }
                .collect { orderTravels ->
                    _uiState.value = UiState.Success(orderTravels)
                }
        }
    }

    fun updateOrderTravel(travel: Travel, count: Int) {
        viewModelScope.launch {
            repository.updateOrderTravel(travel.id, count)
        }
    }
}