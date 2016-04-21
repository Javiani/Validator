;(function(V, $){

	V.add_rule('required', function(field, bool){						
		
		if(!bool) return true;
			
		var 
			el = field.element,
			type = el.type.toLowerCase(),
			valid = bool.call ? bool.call(this, field) : false;		

		if (type == 'radio' || type == 'checkbox') {
			var checked = $('[name="'+el.name+'"]:checked').length;
			return !!checked || valid;
		}

		return ( !!( el.checked || $.trim(el.value) ) || valid );
	});
	
	V.add_rule('accept', function(field, args){								
		var value = field.element.value;
		if(!value) return true;			
		return !!value.split(/\./).pop().match(args);	
	});
	
	V.add_rule('different', function(field, text){		
		if (!field.element.value.match(text)) 
			return true;
		else return false;							
	});
	
	V.add_rule('number', function(field, bool){
		var v = field.element.value;
		if (!bool || !v || !v.match(/\D/)) 
			return true;
		else return false; 								
	});
	
	V.add_rule('minlength', function(field, size){	
	
		var 
			custom = field.custom_messages,
			msg = custom.minlength || this.messages.minlength,
			value = field.element.value;
	
		custom.minlength = msg.replace(/{n}/g, size);	
		if(!value) return true;
		
		return !!(value.length >= size);	
	});
	
	V.add_rule('phone', function(field, strPattern){		
		
		var v = field.element.value;

		if(!value){ return true; }
		
		if(strPattern.replace)
			return new RegExp( 
				strPattern . replace(/(\W)/gi,'\\$1').replace(/x/gi, '\\d')
			) . test(value);
			
		if (value)
			return !!(value.match(/\d{4}\-?\d{4}/));
				
		else if( !strPattern ) return true;  			
		else return false; 					
	});

	V.add_rule('email', function(field, bool){

		var
			value = field.element.value,
			match = value.match(/\b[a-z0-9._%-]+@[a-z0-9.-]+\.\w{2,4}\b/),
			pass = false;

		if(match)
			pass = match[0] == value;

		return (!bool || !value || pass );
	});

	
	V.add_rule('number', function(field, bool){
		var v = field.element.value;
		if (!bool || !v || !v.match(/\D/))
			return true;		
		else return false; 								
	})

	V.add_rule('date', function(field, type){		
	
		var 
			_arrdata = [],
			value = field.element.value,
			date = function(dia, mes, ano){
				mes -= 1;
				var d = new Date(ano != null ? ano : 1984, mes != null ? mes : 03, dia != null ? dia : 31, 15, 15, 0);
				return ( d.getFullYear() == ano && d.getMonth() == mes && d.getDate() == dia );
			}			
			
			switch( typeof type ){
				
				case 'boolean' : 
					_arrdata = value.replace(/\D/g,'\/').split(/\//);
						if(!value) return true;
				break
				
				case 'string' : 
					var c = type.replace(/ /g,'');
					var empty = !(!!value);
								
					$(c).each(function(){ _arrdata.push(this.value); if(this.value) empty = false; });	
						if( empty ) return true;
			}			
		
	
		return date( +_arrdata[0], +_arrdata[1], +_arrdata[2] );	
	});	
	
	V.add_rule('equalTo', function(field, another){		
		
		var
			text,
			el = field.element,
			msg = field.custom_messages.equalTo || this.messages.equalTo;	
		
		text = another.data('message');
		another = $(another)[0];
	
		field.custom_messages.equalTo = msg.replace(/\{target\}/g, text || another.title );
		return el.value == another.value;
	});
	
	V.add_rule('cpf', function(field, bool) {
		if(!bool) return true;
		var v = field.element.value.replace(/\D/g,'');
		if (v == "00000000000" || v == "11111111111" || v == "22222222222" || v == "33333333333" || v == "44444444444" || v == "55555555555" || v == "66666666666" || v == "77777777777" || v == "88888888888" || v == "99999999999") return false;
		if (!v) return true;
		var s = null;
		var r = null;
		if (v.length != 11 || v.match(/1{11};|2{11};|3{11};|4{11};|5{11};|6{11};|7{11};|8{11};|9{11};|0{11};/)) return false;
		s = 0;
		for (var i = 0; i < 9; i++) s += parseInt(v.charAt(i)) * (10 - i);
		r = 11 - (s % 11);
		if (r == 10 || r == 11) r = 0;
		if (r != parseInt(v.charAt(9))) return false;
		s = 0;
		for (var i = 0; i < 10; i++) s += parseInt(v.charAt(i)) * (11 - i);
		r = 11 - (s % 11);
		if (r == 10 || r == 11) r = 0;
		if (r != parseInt(v.charAt(10))) return false;
		return true;
	});	
	
	V.add_rule('cnpj', function(field) {
		var cnpj = field.element.value.replace(/\D/g, '');
		var numeros, digitos, soma, i, resultado, pos, tamanho, digitos_iguais;
			  digitos_iguais = 1;
			  if (cnpj.length < 14 && cnpj.length < 15)
					return false;
			  for (i = 0; i < cnpj.length - 1; i++)
					if (cnpj.charAt(i) != cnpj.charAt(i + 1))
						  {
						  digitos_iguais = 0;
						  break;
						  }
			  if (!digitos_iguais)
					{
					tamanho = cnpj.length - 2
					numeros = cnpj.substring(0,tamanho);
					digitos = cnpj.substring(tamanho);
					soma = 0;
					pos = tamanho - 7;
					for (i = tamanho; i >= 1; i--)
						  {
						  soma += numeros.charAt(tamanho - i) * pos--;
						  if (pos < 2)
								pos = 9;
						  }
					resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
					if (resultado != digitos.charAt(0))
						  return false;
					tamanho = tamanho + 1;
					numeros = cnpj.substring(0,tamanho);
					soma = 0;
					pos = tamanho - 7;
					for (i = tamanho; i >= 1; i--)
						  {
						  soma += numeros.charAt(tamanho - i) * pos--;
						  if (pos < 2)
								pos = 9;
						  }
					resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
					if (resultado != digitos.charAt(1))
						  return false;
					return true;
					}
			  else
					return false;
	});
	
})( Validator, jQuery );
