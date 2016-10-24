package com.example.gharehyazie.dummytestapp;

import android.os.AsyncTask;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.DataOutputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;

/**
 * Created by Mohsen on 10/18/2016.
 */

public class PostJson extends AsyncTask<String, String, String> {



    public void postData(String first) {
        try {
            URL url = new URL("http://46.101.146.4/");
            HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
            httpURLConnection.setDoOutput(true);
            httpURLConnection.setRequestMethod("POST"); // set Post request
            httpURLConnection.setRequestProperty("Content-Type", "application/json"); // data type = json
            httpURLConnection.connect();

            JSONObject jsonObject = new JSONObject();
            // add String to server Table tags
            jsonObject.put("startdate", first);
            jsonObject.put("enddate", "");

            DataOutputStream wr = new DataOutputStream(httpURLConnection.getOutputStream());
            wr.writeBytes(jsonObject.toString());
            wr.flush();
            wr.close();

            String respond = String.valueOf(httpURLConnection.getResponseCode());
            System.out.println(respond);

        } catch (ProtocolException e) {
            e.printStackTrace();
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }

    }

    @Override
    protected String doInBackground(String... params) {
            postData(params[0]);


        return null;
    }


}

