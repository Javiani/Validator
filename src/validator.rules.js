/**
 *	@name
 *	@author Eduardo Ottaviani
 */
(function (root, factory) {

	if (typeof exports === 'object' && exports) {
		module.exports = factory(); // CommonJS
	}else{

		if (typeof define === "function" && define.amd) {
			define( 'validator.rules', factory() ); // AMD
		}else{
			root.Rules = factory(); // <script>
		}
	}

}(this, function(){

	var
		R, rules = {};

	R = {

		get :function(){ return rules; },

		add :function(name, method){

			if( name in rules ){
				console.log('Rules.add::exception', 'Duplicated method', name);
				return;
			}

			rules[name] = method;
		},

		add_all :function(r){
			rules = r;
		},

		test :function(element, name, options){

			if( !(name in rules) ){
				console.log('Rules.test::exception', 'There is no method', name);
				return false;
			}

			return rules[name].call(null, element, options);
		},

		validate :function(el, options, callback){

			var
				valid = true, _self = this;

			$.each(options.rules, function(name, value){

				if(!_self.test( el.element, name, value )){

					el.invalid_rules[name] = value;
					el.is_valid = false;
					callback? callback.call(null, el, name) :null;
				}
			});

			return valid;
		}
	};

	return R;
}));
