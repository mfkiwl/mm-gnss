
var map = L.map('map', {
    center: [18.359549715002537, 99.69806926182481],
    zoom: 13,
    zoomControl: false
});

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    lyr: 'basemap'
});
var CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
    lyr: 'basemap'
});

var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
    lyr: 'basemap'
});

const grod = L.tileLayer('https://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    lyr: 'basemap'
});
const ghyb = L.tileLayer('https://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    lyr: 'basemap'
});

var prov = L.tileLayer.wms("https://rti2dss.com:8443/geoserver/wms?", {
    layers: 'th:province_4326',
    format: 'image/png',
    transparent: true,
    attribution: "sakda"
});

let lyrs = L.layerGroup();


var baseMap = {
    "แผนที่ OSM": osm,
    "แผนที่ CartoDB": CartoDB_Positron,
    "แผนที่ถนน": grod,
    "แผนที่ภาพถ่าย": ghyb.addTo(map)
}

var overlayMap = {
    "ตำแหน่งสถานีตรวจวัด": lyrs.addTo(map),
    "ขอบเขตจังหหวัด": prov.addTo(map)
}

L.control.layers(baseMap, overlayMap).addTo(map)
L.control.zoom({ position: 'bottomright' }).addTo(map);

let iconGreen = L.icon({
    iconUrl: './marker/location-pin-green.svg',
    iconSize: [35, 35],
    iconAnchor: [12, 37],
    popupAnchor: [5, -30]
});

let iconYellow = L.icon({
    iconUrl: './marker/location-pin-yellow.svg',
    iconSize: [35, 35],
    iconAnchor: [12, 37],
    popupAnchor: [5, -30]
});

let iconRed = L.icon({
    iconUrl: './marker/location-pin-red.svg',
    iconSize: [35, 35],
    iconAnchor: [12, 37],
    popupAnchor: [5, -30]
});

let iconAlert = L.icon({
    iconUrl: './marker/location-pin-alert.gif',
    iconSize: [35, 35],
    iconAnchor: [12, 37],
    popupAnchor: [5, -30]
});

let iconGrey = L.icon({
    iconUrl: './marker/location-pin-grey.svg',
    iconSize: [35, 35],
    iconAnchor: [12, 37],
    popupAnchor: [5, -30]
});

let rmLyr = (mkname) => {
    map.eachLayer(lyr => {
        if (lyr.options.name == mkname) {
            map.removeLayer(lyr)
        }
    })
}

let changeColorMarker = (id, val) => {
    // console.log(val);
    let staLatlon;
    id == '01' ? staLatlon = [18.339672, 99.674849] : null;
    id == '02' ? staLatlon = [18.337106, 99.682434] : null;
    id == '03' ? staLatlon = [18.328093, 99.690406] : null;
    id == '04' ? staLatlon = [18.338522, 99.694236] : null;
    id == '05' ? staLatlon = [18.348869, 99.699504] : null;
    id == '06' ? staLatlon = [18.357983, 99.702851] : null;
    id == '07' ? staLatlon = [18.367473, 99.713365] : null;
    id == '08' ? staLatlon = [18.364072, 99.715371] : null;
    id == '09' ? staLatlon = [18.383051, 99.721390] : null;
    id == '10' ? staLatlon = [18.387062, 99.724952] : null;

    if (val == 1) {
        rmLyr(id)
        L.marker(staLatlon, { name: id, icon: iconYellow }).bindPopup('สถานี ' + id).addTo(lyrs);
        $("#wrnsta0" + id).attr("src", "./img/yellow.svg");
    } else if (val == 2) {
        rmLyr(id)
        L.marker(staLatlon, { name: id, icon: iconRed }).bindPopup('สถานี ' + id).addTo(lyrs);
        $("#wrnsta0" + id).attr("src", "./img/red.svg");
    } else if (val == 3) {
        rmLyr(id)
        L.marker(staLatlon, { name: id, icon: iconAlert }).bindPopup('สถานี ' + id).addTo(lyrs);
        $("#wrnsta0" + id).attr("src", "./img/yr.gif");
    } else if (val == 4) {
        rmLyr(id)
        L.marker(staLatlon, { name: id, icon: iconGrey }).bindPopup('สถานี ' + id).addTo(lyrs);
        $("#wrnsta0" + id).attr("src", "./img/grey.svg");
    } else {
        rmLyr(id)
        L.marker(staLatlon, { name: id, icon: iconGreen }).bindPopup('สถานี ' + id).addTo(lyrs);
        $("#wrnsta0" + id).attr("src", "./img/green.svg");
    }
}

