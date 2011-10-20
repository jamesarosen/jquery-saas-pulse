(function(window, $, undefined) {

  // Finds the closest definition of the given Totango property;
  // searches up the DOM tree until it finds an element with the property.
  // @api private
  // @param [jQuery node or DOM element] the starting node for the search
  // @param [String] the Totango property name
  // @return [String] the value
  var lookUpTotangoProperty = function(startNode, propertyName) {
    propertyName = 'data-totango-' + propertyName;
    return $(startNode)
      .closest('[' + propertyName + ']')
      .attr(propertyName);
  };

  $.fn.extend({

    // Adds Totango tracking to the current element.
    // If the element is a form, adds an onSubmit handler;
    // Otherwise, adds an onClick handler.
    // @param [Totango SDR Tracker] the tracker instance; optional, defaults to window.tracker
    // @return [jQuery node list] the receiver, as a jQuery node list
    instrumentTracking: function(tracker) {
      tracker = tracker || window.tracker;
      var handler = function() { $(this).trackEvent({ tracker: tracker }); };
      return $(this)
        .each(function(i, node) {
          node = $(node);
          if (node.attr('tagName').toLowerCase() === 'form') {
            node.submit(handler);
          } else {
            node.click(handler);
          }
        });
    },

    // Send a tracking event.
    // @param [Object] overrides, possibly containing "activity", "module",
    //                 "organization", "user", and "tracker" properties; optional
    // @return [jQuery node list] the receiver, as a jQuery node list
    trackEvent: function(options) {
      var self = $(this);
      options           = options               || {};
      var tracker       = options.tracker       || window.tracker;
      var activity      = options.activity      || lookUpTotangoProperty(this, 'activity');
      var module        = options.module        || lookUpTotangoProperty(this, 'module');
      var organization  = options.organization  || lookUpTotangoProperty(this, 'organization');
      var user          = options.user          || lookUpTotangoProperty(this, 'user');

      if (tracker && activity && module && organization && user) {
        tracker.track(activity, module, organization, user);
      }

      return self;
    }

  });
})(window, jQuery);
