package com.example.gharehyazie.dummytestapp;

import android.app.Application;

import org.apache.tools.ant.types.Environment;
import org.codehaus.plexus.context.Context;
import org.codehaus.plexus.context.ContextException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.RuntimeEnvironment;
import org.robolectric.annotation.Config;
import org.robolectric.shadows.ShadowActivity;

import java.util.Map;

import static org.junit.Assert.*;

/**
 * Created by MahTak on 11/2/2016.
 */
@RunWith(RobolectricTestRunner.class)
@Config(constants = BuildConfig.class, sdk = 21, manifest = "src/main/AndroidManifest.xml", packageName = "com.example.gharehyazie.dummytestapp")
public class ToSharedPreferencesTest {

    ToSharedPreferences shp;
    Application context;

    @Before
    public void setUp() throws Exception {
        shp = new ToSharedPreferences();
        context = RuntimeEnvironment.application;
        shp.generateUUID(context);
    }

    @Test
    public void generateUUID() throws Exception {
        //Arrange

        //Act


        //Assert
        assertNotNull("not UUID", shp.getStringFromPreferences(context, null, "UUID", "deviceID"));
    }


    @Test
    public void putGet() throws Exception {
        //Arrange
        String key = "key";
        String test = "1234 abc";
        String fileKey = "file";
        //Act
        shp.putStringInPreferences(context, key, test, fileKey);

        //Assert
        assertEquals("not Equal", test, shp.getStringFromPreferences(context, null, key, fileKey));
    }

    @Test
    public void getAll() {
        //Arrange
        String key = "key";
        String test = "1234 abc";
        String fileKey = "file";
        shp.putStringInPreferences(context, key, test, fileKey);

        //Act
        Map<String, ?> a = shp.getAll(context, fileKey);

        //Assert
        assertEquals("not the same", "{key=1234 abc}",a.toString());
    }

    @Test
    public void removeAll() {
        //Arrange
        String key1 = "key1";
        String key2 = "key2";
        String value1 = "value1";
        String value2 = "value2";
        String fileKey = "file";
        shp.putStringInPreferences(context, key1, value1, fileKey);
        shp.putStringInPreferences(context, key2, value2, fileKey);

        //Act
        shp.removeAll(context,fileKey);

        //Assert
        assertEquals("not null","{}",shp.getAll(context,fileKey).toString());
    }


}