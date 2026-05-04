package com.example.carsltv.features.signup.fragments

import android.os.Bundle
import android.view.KeyEvent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import androidx.fragment.app.Fragment
import com.example.carsltv.features.signup.components.SignUpButtonView
import com.example.carsltv.features.landing.components.HeroGalleryCarouselView
import com.example.carsltv.features.landing.components.HeroGalleryData

class SignUpFragment : Fragment() {

    private var selectedButtonId = "guest"
    private var focusedElement: String = "buttons"
    private lateinit var guestButton: SignUpButtonView
    private lateinit var signUpButton: SignUpButtonView
    private lateinit var signInLink: TextView
    private lateinit var scrollView: ScrollView

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

            // Main scrollable content
            addView(
                ScrollView(requireContext()).apply {
                    scrollView = this
                    layoutParams = FrameLayout.LayoutParams(
                        FrameLayout.LayoutParams.MATCH_PARENT,
                        FrameLayout.LayoutParams.MATCH_PARENT
                    )

                    addView(
                        LinearLayout(requireContext()).apply {
                            orientation = LinearLayout.VERTICAL
                            layoutParams = FrameLayout.LayoutParams(
                                FrameLayout.LayoutParams.MATCH_PARENT,
                                FrameLayout.LayoutParams.WRAP_CONTENT
                            )

                            val padding = 24
                            setPadding(padding, padding, padding, padding)

                            addView(createLogoView(), LinearLayout.LayoutParams(
                                LinearLayout.LayoutParams.MATCH_PARENT,
                                LinearLayout.LayoutParams.WRAP_CONTENT
                            ).apply {
                                topMargin = 32
                                bottomMargin = 24
                                gravity = android.view.Gravity.CENTER_HORIZONTAL
                            })

                            addView(createTaglineView(), LinearLayout.LayoutParams(
                                LinearLayout.LayoutParams.MATCH_PARENT,
                                LinearLayout.LayoutParams.WRAP_CONTENT
                            ).apply {
                                bottomMargin = 32
                            })

                            addView(createButtonsContainer(), LinearLayout.LayoutParams(
                                LinearLayout.LayoutParams.MATCH_PARENT,
                                LinearLayout.LayoutParams.WRAP_CONTENT
                            ).apply {
                                bottomMargin = 16
                            })

                            // Gallery carousel container
                            addView(createGalleryContainer(), LinearLayout.LayoutParams(
                                LinearLayout.LayoutParams.MATCH_PARENT,
                                (resources.displayMetrics.heightPixels * 0.7f).toInt()
                            ).apply {
                                topMargin = 24
                                bottomMargin = 40
                            })

                            isFocusable = true
                            isFocusableInTouchMode = true
                        }
                    )
                }
            )

