var AlertSettings;
$(document).ready(function () {
    AlertSettings = JSON.parse($("#hdnAlertSettings").val());

    $(".pile-toggle").click(function () {
        var pileId = parseInt(this.id.replace("Pile", ""));
        $(".pile-details:not(#PileDetails" + pileId + ")").hide();
        $("#PileDetails" + pileId).toggle();
    });

    $("html").click(function (e) {
        //click anywhere except element pile-details and pile-toggle
        if ($(e.target).parents(".pile-details").length == 0 && !$(e.target).hasClass("pile-toggle")) {
            $(".pile-details").hide();
        }
    });

});

function ChangeBridgeDesign(designId) {
    $(".bridge").css("background-image", "url('/images/bridge-" + designId + ".jpg')");
}

var socket = io();
var pileStatus;
socket.on('pile-updates', function (msg) {
    var pilesArray = JSON.parse(msg);
    for (var i = 1; i <= 4; i++) {
        var values = pilesArray[i - 1];
        pileStatus = 'success';
        UpdateSensorValue('pressure', values.pressure, i);
        UpdateSensorValue('wind', values.wind, i);
        UpdateSensorValue('temperature', values.temperature, i);
        UpdateSensorValue('humidity', values.humidity, i);
        UpdateSensorValue('rain', values.rain, i);

        UpdatePileStatus(i);
    }
});

function UpdateSensorValue(sensorName, sensorValue, pileId) {
    var pile = $('#PileDetails' + pileId);
    var tr = pile.find('tr.' + sensorName);
    tr.removeClass('text-success text-warning text-danger');

    sensorValue = parseFloat(sensorValue);
    if (sensorValue >= parseFloat(AlertSettings[sensorName].danger)) {
        tr.addClass('text-danger');
        pileStatus = 'danger'
    } else if (sensorValue >= parseFloat(AlertSettings[sensorName].warning)) {
        tr.addClass('text-warning');
        if (pileStatus != 'danger') pileStatus = 'warning';
    } else {
        tr.addClass('text-success');
    }
    pile.find('tr.' + sensorName + ' .sensorval').text(sensorValue);
}

function UpdatePileStatus(pileId) {
    var pile = $('#Pile' + pileId);
    pile.removeClass('badge-success badge-warning badge-danger');
    pile.addClass('badge-' + pileStatus);
}
