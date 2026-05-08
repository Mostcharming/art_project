package com.example.carsltv.features.navigation.components

import android.content.Context
import android.graphics.Color
import android.net.Uri
import android.view.KeyEvent
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.widget.AppCompatButton
import com.bumptech.glide.Glide
import com.example.carsltv.R

data class CardData(
    val src: String,
    val alt: String,
    val title: String,
    val artist: String,
    val bg: Int,
    val leftPercent: Float,
    val topPercent: Float,
    val widthPercent: Float,
    val heightPercent: Float,
    val isPartial: Boolean = false,
    val isCenter: Boolean = false
)

class NavigationMenuView(context: Context) : FrameLayout(context) {

    private var focusedElement: FocusElement = FocusElement.GUEST_BUTTON
    private var selectedButtonId: String = "guest"
    private var onMenuItemSelectedListener: ((String) -> Unit)? = null
    private var cardFocusIndex: Int = 6  // Far right card by default

    private lateinit var guestButton: AppCompatButton
    private lateinit var signUpButton: AppCompatButton
    private lateinit var signInText: TextView
    private var cardsViews: MutableList<View> = mutableListOf()

    enum class FocusElement {
        GUEST_BUTTON, SIGN_UP_BUTTON, SIGN_IN_LINK
    }

    private val CARDS = listOf(
        CardData(
            src = "https://joincarsl.com/api/uploads/artworks/7.png",
            alt = "Carsl",
            title = "Carsl",
            artist = "Carsl",
            bg = Color.parseColor("#1a0a2e"),
            leftPercent = -10f,
            topPercent = 80f,
            widthPercent = 17.7f,
            heightPercent = 30f,
            isPartial = true
        ),
        CardData(
            src = "https://joincarsl.com/api/uploads/artworks/6.png",
            alt = "Carsl",
            title = "Carsl",
            artist = "Carsl",
            bg = Color.parseColor("#1a237e"),
            leftPercent = 6.1f,
            topPercent = 70f,
            widthPercent = 17.7f,
            heightPercent = 40f
        ),
        CardData(
            src = "https://joincarsl.com/api/uploads/artworks/5.png",
            alt = "Carsl",
            title = "Carsl",
            artist = "Carsl",
            bg = Color.parseColor("#111111"),
            leftPercent = 22.2f,
            topPercent = 58f,
            widthPercent = 17.7f,
            heightPercent = 52f
        ),
        CardData(
            src = "https://joincarsl.com/api/uploads/artworks/1.png",
            alt = "Carsl",
            title = "Carsl",
            artist = "Carsl",
            bg = Color.parseColor("#6b1a1a"),
            leftPercent = 38.3f,
            topPercent = 50f,
            widthPercent = 23.4f,
            heightPercent = 60f,
            isCenter = true
        ),
        CardData(
            src = "https://joincarsl.com/api/uploads/artworks/2.png",
            alt = "Carsl",
            title = "Carsl",
            artist = "Carsl",
            bg = Color.parseColor("#7a2800"),
            leftPercent = 60.1f,
            topPercent = 58f,
            widthPercent = 17.7f,
            heightPercent = 52f
        ),
        CardData(
            src = "https://joincarsl.com/api/uploads/artworks/3.png",
            alt = "Carsl",
            title = "Carsl",
            artist = "Carsl",
            bg = Color.parseColor("#d4d0c8"),
            leftPercent = 76.2f,
            topPercent = 70f,
            widthPercent = 17.7f,
            heightPercent = 40f
        ),
        CardData(
            src = "https://joincarsl.com/api/uploads/artworks/4.png",
            alt = "Carsl",
            title = "Carsl",
            artist = "Carsl",
            bg = Color.parseColor("#5a2d00"),
            leftPercent = 92.3f,
            topPercent = 80f,
            widthPercent = 17.7f,
            heightPercent = 30f,
            isPartial = true
        )
    )

    init {
        setBackgroundColor(Color.BLACK)
        setupLayout()
    }

