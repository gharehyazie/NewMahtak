function log(logData) {
    console.log(logData);
}
rf.StandaloneDashboard(function(db) {
    db.setDashboardTitle("APP Dashboard");
    var chart = new ChartComponent();
    chart.setCaption("App Usage and new Installs");
    chart.setDimensions(10, 6);
    chart.setYAxis('Number of Users');
    // chart.addYAxis('newInstalls', "newInstalls");

    chart.lock();
    db.addComponent(chart);


    var kpi = new KPIComponent();
    kpi.setDimensions(2, 2);
    kpi.setCaption("Total users");
    kpi.lock();
    db.addComponent(kpi);


    $.ajax({
        url: '/usageDate',
        type: 'POST',
        data: '',
        contentType: 'application/json; charset-utf-8',
        dataType: 'json',
        success: function(data) {
            log(data);
            if (data.dates.length < 31) {
                chart.setLabels(data.dates);
                chart.addSeries('usage', 'Usage', data.sequences, { seriesDisplayType: 'line' });
            } else {
                chart.setLabels(data.dates.slice(0, 30));
                chart.addSeries('usage', 'Usage', data.sequences.slice(0, 30), { seriesDisplayType: 'line' });
            }
        },
        error: function(xhr, status, error) {
            console.log(error);
        }
    });

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
                    seriesDisplayType: 'line',
                    yAxis: 'newInstalls'
                });
            } else {
                chart.addSeries('newInstalls', 'New Installs', data.newInstalls.slice(0, 30), {
                    seriesDisplayType: 'line'
                });
            }
            chart.unlock();
            a = 0;
            for (i = 0; i < data.newInstalls.length; i++) {
                a += data.newInstalls[i];
            }
            kpi.setValue(a);
            kpi.unlock();

        },
        error: function(xhr, status, error) {
            console.log(error);
        }
    });
});