package com.example.gharehyazie.dummytestapp;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.util.Log;

import org.json.JSONObject;

import java.io.StringWriter;
import java.util.Map;
import java.util.UUID;

/**
 * Created by Mohsen on 10/24/2016.
 */

public class ToSharedPreferences {

    public static void generateUUID(Context context) {
        Log.e("context", context.getClass().getSimpleName());
        SharedPreferences sharedPrefs = context.getSharedPreferences("deviceID", Context.MODE_PRIVATE);
        SharedPreferences.Editor ed;
        if (!sharedPrefs.contains("UUID")) {
            ed = sharedPrefs.edit();
            String uniqueID = String.valueOf(UUID.randomUUID());
            ed.putString("UUID", uniqueID);
            ed.putString("Model", Build.MODEL);
            ed.putString("Brand", Build.BRAND);
            ed.putString("Manufacturer", Build.MANUFACTURER);
            ed.putString("SDK int", String.valueOf(Build.VERSION.SDK_INT));
            ed.commit();
        }
    }

    public void putStringInPreferences(Context context, String key, String value, String FileKey) {
        generateUUID(context);

        SharedPreferences sharedPreferences = context.getSharedPreferences(FileKey, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(key, value);
        editor.commit();


    }

    public String getStringFromPreferences(Context context, String defaultValue, String key, String pKey) {
        SharedPreferences sharedPreferences = context.getSharedPreferences(pKey, Context.MODE_PRIVATE);
        String temp = sharedPreferences.getString(key, defaultValue);
        return temp;
    }


    public  Map<String, ?> getAll(Context context, String pKey) {
        SharedPreferences sharedPreferences = context.getSharedPreferences(pKey, Context.MODE_PRIVATE);
        return sharedPreferences.getAll();
    }
}
