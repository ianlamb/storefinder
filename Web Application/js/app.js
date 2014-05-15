var storeFinder = {
	// configuration variables
	useStubData: true,
	apiBaseUrl: 'http://localhost:8080/StoreFinderWebService/api/',
	noResultsText: '-- No results --',
	mobileWidth: 768,
	animationSpeed: 300,
	
	// runtime variables/methods
	isMobile: false,
	inReviewSection: false,
	selectedCountry: '',
	selectedProvince: '',
	selectedCity: '',
	nameSearch: '',
	filteredStores: [], // results of the loadStores method
	selectedStores: [],	// a running list of "selected" stores
	
	// load a list of countries in the world
	loadCountries: function() {
		if(this.useStubData) {
			storeFinder.drawCountryList(storeFinder.getStubCountries());
		} else {
			$.ajax({
				url: this.apiBaseUrl + 'countries',
				type: 'GET',
				dataType: 'json',
				success: function(data) {
					if(data.countries) {
						storeFinder.drawCountryList(data);
					} else if(data.status == "error") {
						alert(data.message);
					} else {
						alert('Unexpected data returned from server');
					}
				},
				error: function(xhr, ajaxOptions, thrownError) {
					if(confirm("Status " + xhr.status + " returned from server. Would you like to use stub data instead?")) {
						storeFinder.useStubData = true;
						storeFinder.loadCountries();
					}
				}
			});
		}
	},
	drawCountryList: function(data) {
		if(data.countries.length > 0) {
			var newCountryList = '';
			if(storeFinder.isMobile) newCountryList += '<option></option>';
			
			for(var i = 0; i < data.countries.length; i++) {
				newCountryList += '<option value="' + data.countries[i].id + '">' + data.countries[i].name + '</option>';
			}
			
			$('#filteredStores').empty();
			$('#city').empty();
			$('#province').empty();
			$('#country').html(newCountryList);
		} else {
			alert('Sorry, we had a malfunction and couldn\'t retrieve any data for you.');
		}
	},

	// load a list of provinces based on country
	loadProvinces: function() {
		if(storeFinder.selectedCountry == storeFinder.noResultsText || storeFinder.selectedCountry == '') {
			// reload the store list but don't do anything else
			storeFinder.loadStores();
			return false;
		}
		
		if(this.useStubData) {
			storeFinder.drawProvinceList(storeFinder.getStubProvinces());
		} else {
			$.ajax({
				url: this.apiBaseUrl + 'provinces/' + storeFinder.selectedCountry,
				type: 'GET',
				dataType: 'json',
				success: function(data) {
					if(data.provinces) {
						storeFinder.drawProvinceList(data);
					} else if(data.status == "error") {
						alert(data.message);
					} else {
						alert('Unexpected data returned from server');
					}
				},
				error: function(xhr, ajaxOptions, thrownError) {
					if(confirm("Status " + xhr.status + " returned from server. Would you like to use stub data instead?")) {
						storeFinder.useStubData = true;
						storeFinder.loadCountries();
					}
				}
			});
		}
	},
	drawProvinceList: function(data) {
		if(data.provinces.length > 0) {
			var newProvinceList = '';
			if(storeFinder.isMobile) newProvinceList += '<option></option>';
			
			for(var i = 0; i < data.provinces.length; i++) {
				newProvinceList += '<option value="' + data.provinces[i].id + '">' + data.provinces[i].name + '</option>';
			}
			
			$('#city').empty();
			$('#province').html(newProvinceList);
		} else {
			$('#province').html('<option value="" class="fade">' + storeFinder.noResultsText + '</option>');
		}
			
		// reload the store list
		storeFinder.loadStores();
	},

	// load a list of cities based on province
	loadCities: function() {
		if(storeFinder.selectedProvince == storeFinder.noResultsText || storeFinder.selectedProvince == '') {
			// reload the store list but don't do anything else
			storeFinder.loadStores();
			return false;
		}
			
		if(this.useStubData) {
			storeFinder.drawCityList(storeFinder.getStubCities());
		} else {
			$.ajax({
				url: this.apiBaseUrl + 'cities/' + storeFinder.selectedProvince,
				type: 'GET',
				dataType: 'json',
				success: function(data) {
					if(data.cities) {
						storeFinder.drawCityList(data);
					} else if(data.status == "error") {
						alert(data.message);
					} else {
						alert('Unexpected data returned from server');
					}
				},
				error: function(xhr, ajaxOptions, thrownError) {
					if(confirm("Status " + xhr.status + " returned from server. Would you like to use stub data instead?")) {
						storeFinder.useStubData = true;
						storeFinder.loadCountries();
					}
				}
			});
		}
	},
	drawCityList: function(data) {
		if(data.cities.length > 0) {
			var newCityList = '';
			if(storeFinder.isMobile) newCityList += '<option></option>';
			
			for(var i = 0; i < data.cities.length; i++) {
				newCityList += '<option value="' + data.cities[i].id + '">' + data.cities[i].name + '</option>';
			}
			
			$('#city').html(newCityList);
		} else {
			$('#city').html('<option value="" class="fade">' + storeFinder.noResultsText + '</option>');
		}
			
		// reload the store list
		storeFinder.loadStores();
	},

	// load a list of stores based on city
	loadStores: function() {
		// reload selected city, province and country so we don't screw up the query params
		storeFinder.selectedCountry = $('#country').val();
		storeFinder.selectedProvince = $('#province').val();
		storeFinder.selectedCity = $('#city').val();
		storeFinder.nameSearch = $('#name').val();
	
		if(this.useStubData) {
			storeFinder.drawStoreList(storeFinder.getStubStores());
		} else {
			$.ajax({
				url: this.apiBaseUrl + 'stores',
				data: { countryid: storeFinder.selectedCountry, provinceid: storeFinder.selectedProvince, cityid: storeFinder.selectedCity },
				type: 'GET',
				dataType: 'json',
				success: function(data) {
					if(data.stores) {
						storeFinder.drawStoreList(data);
					} else if(data.status == "error") {
						alert(data.message);
					} else {
						alert('Unexpected data returned from server');
					}
				},
				error: function(xhr, ajaxOptions, thrownError) {
					if(confirm("Status " + xhr.status + " returned from server. Would you like to use stub data instead?")) {
						storeFinder.useStubData = true;
						storeFinder.loadCountries();
					}
				}
			});
		}
	},
	drawStoreList: function(data) {
		if(data.stores.length > 0) {
			storeFinder.filteredStores = data.stores;
			var newStoreList = '';
			for(var i = 0; i < storeFinder.filteredStores.length; i++) {
				newStoreList += '<li id="store-' + storeFinder.filteredStores[i].id + '">' + storeFinder.filteredStores[i].name + '</li>';
			}
			
			$('#filteredStores').html(newStoreList);
			storeFinder.searchStores();
		} else {
			$('#filteredStores').html('');
		}
	},

	// filters the stores result list by partial name match
	searchStores: function() {
		var newStoreList = '';
		for(var i = 0; i < storeFinder.filteredStores.length; i++) {
			if(storeFinder.nameSearch == '' || storeFinder.filteredStores[i].name.toUpperCase().indexOf(storeFinder.nameSearch.toUpperCase()) > -1)
				newStoreList += '<li id="store-' + storeFinder.filteredStores[i].id + '">' + storeFinder.filteredStores[i].name + '</li>';
		}
		$('#filteredStores').html(newStoreList);
	},
	// adds a store to the "Selected Stores" section
	selectStore: function(storeId) {
		storeId += "";
		var store;
		for(var i = 0; i < storeFinder.filteredStores.length; i++) {
			if(storeFinder.filteredStores[i].id == storeId) {
				store = storeFinder.filteredStores[i];
				if(!findById(storeFinder.selectedStores, storeId)) {
					storeFinder.selectedStores.push(store);
					$('#selectedStores').append('<li id="selected-' + store.id + '">' + store.name + '<i class="fa fa-times deselect-store"></i></li>');
					$('#continue').removeAttr('disabled');
				}
			}
		}
	},
	// removes a specified store from the "Selected Stores" section
	deselectStore: function(storeId) {
		storeId += "";
		var store;
		for(var i = 0; i < storeFinder.selectedStores.length; i++) {
			if(storeFinder.selectedStores[i].id == storeId) {
				// remove the store from our in-memory list
				storeFinder.selectedStores = $.grep(storeFinder.selectedStores,
                   function(o,i) { return o.id == storeId; },
                   true);
				
				// remove the store from the DOM
				$('#selected-' + storeId).remove();
				
				// if no stores selected, disable continue button
				if(storeFinder.selectedStores.length == 0)
					$('#continue').attr('disabled','disabled');
					
				break;
			}
		}
	},
	// displays the list of selected stores
	goToReviewStores: function() {
		var newStoreRows = '';
		for(var i = 0; i < this.selectedStores.length; i++) {
			newStoreRows += '<tr>' +
							'<td>' + this.selectedStores[i].id + '</td>' +
							'<td>' + this.selectedStores[i].name + '</td>' +
							'<td>' + this.selectedStores[i].country + '</td>' +
							'<td>' + this.selectedStores[i].province + '</td>' +
							'<td>' + this.selectedStores[i].city + '</td>' +
							'</tr>';
		}
		$('#reviewSelectedStores tbody').append(newStoreRows);
		
		$('#storeFinder').animate({
			left: "-=" + parseInt($('#reviewStores').css('left')) // -= to move everything left
		}, storeFinder.animationSpeed, function() {	
			$('#storeFinder').hide();
			$('#reviewStores').show();
			$('#reviewStores').animate({
				left: "-=" + parseInt($('#reviewStores').css('left')) // -= to move everything left
			}, storeFinder.animationSpeed, function() {	});
		});
		
		this.inReviewSection = true;
	},
	// returns to the store finder
	goToStoreFinder: function() {
		$('#reviewStores').animate({
			left: "-=" + parseInt($('#storeFinder').css('left')) // this will return a negative so we'll keep the -= to move everything right this time
		}, storeFinder.animationSpeed, function() {	
			$('#reviewSelectedStores tbody').empty();
			$('#reviewStores').hide();
			$('#storeFinder').show();
			$('#storeFinder').animate({
				left: "-=" + parseInt($('#storeFinder').css('left')) // this will return a negative so we'll keep the -= to move everything right this time
			}, storeFinder.animationSpeed, function() {	});
		});
		
		this.inReviewSection = false;
	},
	// determine mobile or desktop size and adjust the interface accordingly
	sizeForMobile: function() {
		
		if($(window).width() < storeFinder.mobileWidth) {
			// mobile mode
			if(!storeFinder.isMobile) {
				storeFinder.isMobile = true;
				storeFinder.loadCountries();
				$('.combobox').attr('size', '1').attr('style','height:auto');
				$('#continue').addClass('expand');
			}
			
			if(!storeFinder.inReviewSection)
				$('#reviewStores').css('left', ($(window).width() + 100) + 'px');
			else
				$('#storeFinder').css('left', (($(window).width() + 100) * -1) + 'px');
		} else {
			// desktop mode
			if(storeFinder.isMobile) {
				storeFinder.isMobile = false;
				storeFinder.loadCountries();
				$('.combobox').attr('size', '10').removeAttr('style');
				$('#continue').removeClass('expand');
			}
			
			if(!storeFinder.inReviewSection)
				$('#reviewStores').css('left', ($(window).width() - 450) + 'px');
			else
				$('#storeFinder').css('left', (($(window).width() - 450) * -1) + 'px');
		}
	},

	// stub data for testing the UI without a working API/backend
	stubData: {
		countries: [
			{ "id": "1", "name": "Canada" },
			{ "id": "2", "name": "United States" }
		
		],
		provinces: [
			{ "id": "1", "country_id": "1", "name": "Ontario" },
			{ "id": "2", "country_id": "2", "name": "California" }
		],
		cities: [
			{ "id": "1", "province_id": "1", "name": "London" },
			{ "id": "2", "province_id": "1", "name": "Toronto" },
			{ "id": "3", "province_id": "2", "name": "San Francisco" }
		],
		stores: [
			{ "id": "1", "city_id": "1", "province_id": "1", "country_id": "1", "city": "London", "province": "Ontario", "country": "Canada", "name": "Orange Square" },
			{ "id": "2", "city_id": "1", "province_id": "1", "country_id": "1", "city": "London", "province": "Ontario", "country": "Canada", "name": "Blue Square" },
			{ "id": "3", "city_id": "1", "province_id": "1", "country_id": "1", "city": "London", "province": "Ontario", "country": "Canada", "name": "Red Circle" },
			{ "id": "4", "city_id": "2", "province_id": "1", "country_id": "1", "city": "Toronto", "province": "Ontario", "country": "Canada", "name": "Yellow Triangle" },
			{ "id": "5", "city_id": "2", "province_id": "1", "country_id": "1", "city": "Toronto", "province": "Ontario", "country": "Canada", "name": "Black Square" },
			{ "id": "6", "city_id": "3", "province_id": "2", "country_id": "2", "city": "San Francisco", "province": "California", "country": "United States", "name": "Blue Triangle" },
			{ "id": "7", "city_id": "3", "province_id": "2", "country_id": "2", "city": "San Francisco", "province": "California", "country": "United States", "name": "Orange Circle" }
		]
	},
	getStubCountries: function() {
		return { countries: storeFinder.stubData.countries };
	},
	getStubProvinces: function() {
		var provinces = $.grep(storeFinder.stubData.provinces,
           function(o,i) { return o.country_id == storeFinder.selectedCountry; },
           false);
		return { provinces: provinces };
	},
	getStubCities: function() {
		var cities = $.grep(storeFinder.stubData.cities,
           function(o,i) { return o.province_id == storeFinder.selectedProvince; },
           false);
		return { cities: cities };
	},
	getStubStores: function() {
		var stores = $.grep(storeFinder.stubData.stores,
           function(o,i) { return o.country_id == storeFinder.selectedCountry 
           				&& (storeFinder.selectedProvince == '' || storeFinder.selectedProvince == null || storeFinder.selectedProvince == o.province_id)
           				&& (storeFinder.selectedCity == '' || storeFinder.selectedCity == null || storeFinder.selectedCity == o.city_id); },
           false);
		return { stores: stores };
	}
}


