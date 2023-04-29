//getting lat & lon to show data

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

    /////////start second edition
    if (document.getElementById("howTocalcSelect").value == 1) {
    var  kiloowat = parseFloat(document.getElementById("meterOrKw").value);
    } else {
    var  meter = parseFloat(document.getElementById("meterOrKw").value);
    }
   

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

    var allCosts =
      today1PanelCost  +
      todayInverterCost +
      numberOfBattery * todaybatteryCost;
    allCosts = parseFloat(allCosts);
    var allCostsWithStructure = allCosts + (allCosts * 10) / 100;
    allCostsWithStructure = parseFloat(allCostsWithStructure);

    console.log(allCostsWithStructure);

var typeOfThePanel;
var panelPicture;
if(kiloowat<=5){
  typeOfThePanel="مسکونی کوچک"
  panelPicture="pv1_1.png"

}else if(kiloowat>5 && kiloowat <=100){
  typeOfThePanel="تجاری سایز متوسط"
  panelPicture="pv1_1.png"
}else if(kiloowat>100){
  typeOfThePanel="مقیاس بزرگ"
  panelPicture="pv3_1.png"
}
console.log(typeOfThePanel);

var spaceNeed;


if(meter){
  spaceNeed=meter;
}else{
  spaceNeed=kiloowat*10;
}

var mounthMoney=Math.floor (jsonDataElectric.annual.data.PVOUT_csi.toFixed(1)/360*kiloowat*30*1750);
var yearMoney=mounthMoney*12;
var priceBack=Math.floor( allCostsWithStructure/mounthMoney)+1;

    console.log(mounthMoney,yearMoney,priceBack,allCostsWithStructure);

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
        <pre>درجه بهینه پنل ها:(${OPTA}°)</pre>
        <hr>
        <pre>فضای مورد نیاز:(${spaceNeed}متر مربع)</pre>
        <hr>
        <pre>قیمت فروش هر کیلووات برق:(${1750}تومان)</pre>
        <hr>
        <pre>درامد ماهانه:(${
          mounthMoney
        }تومان)</pre>
        <hr>
        <pre>درامد سالانه:(${yearMoney}تومان)</pre>
        <hr>
        <pre>بازگشت سرمایه:(${priceBack}سال)</pre>
        
    
    </div>
</div>
`;

    document.getElementById("btn1").insertAdjacentHTML("afterend", report);

    //add the cards solar data

    var addCard = `
    
<div  class="cards">

    <div id="card1" class="card" style="width: 15rem;">
    <ul id="z" class="list-group list-group-flush">
        <li id="country" class="list-group-item"></li>
        <li id="location" class="list-group-item"></li>
        <li id="exactDate" class="list-group-item"></li>
        </ul>
        </div>


        <form action="/action_page.php" id="perID">
    <select name="per" id="perId">
        <option value="perYear">per year</option>
        <option value="perDay">per day</option>
    </select>
    </form>

        <div>
        <div id="card2" class="card" style="width:18rem">
        <ul class="list-group list-group-flush">
        <li id="PVOUT" class="list-group-item"></li>
        <li id="DNI" class="list-group-item"></li>
        <li id="GHI" class="list-group-item"></li>
        <li id="DIF" class="list-group-item"></li>
        <li id="GTI" class="list-group-item"></li>
        <li id="OPTA" class="list-group-item"></li>
        <li id="TEMP" class="list-group-item"></li>
        <li id="ELE" class="list-group-item"></li>
    </ul>
    </div>
    </div>


