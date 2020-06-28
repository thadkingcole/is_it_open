// Global Variables
const yelpLimit = 5; // 5 appears to be the max requests that can be made at a time
// headers object used in yelp api ajax call
const yelpHeaders = {
  Authorization:
    "Bearer TkYGxqcV6sGmv3RJSbT79S5bzAJdB2CRgJoEWmuGvd-Z9I5FRFzJ8VoQWGIGETFof5BJUGUQsWO6LqgwLscK6sEeLrbWthDRBzdIDuE3RynssWvbTg7szQ6oWvvzXnYx",
};

// Functions
function yelpOpenStatus(businessID) {
  // construct business details from yelp businesses/{id} API
  // https://www.yelp.com/developers/documentation/v3/business
  const businessesURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${businessID}`;

  $.ajax({
    url: businessesURL,
    headers: yelpHeaders,
    method: "GET",
    dataType: "json",
    success: function (response) {
      console.log("yelp business", response);
      // return string depending on whether business is current open
      if (response.hours[0].is_open_now) {
        $("#" + businessID).append($("<p>").text("IS OPEN NOW!"));
      } else {
        $("#" + businessID).append($("<p>").text("is closed now."));
      }
    },
  });
}

function covidAPI(state, latitude, longitude) {
  const settings = {
    async: true,
    crossDomain: true,
    // covid api
    url: `https://covid-19-statistics.p.rapidapi.com/reports?region_province=${state}`,
    method: "GET",
    headers: {
      "x-rapidapi-host": "covid-19-statistics.p.rapidapi.com",
      "x-rapidapi-key": "0f227271cfmsh1a5be0f784ee16ap17ae07jsndfa955b03b56",
    },
  };

  $.ajax(settings).done(function (response) {
    console.log("covid", response);
    // array of county data
    const counties = response.data[0].region.cities;
    // number to compare distance from each county center
    // start at infinity so that first county compared will be chosen to start future comparisons
    let latLongDiff = Infinity;
    // create object to save results of closest county
    const countyData = {
      name: "",
      totalCases: 0,
      casesDiff: 0,
      totalDeaths: 0,
      deathDiff: 0,
      date: "last update",
      since: "today",
    };
    // cycle through each county to find the county closest to the location the user searched yelp
    counties.forEach((county) => {
      // get coordinates for each county
      const latDiff = county.lat - latitude;
      const longDiff = county.long - longitude;
      // compare coordinate difference to the current closest county
      // recall dist_between_points = sqrt(x^2 + y^2)
      if (Math.sqrt(latDiff ** 2 + longDiff ** 2) < latLongDiff) {
        // update comparison value with new diff
        latLongDiff = Math.sqrt(latDiff ** 2 + longDiff ** 2);
        // update data to be posted later
        countyData.name = county.name;
        countyData.totalCases = county.confirmed;
        countyData.casesDiff = county.confirmed_diff;
        countyData.totalDeaths = county.deaths;
        countyData.deathDiff = county.deaths_diff;
        countyData.date = county.last_update;
        countyData.since = county.date;
      }
    });
    console.log(countyData, latLongDiff);
    // post covid data for county on page
    // county name
    $("#covidResults").append($("<h4>").text(`${countyData.name} County`));
    // date of last update
    $("#covidResults").append($("<p>").text(`As of ${countyData.date}`));
    // create list for data
    const covidListEl = $("<ul>");
    // total cases
    covidListEl.append($("<li>").text(`Total Cases: ${countyData.totalCases}`));
    // new cases since last update
    covidListEl.append(
      $("<li>").text(
        `New Cases: ${countyData.casesDiff} since ${countyData.since}`
      )
    );
    // total deaths
    covidListEl.append(
      $("<li>").text(`Total Deaths: ${countyData.totalDeaths}`)
    );
    // new deaths since last update
    covidListEl.append(
      $("<li>").text(
        `New Deaths: ${countyData.deathDiff} since ${countyData.since}`
      )
    );
    // append list to page
    $("#covidResults").append(covidListEl);
  });
}

function yelpSearch(locationStr, catsStr) {
  // construct the initial search term using yelp businesses/search API
  // https://www.yelp.com/developers/documentation/v3/business_search
  const businessSearchURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=${locationStr}&categories=${catsStr}&limit=${yelpLimit}`;

  $.ajax({
    url: businessSearchURL,
    headers: yelpHeaders,
    method: "GET",
    dataType: "json",
    success: function (data) {
      console.log("yelp initial", data);
      // Grab the results from the API JSON return
      const totalresults = data.total;
      // get lat and long of search area
      const latitude = data.region.center.latitude;
      const longitude = data.region.center.longitude;
      //
      covidAPI("north carolina", latitude, longitude);
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
// search button event listener
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
