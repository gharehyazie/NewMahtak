package com.example.gharehyazie.dummytestapp;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import static org.junit.Assert.*;

/**
 * Created by MahTak on 11/2/2016.
 */

@RunWith(RobolectricTestRunner.class)
//@Config(constants = BuildConfig.class, sdk = 21, manifest = "src/main/AndroidManifest.xml", packageName = "com.example.gharehyazie.dummytestapp")

public class PostJsonTest {

    @Test
    public void send() throws Exception {
        //Arrange
        String t1 = "anything you want to send";

        //Act
        String respond =new PostJson().postData(t1);

        //Assert
        assertEquals(respond,200);
    }

}