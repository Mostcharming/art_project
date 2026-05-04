package com.carsltv

import android.view.KeyEvent
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "carslTV"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  /**
   * Handle TV remote key events
   */
  override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
    return when (keyCode) {
      KeyEvent.KEYCODE_DPAD_UP,
      KeyEvent.KEYCODE_DPAD_DOWN,
      KeyEvent.KEYCODE_DPAD_LEFT,
      KeyEvent.KEYCODE_DPAD_RIGHT,
      KeyEvent.KEYCODE_DPAD_CENTER,
      KeyEvent.KEYCODE_BACK,
      KeyEvent.KEYCODE_MENU,
      KeyEvent.KEYCODE_POWER,
      KeyEvent.KEYCODE_ENTER -> {
        sendRemoteKeyEvent(keyCode, "DOWN")
        true
      }
      else -> super.onKeyDown(keyCode, event)
    }
  }

  /**
   * Handle key up events
   */
  override fun onKeyUp(keyCode: Int, event: KeyEvent?): Boolean {
    return when (keyCode) {
      KeyEvent.KEYCODE_DPAD_UP,
      KeyEvent.KEYCODE_DPAD_DOWN,
      KeyEvent.KEYCODE_DPAD_LEFT,
      KeyEvent.KEYCODE_DPAD_RIGHT,
      KeyEvent.KEYCODE_DPAD_CENTER,
      KeyEvent.KEYCODE_BACK,
      KeyEvent.KEYCODE_MENU,
      KeyEvent.KEYCODE_POWER,
      KeyEvent.KEYCODE_ENTER -> {
        sendRemoteKeyEvent(keyCode, "UP")
        true
      }
      else -> super.onKeyUp(keyCode, event)
    }
  }

  private fun sendRemoteKeyEvent(keyCode: Int, action: String) {
    val reactContext = reactNativeHost.reactInstanceManager.currentReactContext
    reactContext?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)?.emit(
      "onRemoteKey",
      Arguments.createMap().apply {
        putInt("keyCode", keyCode)
        putString("keyName", getKeyName(keyCode))
        putString("action", action)
      }
    )
  }

  private fun getKeyName(keyCode: Int): String {
    return when (keyCode) {
      KeyEvent.KEYCODE_DPAD_UP -> "UP"
      KeyEvent.KEYCODE_DPAD_DOWN -> "DOWN"
      KeyEvent.KEYCODE_DPAD_LEFT -> "LEFT"
      KeyEvent.KEYCODE_DPAD_RIGHT -> "RIGHT"
      KeyEvent.KEYCODE_DPAD_CENTER -> "OK/ENTER"
      KeyEvent.KEYCODE_BACK -> "BACK"
      KeyEvent.KEYCODE_MENU -> "MENU"
      KeyEvent.KEYCODE_POWER -> "POWER"
      KeyEvent.KEYCODE_ENTER -> "ENTER"
      else -> "Key $keyCode"
    }
  }
}
