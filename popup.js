counter = 1;
    document.querySelector('button').addEventListener('click', onclick, false)
        function onclick (e){
            console.log(e);
            chrome.tabs.query({currentWindow: true, active: true},
                function(tabs){

                    //This is for the video id
                    var url = tabs[0].url.split("v=")[1].substring(0, 11);
                    var originalUrl = tabs[0].url;
                    //this is for the word to be searched
                    var word = document.getElementById('word').value;

                    let entirePath = "https://www.youtube.com/api/timedtext?lang=en&v=" + String(url);

                    //to download the xml file

                    chrome.downloads.download({
                        url: String(entirePath),
                        filename: String(word) + counter + ".xml",
                      });

                    counter++;

                    extractXMLData(word, originalUrl);

                    /*
                    var requestOptions = {
                        method: 'GET',
                        redirect: 'follow'
                    };
                    
                    fetch(entirePath)
                        .then(response => chrome.tabs.sendMessage(tabs[0].id,response.text()))
                        .then(result => console.log(result))
                      */  
                });
    }
  
function extractXMLData(word, originalUrl){

    const input = document.querySelector('input[type="file"]')
    input.addEventListener('change',function(e){
    //console.log(input.file) 
    const reader = new FileReader()

    var i=0,number=0,text,j=0,k=0, l=0;
    var timedText = new Array(2);
    timedText[0] = new Array(10000);
    timedText[1] = new Array(10000);

    reader.onload=function(){
    const line=reader.result

    while(i<line.length){
    if (line.indexOf('<',i)!=-1)
    {
        i=line.indexOf('<',i)
        
        if (line.indexOf('<text',i)==i)
        {
            i=line.indexOf('<text',i)
            i+=13
            j=i
            while(line[j]!='.')
            {
                j++
            }
            number=line.substring(i,j)
            timedText[0][k]=number
            console.log("TimeStamp: "+timedText[0][k])
            //console.log(timedText[0][k])
            i=line.indexOf('>',i)
            i+=1
            j=i
            while(line[j]!='<')
            {
                j++
            }
            text=line.substring(i,j)
            text=text.replace("&amp;#39;",'\'')
                
            timedText[1][k]=text
            console.log("TimedText: "+timedText[1][k])
            //console.log(timedText[1][k])
            k++
        }
        else
        {
            i=line.indexOf('>',i)
        }
    }
    i++
    }

    //show data based on the timedText
    showData(timedText, word, originalUrl);

    }

    reader.readAsText(input.files[0])
    }, false)
}

function showData(timedText, word, originalUrl){

    var isThere = false;
    for(l = 0; l < timedText[0].length; l++){
    if(typeof timedText[1][l] !== "undefined"){
        var str_pos = timedText[1][l].search(word);
        if(str_pos > -1){

        //time stamp

        var temp = timedText[0][l];
        var min = temp / 60;
        var sec = temp % 60;

        min = min.toPrecision(1);
        

        var alink = document.createElement('a');
        var link = document.createTextNode(min + ':' + sec);
        alink.appendChild(link);
        alink.title = min + ':' + sec;
        alink.href = originalUrl + "&t=" + timedText[0][l];
        document.body.appendChild(alink);
            
            isThere = true;

            //text
            var text = timedText[1][l]; //<<< The text you want to display
            var createText = document.createElement('div'); //<<< create a Element
        createText.innerHTML = text; // <<< append content to the element
        createText.id = "resultWords";
        document.getElementsByTagName('body')[0].appendChild(createText);
        }
    }
    }
    if(!isThere)
    console.log("There is no caption for the word " + word);

}

        
    
