$(document).ready(function() {
	// FORMULARIOS
	// ---------------------

	// Detectar si los input tienen contenido
	// Lo usamos para añadir la clase .form-field__value--completed al label y conseguir el mismo efecto del :focus
	// Para ver los estilos, mirar el _forms.scss
	$(".form-field .form-field__value").blur(function() {
		var inputHasValue = $.trim($(this).val()).length > 0;

		if (inputHasValue) {
			$(this).addClass("form-field__value--completed");
		} else if (!inputHasValue && $(this).hasClass(".form-field__value--completed")) {
			$(this).removeClass("form-field__value--completed");
		}
	});

	// Desplegar / plegar la tabla comparativa
	$(".js-table-toggle").on('click',function(){

		if ($(".js-table-wrap").hasClass("table-wrap--hide")){
			$(".js-table-wrap").removeClass("table-wrap--hide");
			$(".js-table-wrap").addClass("table-wrap--show");
			$(this).text("Mostrar menos");

		} else {
			$(".js-table-wrap").addClass("table-wrap--hide");
			$(".js-table-wrap").removeClass("table-wrap--show");
			$(this).text("Mostrar mas");
		}

		$("html, body").animate({scrollTop: $(".js-table-toggle").offset().top}, 2000);

	});

});

// LANDING NAME

var landing_name = window.location.pathname; var pos =
    landing_name.lastIndexOf("/"); var last_pos = landing_name.length;
    landing_name=landing_name.substring(pos+1,last_pos);
    landing_name=landing_name.toUpperCase();
    landing_name="MKTING_"+landing_name;

    var domain = window.location.host;
    var gaAccount="UA-xxxxxx-x";

    switch (domain) {
        case "www.solostocks.com":
            gaAccount="UA-127194-1";
            break;
        case "www.solostocks.de":
            gaAccount="UA-3610041-21";
            break;
        case "www.solostocks.com.ar":
            gaAccount="UA-3610041-19";
            break;
        case "www.solostocks.com.br":
            gaAccount="UA-3610041-18";
            break;
        case "www.solostocks.cl":
            gaAccount="UA-3610041-14";
            break;
        case "www.solostocks.com.co":
            gaAccount="UA-3610041-22";
            break;
        case "www.solostocks.fr":
            gaAccount="UA-3610041-17";
            break;
        case "www.solostocks.it":
            gaAccount="UA-3610041-20";
            break;
        case "www.solostocks.ma":
            gaAccount="UA-3610041-26";
            break;
        case "www.solostocks.com.mx":
            gaAccount="UA-3610041-3";
            break;
        case "www.solostocks.pl":
            gaAccount="UA-3610041-23";
            break;
        case "www.solostocks.pt":
            gaAccount="UA-3610041-15";
            break;
    }


  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', gaAccount, 'auto'); ga('send', 'pageview',landing_name);