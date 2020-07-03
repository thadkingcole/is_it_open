// Global Variables
const yelpLimit = 50; // only 5 will be displayed at a time
// headers object used in yelp api ajax call
const yelpHeaders = {
  Authorization:
    "Bearer TkYGxqcV6sGmv3RJSbT79S5bzAJdB2CRgJoEWmuGvd-Z9I5FRFzJ8VoQWGIGETFof5BJUGUQsWO6LqgwLscK6sEeLrbWthDRBzdIDuE3RynssWvbTg7szQ6oWvvzXnYx",
};
const rapidAPIKey = "0f227271cfmsh1a5be0f784ee16ap17ae07jsndfa955b03b56";
const imageIndex = Math.floor(Math.random() * 7);
let imageTag = $(".bg");
imageTag.attr("src", "./assets/images/bg" + imageIndex + ".jpg");
// format for displaying dates/times
const momentFormat = "MMMM Do, YYYY, h:mm:ss a";

// Functions
function covidInt(country) {
  const settings = {
    async: true,
    crossDomain: true,
    url: `https://covid-19-data.p.rapidapi.com/country/code?format=json&code=${country}`,
    method: "GET",
    headers: {
      "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
      "x-rapidapi-key": rapidAPIKey,
    },
  };

  $.ajax(settings).done(function (response) {
    const data = response[0];
    const countryData = {
      name: data.country, // name of country
      lastChange: moment(data.lastChange).format(momentFormat), // date & time data last changed
      lastUpdate: moment(data.lastUpdate).format(momentFormat), // data & time data was updated
      confirmed: data.confirmed, // total confirmed cases
      critical: data.critical, // total critical cases
      deaths: data.deaths, // total deaths
      recovered: data.recovered, // total cases recovered
    };
    $("#covidResults").empty(); // clears out data that may already be displayed
    $("#covidResults").append($("<h4>").text(countryData.name)); // display country name
    $("#covidResults").append($("<p>").text(`As of ${countryData.lastUpdate}`));
    const countryList = $("<ul>"); // creates new unorderd list
    // add data to list items appened to unordered list
    countryList.append(
      $("<li>").text(`Total Confirmed Cases: ${data.confirmed}`)
    );
    countryList.append(
      $("<li>").text(`Total Critical Cases: ${data.critical}`)
    );
    countryList.append($("<li>").text(`Total Deaths: ${data.deaths}`));
    countryList.append($("<li>").text(`Total Recovered: ${data.recovered}`));
    // append list to page
    $("#covidResults").append(countryList);
  });
}

function covidUS(state, latitude, longitude) {
  const settings = {
    async: true,
    crossDomain: true,
    // covid api
    url: `https://covid-19-statistics.p.rapidapi.com/reports?region_province=${state}`,
    method: "GET",
    headers: {
      "x-rapidapi-host": "covid-19-statistics.p.rapidapi.com",
      "x-rapidapi-key": rapidAPIKey,
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
      date: moment(response.data[0].last_update).format(momentFormat),
      since: moment(response.data[0].date).format("MM/DD/YYYY"),
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
        countyData.date = moment(county.last_update).format(momentFormat);
        countyData.since = moment(county.date).format("MM/DD/YYYY");
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
      // first, empty the p tag with open status if already created
      $("#" + businessID + "status").empty();
      // next, create an element for the business's open status
      const openStatusEl = $("<p>").attr("id", "#" + businessID + "status");
      // and put the open status in that element
      try {
        response.hours[0];
      } catch {
        openStatusEl.text("Open status: Unknown").css("color", "yellow");
        $("#" + businessID).append(openStatusEl);
        return -1;
      }
      if (response.hours[0].is_open_now) {
        openStatusEl.text("IS OPEN NOW").css("color", "lime");
      } else {
        openStatusEl.text("IS CLOSED NOW").css("color", "coral"); // light red
      }
      // append openStatusEl to the #businessID
      $("#" + businessID).append(openStatusEl);
    },
  });
}

