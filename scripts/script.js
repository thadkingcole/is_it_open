const locationName = "raleigh"; // taken from search form
const categories = "restaurants,bars,parks";
// headers object used in yelp api ajax call
const yelpHeaders = {
  Authorization:
    "Bearer TkYGxqcV6sGmv3RJSbT79S5bzAJdB2CRgJoEWmuGvd-Z9I5FRFzJ8VoQWGIGETFof5BJUGUQsWO6LqgwLscK6sEeLrbWthDRBzdIDuE3RynssWvbTg7szQ6oWvvzXnYx",
};

function yelpOpenStatus(businessID) {
  const businessesURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${businessID}`;

  $.ajax({
    url: businessesURL,
    headers: yelpHeaders,
    method: "GET",
    dataType: "json",
    success: function (data) {
      console.log(data);
      const openStatus = data.hours[0].is_open_now
    },
  });
}

function yelpSearch(locationStr, catsStr) {
  // construct the initial search term using yelp buesinesses/search API
  // https://www.yelp.com/developers/documentation/v3/business_search
  const businessSearchURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=${locationStr}&categories=${catsStr}`;

  $.ajax({
    url: businessSearchURL,
    headers: yelpHeaders,
    method: "GET",
    dataType: "json",
    success: function (data) {
      console.log(data);
      // Grab the results from the API JSON return
      const totalresults = data.total;
      // get lat and long of search area
      const latitude = data.region.center.latitude;
      const longitude = data.region.center.longitude;

      yelpOpenStatus(data.businesses[0].id);
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
          const alias = item.alias;
          const phone = item.display_phone;
          const image = item.image_url;
          const name = item.name;
          const rating = item.rating;
          const reviewcount = item.review_count;
          const address = item.location.address1;
          const city = item.location.city;
          const state = item.location.state;
          const zipcode = item.location.zip_code;
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
}

yelpSearch(locationName, categories);
