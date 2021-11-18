
    //Window URL
    var url = window.location.href;

    //Gets data from GET request
    function getURLData() {
    var search = url.split("search/?")[1].split("&");
    for (var i = 0; i < search.length; i++) {
        search[i] = search[i].replace(/\+/g, " ");
        search[i] = search[i].replace(/%21/g, "!");
        search[i] = search[i].replace(/%40/g, "@");
        search[i] = search[i].replace(/%23/g, "#");
        search[i] = search[i].replace(/%24/g, "$");
        search[i] = search[i].replace(/%25/g, "%");
        search[i] = search[i].replace(/%5E/g, "^");
        search[i] = search[i].replace(/%26/g, "&");
        search[i] = search[i].replace(/%28/g, "(");
        search[i] = search[i].replace(/%29/g, ")");
        search[i] = search[i].replace(/%2B/g, "+");
        search[i] = search[i].replace(/%2C/g, ",");
        search[i] = search[i].replace(/%2F/g, "/");
        search[i] = search[i].replace(/%3A/g, ":");
        search[i] = search[i].replace(/%3B/g, ";");
        search[i] = search[i].replace(/%3D/g, "=");
        search[i] = search[i].replace(/%3F/g, "?");
        search[i] = search[i].replace(/%5B/g, "[");
        search[i] = search[i].replace(/%5D/g, "]");
        
    }
    return search;
    }

//Declaring vars
var searchResponse = [];
var bikes;
var sCountArray = [];
var minPrice = 0;
var maxPrice = 100000000000;
var type;
var brands = {
    giant: 0,
    diamondback: 0,
    huffy: 0,
    kona: 0,
    raleigh: 0,
    orbea: 0
};

//Compares query with bike stock and displays corresponding info
    function analyzeData(data) {
        var search = getURLData();
        if (search.length > 5) {
        if (search[search.length-3].split("=")[1] != "") {
            maxPrice = parseFloat(search[search.length-3].split("=")[1]);
        }
        if (search[search.length-2].split("=")[1] != "") {
            minPrice = parseFloat(search[search.length-2].split("=")[1]);
        }
        var query = search[search.length-4];
        type = search[search.length-6].split("=")[1];
    }
    if (search[0].split("=")[0] == "type") {
        type = search[0].split("=")[1];
    }
    for (var i = 0; i < search.length - 1 && i < Object.keys(brands).length; i++) {
            if (search[i].includes("=on")) {
                var brand = search[i].split("=on")[0];
                brands[brand] = 1;
            }
        }
        bikes = JSON.parse(data);
        var counter = 0;
        for (var i = 0; i < Object.keys(brands).length; i++) {
            if (brands[Object.keys(brands)[i]] == 1) {
                counter++;
            }
        }
            searchResponse = [];
            for (var i = 0; i < Object.keys(brands).length; i++) {
            if (brands[Object.keys(brands)[i]] == 1 || counter == 0) {
                if (query != "") {
                    var currentBrand = bikes.brands[Object.keys(brands)[i]];
                    if (query == undefined) {
                        query = "q=";
                    }
                    var qArray = query.toLowerCase().split(/[;,— =]/);
                    qArray.shift();
                    for (var ii = 0; ii < currentBrand.length; ii++) {
                        var currentBike = currentBrand[ii];
                        var sCount = 0;
                        for (var iii = 0; iii < qArray.length; iii++) {
                            var change = sCount;
                            if (currentBike.name.toLowerCase().includes(qArray[iii])) {
                                sCount += 5*(currentBike.name.toLowerCase().split(qArray[iii]).length - 1);
                            }
                            if (currentBike.class.toLowerCase().includes(qArray[iii])) {
                                sCount += 4*(currentBike.class.toLowerCase().split(qArray[iii]).length - 1);
                            }
                            if (currentBike.price.toLowerCase().includes(qArray[iii])) {
                                sCount += 3*(currentBike.price.toLowerCase().split(qArray[iii]).length - 1);
                            }
                            if (currentBike.description.toLowerCase().includes(qArray[iii])) {
                                sCount += currentBike.description.toLowerCase().split(qArray[iii]).length - 1;
                            }
                            var specs = Object.keys(currentBike.specs);
                            for (var i4 = 0; i4 < specs.length; i4++) {
                                if (currentBike.specs[specs[i4]].toLowerCase().includes(qArray[iii])) {
                                    sCount += 2*(currentBike.specs[specs[i4]].toLowerCase().split(qArray[iii]).length - 1);
                                }
                            }
                            if (change == sCount) {
                                sCount -= 2;
                            }
                        }
                        if (sCount > Math.ceil(3*(qArray.length)) && currentBike.price > minPrice && currentBike.price < maxPrice && (type == undefined || type == "all" || type == currentBike.class.toLowerCase())) {
                            searchResponse.push(currentBike);
                            sCountArray.push(sCount);
                        }
                    }
                }
            }
            }
            while (searchResponse.length > 0) {
                var index = sCountArray.indexOf(Math.max.apply(Math, sCountArray));
                createEntry(searchResponse[index]);
                searchResponse.splice(index, 1);
                sCountArray.splice(index, 1);
            }
        }

//Creates a search entry
function createEntry(query) {
    var surroundDiv = document.createElement("div");
    var link = document.createElement("a");
    link.href = "/viciouscyclesproject/products/bikes/" + query.brand.toLowerCase() + "/" + query.name.replace(/ /g, "_").toLowerCase() + ".html";
    surroundDiv.className = "entryDiv";
    document.getElementById("searchDiv").append(link);
    link.append(surroundDiv)
    surroundDiv.innerHTML = "<h2>"+query.brand+": "+query.name+" "+query.class+" Bike</h2><h3> $"+query.price+"</h3>";
    if (parseInt(query.stock) > 0) {
        surroundDiv.innerHTML += "<h3 class='lime'>In Stock</h3>";
    } else {
        surroundDiv.innerHTML += "<h3 class='red'>Out of Stock</h3>";
    }
}

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

//Reads the stock json file
ajax("/viciouscyclesproject/json/stock.json", analyzeData);