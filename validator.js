/**
 * @class Validator
 * @author Eduardo Ottaviani ( Javiani )
 * @version 1.1.0
 */
;(function(namespace, $){

	//Static
	var 
		dup = function(o){ return $.extend({}, o) },

		clone = function(){
			var f = new Function;
				f . prototype = Validator;
			return new f;
		},
		
		console = window.console || { 
			warn :function(){},
			log  :function(){},
			error:function(){} 
		};

	/**
	 * @class Plugins
	 */
	var Plugins = { 
		/**
		 * @method Método estático para adicionar plugin no validador
		 * @param {String} name Nome do plugin
		 * @param {Function} fn 
		 */
		add : function(name, fn){ this.plugin[name] = fn },

		plugin : {},

		exec : function(rules, arr_elements){
			for (var x in rules){
				if (Plugins.plugin[x]) 
					Plugins.plugin[x].call(this, arr_elements, rules[x]);
			}
		}
	}

	var Rules = { Class :function(){} };

	var Messages = {
		
		language : 'pt-br',
		default_messages : {},

		messages : function(language){ return Messages.default_messages[language]	},
		change_messages : function(o){ Messages.default_messages = o },
		
		Class :function( msg ){

			var pattern = /\{(\w*)\}/g;

			this.text = function(name, field){

				if (!msg.messages[name]){
					return console.warn('Não existe mensagem definida para : ' + name);
				}

				if (field.customMessages && field.customMessages[name]){
					return field.customMessages[name].replace(pattern, function(tag){
						tag = tag.slice(1, -1);
						return field.element[tag];
					});
				}

				else{
					return msg.messages[name].replace(pattern, function(tag){
						tag = tag.slice(1, -1);
						return field.element[tag];
					});
				}
			}
		}
	}

	/**
	 * @class Validator
	 * @author Eduardo Ottaviani 
	 */
	var Validator = {

		addRule : function(name, method, messages){
			Rules.Class.prototype[name] = method;
				if(messages)
					Messages.default_messages[Messages.language][name] = messages;
		},

		Class :function( el ){
			
			//Private
			var 
				self = this,
				arr_elements = [],
				arr_elements_error = [],
				disabled = [],
				jsonRules = {},
				handler = $(el),
				setup = {
					messages: Messages.default_messages[ Messages.language ],
					addRule : null,
					language: function(lang){ this.messages = Messages.messages(lang); }
				},
				
				form = handler.is('form') ? handler :handler.parents('form'),
				
				rules = new Rules.Class,
				messages = new Messages.Class( setup ),
				fn_validation;

				// Constructor
				;(function(){

					if(!handler.length){
						console.warn(
							'Não existe o elemento ' + el + ' para o validator. Tem certeza que está pegando o elemento certo?'
						);
					}

					this.handler = handler;
					this.setup = setup;

				}).call(this);

				//Private
				function add_Validation(rules, scope){

					var container = scope || form;
					jsonRules = rules;
					arr_elements = [];

						for (var x in rules){

							$(x, container).each(function(){

								arr_elements.push({
									element: this,
									rules: dup(rules[x].rules),
									customMessages: dup( rules[x].messages ) || {}
								});

								Plugins.exec.call(self, rules[x], arr_elements[arr_elements.length - 1]);

								$(this)
									.unbind( 'keypress.validation' )
									.bind( 'keypress.validation' , function(e){
										if ( 
											e.which == 13 &&
											e.currentTarget.nodeName.toLowerCase() != 'textarea'
										){
											if(handler[0].nodeName.toLowerCase() != 'form')
												handler.trigger('click');
											else
												handler.trigger('submit');
											return false;
										}

								});

							});
						}
				}
				
				function validation(){

					var map = {};
					arr_elements_error = [];
					
						for(var x = 0; x < arr_elements.length;  x++){
							var valid = true;
							arr_elements[x].message = [];

								for (var name in arr_elements[x].rules){

									if (!rules[name] && !Plugins.plugin[name]) 
										return console.warn('Não existe o método: ' + name);
									
									if(!rules[name]) continue;
									
									if (!rules[name].call(self, arr_elements[x], arr_elements[x].rules[name])) {
										arr_elements[x].message.push (messages.text(name, arr_elements[x]) );
										map[ name ] = messages.text( name, arr_elements[x] );
										valid = false;
									}

								}
								
								if( !valid ) 
									arr_elements_error.push( arr_elements[x] );
						}

						if ( arr_elements_error.length ) {
							$(self).trigger('error', [arr_elements_error, map]);
							return false;
						}

					return $(self).triggerHandler('success');
				}
				
				function handle_event(method){
					if(!handler.is('form')) {
						if(method == 'bind')
							handler[method]('click.validation', fn_validation);
						else
							handler[method]('click.validation');
					}
					else{
						if(method == 'bind')
							handler[method]('submit.validation', fn_validation);
						else
							handler[method]('submit.validation');
					}
				}

			// Public

			/**
			 * @param {String} Name
			 * @param {Function} Method
			 */
			this.bind = function( name, method ){
				$(this).bind(name, function(e, error_list, error_map){
					return method( error_list, error_map );
				});
			}
			
			/**
			 * @method Método para adicionar um novo método de validação no validador
			 * @param {String} name
			 * @param {Function} method 
			 */
			this.setup.addRule = function(name, method){ 
				if( method )
					Rules[ name ] = method;
				return this;
			}

			/**
			 * @method Método para adicionar as regras. 
			 * @param {JSON} rules
			 */
			this.validate = function(rules, scope){
				fn_validation = validation;
				add_Validation.call( this, rules, scope );
				handle_event('bind');
				return this;
			}
			
			/**
			 * @method live
			 * @param {JSON} rules
			 */
			this.live = function(rules, scope){

				add_Validation.call( this, rules, scope );
				

				var method = function(){
					add_Validation.call( this, rules, scope );
					return validation();
				}
				fn_validation = method;
				handle_event('bind');

			}

			/**
			 * @method Método para habilitar campos desabilitados
			 */
			this.enable = function(type){
				handle_event('bind');
			}

			/**
			 * @method Método para desabilitar os campos
			 */
			this.disable = function(){
				handle_event('unbind');
			}

			/**
			 * @method Método para retirar validações de um campo
			 * @param {String} field String jQuery para pegar o campo validado
			 * @param {Array} [String] rule Lista com regras à serem removidas 
			 */
			this.clear = function(field, rule){
				var self = this;
				var iterate = function(r){
					$(field, form).each(function(){
						for (var x = 0; x < arr_elements.length; x++) {
							arr_elements[x].element == this ? delete arr_elements[x].rules[r] : null;
							if(arr_elements[x].element == this)
								delete arr_elements[x].rules[r];
						}			
					})
				}
				
					if(!arguments.length) 
						arr_elements = [];

					else if (rule.constructor == Array)
						for(var a = 0; a < rule.length; a++)
							iterate( rule[a] );
					else
						iterate(rule);

				return this;
			}

		}

	}

	Validator.Class.language = function(lang){ Messages.language = lang };
	Validator.Class.addRule = Validator.addRule;
	Validator.Class.addPlugin = function(){ Plugins.add.apply(Plugins, arguments) };
	Validator.Class.pushMessages = Messages.change_messages;

	namespace.Validator = Validator.Class;

})(window, jQuery)