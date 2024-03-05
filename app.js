"use strict";
const urlParams = new URLSearchParams(window.location.search);
const search = urlParams.get('q');
var quickCopyOnSearch = "YES"
var fuse;
var db;
var lasttext;
if (search !== null && search !== "") {
    document.getElementById("searchbar").value = search;
}
loadFile("template-db.json");
var searchBar = document.getElementById("searchbar");
var timeout = null;
searchBar.addEventListener('keyup', (e) => {
    if (e.key == "Enter") {
        if (true) {
            updateSearch(searchBar.value);
            navigator.clipboard.writeText(lasttext);
            document.getElementById("message").innerHTML = "Copied template to clipboard!";
            document.getElementById("message").style.visibility = "visible";
            document.getElementById("message").style.margin = "20px"
            setTimeout(function(){
                document.getElementById("message").style.visibility = "hidden";
                document.getElementById("message").style.margin = "0px"
            }, 1000);
        }
    } else {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            updateSearch(searchBar.value);
            }, 1000);
    }
});
updateList();
document.getElementById("message").style.visibility = "hidden"
document.getElementById("message").style.margin = "0px"

function updateList() {
    updateSearch(document.getElementById("searchbar").value);
}

function updateSearch(searchTerm) {
    if (searchTerm == "") {
        updateCards(db);
    } else {
        updateCards(fuse.search(searchTerm));
    }
}

function updateCards(list) {
    document.getElementById("result").innerHTML = "";
    var missinglasttext = true;
    for (const obj of list) {
        var card = document.createElement("div")
        card.className = "card";        
        var container = document.createElement("div");
        container.className = "container";
        container.innerHTML = "<h4><b>" + obj.title + "</b></h4>"+
            "<h5>" + obj.tags + "</h5><p>" + obj.text + "</p>";
        card.appendChild(container);
        document.getElementById("result").appendChild(card);
        card.addEventListener("click", () => {
            var regex = /<br\s*[\/]?>/gi;
            navigator.clipboard.writeText(obj.text.replace(regex, "\n"));
            document.getElementById("message").innerHTML = "Copied template to clipboard!";
            document.getElementById("message").style.visibility = "visible";
            document.getElementById("message").style.margin = "20px"
            setTimeout(function(){
                document.getElementById("message").style.visibility = "hidden";
                document.getElementById("message").style.margin = "0px"
            }, 1000);
        });
        if (missinglasttext) {
            var regex = /<br\s*[\/]?>/gi;
            lasttext = obj.text.replace(regex, "\n");
            missinglasttext = false;
        }
    }
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
