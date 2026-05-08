package com.example.carsltv.features.landing.fragments

import android.content.Intent
import android.os.Bundle
import android.view.KeyEvent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.TextView
import androidx.fragment.app.Fragment
import com.example.carsltv.features.navigation.activities.NavigationActivity
import com.example.carsltv.features.landing.components.HeroGalleryCard
import com.example.carsltv.features.landing.components.HeroGalleryCarouselView
import com.example.carsltv.features.landing.components.HeroGalleryData

class HeroGalleryFragment : Fragment() {

    private lateinit var carouselView: HeroGalleryCarouselView
    private var focusedIndex = 6

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

            carouselView = HeroGalleryCarouselView(requireContext())
            carouselView.setCards(HeroGalleryData.cards)
            carouselView.setFocusedIndex(focusedIndex)
            
            addView(carouselView, FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            ))

            val promptText = TextView(requireContext()).apply {
                text = "Press Enter(ok) to continue"
                setTextColor(android.graphics.Color.WHITE)
                textSize = 14f
                gravity = android.view.Gravity.CENTER
            }
            addView(promptText, FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                bottomMargin = 32
                gravity = android.view.Gravity.BOTTOM or android.view.Gravity.CENTER_HORIZONTAL
            })

            // Setup carousel listeners
            carouselView.setOnCardSelectedListener {
                navigateToDetails()
            }
            
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

    private fun navigateToDetails() {
        val intent = Intent(requireContext(), NavigationActivity::class.java)
        startActivity(intent)
    }

    fun onKeyDown(keyCode: Int, event: KeyEvent): Boolean {
        if (event.action == KeyEvent.ACTION_DOWN) {
            return when (keyCode) {
                KeyEvent.KEYCODE_DPAD_LEFT -> {
                    handleLeftNavigation()
                    true
                }
                KeyEvent.KEYCODE_DPAD_RIGHT -> {
                    handleRightNavigation()
                    true
                }
                KeyEvent.KEYCODE_DPAD_CENTER, KeyEvent.KEYCODE_ENTER -> {
                    navigateToDetails()
                    true
                }
                else -> false
            }
        }
        return false
    }

    private fun handleLeftNavigation() {
        val focusableIndices = HeroGalleryData.focusableIndices
        val currentPos = focusableIndices.indexOf(focusedIndex)
        
        if (currentPos > 0) {
            focusedIndex = focusableIndices[currentPos - 1]
            carouselView.setFocusedIndex(focusedIndex)
        }
    }

    private fun handleRightNavigation() {
        val focusableIndices = HeroGalleryData.focusableIndices
        val currentPos = focusableIndices.indexOf(focusedIndex)
        
        if (currentPos < focusableIndices.size - 1) {
            focusedIndex = focusableIndices[currentPos + 1]
            carouselView.setFocusedIndex(focusedIndex)
        }
    }

    companion object {
        fun newInstance() = HeroGalleryFragment()
    }
}
