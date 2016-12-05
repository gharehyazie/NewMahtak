package com.example.gharehyazie.dummytestapp;


import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;

import java.util.Map;
import java.util.UUID;

/**
 * Saves data to shared preferences privately that only this app can access.
 */

public class ToSharedPreferences {

    /**
     * Generates UUID an id that is unique for each installation and saves
     * the Model ,Brand ,Manufacturer and SDK int in first time app opens after
     * installation.
     *
     * @param context the context of called class
     */
    public static void generateUUID(Context context) {

        /**
         * saves UUID ,Model ,Brand ,Manufacturer and SDK int to the sharedPreferences by file key "deviceID" privately.
         */
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

    /**
     * Puts given string in shared preferences.
     *
     * @param context the context of called class
     * @param key     String to be saved
     * @param value   String of key param to be saved
     * @param fileKey the file key to save
     */
    public void putStringInPreferences(Context context, String key, String value, String fileKey) {
        generateUUID(context);

        SharedPreferences sharedPreferences = context.getSharedPreferences(fileKey, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(key, value);
        editor.commit();

    }

    /**
     * Gets string from shared preferences.
     *
     * @param context      the context
     * @param defaultValue if the key doesn't exists
     * @param key          the key to read
     * @param fileKey      the key of file to read
     * @return string value of called key from preferences
     */
    public String getStringFromPreferences(Context context, String defaultValue, String key, String fileKey) {
        SharedPreferences sharedPreferences = context.getSharedPreferences(fileKey, Context.MODE_PRIVATE);
        String temp = sharedPreferences.getString(key, defaultValue);
        return temp;
    }


    /**
     * Gets all keys and values of given file key.
     *
     * @param context the context
     * @param fileKey the key of file to read
     * @return the all keys and values of them as a Map from given fileKey
     */
    public Map<String, ?> getAll(Context context, String fileKey) {
        SharedPreferences sharedPreferences = context.getSharedPreferences(fileKey, Context.MODE_PRIVATE);
        return sharedPreferences.getAll();

    }

    /**
     * Removes all data in the given fileKey
     *
     * @param context the context
     * @param fileKey the key of file to remove
     */
    public void removeAll(Context context, String fileKey) {
        SharedPreferences sharedPreferences = context.getSharedPreferences(fileKey, Context.MODE_PRIVATE);
        sharedPreferences.edit().clear().commit();

    }
    /**
     * Puts given string from custom action in shared preferences.
     *
     * @param key     String to be saved
     * @param value   String of key param to be saved
     */
    public void addCustomRecord(Context context,String key, String value) {
        SharedPreferences sharedPreferences = context.getSharedPreferences("temp", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(key, value);
        editor.commit();

    }
}
