package com.example.carsltv.features.navigation.fragments

import android.content.Intent
import android.os.Bundle
import android.view.KeyEvent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.fragment.app.Fragment
import com.example.carsltv.features.navigation.components.NavigationMenuView

class NavigationFragment : Fragment() {

    private lateinit var navigationMenuView: NavigationMenuView

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return FrameLayout(requireContext()).apply {
            setBackgroundColor(android.graphics.Color.BLACK)
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )

            navigationMenuView = NavigationMenuView(requireContext())
            navigationMenuView.setOnMenuItemSelectedListener { destination ->
                navigateToDestination(destination)
            }
            
            addView(navigationMenuView, FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            ))

            isFocusable = true
            isFocusableInTouchMode = true
            requestFocus()
        }
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        view.requestFocus()
    }

    override fun onResume() {
        super.onResume()
        view?.requestFocus()
    }

    private fun navigateToDestination(destination: String) {
        // Handle navigation to different destinations
        when (destination) {
            "guest" -> {
                // Navigate to guest/browse page
                // TODO: Create and navigate to guest browse activity
            }
            "signin" -> {
                // Navigate to sign up/sign in page
                // TODO: Create and navigate to sign in activity
            }
        }
    }

    fun onKeyDown(keyCode: Int, event: KeyEvent): Boolean {
        if (event.action == KeyEvent.ACTION_DOWN) {
            return navigationMenuView.handleKeyEvent(keyCode)
        }
        return false
    }

    companion object {
        fun newInstance() = NavigationFragment()
    }
}
