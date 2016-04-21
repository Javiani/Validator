;(function(Validator, $){
	
	//Plugin Autotab
	/**
	 * Recebe um campo atual e passa para o próximo campo passado como parâmetro 
	 * após digitado o número máximo de caracteres.
	 * @param {Object Validator} field
	 * @param {String jQuery} target
	 */
	Validator.addPlugin('autotab', function(field, target){
	
		$(field.element).keydown(function(){			
			var self = this	
				
			setTimeout(function(){ 
				if( self.value.length == self.maxLength )
					$(target).focus() 
			},100)			
		})
				
	})	
	
})( Validator, jQuery );