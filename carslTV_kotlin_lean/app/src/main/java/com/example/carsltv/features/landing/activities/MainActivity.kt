package com.example.carsltv.features.landing.activities

import android.os.Bundle
import android.view.KeyEvent
import androidx.fragment.app.FragmentActivity
import com.example.carsltv.R
import com.example.carsltv.features.landing.fragments.HeroGalleryFragment

/**
 * Loads [HeroGalleryFragment] - Custom landing page with hero gallery carousel.
 */
class MainActivity : FragmentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        if (savedInstanceState == null) {
            supportFragmentManager.beginTransaction()
                .replace(R.id.main_browse_fragment, HeroGalleryFragment())
                .commitNow()
        }
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent): Boolean {
        val fragment = supportFragmentManager.findFragmentById(R.id.main_browse_fragment)
        if (fragment is HeroGalleryFragment) {
            if (fragment.onKeyDown(keyCode, event)) {
                return true
            }
        }
        return super.onKeyDown(keyCode, event)
    }
}