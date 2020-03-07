//alert('Big OwO!')
chrome.runtime.onMessage.addListener(function(request){
    alert(request)
 })