$(function() {	
	// load the countries list to get started
	storeFinder.loadCountries();
	
	// register event delegates
	$('#searchContainer').on('change', '#country', function() {
		storeFinder.selectedCountry = $(this).val();
		storeFinder.loadProvinces();
	}).on('change', '#province', function() {
		storeFinder.selectedProvince = $(this).val();
		storeFinder.loadCities();
	}).on('change', '#city', function() {
		storeFinder.selectedCity = $(this).val();
		storeFinder.loadStores();
	}).on('keyup', '#name', function() {
		storeFinder.nameSearch = $(this).val();
		storeFinder.searchStores();
	});
	
	$('#resultsContainer').on('click', '#filteredStores > li', function() {
		var storeId = $(this).attr('id').split('-')[1];
		storeFinder.selectStore(storeId);
	}).on('click', '#selectedStores > li .deselect-store', function() {
		var storeId = $(this).parent().attr('id').split('-')[1];
		storeFinder.deselectStore(storeId);
	});
	
	$('#continue').on('click', function() {
		storeFinder.goToReviewStores();
	});
	
	$('#back').on('click', function() {
		storeFinder.goToStoreFinder();
	});
	
	$(window).on('resize', function() {
		storeFinder.sizeForMobile();
	});
});

function findById(source, id) {
	for (var i = 0; i < source.length; i++) {
		if (source[i].id === id) {
			return source[i];
		}
	}
	return false;
}