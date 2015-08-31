/**
 *	@name
 *	@author Eduardo Ottaviani
 */
(function (root, factory) {

	if(typeof exports === 'object' && exports) {
		// CommonJS
		module.exports = factory( require('validator.rules'), require('validator.messages'), require('validator.plugins') );
	}else{

		if(typeof define === 'function' && define.amd) {
			define('validator', ['validator.rules', 'validator.messages', 'validator.plugins'], factory); // AMD
		}else{

			root.Validator = factory(root.Rules, root.Messages, root.Plugins); // <script>

			delete root.Rules;
			delete root.Messages;
			delete root.Plugins;
		}
	}

}(this, function( Rules, Messages, Plugins ){

	var V = {

		_class :function(o){

			var
				holder,
				hash = {}, _self = this;

			holder = (o && o.holder && o.holder.length)? o.holder :$('<div />');

			holder.on('validator.instance', get);
			holder.on('validator:instance', get);

			this.test = function(el){

				var options = { rules :{} };
				el = el.get? el :$(el);

				$.each(hash, function(query, value){
					if( el.is(query) || el.hasClass(query) ){
						$.extend( options.rules, value.rules );
					}
				});

				return validate( el, { rules :options.rules }, { list: [], map :{} } );
			};

			this.get = function(key){
				return hash[key];
			};

			this.on = function(name, method){
				holder.on( name, bind( method ) );
			};

			this.add = function( query, rules ){

				hash[ query ] = rules;
				Plugins.initialize( holder, rules, query );

				holder.trigger('validator.add', holder, rules, query);
				holder.trigger('validator:add', holder, rules, query);
				return this;
			};

			this.add_all = function(rules){

				hash = rules;
				Plugins.initialize( holder, rules );

				holder.trigger('validator.add', holder, rules);
				holder.trigger('validator:add', holder, rules);
				return this;
			};

			this.remove = function( name ){
				delete hash[ name ];
				holder.trigger('validator.remove', name);
				holder.trigger('validator:remove', name);
			};

			this.validate = function(){

				var errors = check( hash, holder );

				if( errors.list.length ){
					holder.trigger('validator.error', errors);
					holder.trigger('validator:error', errors);
				}else{
					holder.trigger('validator.success');
					holder.trigger('validator:success');
				}

				return !(!!errors.list.length);
			};

			this.is_valid = function(){
				return !(!!check( hash, holder ).list.length);
			};

			function get(e, callback){
				callback? callback( _self ) :null;
			}
		},

		internal :function(o){
			return({ Rule :Rules, Message :Messages, Plugin :Plugins })[o];
		},

		create :function(o){ return new this._class(o); }
	};

	function create(el, options){
		return{
			element	:el.get? el.get(0) :el,
			rules	:$.extend({}, options.rules),
			invalid_rules:{},
			messages:$.extend({ map:{}, list :[] }, { map: options.messages }),
			is_valid:true
		};
	}

	function validate( element, options, errors, scope ){

		var el = create( element, options );

		Rules.validate( el, options, add_error( errors ) );

		if( errors.list.length ){
			Messages.write_all( el, options );
		}

		Plugins.each_elements( el, options );

		return el;
	}

	function check( hash, scope ){

		var errors = { list: [], map :{} };

		$.each( hash, each_hash(scope, errors) );
		return errors;
	}

	function bind(method){
		return function(e, error){
			method( error );
		};
	}

	function each_hash(scope, errors){
		return function(selector, options){
			$(selector, scope).each( each_elements(options, errors, scope) );
		};
	}

	function each_elements(options, errors, scope){
		return function(i, element){
			validate( element, options, errors, scope );
		};
	}

	function add_error(errors){
		return function(el, name){
			errors.list.push(el);
			errors.map[name] = errors.map[name] || [];
			errors.map[name].push(el);
		};
	}

	return V;
}));
