let myurl =
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
    let totalresults = data.total;
    // If our results are greater than 0, continue
    if (totalresults > 0) {
      // Display a header on the page with the number of results
      $("#results").append(
        "<h5>We discovered " + totalresults + " results!</h5>"
      );
      // Itirate through the JSON array of 'businesses' which was returned by the API
      $.each(data.businesses, function (i, item) {
        // Store each business's object in a variable
        let id = item.id;
        let alias = item.alias;
        let phone = item.display_phone;
        let image = item.image_url;
        let name = item.name;
        let rating = item.rating;
        let reviewcount = item.review_count;
        let address = item.location.address1;
        let city = item.location.city;
        let state = item.location.state;
        let zipcode = item.location.zip_code;
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
