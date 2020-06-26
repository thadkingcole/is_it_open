// yelp API
var myurl =
  "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=by-chloe&location=boston";

$.ajax({
  url: myurl,
  headers: {
    Authorization:
      "Bearer TkYGxqcV6sGmv3RJSbT79S5bzAJdB2CRgJoEWmuGvd-Z9I5FRFzJ8VoQWGIGETFof5BJUGUQsWO6LqgwLscK6sEeLrbWthDRBzdIDuE3RynssWvbTg7szQ6oWvvzXnYx",
  },
  method: "GET",
  dataType: "json",
  success: function (data) {
    console.log(data);
    // Grab the results from the API JSON return
    var totalresults = data.total;
    // If our results are greater than 0, continue
    if (totalresults > 0) {
      // Display a header on the page with the number of results
      $("#results").append(
        "<h5>We discovered " + totalresults + " results!</h5>"
      );
      // Itirate through the JSON array of 'businesses' which was returned by the API
      $.each(data.businesses, function (i, item) {
        // Store each business's object in a variable
        var id = item.id;
        var alias = item.alias;
        var phone = item.display_phone;
        var image = item.image_url;
        var name = item.name;
        var rating = item.rating;
        var reviewcount = item.review_count;
        var address = item.location.address1;
        var city = item.location.city;
        var state = item.location.state;
        var zipcode = item.location.zip_code;
        // Append our result into our page
        $("#results").append(
          '<div id="' +
          id +
          '" style="margin-top:50px;margin-bottom:50px;"><img src="' +
          image +
          '" style="width:200px;height:150px;"><br>We found <b>' +
          name +
          "</b> (" +
          alias +
          ")<br>Business ID: " +
          id +
          "<br> Located at: " +
          address +
          " " +
          city +
          ", " +
          state +
          " " +
          zipcode +
          "<br>The phone number for this business is: " +
          phone +
          "<br>This business has a rating of " +
          rating +
          " with " +
          reviewcount +
          " reviews.</div>"
        );
      });
    } else {
      // If our results are 0; no businesses were returned by the JSON therefor we display on the page no results were found
      $("#results").append("<h5>We discovered no results!</h5>");
    }
  },
});

// Button on click function 
$('.searchBtn').on('click', function (e) {
  e.preventDefault()
  const cityName = $('#citySearch').val();
  const

  var settings = {
    async: true,
    crossDomain: true,
    // covid api
    url:
      "https://covid-19-statistics.p.rapidapi.com/reports?region_province=" + cityName,

    // "&iso=USA&region_name=US&q=US%20North%20Carolina",
    method: "GET",
    headers: {
      "x-rapidapi-host": "covid-19-statistics.p.rapidapi.com",
      "x-rapidapi-key": "0f227271cfmsh1a5be0f784ee16ap17ae07jsndfa955b03b56",

    },
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
    console.log(response.data[0].region.cities)
    // response.data[0].deaths

    // const myArray = [{ x: 100 }, { x: 200 }, { x: 300 }];

    // myArray.forEach((element, index, array) => {
    //   console.log(element.x); // 100, 200, 300
    //   console.log(index); // 0, 1, 2
    //   console.log(array);

    //   for (var i = 0; i < myArray.length; i++){

    //     console.log(myArray[i]);
  });


});


