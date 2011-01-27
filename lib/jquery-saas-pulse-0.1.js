(function(window, $, undefined) {

  // Finds the closest definition of the given SaaSPulse property;
  // searches up the DOM tree until it finds an element with the property.
  // @api private
  // @param [jQuery node or DOM element] the starting node for the search
  // @param [String] the SaaSPulse property name
  // @return [String] the value
  var lookUpSaaSPulseProperty = function(startNode, propertyName) {
    propertyName = 'data-saas-pulse-' + propertyName;
    return $(startNode)
      .closest('[' + propertyName + ']')
      .attr(propertyName);
  };

  $.fn.extend({

    // Adds SaaSPulse tracking to the current element.
    // If the element is a form, adds an onSubmit handler;
    // Otherwise, adds an onClick handler.
    // @param [SaaSPulse SDR Tracker] the tracker instance; optional, defaults to window.tracker
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
      var activity      = options.activity      || lookUpSaaSPulseProperty(this, 'activity');
      var module        = options.module        || lookUpSaaSPulseProperty(this, 'module');
      var organization  = options.organization  || lookUpSaaSPulseProperty(this, 'organization');
      var user          = options.user          || lookUpSaaSPulseProperty(this, 'user');

      if (tracker && activity && module && organization && user) {
        tracker.track(activity, module, organization, user);
      }

      return self;
    }

  });
})(window, jQuery);
