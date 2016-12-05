package com.example.gharehyazie.dummytestapp;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.Robolectric;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.Shadows;
import org.robolectric.annotation.Config;
import org.robolectric.shadows.ShadowConnectivityManager;
import org.robolectric.shadows.ShadowNetworkInfo;
import org.robolectric.util.ActivityController;

import static org.junit.Assert.assertNotNull;

/**
 * Created by MahTak on 11/9/2016.
 */
@RunWith(RobolectricTestRunner.class)
@Config(constants = BuildConfig.class, sdk = 21, manifest = "src/main/AndroidManifest.xml", packageName = "com.example.gharehyazie.dummytestapp")
public class LifeCycleReporterTest {
    MainActivity activity;
    ToSharedPreferences shp;
    ActivityController<MainActivity> controller;

    private ConnectivityManager connectivityManager;
    private ShadowConnectivityManager shadowConnectivityManager;
    private ShadowNetworkInfo shadowOfActiveNetworkInfo;

    @Before
    public void setUp() throws Exception {
        connectivityManager = (ConnectivityManager) activity.getSystemService(Context.CONNECTIVITY_SERVICE);
        shadowConnectivityManager = Shadows.shadowOf(connectivityManager);
        shadowOfActiveNetworkInfo = Shadows.shadowOf(connectivityManager.getActiveNetworkInfo());

        controller = Robolectric.buildActivity(MainActivity.class).create().start();
        shp = new ToSharedPreferences();
        activity = controller.get();

    }

    @Test
    public void onCreate() throws Exception {
        assertNotNull("not Null", shp.getStringFromPreferences(activity, null, "UUID", "deviceID"));
        System.out.println("UUID: " + shp.getStringFromPreferences(activity, null, "UUID", "deviceID"));
    }

    @Test
    public void onPause() throws Exception {
        controller.pause();
        activity = controller.get();


        assertNotNull("not Null", shp.getAll(activity, "temp"));
        System.out.println("temp: " + String.valueOf(shp.getAll(activity, "temp")));

    }

    @Test
    public void onDestroy() throws Exception {

        NetworkInfo networkInfo = ShadowNetworkInfo.newInstance(NetworkInfo.DetailedState.CONNECTED, ConnectivityManager.TYPE_WIFI, 0, false, false);
        shadowConnectivityManager.setActiveNetworkInfo(networkInfo);

        controller.pause();
        System.out.println("data: " + String.valueOf(shp.getAll(activity, "data")));
        controller.destroy();
        activity = controller.get();
        System.out.println("data: " + String.valueOf(shp.getAll(activity, "data")));


    }
}