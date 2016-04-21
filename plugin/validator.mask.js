/**
 * Plugins. Métodos adicionais do validator
 * Primeiro parâmetro é um objeto contendo mensagens e o elemento html.
 * Segundo parâmetro é qualquer tipo de objeto sendo definido na chamada do validator.
 * 
 * @param {Object} field
 * @param {Object} maskara
 */		
 
;(function(Validator, $) {

	var Maskara = {		
		
		_class : function(){	   

	        function test(object, mask){
	            var fn = Maskara.methods[mask];
	            object.value = fn(object.value);
	        }
			
			this.mask =function(element, maskara){
		        var _self = this;			  
		        $(element).keyup(function(){     
					var split = maskara.split("|"); 
			            for (var y = 0; y < split.length; y++) 
			                test(element, split[y]);		            
		        }); 
		    }
	    },
		
		add : function(json){ Maskara.methods[json.name] = json.method; },
		
		methods : {}		
	}; 				
	
	Maskara.add({
		"name" : "email",
		"method": function(v){ return v.replace(/[^a-z|\d|\-\_@.]/g,""); }
	});
			
    Maskara.add({
        "name": "phone",
        "method": function(v){
            v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
            v = v.replace(/^(\d\d)(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
            v = v.replace(/(\d{4})(\d)/, "$1-$2"); //Coloca hífen entre o quarto e o quinto dígitos
            return v;
        }
    });		
	
	Maskara.add({
        "name": "digits",
        "method": function(v){ return v.replace(/\D/g, ""); }
    });
    
	Maskara.add({
		"name" : "letters",
		"method": function(v){ return v.replace(/\d/g, ""); }
	});
	
	Maskara.add({
		"name" : "alphanum",
		"method": function(v){ return v.replace(/[^a-z|A-Z|\d|áàãâäéèêëíìîïóòõôöúùûüç\s-?!.@]/g,""); }
	});	
		
	Maskara.add({
		"name" : "money",
		"method": function(v){ return v.replace(/[^\d|R\$.,]/g, ''); }
	});	
    
    Maskara.add({
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
    
    Maskara.add({
        "name": "cep",
        "method": function(v){
            v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
            v = v.replace(/^(\d{5})(\d)/, "$1-$2"); //Esse é tão fácil que não merece explicações
            return v;
        }
    });
    
    Maskara.add({
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
    
    Maskara.add({
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
    })
    
    Maskara.add({
        "name": "date",
        "method": function(v){
            v = v.replace(/\D/g, "");
            v = v.replace(/(\d{2})(\d)/, "$1/$2");
            v = v.replace(/(\d{2})(\d)/, "$1/$2");
            return v;
        }
    })	 
	
	var maskarade = new Maskara._class;
	
	Validator.add_plugin('mask', function(field, maskara){
		maskarade. mask(field.element, maskara);					
	});	

})( Validator, jQuery );
