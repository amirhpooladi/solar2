////map///
var map, vectorLayer, selectMarkerControl, selectedFeature;
var lat = 34.08083;
var lon = 49.62382;
var zoom = 5;
var curpos = new Array();
var position;

var fromProjection = new OpenLayers.Projection("EPSG:4326"); // Transform from WGS 1984
var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection

var cntrposition = new OpenLayers.LonLat(lon, lat).transform(
  fromProjection,
  toProjection
);

function init() {
  map = new OpenLayers.Map("Map", {
    controls: [
      new OpenLayers.Control.PanZoomBar(),
      new OpenLayers.Control.LayerSwitcher({}),
      new OpenLayers.Control.Permalink(),
      new OpenLayers.Control.MousePosition({}),
      new OpenLayers.Control.ScaleLine(),
      new OpenLayers.Control.OverviewMap(),
    ],
  });
  var mapnik = new OpenLayers.Layer.OSM("MAP");
  var markers = new OpenLayers.Layer.Markers("Markers");

  map.addLayers([mapnik, markers]);
  map.addLayer(mapnik);
  map.setCenter(cntrposition, zoom);

  markers.addMarker(new OpenLayers.Marker(cntrposition));

  var click = new OpenLayers.Control.Click();
  map.addControl(click);

  click.activate();
}

OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
  defaultHandlerOptions: {
    single: true,
    double: false,
    pixelTolerance: 0,
    stopSingle: false,
    stopDouble: false,
  },

  initialize: function (options) {
    this.handlerOptions = OpenLayers.Util.extend(
      {},
      this.defaultHandlerOptions
    );
    OpenLayers.Control.prototype.initialize.apply(this, arguments);
    this.handler = new OpenLayers.Handler.Click(
      this,
      {
        click: this.trigger,
      },
      this.handlerOptions
    );
  },

  trigger: function (e) {
    var lonlat = map.getLonLatFromPixel(e.xy);
    lonlat1 = new OpenLayers.LonLat(lonlat.lon, lonlat.lat).transform(
      toProjection,
      fromProjection
    );
    console.log(lonlat1.lon, lonlat1.lat);
    // alert("Hello..." + lonlat1.lon + "  " + lonlat1.lat);
    document.getElementById("lat").value = lonlat1.lat.toFixed(5);
    document.getElementById("lon").value = lonlat1.lon.toFixed(5);
  },
});

