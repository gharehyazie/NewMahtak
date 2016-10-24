package com.example.gharehyazie.dummytestapp;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;

public class MainActivity extends AppCompatActivity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        new ToSharedPreferences().generateUUID(this);
    }

    public void goAct2(View view) {
        Intent intent = new Intent(this, Main2Activity.class);
        startActivity(intent);
    }

    public void goAct3(View view) {
        Intent intent = new Intent(this, ScrollingActivity.class);
        startActivity(intent);
    }

    public void goAct4(View view) {
        Intent intent = new Intent(this, Main3Activity.class);
        startActivity(intent);
    }

    public void sendtest(View view) {

        StringBuilder deviceInfo = new StringBuilder();
        deviceInfo.append(Build.MODEL )
                .append(Build.VERSION.SDK_INT )
                .append(Build.VERSION.RELEASE )
                .append(Build.BRAND )
                .append(Build.MANUFACTURER)
                .append(Build.SERIAL)
                .append(Build.TIME);

        System.out.println(deviceInfo.toString());
        new PostJson().execute(deviceInfo.toString());

    }
}