    private fun setupLayout() {
        // Main container - FrameLayout for absolute positioning
        val mainContainer = FrameLayout(context).apply {
            layoutParams = FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            setBackgroundColor(Color.BLACK)
        }

        // Card carousel container - background layer
        val cardsContainer = FrameLayout(context).apply {
            layoutParams = FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            setBackgroundColor(Color.BLACK)
        }

        // Create and add cards
        for (i in CARDS.indices) {
            val card = CARDS[i]
            val cardView = createCardView(card, i)
            cardsContainer.addView(cardView)
            cardsViews.add(cardView)
        }

        // Add navigation hints overlay at 55% height
        val hintsContainer = FrameLayout(context).apply {
            layoutParams = FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        }

        val hintsText = TextView(context).apply {
            text = "⇅ Navigate | ←→ Scroll | Enter to select"
            setTextColor(Color.WHITE)
            textSize = 14f
            gravity = android.view.Gravity.CENTER
            setBackgroundColor(Color.parseColor("#CC000000"))
            setPadding(16, 8, 16, 8)
        }

        val hintsParams = FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        ).apply {
            gravity = android.view.Gravity.CENTER_HORIZONTAL or android.view.Gravity.BOTTOM
            bottomMargin = 50
        }
        hintsContainer.addView(hintsText, hintsParams)

        // Foreground overlay container with buttons and text
        val overlayContainer = FrameLayout(context).apply {
            layoutParams = FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        }

