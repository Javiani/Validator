;(function(Validator, $) {
	
	Validator.pushMessages({
		'pt-br' : {
			'required' : 'O campo {title} é obrigatório',
			'email'    : 'Preencha um email valido no campo {title}',
			'date' : 'Digite uma data válida no campo {title}',
			'phone': 'Digite um número de telefone válido no campo {title}',
			'minlength': 'Digite no mínimo {n} caracteres no campo {title}',
			'equalTo':'O campo {title} deve ser igual ao campo {another.title}',
			'cpf': 'O campo {title} está com o cpf inválido',
			'accept': 'O campo {title} está com o formato de arquivo inválido',
			'number': 'O campo {title} aceita apenas números'
		},
		'en-us' : {
			'required' : 'The field {title} is required',
			'email'    : 'Please enter a valid email in {title} field',
			'date' : 'Please enter a valid date in {title} field',
			'phone': 'Please enter a valid phone number in {title} field',
			'minlength': 'Please enter more than {n} characters in {title} field',
			'equalTo':'The {title} field must be equal to {another.title} field',
			'cpf' : 'The {title} field must have a valid cpf',
			'accept': 'The field {title} must have a valid file format',
			'number': 'The field {title} accepts only digits'

		}
	})
		
})(Validator, jQuery);
