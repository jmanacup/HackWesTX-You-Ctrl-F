    
var reset = false;

//this function goes through when the button is clicked
document.querySelector('button').addEventListener('click', onclick, false)
    function onclick (e){
        console.log(e);
        chrome.tabs.query({currentWindow: true, active: true},
            function(tabs){

                //This is for the video id
                var url = tabs[0].url.split("v=")[1].substring(0, 11);
                var originalUrl = "https://www.youtube.com/watch?v=" + url;
                //this is for the word to be searched
                var word = document.getElementById('word').value;

                let entirePath = "https://www.youtube.com/api/timedtext?lang=en&v=" + String(url);
                
                //fetch the XML data
                let timedText;

                //interprets the XML file and output it in the popup window
                fetch(entirePath)
                    .then(response => response.text())
                    .then(result => {
                        timedText = extractXMLData(result); //puts the array in timedText
                        showData(timedText, word, originalUrl); //calls the function that shows the text on the pop-up window
                        reset = true;
                        clickData();
                    })
                    .catch(error => alert(error));
                

            });
}
  

//function that puts the the phrase and time in an array
function extractXMLData(result){

    var i=0,number=0,text,j=0,k=0;
    var timedText = new Array(2);
    timedText[0] = new Array(10000);
    timedText[1] = new Array(10000);

    let line = result.toLowerCase();

    while(i<line.length){
    if (line.indexOf('<',i)!=-1)
    {
        i=line.indexOf('<',i);
        
        if (line.indexOf('<text',i)==i)
        {
            i=line.indexOf('<text',i)
            i+=13;
            j=i;
            while(line[j]!='.')
            {
                j++;
            }
            number=line.substring(i,j)
            timedText[0][k]=number
            i=line.indexOf('>',i);
            i+=1;
            j=i;
            while(line[j]!='<')
            {
                j++;
            }
            text=line.substring(i,j);
            text=text.replace("&amp;#39;",'\'');
                
            timedText[1][k]=text;
            k++;
        }
        else
        {
            i=line.indexOf('>',i);
        }
    }
    i++;
    }

    //show data based on the timedText
    return timedText;

}

//function that shows the timedText in the popup window
function showData(timedText, word, originalUrl){

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
    var l;
    
    //header
    var header = document.createElement('h2');
    header.innerHTML = "HERE ARE THE RESULTS FOR THE WORD "  + word.toUpperCase();
    header.className = "headerTitle";
    document.getElementsByTagName('body')[0].appendChild(header);

    //loops that goes through the timedText array to check if the word is present
    for(l = 0; l < timedText[0].length; l++){
    if(typeof timedText[1][l] !== "undefined"){
        word = word.toLowerCase(); //handles all types (lowercase or uppercase) of input word
        var str_pos = timedText[1][l].search(word);

        if(str_pos > -1){

        //time stamp

        var temp = timedText[0][l];
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
            
        isThere = true;

        //phrase of the timedtext
        var text = timedText[1][l]; //<<< The text you want to display
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
