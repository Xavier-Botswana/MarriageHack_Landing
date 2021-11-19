var locations = [
    ['Reib Office Tel: +267 393 0152', -24.63309435601011, 25.950484378083548, 15],
];

var map = new google.maps.Map(document.getElementById('map'), {
zoom: 10,
center: new google.maps.LatLng(-24.666664, 25.896029),
mapTypeId: google.maps.MapTypeId.ROADMAP
});

var infowindow = new google.maps.InfoWindow();

var marker, i;

for (i = 0; i < locations.length; i++) {  
marker = new google.maps.Marker({
    icon:"img/marker.png",
position: new google.maps.LatLng(locations[i][1], locations[i][2]),
map: map
});

google.maps.event.addListener(marker, 'click', (function(marker, i) {
return function() {
  infowindow.setContent(locations[i][0]);
  infowindow.open(map, marker);
}
})(marker, i));
}