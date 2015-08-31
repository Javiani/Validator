/**
 *	@name Custom Plugins
 *	@author Eduardo Ottaviani
 */
(function (root, factory) {

	if(typeof exports === 'object' && exports) {
		module.exports = factory( require('validator') );
	}else{

		if(typeof define === 'function' && define.amd) {
			define(['validator'], factory); // AMD
		}else{
			factory( root.Validator ); // <script>
		}
	}

}(this, function( Validator ){

	var Mask, P, masks;

	P = Validator.internal('Plugin');
	masks = {};

	P.add('mask', Mask = {

		initialize :function(elements, options){
			mask( elements, options );
		},

		add :function(o){
			masks[o.name] = o.method;
		}
	});

	Mask.add({
		"name" : "email",
		"method": function(v){ return v.replace(/[^a-z|\d|\-\_@.]/g,""); }
	});
			
	Mask.add({
		"name": "phone",
		"method": function(v){
			v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
			v = v.replace(/^(\d\d)(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
			v = v.replace(/(\d{4})(\d)/, "$1-$2"); //Coloca hífen entre o quarto e o quinto dígitos
			return v;
		}
	});

	Mask.add({
		"name": "digits",
		"method": function(v){ return v.replace(/\D/g, ""); }
	});
	
	Mask.add({
		"name" : "letters",
		"method": function(v){ return v.replace(/\d/g, ""); }
	});
	
	Mask.add({
		"name" : "alphanum",
		"method": function(v){ return v.replace(/[^a-z|A-Z|\d|áàãâäéèêëíìîïóòõôöúùûüç\s-?!.@]/g,""); }
	});	
		
	Mask.add({
		"name" : "money",
		"method": function(v){ return v.replace(/[^\d|R\$.,]/g, ''); }
	});	
	
	Mask.add({
		"name": "cpf",
		"method": function(v){
			v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
			v = v.replace(/(\d{3})(\d)/, "$1.$2"); //Coloca um ponto entre o terceiro e o quarto dígitos
			v = v.replace(/(\d{3})(\d)/, "$1.$2"); //Coloca um ponto entre o terceiro e o quarto dígitos
			//de novo (para o segundo bloco de números)
			v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); //Coloca um hífen entre o terceiro e o quarto dígitos
			return v;
		}
	});
	
	Mask.add({
		"name": "cep",
		"method": function(v){
			v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
			v = v.replace(/^(\d{5})(\d)/, "$1-$2"); //Esse é tão fácil que não merece explicações
			return v;
		}
	});
	
	Mask.add({
		"name": "cnpj",
		"method": function(v){
			v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
			v = v.replace(/^(\d{2})(\d)/, "$1.$2"); //Coloca ponto entre o segundo e o terceiro dígitos
			v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3"); //Coloca ponto entre o quinto e o sexto dígitos
			v = v.replace(/\.(\d{3})(\d)/, ".$1/$2"); //Coloca uma barra entre o oitavo e o nono dígitos
			v = v.replace(/(\d{4})(\d)/, "$1-$2"); //Coloca um hífen depois do bloco de quatro dígitos
			return v;
		}
	});
	
	Mask.add({
		"name": "site",
		"method": function(v){
			v = v.replace(/^http:\/\/?/, "")
			var dominio = v;
			var caminho = "";
				if (v.indexOf("/") > -1) 
					dominio = v.split("/")[0];
			caminho = v.replace(/[^\/]*/, "");
			dominio = dominio.replace(/[^\w\.\+-:@]/g, "");
			caminho = caminho.replace(/[^\w\d\+-@:\?&=%\(\)\.]/g, "");
			caminho = caminho.replace(/([\?&])=/, "$1");
				if (caminho != "") 
					dominio = dominio.replace(/\.+$/, "");
			v = "http://" + dominio + caminho;
			return v;
		}
	});
	
	Mask.add({
		"name": "date",
		"method": function(v){
			v = v.replace(/\D/g, "");
			v = v.replace(/(\d{2})(\d)/, "$1/$2");
			v = v.replace(/(\d{2})(\d)/, "$1/$2");
			return v;
		}
	});

	function test(object, mask){

		var method = masks[mask];
		if(!method) return console.log('Mask.test::exception', 'mask not exists =>', mask);

		object.value = method( object.value );
	}

	function mask(element, Mask){

		var _self = this;

		element.bind('keyup.mask',function(e){

			switch(e.keyCode){
				case 8:  //backspace
				case 9:  //tab
				case 37: //arrow left
				case 38: //arrow up
				case 39: //arrow right
				case 40: //arrow down
				case 34: //page up
				case 33: //page down
				case 35: //end
				case 36: //home
				case 16: //shift
				case 18: //option
				case 17: //control
				return true;
			}
			var split = Mask.split("|");
				for (var y = 0; y < split.length; y++)
					test( this, split[y] );
		}).trigger('keyup.mask');
	}

	return P;
}));