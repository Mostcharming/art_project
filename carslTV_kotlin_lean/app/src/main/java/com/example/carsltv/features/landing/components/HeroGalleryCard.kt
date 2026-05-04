package com.example.carsltv.features.landing.components

/**
 * Data class representing a card in the hero gallery carousel.
 */
data class HeroGalleryCard(
    val src: String,
    val alt: String,
    val title: String,
    val artist: String,
    val bgColor: Int,
    val positionLeft: Float,      // percentage: 0-100
    val positionTop: Float,       // percentage: 0-100
    val width: Float,             // percentage: 0-100
    val height: Float,            // percentage: 0-100
    val isPartial: Boolean = false,
    val isCenter: Boolean = false
)

object HeroGalleryData {
    val cards = listOf(
        HeroGalleryCard(
            src = "https://joincarsl.com/api/uploads/artworks/7.png",
            alt = "Carsl",
            title = "Carsl",
            artist = "Carsl",
            bgColor = 0xFF1a0a2e.toInt(),
            positionLeft = -10f,
            positionTop = 60f,
            width = 17.7f,
            height = 30.5f,
            isPartial = true
        ),
        HeroGalleryCard(
            src = "https://joincarsl.com/api/uploads/artworks/6.png",
            alt = "Carsl",
            title = "Carsl",
            artist = "Carsl",
            bgColor = 0xFF1a237e.toInt(),
            positionLeft = 6.1f,
            positionTop = 41.2f,
            width = 17.7f,
            height = 40.6f,
            isPartial = false
        ),
        HeroGalleryCard(
            src = "https://joincarsl.com/api/uploads/artworks/5.png",
            alt = "Carsl",
            title = "Carsl",
            artist = "Carsl",
            bgColor = 0xFF111111.toInt(),
            positionLeft = 22.2f,
            positionTop = 21.9f,
            width = 17.7f,
            height = 46.5f,
            isPartial = false
        ),
        HeroGalleryCard(
            src = "https://joincarsl.com/api/uploads/artworks/1.png",
            alt = "Carsl",
            title = "Carsl",
            artist = "Carsl",
            bgColor = 0xFF6b1a1a.toInt(),
            positionLeft = 38.3f,
            positionTop = 0f,
            width = 23.4f,
            height = 54.2f,
            isPartial = false,
            isCenter = true
        ),
        HeroGalleryCard(
            src = "https://joincarsl.com/api/uploads/artworks/2.png",
            alt = "Carsl",
            title = "Carsl",
            artist = "Carsl",
            bgColor = 0xFF7a2800.toInt(),
            positionLeft = 60.1f,
            positionTop = 22.4f,
            width = 17.7f,
            height = 46.5f,
            isPartial = false
        ),
        HeroGalleryCard(
            src = "https://joincarsl.com/api/uploads/artworks/3.png",
            alt = "Carsl",
            title = "Carsl",
            artist = "Carsl",
            bgColor = 0xFFd4d0c8.toInt(),
            positionLeft = 76.2f,
            positionTop = 39.4f,
            width = 17.7f,
            height = 39.4f,
            isPartial = false
        ),
        HeroGalleryCard(
            src = "https://joincarsl.com/api/uploads/artworks/4.png",
            alt = "Carsl",
            title = "Carsl",
            artist = "Carsl",
            bgColor = 0xFF5a2d00.toInt(),
            positionLeft = 92.3f,
            positionTop = 60f,
            width = 17.7f,
            height = 29.3f,
            isPartial = true
        )
    )

    val focusableIndices = listOf(1, 2, 3, 4, 5) // Non-partial card indices
}
