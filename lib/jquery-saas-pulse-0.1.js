jQuery.fn.extend({

  // Adds SaaSPulse tracking to the current element.
  // If the element is a form, adds an onSubmit handler;
  // Otherwise, adds an onClick handler.
  // @param [SaaSPulse SDR Tracker] the tracker instance; optional, defaults to window.tracker
  // @return [jQuery node list] the receiver, as a jQuery node list
  instrumentTracking: function(tracker) {
    tracker = tracker || window.tracker;
    var handler = function() { jQuery(this).trackEvent({ tracker: tracker }); };
    return jQuery(this)
      .each(function(i, node) {
        node = jQuery(node);
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
    var self = jQuery(this);
    options           = options               || {};
    var tracker       = options.tracker       || window.tracker;
    var activity      = options.activity      || self._lookUpSaaSPulseProperty('activity');
    var module        = options.module        || self._lookUpSaaSPulseProperty('module');
    var organization  = options.organization  || self._lookUpSaaSPulseProperty('organization');
    var user          = options.user          || self._lookUpSaaSPulseProperty('user');

    if (tracker && activity && module && organization && user) {
      tracker.track(activity, module, organization, user);
    }

    return self;
  },

  // Finds the closest definition of the given SaaSPulse property.
  // @api private
  // @param [String] the SaaSPulse property name
  // @return [String] the value
  _lookUpSaaSPulseProperty: function(propertyName) {
    propertyName = 'data-saas-pulse-' + propertyName;
    return jQuery(this)
      .closest('[' + propertyName + ']')
      .attr(propertyName);
  }

});