            // Navigation hint overlay
            addView(createNavigationHint())
        }
    }

    private fun createGalleryContainer(): View {
        return FrameLayout(requireContext()).apply {
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT
            )
            setBackgroundColor(android.graphics.Color.BLACK)

            val galleryView = HeroGalleryCarouselView(requireContext()).apply {
                setCards(HeroGalleryData.cards)
            }

            addView(galleryView, FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            ))
        }
    }

    private fun createNavigationHint(): View {
        return FrameLayout(requireContext()).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )

            val hintContainer = FrameLayout(requireContext()).apply {
                setBackgroundColor(android.graphics.Color.parseColor("#CC000000"))
                layoutParams = FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.WRAP_CONTENT,
                    FrameLayout.LayoutParams.WRAP_CONTENT
                ).apply {
                    gravity = android.view.Gravity.CENTER_HORIZONTAL or android.view.Gravity.BOTTOM
                    bottomMargin = 40
                }

                val hintText = TextView(requireContext()).apply {
                    text = "⇅ Navigate | ←→ Scroll | Enter to select"
                    textSize = 12f
                    setTextColor(android.graphics.Color.WHITE)
                    setPadding(16, 8, 16, 8)
                    gravity = android.view.Gravity.CENTER
                }

                addView(hintText, FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.WRAP_CONTENT,
                    FrameLayout.LayoutParams.WRAP_CONTENT
                ).apply {
                    gravity = android.view.Gravity.CENTER
                })
            }

            addView(hintContainer)
        }
    }

    private fun createLogoView(): View {
        return TextView(requireContext()).apply {
            text = "CARSL"
            textSize = 24f
            setTextColor(android.graphics.Color.WHITE)
            typeface = android.graphics.Typeface.create(android.graphics.Typeface.SANS_SERIF, android.graphics.Typeface.BOLD)
            setTypeface(null, android.graphics.Typeface.BOLD)
        }
    }

    private fun createTaglineView(): TextView {
        return TextView(requireContext()).apply {
            text = "The Home of Contemporary Masterpieces"
            textSize = 28f
            setTextColor(android.graphics.Color.WHITE)
            setTypeface(null, android.graphics.Typeface.BOLD)
            gravity = android.view.Gravity.CENTER
            maxLines = 3
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
        }
    }

    private fun createButtonsContainer(): LinearLayout {
        return LinearLayout(requireContext()).apply {
            orientation = LinearLayout.VERTICAL
            gravity = android.view.Gravity.CENTER_HORIZONTAL

            val buttonContainer = LinearLayout(requireContext()).apply {
                orientation = LinearLayout.HORIZONTAL
                gravity = android.view.Gravity.CENTER
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply {
                    bottomMargin = 24
                }

                guestButton = SignUpButtonView(
                    requireContext(),
                    label = "Continue as guest",
                    bgColorHex = "#D8522E",
                    textColorHex = "#FFFFFF"
                ).apply {
                    isFocusable = true
                    isFocusableInTouchMode = true
                    setOnFocusChangeListener { _, hasFocus ->
                        if (hasFocus) {
                            selectedButtonId = "guest"
                            focusedElement = "buttons"
                            updateButtonStates()
                        }
                    }
                    setOnClickListener {
                        selectedButtonId = "guest"
                        focusedElement = "buttons"
                        handleButtonSelect()
                    }
                }

                addView(guestButton, LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply {
                    rightMargin = 16
                })

                signUpButton = SignUpButtonView(
                    requireContext(),
                    label = "Sign up",
                    bgColorHex = "#00000000",
                    textColorHex = "#D8522E"
                ).apply {
                    isFocusable = true
                    isFocusableInTouchMode = true
                    setOnFocusChangeListener { _, hasFocus ->
                        if (hasFocus) {
                            selectedButtonId = "signin"
                            focusedElement = "buttons"
                            updateButtonStates()
                        }
                    }
                    setOnClickListener {
                        selectedButtonId = "signin"
                        focusedElement = "buttons"
                        handleButtonSelect()
                    }
                }

                addView(signUpButton, LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply {
                    leftMargin = 16
                })
            }

            addView(buttonContainer)

            signInLink = TextView(requireContext()).apply {
                text = "Already have an account? Sign In"
                textSize = 14f
                setTextColor(android.graphics.Color.parseColor("#D2D6DB"))
                isFocusable = true
                isFocusableInTouchMode = true
                isClickable = true
                setPadding(12, 8, 12, 8)
                setBackgroundColor(android.graphics.Color.TRANSPARENT)

                setOnFocusChangeListener { _, hasFocus ->
                    if (hasFocus) {
                        focusedElement = "signin"
                        updateButtonStates()
                    }
                }

                setOnClickListener {
                    focusedElement = "signin"
                    navigateToSignIn()
                }
            }

            addView(signInLink, LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                topMargin = 16
                gravity = android.view.Gravity.CENTER_HORIZONTAL
            })
        }
    }

    private fun updateButtonStates() {
        guestButton.setSelected(selectedButtonId == "guest" && focusedElement == "buttons")
        signUpButton.setSelected(selectedButtonId == "signin" && focusedElement == "buttons")
        
        val bgColor = if (focusedElement == "signin") 
            android.graphics.Color.parseColor("#4D2817") 
        else 
            android.graphics.Color.TRANSPARENT
        signInLink.setBackgroundColor(bgColor)
    }

    private fun handleButtonSelect() {
        when (selectedButtonId) {
            "guest" -> navigateToGuest()
            "signin" -> navigateToSignUp()
        }
    }

    private fun navigateToGuest() {
        // TODO: Implement guest navigation
    }

    private fun navigateToSignUp() {
        // TODO: Implement signup navigation
    }

    private fun navigateToSignIn() {
        // Navigate to signin page
    }

    fun onKeyDown(keyCode: Int, event: KeyEvent): Boolean {
        if (event.action == KeyEvent.ACTION_DOWN) {
            return when (keyCode) {
                KeyEvent.KEYCODE_DPAD_LEFT -> {
                    if (focusedElement == "buttons") {
                        selectedButtonId = if (selectedButtonId == "guest") "signin" else "guest"
                        updateButtonStates()
                        if (selectedButtonId == "guest") {
                            guestButton.requestFocus()
                        } else {
                            signUpButton.requestFocus()
                        }
                    }
                    true
                }
                KeyEvent.KEYCODE_DPAD_RIGHT -> {
                    if (focusedElement == "buttons") {
                        selectedButtonId = if (selectedButtonId == "guest") "signin" else "guest"
                        updateButtonStates()
                        if (selectedButtonId == "guest") {
                            guestButton.requestFocus()
                        } else {
                            signUpButton.requestFocus()
                        }
                    }
                    true
                }
                KeyEvent.KEYCODE_DPAD_UP -> {
                    if (focusedElement == "signin") {
                        focusedElement = "buttons"
                        updateButtonStates()
                        if (selectedButtonId == "guest") {
                            guestButton.requestFocus()
                        } else {
                            signUpButton.requestFocus()
                        }
                    }
                    true
                }
                KeyEvent.KEYCODE_DPAD_DOWN -> {
                    if (focusedElement == "buttons") {
                        focusedElement = "signin"
                        updateButtonStates()
                        signInLink.requestFocus()
                    }
                    true
                }
                KeyEvent.KEYCODE_DPAD_CENTER, KeyEvent.KEYCODE_ENTER -> {
                    if (focusedElement == "buttons") {
                        handleButtonSelect()
                    } else if (focusedElement == "signin") {
                        navigateToSignIn()
                    }
                    true
                }
                else -> false
            }
        }
        return false
    }

    companion object {
        fun newInstance() = SignUpFragment()
    }
}
