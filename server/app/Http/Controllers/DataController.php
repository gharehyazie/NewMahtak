<?php

namespace App\Http\Controllers;

use App\Data;
use Illuminate\Http\Request;

use App\Http\Requests;

class DataController extends Controller
{
    public function store(Request $request)
    {
//        store json form post request and save it to DB table 
        $content = $request->getContent();
        $content = json_decode($content, true);
        $data = new Data();
        $data->startdate = $content['startdate'];
        $data->enddate = $content['enddate'];
        $data->timestamps=strtotime(date("Y/m/d h:i:sa"));
        $data->save();
        var_dump("ok");

    }
}
