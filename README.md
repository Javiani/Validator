#Validator

Validator is a simple, easy to use tool for client-side validation. It was born inspired in the very known [jQuery Validation plugin](http://jqueryvalidation.org/).

Validator gives you:

- Simple validation api
- Low learning curve
- Less headaches 


##Getting started

First, you need to load 3 main Validator files:

#### 1. validator.js
The main validator class with all methods and properties.

#### 2. messages.js
Default messages for your rules.

#### 3. rules.js
File containing all available validation methods.


##### Then, if you want all elements with class name "required" to be mandatory:


###.add( {} )

```js
var instance = Validator.create({ holder :$('div.section-required') });
	instance.add({
		'.required' :{
			rules :{
				required :true
			}
		}
	});
```
And there you go! It can't be more simple. The div.section-required is your holder containing .required elements, it can be a div or the whole form if you will =).

### .add_all( {} )

Or you can set all the rules at once to be more easy:

```js
var instance = Validator.create({ holder :$('form.contact') });
	instance.add_all({
		'.required' :{ rules :{ required :true }},
		'.email' :{ rules :{ email :true  }},
		'.number' :{ rules :{ number :true }}
	});
```

###.remove( 'name' )

You can either remove that rules from the validation too:

```js
var instance = Validator.create({ holder :$('div.section-required') });
	instance.remove('.required');
```

###.validate() : true | false

This method will trigger validation, and will return true if it's valid and false otherwhise.

```js
var is_valid = instance.validate();
```

## Events

Validator triggers events for success or error.

### .on('validator.success', Function )

This event will fire if the **.validate()** returns true;

```js
instance.bind('validator.success', function(){
	var data = $('form.contact').serialize();
	$.post('/url/service', data);
});
```

### .on('validator.error', function(error){} ) 

Here's where you have full control of what should be displayed for user when something is invalid on your form. 

**Validator don't know what you want**, it's up to you to code and decide how messages errors should be rendered.

```js
instance.bind('error', function(error){
	
	console.log( error.list, error.map ); 
	// Is always a good idea to take a look into the object.
	
	var 
		form = $('form.contact'),
			feedback = $('.messages').empty();
	
	$.each( error.list, function(i){
		feedback.append( '<p>' + this.messages.list[0] + '</p>' );
		// This will show a list with the first message of each invalid fields.
	});
});
```

## Events - Pub/Sub

Sometimes we need to bind some events in the html elements, and it can be very handy… 

```js
var instance = Validator.create({ holder :$('div.section-required') });
```

Do you see that `div.section-required` in the example above used as a holder for validator? Let's call it `holder`.

##### Your holder will fire the following events:

### on('validator.add', Function)

Will be fired on every call of `.rules()` or `.add()` instance methods.


### on('validator.remove', Function)

Will be triggered on every `.remove()` instance method calls.


### on('validator.instance', Function(instance))

That's seems a little weird.. but it will save you trust me…

There some times when you really need to get the instance from other module or some other script scope… That's when and you will see yourself trying to get the instance by adding new methods and send them by parameters and everything and you're code can be a mess..

In this case, `get-validator` event can help you a lot. You can get the validator  instance by triggering manually this event:

```js
	var instance;
	$('.form-holder').trigger('validator.instance', function(validator){
		instance = validator;
		// Now you do whatever you want =)
	});
```

You see, if you have several holders in the page, each one with your own validator instance, you'll be able to get the right instance of the holder you need.


## Messages

The messages for each rule are defined in the `messages.js` **( Getting Started )**
But you can override them for some group of elements:

```js
instance.add({
	'.required' :{
		rules :{ required :true }
	},
	'#username' :{
		rules :{
			required :true	
		},
		messages :{
			required : 'Sorry, you have to fill username field =)'
		}
	}
});
```

```html
	<input type="text" name="email" class="required email" />
	<input type="text" id="username" name="username" />
```


You can customize any input element you want just adding a messages attribute and setting a custom message for a rule. The default message will overwrite only `#username` required message.

**I've already provided some messages, you can customize them as you want =).**


##Plugins

Is easy to extend Validator with new rules or plugins. You can add some brand new behaviors and save a lot of work in your projects.

Validator already comes with a plugin called `mask` and some default mask methods such as `accept`, `digits`, `email`, `letters`, `date` and some others methods.

```js
instance.add_all({
	'.number' :{
		rules :{ required :true },
		mask  :'digits'
	}
});
```

If you want more then one mask just add more with "|" separator:

```js
instance.add_all({
	'.number' :{
		rules :{ required :true },
		mask  :'my-new-mask|my-other-mask|and-other'
	}
});
```

But be careful doing that, one mask can override another and may do not work properly. For instance, if you setup `number|email` number will conflict with email since email accepts letters and number don't.



##Going deeper…


##Internals

###.internal('Type') : { Rule | Message | Plugin }

You can extend **Validator** by using some internal objects of the library.

For messages or rules you can't do much but adding more methods for rules verifications or adding new messages as you can see in the messages.js and rules.js.

But if you won't trully extend validation with new features you probably will use `.internal('Plugin')`.

That's because validator won't give you too much access to his implementation, but it can provide some action points that can be used for calling methods and/or receiving some relevant data.

Using plugins you have 2 important methods:

#### .initialize( {elements}, {options} )

Implement this interface if you need to start up you plugin with the options setted on `.add()` or `.add_all()` instance methods.

`elements` will be the jqueries and `options` will be the object containing rules, messages and stuff.


#### .each_elements( {element}, {options } )

Implement this interface if you need to do something for each validated element  when you call `.validate()` method.

In this case, `element` will be the current validated element in the foreach statement and `options` will be the options defined just for that element.

```js
	var P, Newplugin;
	P = Validator.internal('Plugin');

	P.add('my-plugin', Newplugin = {

		initialize :function(elements, options){
			console.log( elements, optinos );
		},
		
		each_elements :function(element, options){
			console.log( element, options );
		}
	});
```

If it's not clear what `each_elements` does, you can always print the objects in the console.log to help you.


## Building

Validator2 is "compiled" using r.js that generates a compact version of the validator/rules/messages classes.

If you want to do some changes on them, you'll have to put them all in the same folder and run: `./build`


##And that's it...

Of course, you can edit/add/remove rules.js or messages.js custom files as you wish, you can remove unwanted rules methods, or add your own, you can change all the default messages, add new ones or remove some unused. 

## TODOS

- Reviews in Readme.md
- To Improve documentation
- Adding some plugins
- To create some "do everything" wrappers for lazy ones ( like me ).


