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
    // @param [Totango SDR Tracker] the totango instance; optional, defaults to window.totango
    // @return [jQuery node list] the receiver, as a jQuery node list
    instrumentTracking: function(tracker) {
      totango = totango || window.totango;
      var handler = function() { $(this).trackEvent({ totango: totango }); };
      return $(this)
        .each(function(i, node) {
          node = $(node);
          if (node.get(0).nodeName.toLowerCase() === 'form') {
            node.submit(handler);
          } else {
            node.click(handler);
          }
        });
    },

    // Send a tracking event.
    // @param [Object] overrides, possibly containing "activity", "module",
    //                 "organization", "user", and "totango" properties; optional
    // @return [jQuery node list] the receiver, as a jQuery node list
    trackEvent: function(options) {
      var self = $(this);
      options           = options               || {};
      var totango       = options.totango       || window.totango;
      var activity      = options.activity      || lookUpTotangoProperty(this, 'activity');
      var module        = options.module        || lookUpTotangoProperty(this, 'module');
      var organization  = options.organization  || lookUpTotangoProperty(this, 'organization');
      var user          = options.user          || lookUpTotangoProperty(this, 'user');

      if (totango && activity && module && organization && user) {
        totango.track(activity, module, organization, user);
      }

      return self;
    }

  });
})(window, jQuery);
