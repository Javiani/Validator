;(function(Validator, $) {

	Validator.addRule('required', function(field, bool){						
			if(!bool) return true
			
		var valid = bool.call ? bool.call(this, field) : false		
			
			if (field) {
				if (field.element.type.toLowerCase() == "radio" || field.element.type.toLowerCase() == "checkbox") {
					var checked = $('[name="'+field.element.name+'"]:checked').length
					return !!checked || valid
				}
						
				return ( !!( field.element.checked || $.trim(field.element.value) ) || valid )
			}
	})
	
	Validator.addRule('accept', function(field, args){								
		if(!field.element.value) return true			
		return !!field.element.value.split(/\./).pop().match(args)			
	})
	
	Validator.addRule('different', function(field, text){		
		if (!field.element.value.match(text)) 
			return true
		else return false							
	})
	
	Validator.addRule('number', function(field, bool){
		if (!bool || !field.element.value || !field.element.value.match(/\D/)) 
			return true			
		else return false 								
	})
	
	Validator.addRule('minlength', function(field, size){		
		var messages = field.customMessages.minlength || this.setup.messages.minlength		
		field.customMessages.minlength = messages.replace(/{n}/g, size) 	
			if(!field.element.value) return true	
		return !!( field.element.value.length >= size) 								
	})
	
	Validator.addRule('phone', function(field, strPattern){		
		
		if(!field.element.value){ return true }
		
		if(strPattern.replace)
			return new RegExp( 
				strPattern . replace(/(\W)/gi,'\\$1').replace(/x/gi, '\\d')
			) . test(field.element.value)
			
		if (field.element.value)
			return !!(field.element.value.match(/\d{4}\-?\d{4}/))
				
		else if( !strPattern ) return true  			
		else return false 					
	})

	Validator.addRule('email', function(field, bool){

		var
			value = field.element.value,
			match = value.match(/\b[a-z0-9._%-]+@[a-z0-9.-]+\.\w{2,4}\b/),
			pass = false;

		if(match)
			pass = match[0] == value;

		return (!bool || !value || pass );
	});

	
	Validator.addRule('number', function(field, bool){
		if (!bool || !field.element.value || !field.element.value.match(/\D/)) 
			return true			
		else return false 								
	})

	Validator.addRule('date', function(field, type){		
	
		var _arrdata = []
				
			switch( typeof type ){
				case 'boolean' : 
					_arrdata = field.element.value.replace(/\D/g,'\/').split(/\//)
						if(!field.element.value) return true
				break
				case 'string' : 
					var c = type.replace(/ /g,'');
					var empty = !(!!field.element.value)	
								
					$(c).each(function(){ _arrdata.push(this.value); if(this.value) empty = false })	
						if( empty ) return true				
			}			
		
		var date = function(dia, mes, ano){
			mes -= 1
			var d = new Date(ano != null ? ano : 1984, mes != null ? mes : 03, dia != null ? dia : 31, 15, 15, 0)
			return ( d.getFullYear() == ano && d.getMonth() == mes && d.getDate() == dia )
		}
	
		return date( +_arrdata[0], +_arrdata[1], +_arrdata[2] )							
	})	
	
	Validator.addRule('equalTo', function(field, another){		
		var msg = field.customMessages.equalTo || this.setup.messages.equalTo		
		another = $(another)[0]	
			field.customMessages.equalTo = msg.replace(/\{another\.(.*)\}/g, function(tag){
				tag = tag.slice(1, -1).replace('another.', '')
				return another[tag]
			})			
		return field.element.value == another.value									
	})
	
	Validator.addRule('cpf', function(field, bool) {
		if(!bool) return true
		var v = field.element.value.replace(/\D/g,'')
		if (v == "00000000000" || v == "11111111111" || v == "22222222222" || v == "33333333333" || v == "44444444444" || v == "55555555555" || v == "66666666666" || v == "77777777777" || v == "88888888888" || v == "99999999999") return false
		if (!v) return true
		var s = null
		var r = null
		if (v.length != 11 || v.match(/1{11};|2{11};|3{11};|4{11};|5{11};|6{11};|7{11};|8{11};|9{11};|0{11};/)) return false
		s = 0
		for (var i = 0; i < 9; i++) s += parseInt(v.charAt(i)) * (10 - i)
		r = 11 - (s % 11)
		if (r == 10 || r == 11) r = 0
		if (r != parseInt(v.charAt(9))) return false
		s = 0
		for (var i = 0; i < 10; i++) s += parseInt(v.charAt(i)) * (11 - i)
		r = 11 - (s % 11)
		if (r == 10 || r == 11) r = 0
		if (r != parseInt(v.charAt(10))) return false
		return true
	})	
	
	Validator.addRule('cnpj', function(field) {
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
	})
	
})( Validator, jQuery );