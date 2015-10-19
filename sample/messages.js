;(function(){
	Validator.add_messages({
		required : 'This field is required',
		email    : 'Invalid email',
		date : 'Date format invalid',
		phone: 'Phone number invalid',
		minlength: 'Minlength property not satisfied',
		equalTo:'Invalid field',
		accept: 'Invalid file extension',
		number: 'This field accepts only numbers'
	});
})();
