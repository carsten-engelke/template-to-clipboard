"use strict";
const urlParams = new URLSearchParams(window.location.search);
const search = urlParams.get('q');
var fuse;
var db;
if (search !== null && search !== "") {
    document.getElementById("searchbar").value = search;
}
loadFile("template-db.json");
var searchBar = document.getElementById("searchbar");
var timeout = null;
searchBar.addEventListener('keyup', (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
        alert(updateSearch(searchBar.value));
        }, 1000);
});
updateList();
document.getElementById("message").style.visibility = "hidden"

function updateList() {
    updateSearch(document.getElementById("searchbar").value);
}

function updateSearch(searchTerm) {
    if (searchTerm == "") {
        updateCards(db);
    } else {
        //document.getElementById("result").innerHTML = "<div>" + fuse.search(searchTerm) + "</div>";
        return updateCards(fuse.search(searchTerm));
    }
}

function updateCards(list) {
    document.getElementById("result").innerHTML = "";
    var returntext = ""
    for (const obj of list) {
        var card = document.createElement("div")
        card.className = "card";        
        var container = document.createElement("div");
        container.className = "container";
        container.innerHTML = "<h4><b>" + obj.title + "</b></h4>"+
            "<h5>" + obj.tags + "</h5><p>" + obj.text + "</p>";
        card.appendChild(container);
        document.getElementById("result").appendChild(card);
        var regex = /<br\s*[\/]?>/gi;
        var output = obj.text.replace(regex, "\n");
        card.addEventListener("click", () => {
            navigator.clipboard.writeText(output);
            document.getElementById("message").innerHTML = "Copied template to clipboard!";
            document.getElementById("message").style.visibility = "visible";
            setTimeout(function(){
                document.getElementById("message").style.visibility = "hidden";
            }, 1000);
        });
        if (returntext == "") {
            returntext = output;
        }
    }
    return returntext;
}

function loadFile(filePath) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.onload = function(e) {
        if (xmlhttp.status==200) {
            db = JSON.parse(xmlhttp.responseText);
            var options = {
                shouldSort: true,
                threshold: 0.6,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [
                  "title",
                  "tags",
                  "text"
                ]
            };
            fuse = new Fuse(db, options);
            updateList();
        }
    }
    xmlhttp.send();
  }
