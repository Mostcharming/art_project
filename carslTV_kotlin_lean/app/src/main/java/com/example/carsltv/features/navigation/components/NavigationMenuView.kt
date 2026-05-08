package com.example.carsltv.features.navigation.components

import android.content.Context
import android.graphics.Color
import android.view.KeyEvent
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import androidx.appcompat.widget.AppCompatButton
import com.example.carsltv.R

class NavigationMenuView(context: Context) : FrameLayout(context) {

    private var focusedElement: FocusElement = FocusElement.GUEST_BUTTON
    private var selectedButtonId: String = "guest"
    private var onMenuItemSelectedListener: ((String) -> Unit)? = null

    private lateinit var guestButton: AppCompatButton
    private lateinit var signUpButton: AppCompatButton
    private lateinit var signInText: TextView

    enum class FocusElement {
        GUEST_BUTTON, SIGN_UP_BUTTON, SIGN_IN_LINK
    }

    init {
        setBackgroundColor(Color.BLACK)
        setupLayout()
    }

    private fun setupLayout() {
        val scrollView = ScrollView(context).apply {
            setBackgroundColor(Color.BLACK)
        }

        val mainContainer = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = ScrollView.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
        }

        // Logo
        val logoContainer = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                topMargin = 32
                bottomMargin = 24
            }
            gravity = android.view.Gravity.CENTER
        }

        val logo = ImageView(context).apply {
            setImageResource(R.drawable.carsl_logo)
            layoutParams = LinearLayout.LayoutParams(
                200, // width in pixels
                43  // height in pixels
            )
        }
        logoContainer.addView(logo)
        mainContainer.addView(logoContainer)

        // Tagline
        val taglineText = TextView(context).apply {
            text = "The Home of Contemporary Masterpieces"
            setTextColor(Color.WHITE)
            textSize = 28f
            gravity = android.view.Gravity.CENTER
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                leftMargin = 24
                rightMargin = 24
                bottomMargin = 32
            }
        }
        mainContainer.addView(taglineText)

        // Buttons Container
        val buttonsContainer = LinearLayout(context).apply {
            orientation = LinearLayout.HORIZONTAL
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                leftMargin = 24
                rightMargin = 24
                bottomMargin = 24
            }
            gravity = android.view.Gravity.CENTER
        }

        // Guest Button
        guestButton = createButton(
            "Continue as guest",
            bgColor = Color.parseColor("#D8522E"),
            textColor = Color.WHITE,
            borderColor = Color.parseColor("#D8522E")
        ).apply {
            setOnClickListener {
                focusedElement = FocusElement.GUEST_BUTTON
                selectedButtonId = "guest"
                updateButtonStates()
                onMenuItemSelectedListener?.invoke("guest")
            }
        }
        buttonsContainer.addView(guestButton, LinearLayout.LayoutParams(
            0,
            120
        ).apply {
            weight = 1f
            rightMargin = 16
        })

        // Sign Up Button
        signUpButton = createButton(
            "Sign up",
            bgColor = Color.TRANSPARENT,
            textColor = Color.parseColor("#D8522E"),
            borderColor = Color.parseColor("#D8522E")
        ).apply {
            setOnClickListener {
                focusedElement = FocusElement.SIGN_UP_BUTTON
                selectedButtonId = "signin"
                updateButtonStates()
                onMenuItemSelectedListener?.invoke("signin")
            }
        }
        buttonsContainer.addView(signUpButton, LinearLayout.LayoutParams(
            0,
            120
        ).apply {
            weight = 1f
            leftMargin = 16
        })

        mainContainer.addView(buttonsContainer)

        // Sign In Link
        signInText = TextView(context).apply {
            text = "Already have an account? Sign In"
            setTextColor(Color.parseColor("#D2D6DB"))
            textSize = 16f
            gravity = android.view.Gravity.CENTER
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                topMargin = 16
                bottomMargin = 40
            }
            setOnClickListener {
                focusedElement = FocusElement.SIGN_IN_LINK
                updateButtonStates()
                onMenuItemSelectedListener?.invoke("signin")
            }
        }
        mainContainer.addView(signInText)

        scrollView.addView(mainContainer)
        addView(scrollView, LayoutParams(
            LayoutParams.MATCH_PARENT,
            LayoutParams.MATCH_PARENT
        ))

        updateButtonStates()
    }

    private fun createButton(
        text: String,
        bgColor: Int,
        textColor: Int,
        borderColor: Int
    ): AppCompatButton {
        return AppCompatButton(context).apply {
            setText(text)
            setTextColor(textColor)
            setBackgroundColor(bgColor)
            textSize = 16f
            setTypeface(null, android.graphics.Typeface.BOLD)
            
            // Set border
            val drawable = android.graphics.drawable.GradientDrawable().apply {
                setColor(bgColor)
                setStroke(4, borderColor)
                cornerRadius = 16f
            }
            background = drawable
        }
    }

    fun handleKeyEvent(keyCode: Int): Boolean {
        return when (keyCode) {
            KeyEvent.KEYCODE_DPAD_LEFT -> {
                if (focusedElement == FocusElement.SIGN_UP_BUTTON) {
                    focusedElement = FocusElement.GUEST_BUTTON
                    selectedButtonId = "guest"
                    updateButtonStates()
                }
                true
            }
            KeyEvent.KEYCODE_DPAD_RIGHT -> {
                if (focusedElement == FocusElement.GUEST_BUTTON) {
                    focusedElement = FocusElement.SIGN_UP_BUTTON
                    selectedButtonId = "signin"
                    updateButtonStates()
                }
                true
            }
            KeyEvent.KEYCODE_DPAD_UP -> {
                if (focusedElement == FocusElement.SIGN_IN_LINK) {
                    focusedElement = FocusElement.GUEST_BUTTON
                    selectedButtonId = "guest"
                    updateButtonStates()
                }
                true
            }
            KeyEvent.KEYCODE_DPAD_DOWN -> {
                if (focusedElement != FocusElement.SIGN_IN_LINK) {
                    focusedElement = FocusElement.SIGN_IN_LINK
                    updateButtonStates()
                }
                true
            }
            KeyEvent.KEYCODE_DPAD_CENTER, KeyEvent.KEYCODE_ENTER -> {
                selectCurrentItem()
                true
            }
            else -> false
        }
    }

    private fun selectCurrentItem() {
        when (focusedElement) {
            FocusElement.GUEST_BUTTON -> onMenuItemSelectedListener?.invoke("guest")
            FocusElement.SIGN_UP_BUTTON -> onMenuItemSelectedListener?.invoke("signin")
            FocusElement.SIGN_IN_LINK -> onMenuItemSelectedListener?.invoke("signin")
        }
    }

    private fun updateButtonStates() {
        // Update guest button
        guestButton.apply {
            if (focusedElement == FocusElement.GUEST_BUTTON) {
                scaleX = 1.1f
                scaleY = 1.1f
                setBackgroundColor(Color.parseColor("#D8522E"))
                setTextColor(Color.WHITE)
                setShadowLayer(8f, 0f, 0f, Color.WHITE)
            } else {
                scaleX = 1f
                scaleY = 1f
                val drawable = android.graphics.drawable.GradientDrawable().apply {
                    setColor(Color.parseColor("#D8522E"))
                    setStroke(4, Color.parseColor("#D8522E"))
                    cornerRadius = 16f
                }
                background = drawable
                setTextColor(Color.WHITE)
                setShadowLayer(0f, 0f, 0f, Color.TRANSPARENT)
            }
        }

        // Update sign up button
        signUpButton.apply {
            if (focusedElement == FocusElement.SIGN_UP_BUTTON) {
                scaleX = 1.1f
                scaleY = 1.1f
                setBackgroundColor(Color.parseColor("#14213D"))
                setTextColor(Color.parseColor("#D8522E"))
                setShadowLayer(8f, 0f, 0f, Color.parseColor("#D8522E"))
            } else {
                scaleX = 1f
                scaleY = 1f
                val drawable = android.graphics.drawable.GradientDrawable().apply {
                    setColor(Color.TRANSPARENT)
                    setStroke(4, Color.parseColor("#D8522E"))
                    cornerRadius = 16f
                }
                background = drawable
                setTextColor(Color.parseColor("#D8522E"))
                setShadowLayer(0f, 0f, 0f, Color.TRANSPARENT)
            }
        }

        // Update sign in text
        signInText.apply {
            if (focusedElement == FocusElement.SIGN_IN_LINK) {
                scaleX = 1.1f
                scaleY = 1.1f
                setBackgroundColor(Color.parseColor("#33D8522E"))
                setTextColor(Color.parseColor("#D8522E"))
                setShadowLayer(8f, 0f, 0f, Color.parseColor("#D8522E"))
                setPadding(32, 16, 32, 16)
            } else {
                scaleX = 1f
                scaleY = 1f
                setBackgroundColor(Color.TRANSPARENT)
                setTextColor(Color.parseColor("#D2D6DB"))
                setShadowLayer(0f, 0f, 0f, Color.TRANSPARENT)
                setPadding(0, 0, 0, 0)
            }
        }
    }

    fun setOnMenuItemSelectedListener(listener: (String) -> Unit) {
        onMenuItemSelectedListener = listener
    }
}
