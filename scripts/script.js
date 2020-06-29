// Global Variables
const clickLimit = 0;
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
    // get state data
    const stateData = {
      name: response.data[0].region.province,
      totalActive: response.data[0].active,
      activeDiff: response.data[0].active_diff,
      totalConfirmed: response.data[0].confirmed,
      confirmedDiff: response.data[0].confirmed_diff,
      totalDeaths: response.data[0].deaths,
      deathDiff: response.data[0].deaths_diff,
      date: response.data[0].last_update,
      since: response.data[0].date,
      fatalityRate: response.data[0].fatality_rate,
    };
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
    // post covid data on page
    // first, clear out data already displayed
    $("#covidResults").empty();

    // county name
    $("#covidResults").append($("<h4>").text(`${countyData.name} County`));
    // date of last update
    $("#covidResults").append($("<p>").text(`As of ${countyData.date}`));
    // create list for county data
    const countyList = $("<ul>");
    // total cases
    countyList.append($("<li>").text(`Total Cases: ${countyData.totalCases}`));
    // new cases since last update
    countyList.append(
      $("<li>").text(
        `New Cases: ${countyData.casesDiff} since ${countyData.since}`
      )
    );
    // total deaths
    countyList.append(
      $("<li>").text(`Total Deaths: ${countyData.totalDeaths}`)
    );
    // new deaths since last update
    countyList.append(
      $("<li>").text(
        `New Deaths: ${countyData.deathDiff} since ${countyData.since}`
      )
    );
    // append list to page
    $("#covidResults").append(countyList);

    // start state data with state name
    $("#covidResults").append($("<h4>").text(stateData.name));
    // date of last update
    $("#covidResults").append($("<p>").text(`As of ${stateData.date}`));
    // create list for state data
    const stateList = $("<ul>");
    // total active cases
    stateList.append(
      $("<li>").text(`Total Active Cases: ${stateData.totalActive}`)
    );
    // new active cases since last update
    stateList.append(
      $("<li>").text(
        `New Active Cases: ${stateData.activeDiff} since ${stateData.since}`
      )
    );
    // total confirmed cases
    stateList.append(
      $("<li>").text(`Total Confirmed Cases: ${stateData.totalConfirmed}`)
    );
    // new confirmed cases since last update
    stateList.append(
      $("<li>").text(
        `New Confirmed Cases: ${stateData.confirmedDiff} since ${stateData.since}`
      )
    );
    // total deaths
    stateList.append($("<li>").text(`Total Deaths: ${stateData.totalDeaths}`));
    // new deaths since last update
    stateList.append(
      $("<li>").text(
        `New Deaths: ${stateData.deathDiff} since ${stateData.since}`
      )
    );
    // fatality rate
    stateList.append(
      $("<li>").text(`Fatality Rate: ${stateData.fatalityRate * 100}%`)
    );
    // add list to page
    $("#covidResults").append(stateList);
  });
}

function abbrToState(stateAbbr) {
  // takes 2 letter state abbreviation
  // returns full state name
  const stateAbbrs = {
    AL: "Alabama",
    AK: "Alaska",
    AZ: "Arizona",
    AR: "Arkansas",
    CA: "California",
    CO: "Colorado",
    CT: "Connecticut",
    DE: "Delaware",
    DC: "District of Columbia",
    FL: "Florida",
    GA: "Georgia",
    HI: "Hawaii",
    ID: "Idaho",
    IL: "Illinois",
    IN: "Indiana",
    IA: "Iowa",
    KS: "Kansas",
    KY: "Kentucky",
    LA: "Louisiana",
    ME: "Maine",
    MD: "Maryland",
    MA: "Massachusetts",
    MI: "Michigan",
    MN: "Minnesota",
    MS: "Mississippi",
    MO: "Missouri",
    MT: "Montana",
    NE: "Nebraska",
    NV: "Nevada",
    NH: "New Hampshire",
    NJ: "New Jersey",
    NM: "New Mexico",
    NY: "New York",
    NC: "North Carolina",
    ND: "North Dakoda",
    OH: "Ohio",
    OK: "Oklahoma",
    OR: "Oregon",
    PA: "Pennsylvania",
    RI: "Rhode Island",
    SC: "South Carolina",
    SD: "South Dakota",
    TN: "Tennessee",
    TX: "Texas",
    UT: "Utah",
    VT: "Vermont",
    VA: "Virginia",
    WA: "Washington",
    WV: "West Virginia",
    WI: "Wisconsin",
    WY: "Wyoming",
  };
  return stateAbbrs[stateAbbr];
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
      console.log(data);

      // Grab the results from the API JSON return
      const totalresults = data.total;
      // get lat and long of search area for covidAPI
      const latitude = data.region.center.latitude;
      const longitude = data.region.center.longitude;
      // get state for covidAPI
      const state = data.businesses[0].location.state;
      covidAPI(abbrToState(state), latitude, longitude);
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
          const website = item.url;
          // start other yelp API call to find open status
          yelpOpenStatus(id);

          // Append our result into our page
          $("#results").append(
            '<div id="' +
            id +
            '" class="resultsBox"><a target="_blank" href="' + website + '">' + '<img src="' +
            image +
            '" style="width:200px;height:150px;"></a><br><b>' +
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
  let modal = $('#myModal');
  console.log(modal);
  let span = $('.span');
  let cats = ""; // categories
  $.each($("input[type='checkbox']:checked"), function () {
    cats += $(this).val() + ","; // add each checked category
  });
  // remove extra comma at end of category string cats
  if (cats.endsWith(",")) {
    const categories = cats.substr(0, cats.length - 1);
    yelpSearch(searchLocation, categories);
  } else {
    // Modal to alert please enter one catogory
    $('#myModal').css("display", "block");
    $('.close').on('click', function () { $('#myModal').css("display", "none"); });
    $('#covidBanner').css('display', 'none');
    $('#resultsBanner').css('display', 'none');
    $('.right').css('display', 'none');
  }
  $('#covidBanner').css('display', 'flex');
  $('#resultsBanner').css('display', 'flex');
  $('.right').css('display', 'block');
});
