//Ajax get function
function ajax(url, callback) {
    var xHttp = new XMLHttpRequest();
    xHttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.responseText);
        }
    }
    xHttp.open("GET", url, true);
    xHttp.send();
}

//Get stock info
ajax("/viciouscyclesproject/json/stock.json", analyzeData);

//Creates info display based on filename
function analyzeData(rawData) {
    var bikeName = window.location.href.split("/")[window.location.href.split("/").length-1].split(".html")[0].replace(/_/g, " ");
    data = JSON.parse(rawData);
    var bike;
    for (var i = 0; i < Object.keys(data.brands).length; i++) {
        for (var ii = 0; ii < data.brands[Object.keys(data.brands)[i]].length; ii++) {
            if (data.brands[Object.keys(data.brands)[i]][ii].name.toLowerCase() == bikeName) {
                bike = data.brands[Object.keys(data.brands)[i]][ii];
                break;
            }
        }
    }
    var container = document.getElementById("bikeInfoContainer");
    container.innerHTML += "<img src='/viciouscyclesproject/images/placeholder.jpeg'></img><div class='bikeInfo'><h1>"+bike.name+"</h1><h1>"+bike.class+" Bike</h1><h1>Price: $"+bike.price+"</h1></div>";
    
    
    container.innerHTML += "<h3 class='description'>"+bike.description+"</h3>";

    var specsTable = document.createElement("table");
    specsTable.className = "specs-table"
    var specsHead = specsTable.createTHead();
    var specsBody = specsTable.createTBody();
    specsHead.innerHTML = "<tr><th colspan=2><h2>Specs</h2></th></tr>";
    for (var i = 0; i < Object.keys(bike.specs).length; i++) {
        var spec = Object.keys(bike.specs)[i];
        specValue = bike.specs[spec];
        specsBody.innerHTML += "<tr><td>"+spec+"</td><td>"+specValue+"</td></tr>";
    }
    container.append(specsTable);
}