/*
  Please add all Javascript code to this file.
*/
$(function() {

  console.log('loaded');
  const $popUp = $('#popUp');
  const $closePopUpElement = $('.closePopUp');
  const $dropdownMenu = $('.container ul').eq(1).children();

  let $showTitle = $('#headerTitle');
  let $userChoice = '';
  let $popUpChoice = '';
 
  $.each($dropdownMenu, function () {
    console.log(this)
    $(this).on('click', function() {
     $userChoice =  $(this).text();
     $popUpChoice = $userChoice;
      switch($userChoice) {
        case 'Flickr' :
          $mainContainer1.empty();
          $mainContainer2.empty();
          $mainContainer3.empty();
          $showTitle.empty();
          $popUp.removeClass('hidden');
          getFlickrData();
        console.log("chosen")
        break;
        case 'The Guardian' :
          $mainContainer1.empty();
          $mainContainer2.empty();
          $mainContainer3.empty();
          $showTitle.empty();
          $popUp.removeClass('hidden');
          theguardian();
        console.log("The Guardian")
        break;
        case 'News API' :
          $mainContainer1.empty();
          $mainContainer2.empty();
          $mainContainer3.empty();
          $showTitle.empty();
          $popUp.removeClass('hidden');
          newsApi();
        console.log("News API")
        break;
        default:
          console.log('no email')
       }
       $userChoice = '';
        console.log("click me");
        console.log("you click: ", $(this).text());
    })
  })

  $closePopUpElement.on('click', function () {
    $( ".closePopUp" ).css( "display", "none" );
    $popUp.addClass('loader hidden');
  });

  function previewPopUp(article) {
   $( ".closePopUp" ).css( "display", "block" );
    $popUp.removeClass('loader hidden');
    console.log("$userChoice2: ", $popUpChoice)
   if ($popUpChoice === "Flickr") {
        $popUp.children().eq(1).children().eq(0).text(article.title);
        $popUp.children().eq(1).children().eq(1).text(article.id);
        $popUp.children().eq(1).children().eq(2).attr('href', article.url_n);
        console.log('you selected Flickr: ', article)
      } else if ($popUpChoice === "The Guardian") {
        $popUp.children().eq(1).children().eq(0).text(article.webTitle);
        $popUp.children().eq(1).children().eq(1).text(article.sectionName);
        $popUp.children().eq(1).children().eq(2).attr('href', article.webUrl);
        console.log('you selected The Guardian: ', article)
  } else if ($popUpChoice === "News API") {
        $popUp.children().eq(1).children().eq(0).text(article.title);
        $popUp.children().eq(1).children().eq(1).text(article.description);
        $popUp.children().eq(1).children().eq(2).attr('href', article.url);
        console.log('you selected News API: ', article)
      } else {
        console.log('no text')
      }
  }

// Flickr
 let $mainContainer1 = $('#flickr');
 let flickrArray2 = [];
 const flickrKey = 'ed38c447d0a465cc29d03235e6f942ee';
 function getFlickrData() {
  console.log("flickrArray2" , flickrArray2);
  $showTitle.append($userChoice);
 //const flickKey = 'ed38c447d0a465cc29d03235e6f942ee';
 if (navigator.geolocation) {
  // if it is use the getCurrentPosition method to retrieve the Window's location
  navigator.geolocation.getCurrentPosition(function (position) {
    console.log('lat: ' + position.coords.latitude);
    console.log('lon: ' + position.coords.longitude);

  // All code from here on down is new code, including the closing });
  // Now that we have the user's location, let's search the API for landscape photos nearby
  let url = 'https://api.flickr.com/services/rest/?'; // base URL
  // Object storing each key and value we need in our query.
  // This makes it clear what options we're choosing, and makes it easier
  // to change the values or add/remove options.
  let searchOptions = {
    method: 'flickr.photos.search', // endpoint
    api_key: flickrKey, // stored in js/keys.js
    tags: 'landscape',
    media: 'photos',
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    radius: 10,
    radius_units: 'km',
    format: 'json',
    nojsoncallback: 1,
    extras: 'url_n',
    content_type: 1,
    safe_search: 1,
    sort: 'relevance',
    per_page: 10,
  };
  // loop through the searchOptions object and append each key and value
  // to the url variable to build the full search URL
  for (let key in searchOptions) {
    url += '&' + key + '=' + searchOptions[key];
  }
  console.log("#2  url", url);
  // Now that we've built our URL, we can send our GET request
  $.get(url).done(function (response) {
    flickrArray2 =  response.photos.photo;
    console.log("flickrArray2", flickrArray2);
    $.each(flickrArray2, function(index) {
      let lat = searchOptions.lat;
      let lon = searchOptions.lon;
      let photo = this.url_n;
      let title = this.title;
      let owner = this.owner;
      let articleData = this;
      let $newArticle1 = $(`
      <article data-id=${index} class="article">
        <section class="featuredImage">
          <img src=${photo} alt="" />
        </section>
        <section class="articleContent">
          <a href="#" target="_blank" class="isDisabled">
            <h3>${title}</h3>
          </a>
          <h6>Latitude: ${lat} | Longitude: ${lon}</h6>
        </section>
        <section class="impressions">${owner}</section>
        <div class="clearfix"></div>
      </article>;      
    `);
    $newArticle1.on('click', function () {
      previewPopUp(articleData);
    });
    $mainContainer2.append($newArticle1);
    });
    $popUp.addClass('hidden');
    console.log('Request succeeded!'); // note that we will replace this with code to handle the data when it's received; this is just
  });
  });
  } else {
    $('#headerTitle').append('Sorry, the browser does not support geolocation');
  }

}
$popUp.removeClass('hidden');
$mainContainer1.empty();
 $userChoice =  'Flickr'
 getFlickrData();


 // The Guardian
 let $mainContainer2 = $('#guardian');
 let guardianArray = [];
const guardApiKey = 'bc6cb0c1-cb41-49a4-89d7-25d158c8bdae'
 function theguardian() {
   $showTitle.append($userChoice);
   console.log('getRedditData function');
   $.get(`https://content.guardianapis.com/search?show-elements=all&api-key=${guardApiKey}`).then((response) => {
     guardianArray = response.response.results;
     console.log(" guardian images" , guardianArray);
     $.each(guardianArray, function (index) {
      let showTitle = this.webTitle;
      let description = this.sectionName;
      let publishedAt = this.webPublicationDate;
      let fallBackImage = `./images/article_placeholder_2.jpg`;
      let articleData = this;
       let $newArticle2 = $(`
         <article data-id=${index} class="article">
           <section class="featuredImage">
             <img src="${fallBackImage}" alt="" />
           </section>
           <section class="articleContent">
             <a href="#" target="_blank" class="isDisabled">
               <h3>${showTitle}</h3>
             </a>
             <h6>${description}</h6>
           </section>
           <section class="impressions">${publishedAt}</section>
           <div class="clearfix"></div>
         </article>;      
       `);
       $newArticle2.on('click', function () {
        previewPopUp(articleData);
      });
       $mainContainer2.append($newArticle2);
     });
     $popUp.addClass('hidden');
   });
 }
 $popUp.removeClass('hidden');
 $mainContainer2.empty();
 //theguardian();

// News API
 let $mainContainer3 = $('#news-api');
 let $newsApiArray = [];
 const newsApiKey = '920337af32494de4bb7af3eb74483884';
 //https://newsapi.org/v2/top-headlines?country=ca&apiKey=920337af32494de4bb7af3eb74483884https://newsapi.org/v2/top-headlines?country=ca&apiKey=920337af32494de4bb7af3eb74483884
 function newsApi() {
   $showTitle.append($userChoice);
  // $mainContainer4.empty();
   $.get(`https://accesscontrolalloworiginall.herokuapp.com/https://newsapi.org/v2/top-headlines?country=ca&apiKey=${newsApiKey}`).then((response) => {  
   $newsApiArray =  response.articles;
     console.log(" News Api" , $newsApiArray);
     $.each($newsApiArray, function (index) {
      // let url = this.url;
       let showTitle = this.title;
       let description = this.description
       let newsPhoto = this.urlToImage;
       let publishedAt = this.publishedAt;
      let fallBackImage = `./images/article_placeholder_1.jpg`;
      let articleData = this;
       let $newArticle3 = $(`
         <article data-id=${index} class="article">
           <section class="featuredImage">
             <img src="${newsPhoto || fallBackImage}" alt="" />
           </section>
           <section class="articleContent">
             <a href="#" target="_blank" class="isDisabled">
               <h3>${showTitle}</h3>
             </a>
             <h6>${description}</h6>
           </section>
           <section class="impressions">${publishedAt}</section>
           <div class="clearfix"></div>
         </article>;      
       `);
       $newArticle3.on('click', function () {
        previewPopUp(articleData);
      });
       $mainContainer3.append($newArticle3);
     });
     $popUp.addClass('hidden');
   });
 }
 //newsApi();
 $popUp.removeClass('hidden');
 $mainContainer3.empty();
})

