package com.example.carsltv.features.signup.activities

import android.os.Bundle
import android.view.KeyEvent
import androidx.fragment.app.FragmentActivity
import com.example.carsltv.R
import com.example.carsltv.features.signup.fragments.SignUpFragment

class SignUpActivity : FragmentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_signup)
        if (savedInstanceState == null) {
            supportFragmentManager.beginTransaction()
                .replace(R.id.signup_fragment, SignUpFragment.newInstance())
                .commitNow()
        }
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent): Boolean {
        val fragment = supportFragmentManager.findFragmentById(R.id.signup_fragment)
        if (fragment is SignUpFragment) {
            if (fragment.onKeyDown(keyCode, event)) {
                return true
            }
        }
        return super.onKeyDown(keyCode, event)
    }
}
