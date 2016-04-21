/**
 *	@class Validator
 *	@author Eduardo Ottaviani ( Javiani )
 *	@version 2.0
 */

;(function(namespace, $){

	var
		Plugins,
		Messages,
		Rules = {},
		
		console = window.console || {
			warn :function(){},
			log  :function(){},
			error:function(){}
		};
	
	namespace.Validator = {
	
		add_plugin :function(name, method){
			Plugins.add(name, method);
		},
		
		add_messages :function(o){
			Messages.default_messages = o;
		},

		add_rule : function(name, method, messages){
			Rules[name] = method;
			if(messages) Messages.default_messages[name] = messages;
		},

		_class :function( el ){

			//Private
			var
				_self = this, evt, 
				arr_elements, arr_elements_error,	
				rules, handler, current_rules,
				fn_validation;
				
				function _construct(){
					
					set();	
					test( handler );
					
					this.handler = handler;
				}
				
				this.messages = Messages.default_messages;	
				
				this.bind = function( name, method ){
					$(evt).bind(name, function(e, error_list, error_map){
						return method( error_list, error_map );
					});
				}

				this.validate = function(rls, scope){

					current_rules = rls;
					fn_validation = validation;

					add_validation.call( this, rls, scope );
					handle_event('bind');

					return this;
				}

				this.trigger = function(forceTrigger){
					add_validation.call( this, current_rules );
					return validation({ dont_trigger :!!forceTrigger});
				}

				this.live = function(rls, scope){

					current_rules = rls;
					add_validation.call( this, rls, scope );

					var method = function(){
						add_validation.call( this, rls, scope );
						return validation();
					}

					fn_validation = method;
					handle_event('bind');
				}

				function set(){
					
					handler = $(el);
					evt = $('<span />');
					form = handler.is('form') ? handler :handler.parents('form');
					
					arr_elements = [];
					arr_elements_error = []; 
					rules = {};
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
				
				function add_validation(rls, scope){
									
					var 
						container = scope || form;
					
					rules = rls;
					arr_elements = [];

					for (var x in rls){

						$(x, container).each(function(){
							arr_elements.push({
								element: this,
								rules: dup( rls[x].rules ),
								custom_messages: dup( rls[x].messages ) || {}
							});

							Plugins.execute.call(_self, rls[x], arr_elements[arr_elements.length - 1]);
						});
					}
				}

				function validation(e){

					var 
						map = {},
						element, valid, x,
						length = arr_elements.length;

					arr_elements_error = [];

					for(x = 0; x < length; x++){
						
						valid = true;
						
						el = arr_elements[x];
						el.message = [];
							
						for (var name in el.rules){

							if (!Rules[name] && !Plugins.plugin[name])
								return console.warn('Não existe o método: ' + name);

							if(!Rules[name]) continue;

							if (!Rules[name].call( _self, el, el.rules[name] )){
								el.message.push( Messages.get( name, el ) );
								map[ name ] = Messages.get( name, el );
								valid = false;
							}
						}

						if( !valid ) arr_elements_error.push( el );
					}

					if ( arr_elements_error.length ) {
						$(evt).trigger('error', [arr_elements_error, map]);
						return false;
					}

					if(e && e.dont_trigger) return true; 

					return $( evt ).triggerHandler('success', [_self.handler, _self]);
				}

			_construct.call(this);

		},

		create :function(o){ return new this._class(o); }
	}
	
	Messages = { 
		
		default_messages : {},
		
		get :function(name, el){
			
			var 
				field = el.element,
				data = $(field).data('name'),
				message = el.custom_messages[name] || Messages.default_messages[name];
			
			if(!message){
				console.warn('Não existe mensagem definida para : ' + name);
				return '';
			}
				
			message = message.replace(/\{name\}/g, data || field.title );
			return message;
		}
	};
	
	Plugins = {
		
		add : function(name, fn){ this.plugin[name] = fn },

		plugin : {},

		execute : function(rules, arr_elements){
			for (var x in rules){
				if (Plugins.plugin[x])
					Plugins.plugin[x].call(this, arr_elements, rules[x]);
			}
		}
	};
	
	function dup(o){ 
		return $.extend({}, o); 
	}

	function test(h){
		
		if(!h.length){
			console.warn(
				'Não existe o elemento ' + el + ' para o validator. Tem certeza que está pegando o elemento certo?'
			);
		}
	}

})(window, jQuery)
