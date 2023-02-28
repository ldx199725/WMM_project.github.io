const data_url =
  "https://api.mapbox.com/datasets/v1/lion517/cleo7nsu90fyt2ilpy80siuez/features?access_token=pk.eyJ1IjoibGlvbjUxNyIsImEiOiJjbGNwY2N6NzcyNm13M29wNmpoYnNoc2g3In0.VGwfvrUNFWUlEbeSXXw48A";

map.on("load", () => {
  map.addLayer({
    id: "earthquake222",
    type: "circle",
    source: {
      type: "geojson",
      data:
        "https://raw.githubusercontent.com/ldx199725/wmm/main/Japan_earthquake111.geojson?token=GHSAT0AAAAAAB5ID4XAWSD3CFPSLWUASU5UY76B66Q"
    },
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["number", ["get", "mag"]],
        4,
        5,
        6,
        7
      ],
      "circle-color": [
        "interpolate",
        ["linear"],
        ["number", ["get", "mag"]],
        0,
        "LightSkyBlue",
        1,
        "GreenYellow",
        2,
        "DeepPink",
        3,
        "OrangeRed"
      ],
      "circle-opacity": 0.2
    }
  });
});

map.on("click", (event) => {
  // If the user clicked on one of your markers, get its information.
  const features = map.queryRenderedFeatures(event.point, {
    layers: ["Decimal-Japan"] // replace with your layer name
  });
  if (!features.length) {
    return;
  }
  const feature = features[0];
  //Fly to the point when clicked
  map.flyTo({
    center: feature.geometry.coordinates, //keep this
    zoom: 15 //change fly to zoom level
  });

  const style_4 = "mapbox://styles/lion517/cleo1u8yd000o01qk4vwbyd4o";
  const style_5 = "mapbox://styles/lion517/cleo1up8m00c101pvcil7451y";
  const style_6 = "mapbox://styles/lion517/cleo1uvjh007i01o9snib40pq";
  const style_7 = "mapbox://styles/lion517/cleo1urq0002801mruyswzy1b";

  const years = ["2019", "2020", "2021"];

  function filterBy(year) {
    const filters = ["==", "year", year];
    map.setFilter("earthquake-circles", filters);

    document.getElementById("year").textContent = years[year];
  }

  map.on("load", () => {
    d3.json(
      "https://raw.githubusercontent.com/ldx199725/wmm/main/Japan_earthquake111.geojson?token=GHSAT0AAAAAAB5ID4XAWSD3CFPSLWUASU5UY76B66Q",
      jsonCallback
    );
  });

  function jsonCallback(err, data) {
    if (err) {
      throw err;
    }

    data.features = data.features.map((d) => {
      d.properties.year = new Date(d.properties.time).getFullYear();
      return d;
    });

    map.addSource("earthquakes", {
      type: "geojson",
      data: data
    });

    map.addLayer({
      id: "earthquake-circles",
      type: "circle",
      source: "earthquakes",
      paint: {
        "circle-color": [
          "interpolate",
          ["linear"],
          ["get", "mag"],
          6,
          "#FCA107",
          8,
          "#7F3121"
        ],
        "circle-opacity": 0.75,
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["get", "mag"],
          6,
          20,
          8,
          40
        ]
      }
    });

    map.addLayer({
      id: "earthquake-labels",
      type: "symbol",
      source: "earthquakes",
      layout: {
        "text-field": ["concat", ["to-string", ["get", "mag"]], "m"],
        "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
        "text-size": 13
      },
      paint: {
        "text-color": "rgba(0,0,0,0.5)"
      }
    });

    // Set filter to first year
    // 0 = 2019
    filterBy(0);

    document.getElementById("slider").addEventListener("input", (e) => {
      const year = parseInt(e.target.value, 10);
      filterBy(year);
    });
  }

  const popup = new mapboxgl.Popup({ offset: [0, -50], className: "popup123" })
    .setLngLat(feature.geometry.coordinates) //Set the loctaion of the pop up to the marker's long and lat using
    .setHTML(
      //Create some html with a heading h3, and two paragraphs p to display some properties of the marker.
      `<h3>${feature.properties.place}</h3> 
  <p>mag${feature.properties.mag}</p>
  `
    ) //${feature.properties.xxx} is used to refer to a certain property in the data.
    .addTo(map); //Add this pop up to the map.
});

map.on("mouseenter", "earthquake", (e) => {
  map.getCanvas().style.cursor = "default";
});

map.on("mouseleave", "earthquake", () => {
  map.getCanvas().style.cursor = "";
});

const scale = new mapboxgl.ScaleControl({
  maxWidth: 100,
  unit: "Kilometre"
});
map.addControl(scale);

const geocoder = new MapboxGeocoder({
  // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: "Search for locations in Japan", // Placeholder text for the search bar
  proximity: {
    longitude: 35.69,
    latitude: 139.69
  } // Coordinates of Tokyo center
});

map.addControl(geocoder, "top-right");

map.addControl(new mapboxgl.NavigationControl(), "top-right");

map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
  }),
  "top-right"
);