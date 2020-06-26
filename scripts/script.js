const locationName = "Raleigh"; // taken from search form
const categories = "restaurants,bars,parks";
const bars = "bars";
const restaurants = "restaurants";
const parks = "active";

// construct the initial search team 
const myurl =
  `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=${locationName}&categories=${bars + restaurants + parks}`;

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
    const totalresults = data.total;
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
