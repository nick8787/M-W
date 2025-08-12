/*
Version : 1.0
*/

jQuery(document).ready(function($){

    "use strict";
    
    /* Google All Event Maps with markers */
    
    // Add an Event Listener to Load the Map
    google.maps.event.addDomListener(window, 'load', alleventInit);

    // A function to initialize the map
    function alleventInit() { 
        
        var markerIco = 'images/marker.png'; // For default Skin
        //var markerIco = 'images/turquoise/marker.png'; // For Turquoise Skin
        //var markerIco = 'images/lavender/marker.png'; // For Lavender Skin

        /* All Event Map */

        // Set Map Properties
		var alleventCenter = {
            zoom: 18, // Set zoom levels
            center: new google.maps.LatLng(37.8074592, -122.2968658), // Create a LatLng object to center the map on a specific point
            scrollwheel: false, 
            //zoomControl: true,
            };

        var alleventElement = document.getElementById('wdp_all_event_map');

        var alleventMap = new google.maps.Map(alleventElement, alleventCenter);


        /* Main Ceremony Map Marker */

        // Add a Marker
        var marker1 = new google.maps.Marker({
            position: new google.maps.LatLng(37.8069934, -122.2958658), 
            map: alleventMap,
            //title: 'Main Ceremony',
            icon: markerIco
        });

        var markerContent1 = '<h5>Main Ceremony</h5>'+'<p>10.00 am to 2.00 pm.</p>'; // Store an Infowindow content 

        // Show an InfoWindow with some text content for The Marker
        var markerInfo1 = new google.maps.InfoWindow({ 
            content: markerContent1,
        });

        markerInfo1.open(alleventElement,marker1); // Open an InfoWindow when DOM is fully loaded

        // Open an InfoWindow when clicking on The Marker
        google.maps.event.addListener(marker1, 'click', function() {
            markerInfo1.open(alleventElement,marker1);
        });


        /* Wedding Party Map Marker */

        // Add a Marker
        var marker2 = new google.maps.Marker({
            position: new google.maps.LatLng(37.8074592, -122.2968658),
            map: alleventMap,
            //title: 'Wedding Party',
            icon: markerIco
        });

        var markerContent2 = '<h5>Wedding Party</h5>'+'<p>4.00 pm to 6.00 pm.</p>'; // Store an Infowindow content 

        // Show an InfoWindow with some text content for The Marker
        var markerInfo2 = new google.maps.InfoWindow({
            content: markerContent2,
        });

        markerInfo2.open(alleventElement,marker2); // Open an InfoWindow when DOM is fully loaded

        // Open an InfoWindow when clicking on The Marker
        google.maps.event.addListener(marker2, 'click', function() {
            markerInfo2.open(alleventElement,marker2);
        });


        /* Wedding Dinner Map Marker */

        // Add a Marker
        var marker3 = new google.maps.Marker({
            position: new google.maps.LatLng(37.8065834, -122.2968698),
            map: alleventMap,
            //title: 'Wedding Dinner',
            icon: markerIco
        });

        var markerContent3 = '<h5>Wedding Dinner</h5>'+'<p>9.00 pm to 11.00 pm.</p>'; // Store an Infowindow content 

        // Show an InfoWindow with some text content for The Marker
        var markerInfo3 = new google.maps.InfoWindow({
            content: markerContent3,
        });

        markerInfo3.open(alleventElement,marker3); // Open an InfoWindow when DOM is fully loaded

        // Open an InfoWindow when clicking on The Marker
        google.maps.event.addListener(marker3, 'click', function() {
            markerInfo3.open(alleventElement,marker3);
        });
   }  
});