function showBusiness(business) {
  // Store each business's object in a variable
  const id = business.id;
  const phone = business.display_phone;
  const image = business.image_url;
  const name = business.name;
  const rating = business.rating;
  const reviewcount = business.review_count;
  const address = business.location.address1;
  const city = business.location.city;
  const state = business.location.state;
  const zipcode = business.location.zip_code;
  const website = business.url;
  // start other yelp API call to find open status
  setTimeout(yelpOpenStatus(id), 1000); // delays start of fucntion by 1 sec

  // Append our result into our page
  // create a div to hold the business information
  const businessEl = $("<div>").attr("id", id).addClass("resultsBox");
  // create img to hold business picture
  const businessPic = $("<img>")
    .attr("src", image)
    .attr("alt", "name")
    .css({ width: "200px", "border-radius": "20px" });
  // add our picture with a link to the yelp page
  businessEl.append(
    $("<a>").attr("href", website).attr("target", "_blank").append(businessPic)
  );
  // display business name (bolded)
  businessEl.append($("<div>").append($("<strong>").text(name)));
  // display business address
  businessEl.append(
    $("<address>").html(`${address}<br>${city}, ${state}, ${zipcode}`)
  );
  // display business phone number
  businessEl.append($("<div>").text(`Phone: ${phone}`));

  const yelplogo = $("<img>")
    .attr("src", "./assets/images/yelplogo.png")
    .attr("width", "70px");

  businessEl.append(
    $("<a>")
      .attr("href", "https://www.yelp.com")
      .attr("target", "_blank")
      .append(yelplogo)
  );

  //Yelp Pictures append
  if (rating === 0) {
    businessEl.append($("<img>").attr("src", "./assets/regular/regular_0.png"));
  } else if (rating === 1) {
    businessEl.append($("<img>").attr("src", "./assets/regular/regular_1.png"));
  } else if (rating === 1.5) {
    businessEl.append(
      $("<img>").attr("src", "./assets/regular/regular_1_half.png")
    );
  } else if (rating === 2) {
    businessEl.append($("<img>").attr("src", "./assets/regular/regular_2.png"));
  } else if (rating === 2.5) {
    businessEl.append(
      $("<img>").attr("src", "./assets/regular/regular_2_half.png")
    );
  } else if (rating === 3) {
    businessEl.append($("<img>").attr("src", "./assets/regular/regular_3.png"));
  } else if (rating === 3.5) {
    businessEl.append(
      $("<img>").attr("src", "./assets/regular/regular_3_half.png")
    );
  } else if (rating === 4) {
    businessEl.append($("<img>").attr("src", "./assets/regular/regular_4.png"));
  } else if (rating === 4.5) {
    businessEl.append(
      $("<img>").attr("src", "./assets/regular/regular_4_half.png")
    );
  } else if (rating === 5) {
    businessEl.append($("<img>").attr("src", "./assets/regular/regular_5.png"));
  }
  businessEl.append($("<strong>").text(`  ${reviewcount} reviews`));

  // add business El to #results ID
  $("#results").append(businessEl);
}

function yelpSearch(locationStr, catsStr, radius) {
  // construct the initial search term using yelp businesses/search API
  // https://www.yelp.com/developers/documentation/v3/business_search
  const businessSearchURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=${locationStr}&categories=${catsStr}&limit=${yelpLimit}&radius=${radius}`;

  $.ajax({
    url: businessSearchURL,
    headers: yelpHeaders,
    method: "GET",
    dataType: "json",
    success: function (data) {
      // Grab the results from the API JSON return
      const totalresults = data.total;
      // get country of search
      const country = data.businesses[0].location.country;
      if (country === "US") {
        // get lat and long of search area for covid API
        const latitude = data.region.center.latitude;
        const longitude = data.region.center.longitude;
        // get state for covid API
        const state = data.businesses[0].location.state;
        covidUS(abbrToState(state), latitude, longitude);
      } else {
        // country isn't US. do international search
        covidInt(country);
      }
      // start by remove results that may already be displayed
      $("#results").empty();
      // remove more results button if it exists
      $(".showMore").remove();
      // If our results are greater than 0, continue
      if (totalresults > 0) {
        // Display a header on the page with the number of results
        $("#results").append(
          "<h5>We discovered " + totalresults + " results!</h5>"
        );
        // Itirate through the JSON array of 'businesses' which was returned by the API.
        // start with displaying the first 5 businesses
        let businessCtr = 0;
        for (businessCtr = 0; businessCtr < 5; businessCtr++) {
          // delay start of function by 1 sec
          setTimeout(showBusiness(data.businesses[businessCtr]), 1000);
        }
        // create button for displaying more results
        const moreButton = $("<button>")
          .text("Show 5 More")
          .addClass("showMore button-primary");
        $("#results").append(moreButton);
        // add event listener to button just created
        $(".showMore").click(function () {
          // display the next 5 busniesses
          const stopValue = Math.min(businessCtr + 5, totalresults);
          for (businessCtr; businessCtr < stopValue; businessCtr++) {
            // delay start of function by 1 sec
            setTimeout(showBusiness(data.businesses[businessCtr]), 1000);
          }
          if (businessCtr < Math.min(yelpLimit, totalresults)) {
            // move button to bottom of results
            $(".results").append(moreButton);
            // clicking button will run this function again and show more results
          } else {
            // we reached the number of results returned by the API (max 50)
            // remove button
            $(".showMore").remove();
          }
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
$("input.button-primary").click(function () {
  const searchLocation = $("#searchBox").val().trim(); // from input form
  let searchRadius = $("#search-radius").val(); // from dropdown
  let cats = ""; // categories
  $.each($("input[type='checkbox']:checked"), function () {
    cats += $(this).val() + ","; // add each checked category
  });
  $("#covidBanner").fadeIn().css("display", "flex");
  $("#resultsBanner").fadeIn().css("display", "flex");
  $(".right").fadeIn().css("display", "block");
  // remove extra comma at end of category string cats
  if (cats.endsWith(",")) {
    const categories = cats.substr(0, cats.length - 1);
    // perform yelp api search for businesses meeting requested paramters
    yelpSearch(searchLocation, categories, searchRadius);
  } else {
    // Modal to alert please enter one catogory
    $("#myModal").css("display", "block");
    $(".close").on("click", function () {
      $("#myModal").css("display", "none");
    });
    $("#covidBanner").css("display", "none");
    $("#resultsBanner").css("display", "none");
    $(".right").css("display", "none");
  }
});
