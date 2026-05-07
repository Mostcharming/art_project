package com.example.carsltv.features.landing.components

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.util.AttributeSet
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.TextView
import com.bumptech.glide.Glide
import com.bumptech.glide.load.engine.DiskCacheStrategy

class HeroGalleryCarouselView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : FrameLayout(context, attrs, defStyleAttr) {

    private val cardViews = mutableListOf<HeroCardView>()
    private var focusedIndex = 3
    private var onCardFocusedListener: ((Int) -> Unit)? = null
    private var onCardSelectedListener: (() -> Unit)? = null

    init {
        setBackgroundColor(Color.BLACK)
    }

    fun setCards(cards: List<HeroGalleryCard>) {
        removeAllViews()
        cardViews.clear()

        for ((index, card) in cards.withIndex()) {
            val cardView = HeroCardView(context).apply {
                setCard(card, index == focusedIndex)
            }
            cardViews.add(cardView)
            
            val layoutParams = LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT)
            layoutParams.leftMargin = 0
            layoutParams.topMargin = 0
            
            addView(cardView, layoutParams)
        }
    }

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        super.onSizeChanged(w, h, oldw, oldh)
        
        for ((index, cardView) in cardViews.withIndex()) {
            val card = cardView.getCard() ?: continue
            
            val leftPixels = (width * card.positionLeft / 100).toInt()
            val topPixels = (height * card.positionTop / 100).toInt()
            val cardWidth = (width * card.width / 100).toInt()
            val cardHeight = (height * card.height / 100).toInt()
            
            val params = cardView.layoutParams as LayoutParams
            params.width = cardWidth
            params.height = cardHeight
            params.leftMargin = leftPixels
            params.topMargin = topPixels
            cardView.layoutParams = params
        }
    }

    fun setFocusedIndex(index: Int) {
        if (index == focusedIndex) return
        if (index !in cardViews.indices) return

        cardViews[focusedIndex].setFocused(false)
        focusedIndex = index
        cardViews[focusedIndex].setFocused(true)
        onCardFocusedListener?.invoke(index)
    }

    fun setOnCardFocusedListener(listener: (Int) -> Unit) {
        this.onCardFocusedListener = listener
    }

    fun setOnCardSelectedListener(listener: () -> Unit) {
        this.onCardSelectedListener = listener
    }

    fun selectCard() {
        onCardSelectedListener?.invoke()
    }

    override fun dispatchDraw(canvas: Canvas) {
        super.dispatchDraw(canvas)
        
        val gradient = android.graphics.LinearGradient(
            0f, 0f, 0f, height.toFloat(),
            intArrayOf(Color.TRANSPARENT, Color.argb(153, 0, 0, 0)),
            floatArrayOf(0f, 1f),
            android.graphics.Shader.TileMode.CLAMP
        )
        val paint = Paint().apply {
            shader = gradient
        }
        canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), paint)
    }
}

class HeroCardView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : FrameLayout(context, attrs, defStyleAttr) {

    private val imageView = ImageView(context).apply {
        scaleType = ImageView.ScaleType.CENTER_CROP
    }
    private var card: HeroGalleryCard? = null
    private var isFocused = false
    private val infoOverlay = FrameLayout(context)
    private val titleView = TextView(context).apply {
        setTextColor(Color.WHITE)
        textSize = 14f
        maxLines = 1
    }
    private val artistView = TextView(context).apply {
        setTextColor(Color.argb(153, 255, 255, 255))
        textSize = 12f
        maxLines = 1
    }

    init {
        clipToOutline = true
        setBackgroundColor(Color.BLACK)
        
        addView(imageView, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT))
        
        infoOverlay.addView(titleView, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT).apply {
            bottomMargin = 8
            leftMargin = 12
            rightMargin = 12
        })
        infoOverlay.addView(artistView, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT).apply {
            leftMargin = 12
            rightMargin = 12
        })
        addView(infoOverlay, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT))
        infoOverlay.visibility = GONE
    }

    fun setCard(card: HeroGalleryCard, isFocused: Boolean = false) {
        this.card = card
        this.isFocused = isFocused

        setBackgroundColor(card.bgColor)

        Glide.with(context)
            .load(card.src)
            .diskCacheStrategy(DiskCacheStrategy.ALL)
            .into(imageView)

        titleView.text = card.title
        artistView.text = card.artist

        updateFocusState()
    }

    fun getCard(): HeroGalleryCard? = card

    fun setFocused(focused: Boolean) {
        isFocused = focused
        updateFocusState()
    }

    private fun updateFocusState() {
        if (isFocused) {
            scaleX = 1.05f
            scaleY = 1.05f
            elevation = 16f
            
            bringToFront()
            
            val outlineProvider = object : android.view.ViewOutlineProvider() {
                override fun getOutline(view: android.view.View, outline: android.graphics.Outline) {
                    outline.setRoundRect(0, 0, view.width, view.height, 12f)
                }
            }
            setOutlineProvider(outlineProvider)
            elevation = 16f
            
            infoOverlay.visibility = VISIBLE
            infoOverlay.invalidate()
        } else {
            elevation = if (card?.isCenter == true) 4f else 0f
            scaleX = 1f
            scaleY = 1f
            infoOverlay.visibility = GONE
        }
    }

    override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
        super.onLayout(changed, left, top, right, bottom)
        
        val padding = 12
        
        titleView.measure(
            MeasureSpec.makeMeasureSpec(width - padding * 2, MeasureSpec.AT_MOST),
            MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED)
        )
        
        artistView.measure(
            MeasureSpec.makeMeasureSpec(width - padding * 2, MeasureSpec.AT_MOST),
            MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED)
        )
        
        val totalHeight = titleView.measuredHeight + artistView.measuredHeight + 8
        val startY = height - totalHeight - padding
        
        titleView.layout(padding, startY, width - padding, startY + titleView.measuredHeight)
        artistView.layout(padding, startY + titleView.measuredHeight + 8, width - padding, height - padding)
    }

    override fun dispatchDraw(canvas: Canvas) {
        super.dispatchDraw(canvas)
        
        if (isFocused) {
            val borderPaint = Paint().apply {
                color = Color.argb(204, 255, 255, 255)
                style = Paint.Style.STROKE
                strokeWidth = 4f
                isAntiAlias = true
            }
            canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), borderPaint)
        }
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        
        if (isFocused && infoOverlay.visibility == VISIBLE) {
            val overlayHeight = height * 0.5f
            val gradient = android.graphics.LinearGradient(
                0f, height - overlayHeight, 0f, height.toFloat(),
                intArrayOf(Color.TRANSPARENT, Color.argb(204, 0, 0, 0)),
                floatArrayOf(0f, 1f),
                android.graphics.Shader.TileMode.CLAMP
            )
            val paint = Paint().apply {
                shader = gradient
            }
            canvas.drawRect(0f, height - overlayHeight, width.toFloat(), height.toFloat(), paint)
        }
    }
}
