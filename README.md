# Validator

>A lightweight and flexible Javascript validation module.

>**Version** :`2.0.0`

>**Dependencies**: `jQuery` or `Zepto` or any `jQuery-like` library

>**Author**: [Eduardo Ottaviani](//github.com/javiani)

>**Demo**: [Demo](//codepen.io/Javiani/pen/KdXWJe)

>**AMD Demo ( Requirejs )**: [Demo](//codepen.io/Javiani/pen/qOPrzE)

---

Validator was designed to simplify our way to validate forms.
- Does not have any default behavior, so you don't need to overload methods and struggles unecessary default behaviors.
- Low learning curve
- Makes form validation more readable and maintainable
- You can validate partials sections of your form

### And... It doesn't need a form.

```js
var myholder = $('div.form');

v = Validator.create({ holder :myholder });

v.add( '.required' , { rules :{ required :true } });
v.add( '.number' , { rules :{ number :true } });
v.add( 'input[type=email]' , { rules :{ email :true } });
v.add( 'input[type=file]' , { rules :{ accept :'jpg|png|gif' } });


v.validate(); // true or false

```

### Setting all together :

```js
var instance = Validator.create({ holder :$('div.section-required') });
	instance.add_all({
		'.required' :{
			rules :{
				required :true
			}
		},
		'.number' :{
			rules :{
				number :true
			}
		},
		'.email' :{
			rules :{
				email :true
			}
		}
	});
```

## Defining a rule

```js
Validator.add_rule('required', function(field, bool){

	//bool keeps boolean value of the rule.
	if(!bool) return true; // Ok! move on required is set to false.

	var value = field.value.trim();

	if( value )
		// Ok, there's a value, it's valid.
		return true;
	else
		// Oh...the required rule was not satisfied. Field is invalid.
		return false;
});
```

## Defining default messages

```js
Validator.add_messages({
	required : 'Hey, this field is required',
	email    : 'Invalid email!'
});
```

## Overriding default messages on definition

```js
instance.add({
	'.required' :{
		rules :{ required :true },
		messages :{
			required : 'Sorry, you have to fill username field =)'
		}
	}
});
```

## API

#### .validate() : `Boolean`

This method will trigger validation, and will return true if it's valid and false otherwhise.

```js
var is_valid = instance.validate();
```

#### .remove( 'name' )

Removes a group from validation.

```js
instance.remove('.required');
```

#### .test( DOM | jQuery element ) : `Object`

Test if a element is valid or not, also returns some validations properties.

```js
v.test( $('input.required').eq(0) );
```

#### .add( {definition} )

Adds a single element validation definition.

```js
v.add( '.required' , { rules :{ required :true } });
```

#### .add_all( {definitions} )

Adds all groups validations definitions at once. See [Setting all together](#setting-all-together) section.

#### .is_valid() : `Boolean`

Checks if the form is valid or not.


## Events

Validator triggers events for success or error.

#### .on('validator.success', Function )

This event will fire if the **.validate()** returns true;

```js
instance.on('validator.success', function(){
	var data = $('form.contact').serialize();
	$.post('/url/service', data);
});
```

#### .on('validator.error', function(error){} )

Here's where you have full control of what should be displayed for user when something is invalid on your form.

**Validator doesn't know your needs**, it's up to you to code and decide how messages errors should be rendered.

```js
instance.on('error', function(error){

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
Let that `div.section-required` in the example above to be a `holder`.

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

If you have several holders in the page, each one with your own validator instance, you'll be able to get the right instance of the holder you need.


##Going deeper…

But be careful doing that, one mask can override another and may do not work properly. For instance, if you setup `number|email` number will conflict with email since email accepts letters and number don't.

## Building

Validator is "compiled" using r.js that generates a bundle with validator/rules/messages classes.
If you want to do some changes on them, you'll have to put them all in the same folder and run: `./build`


##And that's it...

Of course, you can edit/add/remove rules.js or messages.js custom files as you wish, you can remove unwanted rules methods, or add your own, you can change all the default messages, add new ones or remove some unused.

## TODOS

- Reviews in Readme.md ✓
- To Improve documentation
- ~~Adding some plugins~~
- To create some "do everything" wrappers for lazy ones ( like me ).
