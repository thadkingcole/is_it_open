// Global Variables
const yelpLimit = 5; // 5 appears to be the max requests that can be made at a time
// headers object used in yelp api ajax call
const yelpHeaders = {
  Authorization:
    "Bearer TkYGxqcV6sGmv3RJSbT79S5bzAJdB2CRgJoEWmuGvd-Z9I5FRFzJ8VoQWGIGETFof5BJUGUQsWO6LqgwLscK6sEeLrbWthDRBzdIDuE3RynssWvbTg7szQ6oWvvzXnYx",
};

// Functions
function yelpOpenStatus(businessID) {
  // construct business details from
  const businessesURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${businessID}`;

  $.ajax({
    url: businessesURL,
    headers: yelpHeaders,
    method: "GET",
    dataType: "json",
    success: function (response) {
      // return string depending on whether business is current open
      if (response.hours[0].is_open_now) {
        $("#" + businessID).append($("<p>").text("IS OPEN NOW!"));
      } else {
        $("#" + businessID).append($("<p>").text("is closed now."));
      }
    },
  });
}

function covidAPI(location) {
  var settings = {
    async: true,
    crossDomain: true,
    // covid api
    url:
      "https://covid-19-statistics.p.rapidapi.com/reports?region_province=" +
      cityName,

    // "&iso=USA&region_name=US&q=US%20North%20Carolina",
    method: "GET",
    headers: {
      "x-rapidapi-host": "covid-19-statistics.p.rapidapi.com",
      "x-rapidapi-key": "0f227271cfmsh1a5be0f784ee16ap17ae07jsndfa955b03b56",
    },
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
    console.log(response.data[0].region.cities);
    // response.data[0].deaths

    // const myArray = [{ x: 100 }, { x: 200 }, { x: 300 }];

    // myArray.forEach((element, index, array) => {
    //   console.log(element.x); // 100, 200, 300
    //   console.log(index); // 0, 1, 2
    //   console.log(array);

    //   for (var i = 0; i < myArray.length; i++){

    //     console.log(myArray[i]);
  });
}

function yelpSearch(locationStr, catsStr) {
  // construct the initial search term using yelp buesinesses/search API
  // https://www.yelp.com/developers/documentation/v3/business_search
  const businessSearchURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=${locationStr}&categories=${catsStr}&limit=${yelpLimit}`;

  $.ajax({
    url: businessSearchURL,
    headers: yelpHeaders,
    method: "GET",
    dataType: "json",
    success: function (data) {
      // Grab the results from the API JSON return
      const totalresults = data.total;
      // get lat and long of search area
      const latitude = data.region.center.latitude;
      const longitude = data.region.center.longitude;
      // If our results are greater than 0, continue
      if (totalresults > 0) {
        // Display a header on the page with the number of results
        $("#results").append(
          "<h5>We discovered " + totalresults + " results!</h5>"
        );
        // Itirate through the JSON array of 'businesses' which was returned by the API
        $.each(data.businesses, function (i, item) {
          // Store each business's object in a variable
          const id = item.id;
          const phone = item.display_phone;
          const image = item.image_url;
          const name = item.name;
          const rating = item.rating;
          const reviewcount = item.review_count;
          const address = item.location.address1;
          const city = item.location.city;
          const state = item.location.state;
          const zipcode = item.location.zip_code;
          // start other yelp API call to find open status
          yelpOpenStatus(id);

          // Append our result into our page
          $("#results").append(
            '<div id="' +
              id +
              '" class="resultsBox"><img src="' +
              image +
              '" style="width:200px;height:150px;"><br><b>' +
              name +
              "</b><br> Located at: " +
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
              " reviews.<br></div>"
          );
        });
      } else {
        // If our results are 0; no businesses were returned by the JSON therefor we display on the page no results were found
        $("#results").append("<h5>We discovered no results!</h5>");
      }
    },
  });
}

// Main
$("input.button-primary").click(function (event) {
  // clear div so that duplicates do not appear from multiple searches
  $("#results").empty();
  const searchLocation = $("#searchBox").val().trim(); // from form
  let cats = ""; // categories
  $.each($("input[type='checkbox']:checked"), function () {
    cats += $(this).val() + ","; // add each checked category
  });
  // remove extra comma at end of category string cats
  if (cats.endsWith(",")) {
    const categories = cats.substr(0, cats.length - 1);
    yelpSearch(searchLocation, categories);
  } else {
    // TODO change the alert to a modal. alerts not allowed
    alert(
      "please select at least one category\n\n" +
        "change this to a modal".toUpperCase()
    );
  }
});

// Button on click function
$(".searchBtn").on("click", function (e) {
  e.preventDefault();
  // const cityName = $("#citySearch").val();
});
