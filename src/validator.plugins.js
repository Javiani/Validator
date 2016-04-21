/**
 *	@name
 *	@author Eduardo Ottaviani
 */
(function (root, factory) {

	if (typeof exports === 'object' && exports) {
		module.exports = factory(); // CommonJS
	}else{

		if (typeof define === "function" && define.amd) {
			define( factory() ); // AMD
		}else{
			root.Plugins = factory(); // <script>
		}
	}

}(this, function(){

	var
		P, M, plugins = {};

	P = Mixin.apply({

		initialize :function( holder, rules, query ){

			return query?
				start_single( query, rules, holder )
				:start_all( rules, holder );
		},

		add :function( name, object ){
			plugins[ name ] = Mixin.apply( object );
		},

		get :function( name ){
			return plugins[ name ];
		},

		each_elements :function( elements, options ){
			each_elements( elements, options );
		}
	});

	function each_elements( elements, options ){

		$.each( plugins, function(){
			this.each_elements( elements, options );
		});
	}

	function start_single( query, options, holder ){

		$.each( plugins, function(name){
			if(name in options){
				plugins[name].initialize( $(query), options[name], holder );
			}
		});
	}

	function start_all(rules, holder){

		$.each( rules, function(query, options){
			start_single( query, options );
		});
	}

	function Mixin(){

		this.initialize  = this.initialize || function(){};
		this.each_elements = this.each_elements || function(){};

		return this;
	}

	return P;
}));
