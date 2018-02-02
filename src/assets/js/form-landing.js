$(document).ready(function() {

	$('.send-form-js').click(function (e) {
		e.preventDefault();
		modulo.onClickEnviarFormulario($(this));
	});
});

var modulo = {

	$formulario: null,
	$inputNombre: null,
	$inputApellidos: null,
	$inputNombreComercialEmpresa: null,
	$inputEmail: null,
	$inputTelefono: null,
	$inputLlamar: null,

	nombre: null,
	apellidos: null,
	nombreComercialEmpresa: null,
	empresaOrigen: null,
	empresaOrigenWeb: null,
	email: null,
	telefono: null,
	hora: null,
	get_ip: null,
	pack_sel: null,
	llamar: null,

	onClickEnviarFormulario: function ($botonEnviar) {

		modulo.inicializarVariables($botonEnviar);

		modulo.quitarErroresCampos();

		if (modulo.validarCampos()) {
			modulo.enviarFormulario();
		}

	}, inicializarVariables: function ($botonEnviar) {

		formName = $botonEnviar.data('type');
		$formulario = $('#form' + formName);

		$inputNombre = $formulario.find('input[name="nombre"]');
		$inputApellidos = $formulario.find('input[name="apellidos"]');
		$inputNombreComercialEmpresa = $formulario.find('input[name="empresa"]');
		$inputEmail = $formulario.find('input[name="email"]');
		$inputTelefono = $formulario.find('input[name="telefono"]');
		$inputLlamar = $formulario.find('input[name="llamar"]');

		nombre = $inputNombre.val();
		apellidos = $inputApellidos.val();
		nombreComercialEmpresa = $inputNombreComercialEmpresa.val();
		empresaOrigen = $formulario.find('input[name="empresaOrigen"]').val();
		empresaOrigenWeb = $formulario.find('input[name="empresaOrigenWeb"]').val();
		email = $inputEmail.val();
		telefono = $inputTelefono.val();
		hora = '';
		get_ip = $formulario.find('input[name="get_ip"]').val();
		pack_sel = $formulario.find('input[name="pack_sel"]').val();
		llamar = '0';

		if ($inputLlamar.is(':checked')) {
			llamar = '1';
		}

	}, quitarErroresCampos: function () {

		$formulario.find("input").removeClass("error");

	}, validarCampos: function () {

		var validado = true;

		if ($inputNombre.length > 0 && !nombre) {
			$inputNombre.focus();
			$inputNombre.addClass("error");
			validado = false;
		}

		if ($inputApellidos.length > 0 && !apellidos) {
			$inputApellidos.focus();
			$inputApellidos.addClass("error");
			validado = false;
		}

		if ($inputNombreComercialEmpresa.length > 0 && !nombreComercialEmpresa) {
			$inputNombreComercialEmpresa.focus();
			$inputNombreComercialEmpresa.addClass("error");
			validado = false;
		}

		if ($inputEmail.length > 0) {
			if (!email) {
				$inputEmail.focus();
				$inputEmail.addClass("error");
				validado = false;
			} else {
				var emailRegex = new RegExp(/^([\w.+-]+)@([\w-]+)((\.(\w){2,3})+)$/i);
				var valid = emailRegex.test(email);

				if (!valid) {
					$inputEmail.addClass("error");
					validado = false;
				}
			}
		}

		if ($inputTelefono.length > 0) {
			if (!telefono) {
				$inputTelefono.focus();
				$inputTelefono.addClass("error");
				validado = false;
			} else {
				var emailRegextl = new RegExp(/^[9|8|7|6]\d{8}$/i);
				var validtl = emailRegextl.test($inputTelefono.val());
				if (!validtl) {
					$inputTelefono.addClass("error");
					validado = false;
				}
			}
		}

		return validado;

	}, enviarFormulario: function () {

		var pack = '0'; //Aqui hay que pasar el pack

		var urljson = '/saveContact.ssi?landing=true&ip=' + $('#user_ip').html()
			+ '&url=' + window.location.href + '&callNow=' + llamar + '&pack=' + pack + '&' + $('#form' + formName).serialize();

		$.ajax({
			url: urljson,
			dataType: 'json',
			jsonpCallback: 'getJson',
			type: 'GET',
			error: function () {
				landing_name = landing_name + '_ERROR_AJAX';
				ga('send', 'pageview', landing_name);
			},
			success: function (data) {

				if (data.status == 'ok-new' || data.status == 'ok-registered' ) {
					modulo.procesarRespuestaFormularioOk(data);
				} else {
					modulo.procesarRespuestaFormularioKo(data);
				}

			}

		});

	}, procesarRespuestaFormularioOk: function (data) {
		if (data.status == 'ok-new') {
			landing_name = landing_name + '_GOAL_ALTA';
			ga('send', 'pageview', landing_name);
		}

		if (data.status == 'ok-registered') {
			landing_name = landing_name + '_GOAL_INFO';
			ga('send', 'pageview', landing_name);
		}

		switch (formName) {
			case "1eBook":
				$('.formulario').html('<h3>Descargando el pdf.</h3><p style="font-size:18px;">Deseamos que disfrutes con su lectura.</p>');
			break;

			case "Hawai":
				$('.formulario').html('<h3>数据发送失败</h3><p style="text-align:center;font-size:18px;">请重新尝试</p>');
			break;

			case "fr":
				$('.formulario-B').html('<h3>Merci de faire confiance à SoloStocks!</h' + '3><'
					+ 'p style="font-size:18px;">Notre équipe de consultants vous contactera sous peu.</p>');
			break;

			case "-it":
				$('.formulario-B').html('<h3>Grazie per la fiducia riposta su SoloStocks!</h3><'
					+ 'p style="font-size:18px;">A breve la nostra equipe di consulenti si metterá in contatto con te.</p>');
			break;

			case "-ma":
				$('.formulario-B').html('<h3>Merci de faire confiance à SoloStocks !</h3><'
					+ 'p style="font-size:18px;">Notre équipe de consultants vous contactera sous peu.</p>');
			break;

			case "-formacion":
				$('.formulario-B').html('<h3>¡Muchas gracias por inscribirte!</h3><p style="font-size:18px">Te esperamos el día 13 de julio.</p>');
			break;

			default:
				$('.formulario, .formulario-B').html('<h3>¡Gracias por confiar en SoloStocks.com! </h3><'
					+ 'p style="text-align:center;font-size:18px;">En breve nuestro equipo de consultores contactará contigo.</p><nos'
					+ 'cript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-MPDSVG" height="0" width="0" style="display:none;visibility:hidden"></ifr'
					+ 'ame></noscript><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});'
					+ 'var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;'
					+ 'j.src="//www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);})(window,document,"script","dataLayer","GTM-MPDSVG");</script>');
			break;

		}

	}, procesarRespuestaFormularioKo: function (data) {

		if (data.status == 'ko-denied') {
			landing_name = landing_name + '_ERROR_DENIED';
			ga('send', 'pageview', landing_name);
			$('.formulario, .formulario-B').html('<h3>¡Error!</h3><p style="text-align:center;font-size:18px;">Por favor vuelva a intentarlo.</p>');
		}

		if (data.status == 'ko-new') {
			landing_name = landing_name + '_ERROR_NEW';
			ga('send', 'pageview', landing_name);
			$('.formulario, .formulario-B').html('<h3>¡Error al enviar los datos!</h3><p style="text-align:center;font-size:18px;">Por favor vuelva a intentarlo.</p>');
		}

		if (data.status == 'ko-errors') {
			landing_name = landing_name + '_ERROR';
			ga('send', 'pageview', landing_name);
			$('.formulario, .formulario-B').html('<h3>¡Ups, parece que hay un error!</h3><p style="text-align:center;font-size:18px;">Por favor vuelva a intentarlo.</p>');
		}

	}

};
