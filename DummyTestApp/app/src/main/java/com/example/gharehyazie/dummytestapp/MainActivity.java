package com.example.gharehyazie.dummytestapp;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;

public class MainActivity extends AppCompatActivity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        LifeCycleReporter reporter = new LifeCycleReporter();
        getApplication().registerActivityLifecycleCallbacks(reporter);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
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

}