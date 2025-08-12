/*
Version : 1.0
*/

jQuery(document).ready(function($){

    "use strict";
    
    /* Google Event Maps */
    
    // Add an Event Listener to Load the Map
    google.maps.event.addDomListener(window, 'load', eventInit);

    // A function to initialize the map
    function eventInit() { 
        
        var markerIco = 'images/marker.png'; // For default Skin
        //var markerIco = 'images/turquoise/marker.png'; // For Turquoise Skin
        //var markerIco = 'images/lavender/marker.png'; // For Lavender Skin

        /* Main Ceremony Map */

        var eventMapCenter1=new google.maps.LatLng(37.8069934, -122.2958658); // Create a LatLng object to center the map on a specific point

        // Set Map Properties 
		var eventMapProp1 = {
			center:eventMapCenter1,
			zoom:18, // Set zoom levels
			scrollwheel: false,
		};

		var eventMap1=new google.maps.Map(document.getElementById("wdp_event_map1"),eventMapProp1); // Create a Map Object

		// Add a Marker
		var eventMapMarker1=new google.maps.Marker({
			position:eventMapCenter1,
			icon: markerIco,
			title: 'Main Ceremony'
		});

		eventMapMarker1.setMap(eventMap1);

		var eventMapContent1 = '<h5>Main Ceremony</h5>'+'<p>10.00 am to 2.00 pm.</p>'; // Store an Infowindow content 

		// Show an InfoWindow with some text content for The Marker
		var evenMapInfo1 = new google.maps.InfoWindow({
			content: eventMapContent1,
		});

		// Open an InfoWindow when clicking on The Marker
		google.maps.event.addListener(eventMapMarker1, 'click', function() {
			evenMapInfo1.open(eventMap1,eventMapMarker1);
		});


		/* Wedding Party Map */

        var eventMapCenter2=new google.maps.LatLng(37.8074592, -122.2968658); // Create a LatLng object to center the map on a specific point

		var eventMapProp2 = { // Set Map Properties
			center:eventMapCenter2,
			zoom:18, // Set zoom levels
			scrollwheel: false,
		};

		var eventMap2=new google.maps.Map(document.getElementById("wdp_event_map2"),eventMapProp2); // Create a Map Object

		// Add a Marker
		var eventMapMarker2=new google.maps.Marker({ 
			position:eventMapCenter2,
			icon: markerIco,
			title: 'Main Ceremony'
		});

		eventMapMarker2.setMap(eventMap2);

		var eventMapContent2 = '<h5>Wedding Party</h5>'+'<p>4.00 pm to 6.00 pm.</p>'; // Store an Infowindow content 

		// Show an InfoWindow with some text content for The Marker
		var evenMapInfo2 = new google.maps.InfoWindow({ 
			content: eventMapContent2,
		});

		// Open an InfoWindow when clicking on The Marker
		google.maps.event.addListener(eventMapMarker2, 'click', function() { 
			evenMapInfo2.open(eventMap2,eventMapMarker2);
		});


		/* Wedding Dinner Map */

        var eventMapCenter3=new google.maps.LatLng(37.8065834, -122.2968698); // Create a LatLng object to center the map on a specific point

		var eventMapProp3 = { // Set Map Properties
			center:eventMapCenter3,
			zoom:18, // Set zoom levels
			scrollwheel: false,
		};

		var eventMap3=new google.maps.Map(document.getElementById("wdp_event_map3"),eventMapProp3); // Create a Map Object

		// Add a Marker
		var eventMapMarker3=new google.maps.Marker({ 
			position:eventMapCenter3,
			icon: markerIco,
			title: 'Main Ceremony'
		});

		eventMapMarker3.setMap(eventMap3);

		var eventMapContent3 = '<h5>Wedding Dinner</h5>'+'<p>9.00 pm to 11.00 pm.</p>'; // Store an Infowindow content 

		// Show an InfoWindow with some text content for The Marker
		var evenMapInfo2 = new google.maps.InfoWindow({
			content: eventMapContent3,
		});

		// Open an InfoWindow when clicking on The Marker
		google.maps.event.addListener(eventMapMarker3, 'click', function() { 
			evenMapInfo2.open(eventMap3,eventMapMarker3);
		});

    }
  
});