        // Content container for header, buttons, and sign-in
        val contentContainer = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            ).apply {
                gravity = android.view.Gravity.TOP or android.view.Gravity.CENTER_HORIZONTAL
            }
            gravity = android.view.Gravity.TOP or android.view.Gravity.CENTER_HORIZONTAL
        }

        // Logo
        val logoContainer = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                topMargin = 16
                bottomMargin = 16
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
        contentContainer.addView(logoContainer)

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
        contentContainer.addView(taglineText)

        // Buttons Container
        val buttonsContainer = LinearLayout(context).apply {
            orientation = LinearLayout.HORIZONTAL
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                leftMargin = 32
                rightMargin = 32
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
            LinearLayout.LayoutParams.WRAP_CONTENT,
            80
        ).apply {
            rightMargin = 20
        })

        // Sign Up Button
        signUpButton = createButton(
            "Sign up",
            bgColor = Color.TRANSPARENT,
            textColor = Color.WHITE,
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
            LinearLayout.LayoutParams.WRAP_CONTENT,
            80
        ).apply {
            leftMargin = 20
        })

        contentContainer.addView(buttonsContainer)

        // Sign In Link
        signInText = TextView(context).apply {
            val fullText = "Already have an account? Sign In"
            val spannableString = android.text.SpannableString(fullText)
            
            // Set white for the beginning part
            spannableString.setSpan(
                android.text.style.ForegroundColorSpan(Color.WHITE),
                0,
                "Already have an account? ".length,
                android.text.Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
            )
            
            // Set orange for "Sign In"
            spannableString.setSpan(
                android.text.style.ForegroundColorSpan(Color.parseColor("#D8522E")),
                "Already have an account? ".length,
                fullText.length,
                android.text.Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
            )
            
            text = spannableString
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
        contentContainer.addView(signInText)

        overlayContainer.addView(contentContainer)

        // Add layers to main container
        mainContainer.addView(cardsContainer, FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ))
        mainContainer.addView(overlayContainer, FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ))
        mainContainer.addView(hintsContainer, FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ))

        addView(mainContainer)

        updateButtonStates()
    }

    private fun createCardView(card: CardData, index: Int): View {
        val cardContainer = FrameLayout(context).apply {
            setBackgroundColor(card.bg)
            clipToOutline = true
        }

        val cardImage = ImageView(context).apply {
            scaleType = ImageView.ScaleType.CENTER_CROP
            // Load image from actual URL using Glide
            Glide.with(context)
                .load(card.src)
                .into(this)
        }
        cardContainer.addView(cardImage, FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ))

        // Convert percentages to pixels
        val screenWidth = context.resources.displayMetrics.widthPixels
        val screenHeight = context.resources.displayMetrics.heightPixels

        val leftPx = (screenWidth * card.leftPercent / 100).toInt()
        val topPx = (screenHeight * card.topPercent / 100).toInt()
        val widthPx = (screenWidth * card.widthPercent / 100).toInt()
        val heightPx = (screenHeight * card.heightPercent / 100).toInt()

        val params = FrameLayout.LayoutParams(widthPx, heightPx).apply {
            leftMargin = leftPx
            topMargin = topPx
            if (!card.isPartial && !card.isCenter) {
                // Regular cards
            } else if (card.isCenter) {
                // Center card z-index
            }
        }

        cardContainer.layoutParams = params

        // Set corner radius
        cardContainer.outlineProvider = object : android.view.ViewOutlineProvider() {
            override fun getOutline(view: View?, outline: android.graphics.Outline?) {
                if (outline != null) {
                    outline.setRoundRect(0, 0, view!!.width, view.height, 12f)
                }
            }
        }
        cardContainer.clipToOutline = true

        return cardContainer
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
            textSize = 16f
            setTypeface(null, android.graphics.Typeface.BOLD)
            
            // Set border and background
            val drawable = android.graphics.drawable.GradientDrawable().apply {
                setColor(bgColor)
                setStroke(2, borderColor)
                cornerRadius = 20f
            }
            background = drawable
            
            // Add padding for better appearance
            setPadding(24, 16, 24, 16)
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
        // White with 70% opacity for unfocused text
        val unfocusedTextColor = Color.parseColor("#B3FFFFFF")
        
        // Update guest button
        guestButton.apply {
            val drawable = android.graphics.drawable.GradientDrawable().apply {
                setColor(Color.parseColor("#D8522E"))
                setStroke(2, Color.parseColor("#D8522E"))
                cornerRadius = 20f
            }
            background = drawable
            
            if (focusedElement == FocusElement.GUEST_BUTTON) {
                scaleX = 1.1f
                scaleY = 1.1f
                setTextColor(Color.WHITE)
                setShadowLayer(2f, 0f, 0f, Color.WHITE)
            } else {
                scaleX = 1f
                scaleY = 1f
                setTextColor(unfocusedTextColor)  // white/70%
                setShadowLayer(0f, 0f, 0f, Color.TRANSPARENT)
            }
        }

        // Update sign up button
        signUpButton.apply {
            val drawable = android.graphics.drawable.GradientDrawable().apply {
                setColor(Color.TRANSPARENT)
                setStroke(2, Color.parseColor("#D8522E"))
                cornerRadius = 20f
            }
            background = drawable
            
            if (focusedElement == FocusElement.SIGN_UP_BUTTON) {
                scaleX = 1.1f
                scaleY = 1.1f
                setTextColor(Color.parseColor("#D8522E"))
                setShadowLayer(2f, 0f, 0f, Color.WHITE)
            } else {
                scaleX = 1f
                scaleY = 1f
                setTextColor(unfocusedTextColor)  // white/70%
                setShadowLayer(0f, 0f, 0f, Color.TRANSPARENT)
            }
        }

        // Update sign in text
        signInText.apply {
            // Create spannable string with white and orange colors
            val fullText = "Already have an account? Sign In"
            val spannableString = android.text.SpannableString(fullText)
            
            // Set white for the beginning part
            spannableString.setSpan(
                android.text.style.ForegroundColorSpan(Color.WHITE),
                0,
                "Already have an account? ".length,
                android.text.Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
            )
            
            // Set orange for "Sign In"
            spannableString.setSpan(
                android.text.style.ForegroundColorSpan(Color.parseColor("#D8522E")),
                "Already have an account? ".length,
                fullText.length,
                android.text.Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
            )
            
            text = spannableString
            
            if (focusedElement == FocusElement.SIGN_IN_LINK) {
                scaleX = 1.1f
                scaleY = 1.1f
                setBackgroundColor(Color.parseColor("#33D8522E"))
                setShadowLayer(2f, 0f, 0f, Color.WHITE)
                setPadding(32, 16, 32, 16)
            } else {
                scaleX = 1f
                scaleY = 1f
                setBackgroundColor(Color.TRANSPARENT)
                setShadowLayer(0f, 0f, 0f, Color.TRANSPARENT)
                setPadding(0, 0, 0, 0)
            }
        }
    }

    fun setOnMenuItemSelectedListener(listener: (String) -> Unit) {
        onMenuItemSelectedListener = listener
    }
}
