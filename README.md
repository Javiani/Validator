#Validator

Validator is a simple, easy to use tool for client-side validation. It was born inspired in the very known [jQuery Validation plugin](http://jqueryvalidation.org/).

The Validator project give less plug and more control for you to choose what do you want to do with validation errors, and what to do when the form is valid, this can be very handful if your project needs to show messages in some very specific way. Also, Validator has a pretty low learning curve.


##Getting started

First, you need to load 3 main Validator files:

#### 1. validator.js
The main validator class with all methods and properties.

#### 2. validator.messages.js
Default messages for rules.

#### 3. validator.rules.js
File containing all available rules.


##### Then, if you want all elements with class name "required" to be mandatory:

```
var instance = Validator.create( $('form') );
	instance . validate({
		'.required' :{
			rules :{
				required :true
			}
		}
	});
```
And there you go! It can't be more simple. 

This setup will bind a validation in the form passed in `create()` method.
 

## Binding events


If the form is valid, submit will be fired as usual, if it's not, form submit action will be prevented.


### Success

In case you don't want to submit form in success, for instance, if it's an ajax request, you can prevent default submit form action.

```
instance.bind('success', function(form){
	var data = form.serialize();
	$.post('/url/service', data);
	return false; //This will prevent default behavior 
});

```

### Error

Here's where you have full control of what should be displayed for user when something is invalid on your form. 

**Validator don't know what you want**, it's up on you to code and decide how messages errors should be rendered.

```
instance.bind('error', function(error_list, error_map){

	console.log( error_list, error_map ); 
	// Is always a good idea to take a look into the object.

	var 
		form = instance.handler,
		msg = $('#messages').empty();
	
	$.each( error_list, function(i){
		msg.append( '<p>' + this.message[0] + '</p>' );
		// This will list all first error list in the 
	});

});

```
##Custom Messages

Let's say you want to give a unique message for a single input element:


```
instance.validate({

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

You can customize any input you want just adding a messages attribute and setting a custom message for a rule. The default message will overwrite only `#username` required message.


##Plugins

Is easy to extend Validator with new rules or plugins. You can add some brand new behaviors and save a lot of work in your projects.

Validator already comes with a plugin called `mask` and some default mask methods such as `accept`, `digits`, `email`, `letters`, `date` and some others methods.

```
instance.validate({
	'.number' :{
		rules :{ required :true },
		mask  :'digits'
	}
});
```


##And that's it...

Of course, you can edit/add/remove validator.rules or validator.messages files as you wish, you can remove unwanted rules methods, or add you own, you can change all the default messages, add new ones or remove some unused. 


