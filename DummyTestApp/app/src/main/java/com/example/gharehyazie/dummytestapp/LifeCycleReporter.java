package com.example.gharehyazie.dummytestapp;

/**
 * Created by Mohsen on 10/25/2016.
 * <p>
 * This class is for logging activities life cycle and seconds each activity is used
 * and if devise is online send data to server and if not save data to shared preferences
 * to send next time the device is online.
 * also at first time app is installed it creates a unique UUID for each device and
 * save it to the shared preferences.
 * <p>
 */


import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.os.Bundle;

import org.json.JSONObject;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;


/**
 * The type Life cycle reporter.
 */
public class LifeCycleReporter implements Application.ActivityLifecycleCallbacks {

    ToSharedPreferences SHP;
    /**
     * The Time map.
     */
    Map<String, Long> timeMap = new LinkedHashMap<>();

    /**
     * name of the app main calls for using in onDestroyed method
     */
    Context mainActivity = null;

    @Override
    public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
    }

    /**
     * @param activity = context that contains the info of the onStarted activity.
     *                 mainActivity sets app main activity name.
     */
    @Override
    public void onActivityStarted(Activity activity) {
        SHP = new ToSharedPreferences();

        /**
         * If condition works when app installed and opend for the first time
         */
        if (mainActivity == null) {
            mainActivity = activity;
            if (SHP.getStringFromPreferences(mainActivity, "0", mainActivity.getClass().getSimpleName(), "temp") != "0") {
                SHP.putStringInPreferences(mainActivity, "Terminated", "true", "temp");
                sendOrSave();
            }
            new ToSharedPreferences().generateUUID(activity);
            /**
             * sets the current date
             */
            SHP.putStringInPreferences(mainActivity, "date", String.valueOf(new Date((Long) System.currentTimeMillis())), "temp");
        }
        /**
         * sets the onStart time
         */
        timeMap.put(activity.getClass().getSimpleName(), System.currentTimeMillis());
    }

    @Override
    public void onActivityResumed(Activity activity) {
//        Log.e(activity.getClass().getSimpleName(), "onResume()");
    }

    /**
     * @param activity = context that contains the info of the onStarted activity.
     *                 difference calculates the time in seconds form on start to on pause of activity and add the value to the
     */
    @Override
    public void onActivityPaused(Activity activity) {
        Long difference = (System.currentTimeMillis() - timeMap.get(activity.getClass().getSimpleName())) / 1000;

        String differenceString = String.valueOf(Long.valueOf(SHP.getStringFromPreferences(mainActivity, "0", activity.getClass().getSimpleName(), "temp")) + difference);
        SHP.putStringInPreferences(mainActivity, activity.getClass().getSimpleName(), differenceString, "temp");
    }

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle outState) {
//        Log.e(activity.getClass().getSimpleName(), "onSaveInstanceState(Bundle)");
    }

    @Override
    public void onActivityStopped(Activity activity) {
//        Log.e(activity.getClass().getSimpleName(), "onStop()");
    }

    @Override
    public void onActivityDestroyed(Activity activity) {
        /**
         * condition checks if the app main activity is closed meaning the app is closed
         */

        if (mainActivity.equals(activity)) {
            sendOrSave();

            /**
             * unregisters the ActivityLifecycleCallbacks for preventing duplicate data on the next start of app
             */
            activity.getApplication().unregisterActivityLifecycleCallbacks(this);
        }
    }

    public void sendOrSave() {
        /**
         * save both deviceID from shared preferences and temp to result JSONObject
         */
        Map lifeCycleID = new LinkedHashMap<>();
        lifeCycleID.putAll(SHP.getAll(mainActivity, "deviceID"));
        lifeCycleID.putAll(SHP.getAll(mainActivity, "temp"));
        SHP.removeAll(mainActivity, "temp");

        JSONObject result = new JSONObject(lifeCycleID);

        /**
         * when device is online  checks if there is any on sent data and send them + current data
         * and if device is offline saves the data to shared preferences for next time bye file key "data"
         */
        if (new PostJson().isOnline(mainActivity)) {

            Map<String, ?> keys = SHP.getAll(mainActivity, "data");
            for (Map.Entry<String, ?> entry : keys.entrySet()) {
                if (SHP.getStringFromPreferences(mainActivity, null, entry.getKey(), "data") != null) {
                    new PostJson().execute(SHP.getStringFromPreferences(mainActivity, null, entry.getKey(), "data"));
                    SHP.putStringInPreferences(mainActivity, entry.getKey(), null, "data");
                }
            }

            new PostJson().execute(result.toString());

        } else {
            int i = SHP.getAll(mainActivity, "data").size() + 1;
            String s = String.valueOf(i);
            SHP.putStringInPreferences(mainActivity, s, result.toString(), "data");
        }
    }

}
