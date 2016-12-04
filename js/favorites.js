function createFavorite() { 
    var listofFavorites = document.getElementsByClassName("favorite");
    var theFirstFavorite = listofFavorites.item(0);
    var theNewFavorite = theFirstFavorite.cloneNode(true);
    document.getElementById("content").appendChild(theNewFavorite);
    
    console.log(listofFavorites);
    var newFavoriteTitle = document.getElementById("creator-title").value;
    var newFavoriteDescription = document.getElementById("creator-description")
    var newFavoriteMedia = document.getElementById("creator-media").value;
    theNewFavorite.getElementsByClassName("title")[0].innerHTML = newFavoriteTitle;
    theNewFavorite.getElementsByClassName("description")[0].innerHTML = newFavoriteDescription;
    theNewFavorite.getElementsByClassName("media")[0].innerHTML = newFavoriteMedia;
    
}    
