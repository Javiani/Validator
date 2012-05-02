;(function(Validator, $){

	//Plugins Contador
	
	/**
	 * Recebe um textarea ou um input text e trava a digitação mostrando
	 * a quantidade de caracteres restantes em algum outro elemento html.
	 * @param {Object Validator.arr_list} field
	 * @param {String jQuery} counter
	 */
	 
	Validator.addPlugin('counter', function(field, counter){
		counter = $(counter)
		var max = +counter.text().replace(/\D/g, '')
					
		$(field.element).keydown(function(e){
			
			var self = this		
			
			setTimeout(function(){ 		
				var count = ( max - self.value.length )	
					if (count < 1 && e.which != 8) {
						if (count < 0) {
							self.value = self.value.substring(0, max)
							counter.text(0)								
						}					
						return false
					}
				counter.text( max - self.value.length )
			},100)
						
		})
	})	

})( Validator, jQuery );