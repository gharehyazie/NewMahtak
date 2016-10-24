package com.example.gharehyazie.dummytestapp;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.util.Log;

import java.util.UUID;

/**
 * Created by Mohsen on 10/24/2016.
 */

public class ToSharedPreferences {

    public static void generateUUID(Context context) {
        Log.e("context",context.getApplicationInfo().toString());
        SharedPreferences sharedPrefs = context.getSharedPreferences("deviceID", Context.MODE_PRIVATE);
        SharedPreferences.Editor ed;
        if(!sharedPrefs.contains("initialized")){
            ed = sharedPrefs.edit();

            //Indicate that the default shared prefs have been set
            ed.putBoolean("initialized", true);
            String uniqueID = String.valueOf(UUID.randomUUID());
            ed.putString("UUID", uniqueID);
            ed.commit();
        }

        Log.e("UUID sharedP",sharedPrefs.getString("UUID","doesn't exist"));
        putStringInPreferences(context, "Model",Build.MODEL,"deviceID");
        Log.e("Model sharedP",sharedPrefs.getString("Model","doesn't exist"));
    }



    public static void putStringInPreferences(Context context,  String key,String value, String FileKey) {
        SharedPreferences sharedPreferences = context.getSharedPreferences(FileKey, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(key, value);
        editor.commit();
    }

    public static String getStringFromPreferences(Context context, String defaultValue, String key, String pKey) {
        SharedPreferences sharedPreferences = context.getSharedPreferences(pKey, Context.MODE_PRIVATE);
        String temp = sharedPreferences.getString(key, defaultValue);
        return temp;
    }


}