`;
    document.getElementById("btn1").insertAdjacentHTML("afterend", addCard);

    document.getElementById(
      "country"
    ).innerHTML = ` کشور<pre> ${countryName}</pre>`;
    document.getElementById(
      "location"
    ).innerHTML = `مکان دقیق<pre> ${cityName}</pre>`;
    document.getElementById("exactDate").innerHTML = `تاریخ<pre> ${time}</pre>`;

    document.getElementById(
      "PVOUT"
    ).innerHTML = `خروجی برق فوتو ولتاییک<pre>${PVOUT.toFixed(
      1
    )} kWh/kWp</pre>`;
    document.getElementById("DNI").innerHTML = `تابش مستقیم<pre>${DNI.toFixed(
      1
    )} kWh/m2</pre>`;
    document.getElementById("GHI").innerHTML = ` تابش افقی<pre>${GHI.toFixed(
      1
    )} kWh/m2</pre>`;
    document.getElementById(
      "DIF"
    ).innerHTML = ` تابش افقی پراکنده<pre>${DIF.toFixed(1)} kWh/m2</pre>`;
    document.getElementById(
      "GTI"
    ).innerHTML = ` تابش کج در زاویه بهینه<pre>${GTI.toFixed(1)} kWh/m2</pre>`;
    document.getElementById(
      "OPTA"
    ).innerHTML = `شیب بهینه ماژول ها <pre>${OPTA.toFixed(1)} °</pre>`;
    document.getElementById("TEMP").innerHTML = ` دما<pre>${TEMP.toFixed(
      1
    )} °C</pre>`;
    document.getElementById(
      "ELE"
    ).innerHTML = ` ارتفاع ناحیه<pre>${PVOUT.toFixed(1)} m</pre>`;

    document.getElementById("btn1").disabled = false;
    document.getElementById("btn1").innerHTML = `محاسبه `;

    document.getElementById("perId").addEventListener("change", () => {
      if (document.getElementById("perId").value == "perYear") {
        document.getElementById(
          "country"
        ).innerHTML = ` کشور<pre> ${countryName}</pre>`;
        document.getElementById(
          "location"
        ).innerHTML = `مکان دقیق<pre> ${cityName}</pre>`;
        document.getElementById(
          "exactDate"
        ).innerHTML = `تاریخ<pre> ${time}</pre>`;

        document.getElementById(
          "PVOUT"
        ).innerHTML = `خروجی برق فوتو ولتاییک<pre>${PVOUT.toFixed(
          1
        )} kWh/kWp</pre>`;
        document.getElementById(
          "DNI"
        ).innerHTML = `تابش مستقیم<pre>${DNI.toFixed(1)} kWh/m2</pre>`;
        document.getElementById(
          "GHI"
        ).innerHTML = ` تابش افقی<pre>${GHI.toFixed(1)} kWh/m2</pre>`;
        document.getElementById(
          "DIF"
        ).innerHTML = ` تابش افقی پراکنده<pre>${DIF.toFixed(1)} kWh/m2</pre>`;
        document.getElementById(
          "GTI"
        ).innerHTML = ` تابش کج در زاویه بهینه<pre>${GTI.toFixed(
          1
        )} kWh/m2</pre>`;
        document.getElementById(
          "OPTA"
        ).innerHTML = `شیب بهینه ماژول ها<pre>${OPTA.toFixed(1)} °</pre>`;
        document.getElementById("TEMP").innerHTML = ` دما<pre>${TEMP.toFixed(
          1
        )} °C</pre>`;
        document.getElementById(
          "ELE"
        ).innerHTML = ` ارتفاع ناحیه<pre>${PVOUT.toFixed(1)} m</pre>`;
      } else {
        document.getElementById(
          "country"
        ).innerHTML = ` کشور<pre> ${countryName}</pre>`;
        document.getElementById(
          "location"
        ).innerHTML = `مکان دقیق<pre> ${cityName}</pre>`;
        document.getElementById(
          "exactDate"
        ).innerHTML = `تاریخ<pre> ${time}</pre>`;

        document.getElementById(
          "PVOUT"
        ).innerHTML = `خروجی برق فوتو ولتاییک<pre>${(PVOUT / 360).toFixed(
          1
        )} kWh/kWp</pre>`;
        document.getElementById("DNI").innerHTML = `تابش مستقیم<pre>${(
          DNI / 360
        ).toFixed(1)} kWh/m2</pre>`;
        document.getElementById("GHI").innerHTML = ` تابش افقی<pre>${(
          GHI / 360
        ).toFixed(1)} kWh/m2</pre>`;
        document.getElementById("DIF").innerHTML = ` تابش افقی پراکنده<pre>${(
          DIF / 360
        ).toFixed(1)} kWh/m2</pre>`;
        document.getElementById(
          "GTI"
        ).innerHTML = ` تابش کج در زاویه بهینه<pre>${(GTI / 360).toFixed(
          1
        )} kWh/m2</pre>`;
        document.getElementById(
          "OPTA"
        ).innerHTML = `شیب بهینه ماژول ها <pre>${OPTA.toFixed(1)} °</pre>`;
        document.getElementById("TEMP").innerHTML = ` دما<pre>${TEMP.toFixed(
          1
        )} °C</pre>`;
        document.getElementById(
          "ELE"
        ).innerHTML = ` ارتفاع ناحیه<pre>${PVOUT.toFixed(1)} m</pre>`;
      }
    });

    //add panel cards
    var panel1 = 5;
    var panel2 = 100;
    var panel3 = 1000;
    var panel4 = 1000;
    var price1 = 1750;
    var price2 = 1650;
    var space1 = 50;
    var space2 = 1000;
    var space3 = 12000;
    var space4 = 12000;
    var priceBack = 4;

    var pvCards = `
    <div id="cardDisplay">

            <div id="cardBG1" class="card" style="width: 18rem;">
                <img src="./assets/pv1_1.png" class="card-img-top" alt="pv1">
                <div class="card-body">
                    <h5 class="card-title" style="padding-bottom: 30px;">مسکونی کوچک</h5>

                    <hr>
                    <pre>نوع پنل: Small residential</pre>
                    <hr>
                    <pre>ظرفیت:(${panel1}kwp)</pre>
                    <hr>
                    <pre>آزیموث : Default(0º)</pre>
                    <hr>
                    <pre>درجه بهینه پنل های:(${OPTA}°)</pre>
                    <hr>
                    <pre>قیمت فروش هر کیلووات برق:(${price1}تومان)</pre>
                    <hr>
                    <pre>فضای مورد نیاز:(${space1}متر مربع)</pre>
                    <hr>
                    <pre>درامد ماهانه:(${
                      (PVOUT / 360).toFixed(1) * panel1 * 30 * price1
                    }تومان)</pre>
                    <hr>
                    <pre>درامد سالانه:(${
                      PVOUT.toFixed(1) * panel1 * price1
                    }تومان)</pre>
                    <hr>
                    <pre>بازگشت سرمایه:(${priceBack}سال)</pre>
                    
                </div>
                </div>
            </div>



            <div id="cardBG2" class="card" style="width: 18rem;">
                <img src="./assets/pv2_1.png" class="card-img-top" alt="pv1">
                <div class="card-body">
                    <h5 class="card-title" style="padding-bottom: 30px;">تجاری سایز متوسط</h5>
                    <hr>
                    <pre>نوع پنل: Medium size comercial</pre>
                    <hr>
                    <pre>ظرفیت:(${panel2}kwp)</pre>
                    <hr>
                    <pre>آزیموت : Default(0º)</pre>
                    <hr>
                    <pre>درجه بهینه پنل ها:(${OPTA}°)</pre>
                    <hr>
                    <pre>قیمت فروش هر کیلووات برق:(${price2}تومان)</pre>
                    <hr>
                    <pre>فضای مورد نیاز:(${space2}متر مربع)</pre>
                    <hr>
                    <pre>درامد ماهانه:(${
                      (PVOUT / 360).toFixed(1) * panel2 * 30 * price2
                    }تومان)</pre>
                    <hr>
                    <pre>درامد سالانه:(${
                      PVOUT.toFixed(1) * panel2 * price2
                    }تومان)</pre>
                    <hr>
                    <pre>بازگشت سرمایه:(${priceBack}سال)</pre>
                    
                



                </div>
            </div>


            <div id="cardBG3" class="card" style="width: 18rem;">
                <img src="./assets/pv3_1.png" class="card-img-top" alt="pv1">
                <div class="card-body">
                    <h5 class="card-title" style="padding-bottom: 30px;">روی زمین در مقیاس بزرگ</h5>

                    <hr>
                    <pre>نوع پنل: Ground-mounted large scale</pre>
                    <hr>
                    <pre>ظرفیت:(${panel3}kwp)</pre>
                    <hr>
                    <pre>آزیموت : Default(0º)</pre>
                    <hr>
                    <pre>درجه بهینه پنل ها:(${OPTA}°)</pre>
                    <hr>
                    <pre>قیمت فروش هر کیلووات برق:(${price2}تومان)</pre>
                    <hr>
                    <pre>فضای مورد نیاز:(${space3}متر مربع)</pre>
                    <hr>
                    <pre>درامد ماهانه:(${
                      (PVOUT / 360).toFixed(1) * panel3 * 30 * price2
                    }تومان)</pre>
                    <hr>
                    <pre>درامد سالانه:(${
                      PVOUT.toFixed(1) * panel3 * price2
                    }تومان)</pre>
                    <hr>
                    <pre>بازگشت سرمایه:(${priceBack}سال)</pre>
                    

                   
                </div>
            </div>



            <div id="cardBG4" class="card" style="width: 18rem;">
                <img src="./assets/pv4_1.png" class="card-img-top" alt="pv1">
                <div class="card-body">
                    <h5 class="card-title" style="padding-bottom: 30px;">شناور در مقیاس بزرگ</h5>
                    
                    <hr>
                    <pre>نوع پنل: Floating large scale</pre>
                    <hr>
                    <pre>ظرفیت:(${panel4}kwp)</pre>
                    <hr>
                    <pre>آزیموت : Default(10º)</pre>
                    <hr>
                    <pre>درجه بهینه پنل ها:(${OPTA}°)</pre>
                    <hr>
                    <pre>قیمت فروش هر کیلووات برق:(${price2}تومان)</pre>
                    <hr>
                    <pre>فضای مورد نیاز:(${space4} متر مربع)</pre>
                    <hr>
                    <pre>درامد ماهانه:(${
                      (PVOUT / 360).toFixed(1) * panel4 * 30 * price2
                    }تومان)</pre>
                    <hr>
                    <pre>درامد سالانه:(${
                      PVOUT.toFixed(1) * panel4 * price2
                    }تومان)</pre>
                    <hr>
                    <pre>بازگشت سرمایه:(${priceBack}سال)</pre>

                    
                    

                  
                </div>
            </div>

        </div>`;

    document.querySelector(".cards").insertAdjacentHTML("afterend", pvCards);

    /*
    map1 = `
            <div class="map2">

            <iframe
             width="425"
              height="350"
               frameborder="0"
                scrolling="no"
                marginheight="0"
                marginwidth="0"
                src="https://www.openstreetmap.org/export/embed.html?bbox=47.43072509765626%2C32.8149783969858%2C50.96282958984376%2C34.34116826510752&amp;layer=mapnik"
                style="border: 1px solid black">
                </iframe>
                <br/>
                <small>
                <a href="https://www.openstreetmap.org/#map=9/33.5814/49.1968"
                target="_blank">
                View Larger Map</a>
                </small>


                </div>`;
*/
    // document.getElementById("ray").insertAdjacentElement("afterend", map1);
  } catch {
    //if something went wrong
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
}

//start program by click on button

function click() {
  document.querySelector("#btn1").addEventListener("click", () => {
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
  });
}

click();

////////////////map
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

document.getElementById("typeOfGen").addEventListener("change", () => {
  if (document.getElementById("flexRadioDefault1").checked === true) {
    document.getElementById("batteryPrice").value="";
    document.getElementById("batteryPrice").disabled = true;
    document.getElementById("batteryCount").value="";
    document.getElementById("batteryCount").disabled = true;
  } else {
    document.getElementById("batteryPrice").disabled = false;
    document.getElementById("batteryCount").disabled = false;
  }
});

document.getElementById(
  "ray"
).innerHTML = ` <footer id="ray" style="color: rgb(252, 1, 1); text-align: center; margin-top:${
  screen.height
}${"px"}" >.</footer>`;
