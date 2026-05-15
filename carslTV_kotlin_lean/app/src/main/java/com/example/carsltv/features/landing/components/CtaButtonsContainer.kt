package com.example.carsltv.features.landing.components

import android.content.Context
import android.view.KeyEvent
import android.widget.FrameLayout
import android.widget.LinearLayout
import androidx.core.view.setPadding

/**
 * CTA buttons container matching the React Native layout.
 * Contains "Continue as guest" and "Sign up" buttons with TV remote navigation.
 */
class CtaButtonsContainer(
    context: Context,
    private val onGuestPressed: () -> Unit = {},
    private val onSignupPressed: () -> Unit = {}
) : FrameLayout(context) {

    private val guestButton: CtaButton
    private val signupButton: CtaButton
    private var selectedButtonId: String = "guest"
    private var focusedElement: String = "buttons"

    init {
        setBackgroundColor(android.graphics.Color.TRANSPARENT)

        // Create horizontal layout for buttons
        val buttonContainer = LinearLayout(context).apply {
            orientation = LinearLayout.HORIZONTAL
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.WRAP_CONTENT,
                FrameLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                gravity = android.view.Gravity.CENTER_HORIZONTAL or android.view.Gravity.TOP
                topMargin = dpToPx(32)
            }
        }

        // Guest button
        guestButton = CtaButton(context).apply {
            text = "Continue as guest"
            buttonType = CtaButton.ButtonType.GUEST
            isButtonSelected = true
            setOnClickListener {
                selectButton("guest")
                onGuestPressed()
            }
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                dpToPx(48)
            ).apply {
                marginEnd = dpToPx(16)
            }
        }
        buttonContainer.addView(guestButton)

        // Sign up button
        signupButton = CtaButton(context).apply {
            text = "Sign up"
            buttonType = CtaButton.ButtonType.SIGNUP
            isButtonSelected = false
            setOnClickListener {
                selectButton("signup")
                onSignupPressed()
            }
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                dpToPx(48)
            ).apply {
                marginStart = dpToPx(16)
            }
        }
        buttonContainer.addView(signupButton)

        addView(buttonContainer)
        isFocusable = true
    }

    fun selectButton(buttonId: String) {
        selectedButtonId = buttonId
        focusedElement = "buttons"
        updateButtonStates()
    }

    private fun updateButtonStates() {
        guestButton.isButtonSelected = selectedButtonId == "guest" && focusedElement == "buttons"
        signupButton.isButtonSelected = selectedButtonId == "signup" && focusedElement == "buttons"
    }

    fun handleKeyDown(keyCode: Int): Boolean {
        return when (keyCode) {
            KeyEvent.KEYCODE_DPAD_LEFT -> {
                if (focusedElement == "buttons") {
                    selectedButtonId = if (selectedButtonId == "guest") "signup" else "guest"
                    updateButtonStates()
                }
                true
            }
            KeyEvent.KEYCODE_DPAD_RIGHT -> {
                if (focusedElement == "buttons") {
                    selectedButtonId = if (selectedButtonId == "guest") "signup" else "guest"
                    updateButtonStates()
                }
                true
            }
            KeyEvent.KEYCODE_DPAD_CENTER, KeyEvent.KEYCODE_ENTER -> {
                if (focusedElement == "buttons") {
                    when (selectedButtonId) {
                        "guest" -> onGuestPressed()
                        "signup" -> onSignupPressed()
                    }
                }
                true
            }
            else -> false
        }
    }

    private fun dpToPx(dp: Int): Int {
        return (dp * context.resources.displayMetrics.density).toInt()
    }
}
