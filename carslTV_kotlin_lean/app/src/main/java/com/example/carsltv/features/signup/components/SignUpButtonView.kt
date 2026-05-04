package com.example.carsltv.features.signup.components

import android.content.Context
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.widget.FrameLayout
import android.widget.TextView

class SignUpButtonView (
    context: Context,
    private val label: String = "",
    private val bgColorHex: String = "#D8522E",
    private val textColorHex: String = "#FFFFFF"
) : FrameLayout(context) {

    private val textView: TextView
    private var isSelected = false

    init {
        layoutParams = LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT)
        minimumHeight = 48
        minimumWidth = 200

        textView = TextView(context).apply {
            text = label
            textSize = 14f
            setTextColor(Color.parseColor(textColorHex))
            setTypeface(null, android.graphics.Typeface.BOLD)
            gravity = android.view.Gravity.CENTER
            setPadding(24, 12, 24, 12)
            maxLines = 1
        }

        addView(textView, LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.MATCH_PARENT).apply {
            gravity = android.view.Gravity.CENTER
        })

        updateBackground()
    }

    override fun setSelected(selected: Boolean) {
        isSelected = selected
        updateBackground()
    }

    private fun updateBackground() {
        if (isSelected) {
            val bgColor = Color.parseColor(bgColorHex)
            background = GradientDrawable().apply {
                setColor(bgColor)
                shape = GradientDrawable.RECTANGLE
                cornerRadius = 8f
                setStroke(2, Color.parseColor(bgColorHex))
            }
            elevation = 8f
            scaleX = 1.1f
            scaleY = 1.1f
        } else {
            background = GradientDrawable().apply {
                setColor(Color.TRANSPARENT)
                shape = GradientDrawable.RECTANGLE
                cornerRadius = 8f
                setStroke(2, Color.parseColor(bgColorHex))
            }
            elevation = 0f
            scaleX = 1f
            scaleY = 1f
        }
    }

    override fun onFocusChanged(gainFocus: Boolean, direction: Int, previouslyFocusedRect: android.graphics.Rect?) {
        super.onFocusChanged(gainFocus, direction, previouslyFocusedRect)
        setSelected(gainFocus)
    }
}
