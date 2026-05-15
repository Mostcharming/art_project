package com.carsltv

import android.app.Application
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.packagerconnection.PackagerConnectionSettings

class MainApplication : Application(), ReactApplication {

  // Fallback configuration when autolinking is disabled
  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList = emptyList(), // No packages - autolinking disabled
    )
  }

  override fun onCreate() {
    super.onCreate()
    // Initialize React Native
  }
}
