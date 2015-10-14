require(['validator'], function(validator){
	validator.add_messages({
		required : 'Este campo é obrigatório',
		email    : 'Preencha um email valido',
		date : 'Digite uma data válida',
		phone: 'Digite um número de telefone válido',
		minlength: 'Preencha o campo com pelo menos o mínimo necessário',
		equalTo:'Campo inválido',
		cpf: 'CPF inválido',
		accept: 'Formato de arquivo inválido',
		number: 'Preencha apenas com números'
	});
});
