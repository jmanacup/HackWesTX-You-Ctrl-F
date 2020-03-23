    
var reset = false;


let originalUrl, url, entirePathJson;

getUrl();

//function that checks the url beforehand if there are captions available
function getUrl(){

    chrome.tabs.query({currentWindow: true, active: true},
        function(tabs){
    
            //This is for the video id
            url = tabs[0].url.split("v=")[1].substring(0, 11);
            originalUrl = "https://www.youtube.com/watch?v=" + url;

            entirePathJson = "https://www.youtube.com/api/timedtext?lang=en&fmt=json3&v=" + String(url);

            fetch(entirePathJson)
                .then(response => response.text())
                .then(result => {
                    if(result.length == 0){
                        alert("There is no owner-provided caption for this video yet."); 
                        
                        //disable the text field and the button
                        document.getElementById("word").disabled = true;
                        document.getElementById("btn").disabled = true;
                    }
                })
                .catch(error => alert(error));

        });

}


//this function goes through when the button is clicked
document.querySelector('button').addEventListener('click', onclick, false)
    function onclick (e){
        console.log(e);
        chrome.tabs.query({currentWindow: true, active: true},
            function(tabs){

                //this is for the word to be searched
                var word = document.getElementById('word').value;

                //interprets the JSON file and output it in the popup window
                fetch(entirePathJson)
                    .then(response => response.json()) //parse the json file as a javascript object
                    .then(result => {
                        extractJSONdata(result , word, originalUrl); //calls the function that handles both the extraction and output for the captions
                        reset = true; //sets when user inputted 2 or more consecutive words
                        clickData(); //calls the function that makes the link clickable
                    })
                    .catch(error => alert(error));

            });
}

function extractJSONdata(jsonData, word, originalUrl){

    if(reset){ //to clear the result if user search for another one
        var elements = document.getElementsByTagName("div");
        var elements2 = document.getElementsByTagName('a');
        var elements3 = document.getElementsByClassName("headerTitle");
        for(var i = 0; i < elements.length; i++){
            elements[i].innerHTML = "";
        }

        for(var j = 0; j < elements2.length; j++){
            elements2[j].innerHTML = "";
        }
        for(var k = 0; k < elements3.length; k++){
            elements3[k].innerHTML = "";
        }

    }

    var isThere = false; //flag that checks if the word is present in the timedText

    //header
    var header = document.createElement('h2');
    header.innerHTML = "HERE ARE THE RESULTS FOR THE WORD "  + word.toUpperCase();
    header.className = "headerTitle";
    document.getElementsByTagName('body')[0].appendChild(header);

    //loops that goes through the timedText array to check if the word is present
    for(var i = 0; i < jsonData.events.length; i++){

        //this check to see if the word is not blank
        if(word){
            word = word.toLowerCase(); //handles all types (lowercase or uppercase) of input word

            var captionText = jsonData.events[i].segs[0].utf8;
            var captionTime = Math.trunc(jsonData.events[i].tStartMs / 1000); // milliseconds --> seconds

            var str_pos = captionText.search(word); //searches throughout the utf8 portion of the json data file

            if(str_pos > -1){

                //makes the flag to true since the word is there
                isThere = true;

                //time stamps variables
                var temp = captionTime;
                var min = temp / 60;
                var sec = temp % 60;

                min = Math.floor(min);

                //link for the timestamp
                var alink = document.createElement('a');
                alink.innerHTML = min + ':' + (sec < 10 ? '0' : '') + sec; 
                alink.title = min + ':' + sec;
                alink.href = originalUrl + "&t=" + temp;
                alink.id = "timeLink";
                document.getElementsByTagName('body')[0].appendChild(alink);

                //phrase of the captionText
                var text = captionText; //<<< The text you want to display
                var createText = document.createElement('div'); //<<< create a Element
                createText.innerHTML = text; // <<< append content to the element
                createText.id = "resultWords";
                document.getElementsByTagName('body')[0].appendChild(createText);
            }
        }
    }
    //if the word is not in the timedText array
    if(!isThere)
        alert("There is no caption for the word " + word);

}

//function that makes the page reload when links are pressed in the popup window
function clickData(){

    var elements = document.getElementsByTagName('a');

    var i = 0;

    for(i; i < elements.length; i++){

        let timeLink = elements[i].href;
        elements[i].onclick = function () {
            chrome.tabs.update(null, {url: timeLink});
        }
    }
}
