
    document.querySelector('button').addEventListener('click', onclick, false)
        function onclick (){
            chrome.tabs.query({currentWindow: true, active: true},
                function(tabs){
                    chrome.tabs.sendMessage(tabs[0].id,'hii')
                    var url = tabs[0].url;
                    chrome.tabs.sendMessage(tabs[0].id, url)
            });
        }   
  
        
    