///get lat and lon and fetch data
async function getData(lat, lon) {
  try {
    //api for timezone and region
    var timeZone = await fetch(
      `https://vip.timezonedb.com/v2/get-time-zone?key=OX7AD7FQO41D&by=position&format=json&lat=${lat}&lng=${lon}`
    );
    var jsonData = await timeZone.json();
    var countryName = 0;
    countryName = jsonData.countryName;
    var cityName = jsonData.cityName;
    var time = jsonData.formatted;

    //api for electric data

    var elctricData = await fetch(
      `https://api.globalsolaratlas.info/data/lta?loc=${lat},${lon}`
    );

    var jsonDataElectric = await elctricData.json();
    var PVOUT = 0;
    PVOUT = jsonDataElectric.annual.data.PVOUT_csi;
    var DNI = jsonDataElectric.annual.data.DNI;
    var GHI = jsonDataElectric.annual.data.GHI;
    var DIF = jsonDataElectric.annual.data.DIF;
    var GTI = jsonDataElectric.annual.data.GTI_opta;
    var OPTA = jsonDataElectric.annual.data.OPTA;
    var TEMP = jsonDataElectric.annual.data.TEMP;
    var ELE = jsonDataElectric.annual.data.ELE;
    console.log(PVOUT, countryName);

    if (document.querySelector(".cards")) {
      document
        .querySelector(".cards")
        .parentNode.removeChild(document.querySelector(".cards"));
      document
        .querySelector("#cardDisplay")
        .parentNode.removeChild(document.querySelector("#cardDisplay"));
    }
    
    var todayElicPrice = parseFloat(document.getElementById("elecPrice").value);
    var today1PanelCost = parseFloat(document.getElementById("panelp").value);
    var todayInverterCost = parseFloat(
      document.getElementById("inverterp").value
    );
    var todaybatteryCost = parseFloat(
      document.getElementById("batteryPrice").value
    );
    var numberOfBattery = parseFloat(
      document.getElementById("batteryCount").value
    );
    

    if (document.getElementById("howTocalcSelect").value == 1) {
      var kiloowat = 0;
      var kiloowat = parseFloat(document.getElementById("meterOrKw").value);
      var meter = kiloowat * 10;
    } else {
      var meter = 0;
      var meter = parseFloat(document.getElementById("meterOrKw").value);
      kiloowat = meter / 10;
    }
    var numberOfPanel=kiloowat*2;

    var allCosts =
      numberOfPanel * today1PanelCost +
      todayInverterCost +
      todaybatteryCost * numberOfBattery;
    
    allCosts = parseFloat(allCosts);
    var allCostsWithStructure = allCosts + (allCosts * 10) / 100;
    allCostsWithStructure = parseFloat(allCostsWithStructure);

    var typeOfThePanel;
    var panelPicture;

    if (kiloowat <= 5) {
      typeOfThePanel = "مسکونی کوچک";
      panelPicture = "pv1_1.png";
    } else if (kiloowat > 5 && kiloowat <= 100) {
      typeOfThePanel = "تجاری سایز متوسط";
      panelPicture = "pv1_1.png";
    } else if (kiloowat > 100) {
      typeOfThePanel = "مقیاس بزرگ";
      panelPicture = "pv3_1.png";
    } else {
      typeOfThePanel = " پنل خورشیدی";
      panelPicture = "pv3_1.png";
    }

    

    var spaceNeed = meter;

    var mounthMoney = Math.floor(
      (jsonDataElectric.annual.data.PVOUT_csi.toFixed(1) / 360) *
        kiloowat *
        30 *
        todayElicPrice
    );
    var yearMoney = mounthMoney * 12;
    var priceBack = Math.floor(allCostsWithStructure / yearMoney);
   

    var addCard = `
    
<div  class="cards">

    <div id="card1" class="card" style="width: 15rem;">
    <ul id="z" class="list-group list-group-flush">
        <li id="country" class="list-group-item">کشور<pre> ${countryName}</pre></li>
        <li id="location" class="list-group-item">مکان دقیق<pre> ${cityName}</pre></li>
        <li id="exactDate" class="list-group-item">تاریخ<pre> ${time}</pre></li>
        </ul>
        </div>
        </div>`;
    document.getElementById("btn1").insertAdjacentHTML("afterend", addCard);

    var report = `
 

<div id="cardDisplay">

<div id="cardBG1" class="card" style="width: 18rem;">
    <img src="./assets/${panelPicture}" class="card-img-top" alt="pv1">
    <div class="card-body">
        <h5 class="card-title" style="padding-bottom: 30px;">${typeOfThePanel}</h5>
        
        <hr>
        <pre>نوع پنل:${typeOfThePanel} </pre>
        <hr>
        <pre>ظرفیت:(${kiloowat}kwp)</pre>
        <hr>
        <pre> تعداد پنل 500 وات:(${numberOfPanel})</pre>
        <hr>
        <pre>درجه بهینه پنل ها:(${OPTA}°)</pre>
        <hr>
        <pre>فضای مورد نیاز:(${spaceNeed}متر مربع)</pre>
        <hr>
        <pre>قیمت فروش هر کیلووات برق:(${todayElicPrice}تومان)</pre>
        <hr>
        <pre>درامد ماهانه:(${mounthMoney}تومان)</pre>
        <hr>
        <pre>درامد سالانه:(${yearMoney}تومان)</pre>
        <hr>
        <pre>بازگشت سرمایه:(${priceBack}سال)</pre>
        
    </div>
    </div>
</div>
`;

    document.querySelector(".cards").insertAdjacentHTML("afterend", report);
    document.getElementById("btn1").disabled = false;
    document.getElementById("btn1").innerHTML = `محاسبه `;

    //if something went wrong
  } catch {
    if (document.querySelector(".cards")) {
      document
        .querySelector(".cards")
        .parentNode.removeChild(document.querySelector(".cards"));
      document
        .querySelector("#cardDisplay")
        .parentNode.removeChild(document.querySelector("#cardDisplay"));
    }
    document.getElementById("error").textContent =
      "خطایی رخ داده دوباره امتحان کنید";
    document.getElementById("btn1").disabled = false;
    document.getElementById("btn1").innerHTML = `محاسبه `;
  }
  console.log(`درامد سالانه:${yearMoney}`);
  console.log(`خرج:${allCostsWithStructure}`);
}

//start program by click on button

function click() {
  document.querySelector("#btn1").addEventListener("click", () => {
    if (
      document.getElementById("meterOrKw").value === "" ||
      document.getElementById("panelp").value === "" ||
      document.getElementById("inverterp").value === "" ||
      document.getElementById("elecPrice").value === ""
    ) {
      document.getElementById("error").textContent =
        "همه ی پارامتر ها را وارد کنید";
    } else {
      document.getElementById(
        "btn1"
      ).innerHTML = ` <div class="spinner-border text-light"></div>`;
      document.getElementById("btn1").disabled = true;

      var lat = document.getElementById("lat").value;
      var lon = document.getElementById("lon").value;
      getData(lat, lon);

      document.getElementById("lat").value = "";
      document.getElementById("lon").value = "";
      document.getElementById("error").textContent = "";
    }
  });
}

/////////start second edition
document.getElementById("howTocalcSelect").addEventListener("change", () => {
  if (document.getElementById("howTocalcSelect").value === "1") {
    var kiloowat = parseFloat(document.getElementById("meterOrKw").value);
    document.getElementById("meterOrKw").placeholder = "کیلو وات";
  } else {
    var meter = parseFloat(document.getElementById("meterOrKw").value);
    document.getElementById("meterOrKw").placeholder = "متر";
  }
});

var todayElicPrice = parseFloat(document.getElementById("elecPrice").value);
var today1PanelCost = parseFloat(document.getElementById("panelp").value);
var todayInverterCost = parseFloat(document.getElementById("inverterp").value);
var todaybatteryCost = parseFloat(
  document.getElementById("batteryPrice").value
);
var numberOfBattery = parseFloat(document.getElementById("batteryCount").value);

//disable inputs that we dont need
document.getElementById("typeOfGen").addEventListener("change", () => {
  if (document.getElementById("flexRadioDefault1").checked === true) {
    document.getElementById("batteryPrice").value = "0";
    document.getElementById("batteryPrice").disabled = true;
    document.getElementById("batteryCount").value = "0";
    document.getElementById("batteryCount").disabled = true;
  } else {
    document.getElementById("batteryPrice").value = "";
    document.getElementById("batteryCount").value = "";
    document.getElementById("batteryPrice").disabled = false;
    document.getElementById("batteryCount").disabled = false;
  }
});

click();