var chart;

let showChart = async (stat_code, param, cat, dat) => {
    Highcharts.chart("sta0" + stat_code + param, {
        title: {
            text: '',
            style: {
                display: 'none'
            }
        },
        subtitle: {
            text: '',
            style: {
                display: 'none'
            }
        },
        yAxis: {
            title: {
                text: "&#9651;" + param + " (m.)"
            }
        },
        xAxis: {
            categories: cat
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        series: [{
            name: param,
            data: dat
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    });
}

let last = []
let loadData = async (stat_code) => {
    // console.log(stat_code);
    try {
        let resp = await axios.post("/api/last20position", { stat_code })
        let de = [];
        let dn = [];
        let dh = [];
        let cat = [];
        let status = 0;
        let d;
        let t;
        resp.data.data.map(i => {
            // console.log(i);
            d = i.d;
            t = i.t;
            status = i.status;
            $("#sta").text(`${i.stname}`);
            $("#date").text(`${i.d}`);
            $("#time").text(`${i.t}`);
            cat.push(i.t);
            de.push(Number(i.de));
            dn.push(Number(i.dn));
            dh.push(Number(i.dh));
        });

        if (last.toString() !== cat.toString()) {
            await showChart(stat_code, "de", cat, de);
            await showChart(stat_code, "dn", cat, dn);
            await showChart(stat_code, "dh", cat, dh);
        }
        // console.log(last, cat);
        last = cat;
        //console.log(stat_code)
        await axios.post("/api/lastposition", { stat_code }).then(r => {
            console.log(r.data.data.length);
            if (r.data.data.length > 0) {
                changeColorMarker(stat_code, r.data.data[0].status)
                $("#gid_sta" + stat_code).val(r.data.data[0].id)
            }

        })

    } catch (err) {
        console.error(err);
    }
}

let reset = (stat_code, value) => {
    let id = $("#gid_sta" + stat_code).val()
    axios.post("/api/reset", { stat_code, id }).then(r => {
        loadData(stat_code);
    })
    axios.get(`/api/status_reset/${stat_code}`).then(r => {
        // loadData(stat_code);
        console.log(r)
    })
}

loadData("01");
loadData("02");
loadData("03");
loadData("04");
loadData("05");
loadData("06");
loadData("07");
loadData("08");
loadData("09");
loadData("10");

setInterval(() => {
    loadData("01");
    loadData("02");
    loadData("03");
    loadData("04");
    loadData("05");
    loadData("06");
    loadData("07");
    loadData("08");
    loadData("09");
    loadData("10");
}, 5000)

let startPy = (station) => {
    axios.post('/api/startpython', { station }).then(r => {
        $("#status_sta" + station).html("starting...");
        $("#btn_sta" + station).prop("disabled", true);
        console.log(r)
    });
}

let stopPy = (station) => {
    axios.post('/api/stoppython', { station }).then(r => {
        $("#status_sta" + station).html("stoped");
        $("#btn_sta" + station).prop("disabled", false);
        console.log(r)
    });
}

$("#status_sta01").html("starting...");
$("#btn_sta01").prop("disabled", true);

$("#status_sta02").html("starting...");
$("#btn_sta02").prop("disabled", true);

$("#status_sta03").html("starting...");
$("#btn_sta03").prop("disabled", true);

$("#status_sta04").html("starting...");
$("#btn_sta04").prop("disabled", true);

$("#status_sta05").html("starting...");
$("#btn_sta05").prop("disabled", true);

$("#status_sta06").html("starting...");
$("#btn_sta06").prop("disabled", true);

$("#status_sta07").html("starting...");
$("#btn_sta07").prop("disabled", true);

$("#status_sta08").html("starting...");
$("#btn_sta08").prop("disabled", true);

$("#status_sta09").html("starting...");
$("#btn_sta09").prop("disabled", true);

$("#status_sta10").html("starting...");
$("#btn_sta10").prop("disabled", true);