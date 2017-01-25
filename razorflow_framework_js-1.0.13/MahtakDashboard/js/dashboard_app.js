
// $.get("http://198.143.180.135:8088/", function(data) {
//           console.log(data[0]);
        
//     });

$.ajax({
    url: "http://198.143.180.135:8088",
    type: 'POST',
    data: '',
    contentType: 'application/json; charset-utf-8',
    crossDomain: true,
    dataType: 'json',
    header : {'Access-Control-Allow-Origin': '*'},
    success: function (data) {
      console.log(data[0]);
      // alert("success");
      // $('#msg').html("Success");
    },
    error: function(xhr,status,error) {
      console.log(error);
      alert("fail");
      $('#msg').html("ERROR...! Please check the console (F12)");
    }
  });


// rf.StandaloneDashboard (function (db) {
//     db.setDashboardTitle ("MySQL Example");
//     var top_artists = new ChartComponent();
//     top_artists.setDimensions (6,6);
//     top_artists.setCaption ("Top 5 artists by revenue");
//     top_artists.lock();

//     $.get("http://localhost:8088/", function(data) {
//         var labels = [], sales_data = [];
//         for(var i = 0; i < data.length; i++) {
//           console.log(data[0]);
//             labels.push (data[i]["Name"]);
//             sales_data.push ((data[i]["total_sales"]));
//         }
//         top_artists.setLabels (labels);
//         top_artists.addSeries ("sales", "Total Sales", sales_data, {
//             numberPrefix: "$"
//         });
//         top_artists.unlock();
//     });
//     db.addComponent (top_artists);
// });