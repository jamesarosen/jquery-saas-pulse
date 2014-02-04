## What ##

A jQuery plugin that makes instrumenting your web application with
[Totango](http://www.totango.com/) metrics easy. Totango uses
a 4-tuple to identify each event:

    [ activity, module, organization, user ]

jQuery-Totango will automatically track clicks and form submissions
on any element that has data attributes for all four pieces of information.
To reduce redundancy and make implementation easier, it will also
search up the DOM tree to fill in missing pieces of information.

## Installation ##

Include Totango's SDR library:

    <script src="//s3.amazonaws.com/totango-cdn/totango.js"></script>

Initialize the Totango tracker:

	try {
		var totango = new __totango(...);
	} catch (err) {
		// uncomment the alert below for debugging only
		// alert ("Totango code load failure, tracking will be ignored");
		quite = function () {};
		var totango = {
			track: quite,
			identify: quite,
			setAccountAttributes: quite
		};
	}		

Include jQuery-Totango:

    <script src='/javascripts/jquery-totango-0.2.js' defer></script>

## Usage ##

### Basics ###

To instrument tracking on only one element on a page, add four data
attributes to that element and apply `instrumentTracking` to it:

    <a href='#/foo/bar'
       id='foo_bar'
       data-totango-activity='bar'
       data-totango-module='foo'
       data-totango-organization='Example.org'
       data-totango-user='Chloe'>Bar my Foo</a>

    // whenever the <a> is clicked, the Totango SDR tracker is
    // called with ('bar', 'foo', 'Example.org', 'Chloe')
    $('#foo_bar').instrumentTracking();

### Reducing Duplication ###

In most applications, you'll want to instrument more than one element
on a page and elements will share tracking properties -- particularly
`organization` and `user`. In those cases, you can use the DOM tree's
inherent structure to reduce duplication:

    <body data-totango-organization='Example.org'
          data-totango-user='Chloe'>
      <section data-totango-module='foo'>
        <form action='#/foo/bar' id='foo_bar' data-totango-activity='bar'>
          <input type='submit' value='Bar my Foo' />
        </form>
      </section>
      <aside data-totango-module='sidebar'>
        <a href='#/baz' id='sidebar_baz' data-totango-activity='baz'>Baz</a>
      </aside>
    </body>

    // Whenever the <form> is submitted, the Totango SDR tracker is
    // called with ('bar', 'foo', 'Example.org', 'Chloe').
    // Whenever the <a> is clicked, it is called with
    // ('baz', 'sidebar', 'Example.org', 'Chloe').
    $('#foo_bar, #sidebar_baz').instrumentTracking();

### Less-Specific Selectors ###

If you call `instrumentTracking()` on elements that don't have all four
data attributes (either themselves or inherited from parents), no call
will be made to Totango. Nonetheless, it is suggested that you be as
specific as possible since the search up the DOM tree can become expensive
when run on every single click on a page.

### Manually Tracking an Activity ###

You may want to track an event other than a `click` or form `submit`. If so,
you can call `trackEvent` on an element, which will send a single tracking
call to the SDR library. You can override the `activity`, `module`,
`organization`, or `user` that would be fetched from data attributes by
passing an `Object` hash with them to the `trackEvent` call.

For example, say you want to track every time somebody
fails to fill in a field on your sign-in form:

    <body data-totango-organization='Example.org'
          data-totango-user='Chloe'>
      <form class='sign_in' data-totango-module='Sign-In'>
        ...
      </form>
    </body>

    $('form.sign_in input').blur(function() {
      if ($(this).val() === '') {
        $(this).trackEvent({ activity: 'skip-required' });
      }
    });


### Custom Tracker Object ###

By default, the plugin uses the global `tracker` object, as described by
the Totango documentation. If you have namespaced your tracker, simply
pass it to the `instrumentTracking` call:

    MyApp.totangoTracker = ...

    $('#foo,.bar).instrumentTracking(MyApp.totangoTracker);

or, when manually tracking an activity, pass it as the `tracker` option
in the `options` hash:

    $(this).trackEvent({ tracker: MyApp.totangoTracker, activity: 'ignore' });
