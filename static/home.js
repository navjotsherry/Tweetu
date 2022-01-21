function handleTweetFormError(msg,display){
    var tweetCreateErrorHandler = document.getElementById("tweet-form-create-handle-error")
    if(display===true){
        tweetCreateErrorHandler.innerText= msg
        tweetCreateErrorHandler.setAttribute("class","alert alert-danger")
    }
    else{
        tweetCreateErrorHandler.setAttribute("class","d-none alert alert-danger")
    }
}

function handleTweetCreateFormSubmit(event) {
    event.preventDefault();
    const myForm = event.target;
    const myFormData = new FormData(myForm);
    const url = myForm.getAttribute("action");
    const method = myForm.getAttribute("method");
    const xhr = new XMLHttpRequest();
    const responseType = 'json';
    xhr.responseType = responseType;
    xhr.open(method, url);
    xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.onload = function () {
        if (xhr.status === 201) {
            const newTweet = xhr.response;
            const newTweetElement = formatTweetElement(newTweet);
            const ogHtml = tweetsContainerElement.innerHTML;
            tweetsContainerElement.innerHTML = newTweetElement + ogHtml;
            myForm.reset();
            handleTweetFormError('',false)
        } else if (xhr.status === 400) {
            const errorJson = xhr.response;
            const contentError = errorJson.content
            let contentErrorMsg;
            if (contentError){
                contentErrorMsg= contentError[0]
                handleTweetFormError(contentErrorMsg,true)
            }
            
        } else if(xhr.status===500){
            alert("There was a server error.")
        }else if(xhr.status===401){
            alert("You Must Login..")
            window.location.href= '/login'
        }

    };
    xhr.onerror = function () {
        alert("An Error occured");
    };
    xhr.send(myFormData);


}
const TweetCreateFormEl = document.getElementById('tweet-create-form');
TweetCreateFormEl.addEventListener('submit', handleTweetCreateFormSubmit);
const tweetsContainerElement = document.getElementById("tweets");
function loadTweets(tweetsElements) {
    const xhr = new XMLHttpRequest();
    const method = 'GET';
    const url = '/tweets';
    const responseType = 'json';
    xhr.responseType = responseType;
    xhr.open(method, url);
    xhr.onload = function () {
        const serverResponse = xhr.response;
        var listedItems = serverResponse;
        var finalTweetStr = "";
        for (var i = 0; i < listedItems.length; i++) {
            var currentItem = formatTweetElement(listedItems[i]);
            finalTweetStr += currentItem;
        }
        tweetsElements.innerHTML = finalTweetStr;
    };
    xhr.send();

}
loadTweets(tweetsContainerElement);
function handleDidLike(tweet_id, currentCount) {
    console.log(tweet_id, currentCount);
}
function LikeBtn(tweet) {
    return "<button class='btn btn-primary' onclick=handleDidLike(" + tweet.id + "," + tweet.likes + ")>" + tweet.likes + " Likes</button>";
}
function formatTweetElement(tweet) {
    var formattedTweet = "<div class=' col-12 col-md-10 mx-auto rounded py-3 border py-3 mb-4 tweet' id='tweet-" + tweet.id + "'>" + "<p>" + tweet.content +
        "</p><div class='btn-group'>" +
        LikeBtn(tweet) +
        "</div></div>";
    return formattedTweet;
}