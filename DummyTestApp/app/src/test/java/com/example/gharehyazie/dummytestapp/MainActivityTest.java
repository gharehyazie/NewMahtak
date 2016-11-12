package com.example.gharehyazie.dummytestapp;

import android.annotation.TargetApi;
import android.app.Activity;
import android.os.Build;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.Robolectric;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import static org.junit.Assert.*;

/**
 * Created by Mohsen on 11/1/2016.
 */

@RunWith(RobolectricTestRunner.class)
@Config(constants = BuildConfig.class, sdk = 21, manifest = "src/main/AndroidManifest.xml", packageName = "com.example.gharehyazie.dummytestapp")
public class MainActivityTest {



    @Test
    public void test (){
        MainActivity activity = Robolectric.setupActivity(MainActivity.class);
        LifeCycleReporter reporter = new LifeCycleReporter();
        activity.getApplication().registerActivityLifecycleCallbacks(reporter);
        assertEquals(1,1);
    }

}