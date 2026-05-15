package com.example.carsltv.features.landing.components

import android.content.Context
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.util.AttributeSet
import android.view.Gravity
import androidx.appcompat.widget.AppCompatButton
import androidx.core.content.ContextCompat

/**
 * Custom CTA button component matching React Native styling.
 * - "Continue as guest": Orange/rust background (#D8522E) with white text
 * - "Sign up": Transparent background with orange border and orange text
 */
class CtaButton @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : AppCompatButton(context, attrs, defStyleAttr) {

    companion object {
        const val BUTTON_HEIGHT_DP = 48
        const val PADDING_HORIZONTAL_DP = 24
        const val BORDER_WIDTH_DP = 2
        const val CORNER_RADIUS_DP = 12

        const val COLOR_PRIMARY = "#D8522E"  // Orange/rust
        const val COLOR_WHITE = "#FFFFFF"
        const val COLOR_WHITE_70 = "#B3FFFFFF"  // White at 70% opacity
        const val COLOR_TRANSPARENT = Color.TRANSPARENT
    }

    var isButtonSelected = false
        set(value) {
            field = value
            updateButtonStyle()
        }

    var buttonType: ButtonType = ButtonType.GUEST
        set(value) {
            field = value
            updateButtonStyle()
        }

    enum class ButtonType {
        GUEST,      // Orange filled background
        SIGNUP      // Transparent with orange border
    }

    init {
        setAllCaps(false)
        gravity = Gravity.CENTER
        textSize = 18f
        setPadding(
            dpToPx(PADDING_HORIZONTAL_DP),
            dpToPx(8),
            dpToPx(PADDING_HORIZONTAL_DP),
            dpToPx(8)
        )
        minHeight = dpToPx(BUTTON_HEIGHT_DP)
        isPressed = false
        updateButtonStyle()
    }

    private fun updateButtonStyle() {
        val backgroundColor: Int
        val textColor: Int
        val borderColor: Int
        val borderWidth: Int
        val elevation: Float

        when {
            isButtonSelected -> {
                // Selected state: full styling
                when (buttonType) {
                    ButtonType.GUEST -> {
                        backgroundColor = Color.parseColor(COLOR_PRIMARY)
                        textColor = Color.parseColor(COLOR_WHITE)
                        borderColor = Color.parseColor(COLOR_PRIMARY)
                    }
                    ButtonType.SIGNUP -> {
                        backgroundColor = COLOR_TRANSPARENT
                        textColor = Color.parseColor(COLOR_PRIMARY)
                        borderColor = Color.parseColor(COLOR_PRIMARY)
                    }
                }
                borderWidth = dpToPx(BORDER_WIDTH_DP)
                elevation = 4f
                scaleX = 1.1f
                scaleY = 1.1f
            }
            else -> {
                // Not selected: muted styling
                when (buttonType) {
                    ButtonType.GUEST -> {
                        backgroundColor = Color.parseColor(COLOR_PRIMARY)
                        textColor = Color.parseColor(COLOR_WHITE)
                        borderColor = Color.parseColor(COLOR_PRIMARY)
                    }
                    ButtonType.SIGNUP -> {
                        backgroundColor = COLOR_TRANSPARENT
                        textColor = Color.parseColor(COLOR_WHITE_70)
                        borderColor = Color.parseColor(COLOR_PRIMARY)
                    }
                }
                borderWidth = dpToPx(BORDER_WIDTH_DP)
                elevation = 0f
                scaleX = 1f
                scaleY = 1f
            }
        }

        setTextColor(textColor)
        this.elevation = elevation

        // Create drawable with border and corner radius
        val drawable = GradientDrawable().apply {
            setColor(backgroundColor)
            setStroke(borderWidth, borderColor)
            cornerRadius = dpToPx(CORNER_RADIUS_DP).toFloat()
        }
        background = drawable
    }

    private fun dpToPx(dp: Int): Int {
        return (dp * context.resources.displayMetrics.density).toInt()
    }
}
