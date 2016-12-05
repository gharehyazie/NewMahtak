package com.example.gharehyazie.dummytestapp;

/**
 * Created by Mohsen on 10/18/2016.
 * PostJson class sends post request that contains the app usage log as json to server data base
 */

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.AsyncTask;
import android.util.Log;

import java.io.DataOutputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;

public class PostJson extends AsyncTask<String, String, String> {

    /**
     * Is online boolean.
     *
     * @param context the context of the class that the method is called
     * @return the boolean : true if device is online and false if devise is online
     */
    public boolean isOnline(Context context) {

        ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo netInfo = cm.getActiveNetworkInfo();
        return (netInfo != null && netInfo.isConnected());
    }

    /**
     * Send the collected data to te server using POST method by AsyncTask
     * in background Thread.
     *
     * @param string the that will be sent to server
     */
    public String postData(String string) {
        /**
         * using android httpURLConnection sends a post request with json body to the URL
         */
        String respond = null;
        try {
            URL url = new URL("http://46.101.146.4/");
            HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
            httpURLConnection.setDoOutput(true);
            httpURLConnection.setRequestMethod("POST"); // set Post request
            httpURLConnection.setRequestProperty("Content-Type", "application/json"); // data type = json
            httpURLConnection.connect();


            DataOutputStream wr = new DataOutputStream(httpURLConnection.getOutputStream());
            wr.writeBytes(string);
            wr.flush();
            wr.close();

            /**
             *print the post request responde to Log.e
             */
            respond = String.valueOf(httpURLConnection.getResponseCode());
            Log.e("postRespond", respond);

        } catch (ProtocolException e) {
            e.printStackTrace();
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return respond;
    }

    @Override
    protected String doInBackground(String... params) {
        String respond = postData(params[0]);
        return respond;
    }


}

