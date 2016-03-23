function readBibFile(file)
{
    var rawFile = new XMLHttpRequest();
    var bibTexContent = null;
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4 && 
            (rawFile.status === 200 || rawFile.status == 0)) {
                bibTexContent = rawFile.responseText;
        }
    }
    rawFile.send(null);
    return bibTexContent;
}

function bibEntry2html(entry, root) {
    
    //this.htmlstring        = 'AUTHORS, "<strong>TITLE</strong>", <em>JOURNAL</em>, YEAR<br />';
    //First need to take care of the authors
    var nAuthors = entry['author'].length;
    var authorsElement = document.createElement("span")
    authorsElement.setAttribute("class", "pubAuthors");
    
    function formatAuthor(author) {
        return author['first'] + ' ' + author['last'];
    }
    
    if (nAuthors == 0) {
        return;
    }
    else if (nAuthors == 1) {
        authorsElement.appendChild(document.createTextNode(formatAuthor(entry['author'][0])));
    }
    else if (nAuthors == 2) {
        authorsElement.appendChild(document.createTextNode(formatAuthor(entry['author'][0]) + ' and ' +
                                                           formatAuthor(entry['author'][1])));
    }
    else {
        authorsElement.appendChild(document.createTextNode(formatAuthor(entry['author'][0]) + ' '));
        var etalElement = document.createElement("span");
        etalElement.setAttribute("class", "etal");
        etalElement.appendChild(document.createTextNode('et al.'));
        authorsElement.appendChild(etalElement);
    }
    root.appendChild(authorsElement);
    
    //Second, we need to append the title
    root.appendChild(document.createTextNode(", "));
    var titleElement = document.createElement("span");
    titleElement.setAttribute("class", "pubTitle");
    titleElement.appendChild(document.createTextNode(entry['title']))
    root.appendChild(titleElement);
    
    //Third, we need to add the journal/conference/name
    root.appendChild(document.createTextNode(", "));
    var titleElement = document.createElement("span");
    titleElement.setAttribute("class", "pubJournal");
    titleElement.appendChild(document.createTextNode(entry['journal']))
    root.appendChild(titleElement);
    
    //Last, we need to add the year
    root.appendChild(document.createTextNode(", "));
    var titleElement = document.createElement("span");
    titleElement.setAttribute("class", "pubYear");
    titleElement.appendChild(document.createTextNode(entry['year']))
    root.appendChild(titleElement);
    
    //Add the bibtex bit
    //Last, we need to add the year
    var titleElement = document.createElement("span");
    titleElement.setAttribute("class", "pubBib");
    titleElement.appendChild(document.createTextNode(entry['year']))
    root.appendChild(titleElement);
    
    //I need to create a link for the url if I have one
    if ("url" in entry) {
        var urlElement = document.createElement("a");
        urlElement.setAttribute("class", "pubUrl");
        urlElement.setAttribute("href", entry["url"]);
        urlElement.appendChild(document.createTextNode("[url]"));
        root.appendChild(urlElement);
    }
    
    var bibLink = document.createElement("a");
    bibLink.setAttribute("href", "#bibtex-popup");
    bibLink.setAttribute("class", "open-popup-link");
    
    function changeContent () {
        var popup = document.getElementById("bibtex-popup");
        while (popup.firstChild) {
            popup.removeChild(popup.firstChild);
        }
        var pre = document.createElement("pre");
        var bib = "@Article{id,\n" +
            "\tTitle = {" + entry['title'] + "},\n" +
            "}";
        pre.appendChild(document.createTextNode(bib));
        popup.appendChild(pre);
    }
    bibLink.onclick = changeContent;
    
    bibLink.appendChild(document.createTextNode("[bib]"));
    
    root.appendChild(bibLink);
    
    //console.log(Object.keys(entry));
}

function bib2html(bibfilename, biblistid) {
    var bibtex = new BibTex({'validate':true, 'unwrap':true});
    bibtex.content = readBibFile(bibfilename);
    bibtex.parse();
    
    var list = document.getElementById(biblistid);
    
    for (var i = 0; i < bibtex.data.length ; i++) {
        var entry = bibtex.data[i];
        var entryLi = document.createElement("li");
        bibEntry2html(entry, entryLi);
        list.appendChild(entryLi);
    }
}