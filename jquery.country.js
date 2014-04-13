(function ($) {

    $.countrify = function (countryElement, stateElement, cityElement, options) {

        var settings = $.extend({
            inputTextClass: ''
        }, options);

        initialize = function () {
			validate();
			
            countryElement.change(onCountryChange);

            stateElement.change(onStateChange);

            $.getJSON('data/countries.json', function (countries) {
                countryElement.append('<option>Selecione</option>');

                for (var i = 0; i < countries.length; i++) {
                    countryElement.append('<option>' + countries[i] + '</option>');
                }
            });

            stateElement.attr('disabled', 'disabled');

            cityElement.attr('disabled', 'disabled');

            setupLoading();
        };

        validate = function () {
			if (!countryElement || 
				!(countryElement instanceof jQuery) || 
				countryElement.size() == 0) {
				throw 'country element required';
			}
			
			if (!stateElement || 
				!(stateElement instanceof jQuery) || 
				stateElement.size() == 0) {
				throw 'state element required';
			}
			
			if (!cityElement || 
				!(cityElement instanceof jQuery) || 
				cityElement.size() == 0) {
				throw 'city element required';
			}
			
			if (!countryElement.attr('name')) {
				throw 'country element requires a name attribute';
			}
			
			if (!stateElement.attr('name')) {
				throw 'state element requires a name attribute';
			}
			
			if (!cityElement.attr('name')) {
				throw 'city element requires a name attribute';
			}
		}
		
		setupLoading = function () {
            $(document).ajaxStart(function () {
                $('html').css('cursor', 'wait');
            });

            $(document).ajaxComplete(function () {
                $('html').css('cursor', 'default');
            });
        };

        switchInputToSelectState = function () {
            var stateElementName = stateElement.attr("name");

            var stateInput = $('input[name=' + stateElementName + ']');

            if (stateInput.size() == 1) {
                stateInput.replaceWith(stateElement);

                stateElement.change(onStateChange);
            }

            switchInputToSelectCity();
        };

        switchInputToSelectCity = function () {
            var cityElementName = cityElement.attr("name");

            var cityInput = $('input[name=' + cityElementName + ']');

            if (cityInput.size() == 1) {
                cityInput.replaceWith(cityElement);
            }
        };

        switchSelectToInputState = function () {
            var stateInput = $('<input type="text" />').attr({
                'id': stateElement.attr('name'),
                'name': stateElement.attr('name')
            })
                .addClass(settings.inputTextClass);

            stateElement.replaceWith(stateInput);

            switchSelectToInputCity();
        };

        switchSelectToInputCity = function () {
            var cityInput = $('<input type="text" />').attr({
                'id': cityElement.attr('name'),
                'name': cityElement.attr('name')
            })
                .addClass(settings.inputTextClass);

            cityElement.replaceWith(cityInput);
        };

        onCountryChange = function () {
            switchInputToSelectState();

            stateElement.html("");

            cityElement.html("");

            if (countryElement.val() == 'Selecione') {
                stateElement.attr('disabled', 'disabled');

                cityElement.attr('disabled', 'disabled');

                return;
            }

            $.getJSON('data/' + countryElement.val().toLowerCase() + '/states.json', function (states) {
                stateElement.append('<option>Selecione</option>');

                for (var i = 0; i < states.length; i++) {
                    stateElement.append('<option>' + states[i] + '</option>');
                }

                stateElement.removeAttr('disabled', 'disabled');
            })
			.fail(switchSelectToInputState);
        };

        onStateChange = function () {
            switchInputToSelectCity();

            cityElement.html("");

            if (stateElement.val() == 'Selecione') {
                cityElement.attr('disabled', 'disabled');

                return;
            }

            $.get('data/' + countryElement.val().toLowerCase() + '/cities.json', function (cities) {
                cityElement.append('<option>Selecione</option>');
                for (var i = 0; i < cities.length; i++) {
                    var city = cities[i];
                    if (city.state == stateElement.val()) {
                        cityElement.append('<option>' + city.name + '</option>');
                    }
                }

                cityElement.removeAttr('disabled', 'disabled');

                var options = cityElement.find('option').size()
                if (options == 1) {
                    switchSelectToInputCity();
                }

            })
			.fail(switchSelectToInputCity);
        };

        initialize();

        return this;
    };

}(jQuery));