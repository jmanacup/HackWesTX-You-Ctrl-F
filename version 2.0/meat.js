const input = document.querySelector('input[type="file"]')
input.addEventListener('change',function(e){
    //console.log(input.file) 
    const reader = new FileReader()
    
    var i=0,number=0,text,j=0,k=0, l=0;
        var timedText = new Array(2);
        timedText[0] = new Array(10000);
        timedText[1] = new Array(10000);

    reader.onload=function(){
        
        const line=reader.result;

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
        
       var word ="pink"; 
       var isThere = false;
       for(l = 0; l < timedText[0].length; l++){
           if(typeof timedText[1][l] !== "undefined"){
                var str_pos = timedText[1][l].search(word);
                if(str_pos > -1){
                    console.log(timedText[0][l] + "     " + timedText[1][l]);
                    isThere = true;
                }
           }
       }
       if(!isThere)
            console.log("There is no caption for the word " + word);
    }
       
    reader.readAsText(input.files[0])
}, false)

        
        
     

