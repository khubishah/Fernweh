/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken = 'pk.eyJ1Ijoia2h1YmlzaGFoIiwiYSI6ImNrZG0xbHJlcjB2Nncycmw1Ynk3cmZraDAifQ.6Np2dop1manqF296_QbU-A';
var map = new mapboxgl.Map({
    container: 'map', // element iwth id map
    style: 'mapbox://styles/khubishah/ckdm1pl2a0l2w1imw6u5gf7pf',
    center: [-118.11, 34.11],
    zoom: 4,
    scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
    // create marker
    const el = document.createElement('div');
    el.className = 'marker';
    // add the marker
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
    }).setLngLat(loc.coordinates).addTo(map);

    // add popup
    new mapboxgl.Popup({
        offset: 30,
    })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map);
    // extend map bounds to include the current location
    bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100,
    }
});