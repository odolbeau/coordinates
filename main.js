google.maps.event.addDomListener(window, 'load', function () {
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 6,
        center: new google.maps.LatLng(48.8788866, 2.331609599999979),
    });

    polygon = new google.maps.Polygon({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#FF0000',
        fillOpacity: 0.35
    });
    polygon.setMap(map);

    // Add a listener for the click event
    google.maps.event.addListener(map, 'click', function(event) {
        path = polygon.getPath();
        path.push(event.latLng);
    });

    // Display coordinates when clicking on the polygon
    google.maps.event.addListener(polygon, 'click', function(event) {
        var content = '<h1>Coordinates of the area</h1><p>';
        polygon.getPaths().forEach(function(arr) {
            arr.forEach(function(latLng, index) {
                content = content.concat(latLng.toString());
                if (index != arr.length - 1) {
                    content = content.concat(';');
                }
            })
        });

        content = content.concat('</p>');

        new google.maps.InfoWindow({
            content: content,
            position: event.latLng
        }).open(map);
    });


    // Adds buttons
    undoButton = getButton('Undo');
    google.maps.event.addDomListener(undoButton, 'click', function() {
        polygon.getPath().pop();
    });
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(undoButton);

    clearButton = getButton('Clear all');
    google.maps.event.addDomListener(clearButton, 'click', function() {
        polygon.getPath().clear();
    });
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(clearButton);

    // Search box
    input = document.getElementById('pac-input');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    markers = [];

    searchBox = new google.maps.places.SearchBox((input));

    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }
        for (var i = 0, marker; marker = markers[i]; i++) {
            marker.setMap(null);
        }

        // For each place, get the icon, place name, and location.
        markers = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
            markers.push(new google.maps.Marker({
                map: map,
                title: place.name,
                position: place.geometry.location
            }));

            bounds.extend(place.geometry.location);
        }

        map.fitBounds(bounds);
    });

    google.maps.event.addListener(map, 'bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });
});

function getButton(text)
{
    var button = document.createElement('div');
    button.index = 1;
    // Set CSS for the control border
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = text;
    button.appendChild(controlUI);

    // Set CSS for the control interior
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = text;
    controlUI.appendChild(controlText);

    return button;
}

