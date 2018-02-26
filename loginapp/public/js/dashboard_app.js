// log given argument
function log(logData) {
    console.log(logData);
}
// new Dashboard
rf.StandaloneDashboard(function(db) {


    var pieChart = new ChartComponent();
    pieChart.setDimensions(4, 4);
    pieChart.setCaption("Device Types");
    pieChart.onItemClick(function(obj) {
        console.log(obj);
        alert("The value you clicked was ", obj.value);
        alert("The label you clicked was ", obj.label);

    });
    pieChart.lock();
    db.addComponent(pieChart);

    $.ajax({
        url: '/deviceType',
        type: 'POST',
        data: '',
        contentType: 'application/json; charset-utf-8',
        dataType: 'json',
        success: function(data) {
            log(data);
            pieChart.setLabels(data.types);
            pieChart.setPieValues(data.percent);
            pieChart.unlock();
        },
        error: function(xhr, status, error) {
            console.log(error);
        }
    });


    // var form = new FormComponent();
    // form.setDimensions(3, 4);
    // form.addDateRangeField("data_period", "Data Period");
    // form.onApplyClick(function(params) {
    //     log(form.getInputValue("data_period"));
    //     log(params);
    // });
    // db.addComponent(form);

    // Dashboard title
    db.setDashboardTitle("APP Dashboard");
    // create new Chart and locks it
    var chart = new ChartComponent();
    chart.setCaption("All Users vs new Installs");
    chart.setDimensions(9, 6);
    chart.setYAxis('Number of Users');
    chart.lock();
    db.addComponent(chart);

    // var form = new FormComponent();
    // form.setDimensions(9, 2);
    // form.addNumericRangeField("stock", "Units In Stock");
    // db.addComponent(form);


    // create new Kpi and locks it  
    var kpi = new KPIComponent();
    kpi.setDimensions(3, 2);
    kpi.setCaption("Total users");
    kpi.lock();
    db.addComponent(kpi);

    /**
     * post request to get dailyUsers
     * if success: add dates as chart's Labels and usersNumber as it's Series 
     * set data point limitation to 30
     */
    $.ajax({
        url: '/dailyUsers',
        type: 'POST',
        data: '',
        contentType: 'application/json; charset-utf-8',
        dataType: 'json',
        success: function(data) {
            log(data);
            if (data.dates.length < 31) {
                chart.setLabels(data.dates);
                chart.addSeries('totalUsers', 'Total Users', data.usersNumber, { seriesDisplayType: 'area' });
            } else {
                chart.setLabels(data.dates.slice(0, 30));
                chart.addSeries('totalUsers', 'Total Users', data.usersNumber.slice(0, 30), { seriesDisplayType: 'area' });
            }
        },
        error: function(xhr, status, error) {
            console.log(error);
        }
    });

    /**
     * post request to get installDate
     * if success: add newInstalls as chart's Series 
     * set data point limitation to 30
     */
    $.ajax({
        url: '/installDate',
        type: 'POST',
        data: '',
        contentType: 'application/json; charset-utf-8',
        dataType: 'json',
        success: function(data) {
            log(data);
            if (data.dates.length < 31) {
                chart.addSeries('newInstalls', 'New Installs', data.newInstalls, {
                    seriesDisplayType: 'area'
                });
            } else {
                chart.addSeries('newInstalls', 'New Installs', data.newInstalls.slice(0, 30), {
                    seriesDisplayType: 'area'
                });
            }
            // unlocks the chart
            chart.unlock();

            // set kpi value "total user" equal to the sum of new Installs
            a = 0;
            for (i = 0; i < data.newInstalls.length; i++) {
                a += data.newInstalls[i];
            }
            kpi.setValue(a);
            //unlocks kpi
            kpi.unlock();

        },
        error: function(xhr, status, error) {
            console.log(error);
        }
    });
    var chart2 = new ChartComponent();
    chart2.setCaption("Daily use of App");
    chart2.setDimensions(9, 6);
    chart2.setYAxis('launches Number');
    chart2.lock();
    db.addComponent(chart2);

    $.ajax({
        url: '/usageDate',
        type: 'POST',
        data: '',
        contentType: 'application/json; charset-utf-8',
        dataType: 'json',
        success: function(data) {
            log(data);
            if (data.dates.length < 31) {
                chart2.setLabels(data.dates);
                chart2.addSeries('times', 'Times', data.sequences, {
                    seriesDisplayType: 'area'
                });
            } else {
                chart2.setLabels(data.dates);
                chart2.addSeries('times', 'Times', data.sequences.slice(0, 30), {
                    seriesDisplayType: 'area'
                });
            }
            // unlocks the chart
            chart2.unlock();
        },
        error: function(xhr, status, error) {
            console.log(error);
        }
    });
});