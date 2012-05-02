;(function(Validator, $) {

	Validator.addRule('age', function(field, limitAge){
		
		var el = $(field.element);
		var date = field.element.value;
		var aux, d;
			
			if(!date) return true;
		
			aux = date.split(/\//g);
				
				if(aux){
					d =  { dia :aux[0], mes :aux[1], ano :aux[2] };
				}
				else{
					d = { dia :el.val(), mes:el.next(':text').val(), ano:el.next(':text').next(':text').val() };
				}
		
			if(!(d.dia || d.mes || d.ano )) return false;
		
		var get_diff = function(dia, mes, ano){
			return (new Date(new Date() - new Date(ano, mes-1, dia)).getFullYear() - 1970);
		}
		
		var max = get_diff(+d.dia, +d.mes, +d.ano);
		var msg = this.setup.messages.age;
		
		this.setup.messages.age = msg.replace(/\{idade\}/, limitAge);
		return (max >= limitAge);
		
	}, 'Somente para pessoas maiores de {idade} anos.');
	
})(Validator, jQuery );