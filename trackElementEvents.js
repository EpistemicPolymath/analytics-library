function trackElementEvents(elementList) {
  //Send Tracking for either gtag or ga
  // The callback parameter will refer to a function to callback
  function sendTracking(action, category, label, callback) {
      // We can check to see if the callback is a function and if so call it, then log a success message
      var ourCallback = function() {
        typeof callback === 'function' && callback();
        console.log('analytics event sent!');
      }
      if (typeof gtag === "function") { // Check for gtag
          // The gtag function exists
          // Send the data with gtag
          gtag('event', action, {
              event_category: category ,
              event_label: label,
              event_callback: ourCallback
          });
          return; // Break out the function
      }
      if (typeof ga === "function") { // Check for ga
        // The ga function exists
        // Send the data with ga
          ga('send', {
              hitType: 'event',
              eventCategory: category,
              eventAction: action,
              eventLabel: label,
              hitCallback: ourCallback
          });
          return; // Break out the function
      }
      console.error("The gtag or ga function is required for the analytics script to work."); // If all else fails, throw and error
  }
  // ForEach that goes through all elements in the list using a switch case to set event listeners and send data to analytics
  elementList.filter(function(element) {
      // Check Required URL For Filtering
      // window.location.href - How we know where we are on the site
      // https://stackoverflow.com/questions/6603015/check-whether-a-string-matches-a-regex-in-js
      return (new RegExp(element.url)).test(window.location.pathname);
  }).forEach(function(element) {
      // Grab elements
      var elements = document.querySelectorAll(element.selector);
      // Check if the element(s) exist on the page
      // https://css-tricks.com/snippets/jquery/check-if-element-exists/
      if (elements.length === 0) {
          // The element(s) do not exist
          console.warn("This element does not exist on the page: " + element.selector);
          console.debug("Is this check working properly?" + elements);
          return; //This should skip this empty iteration of elements
        }
      // If queryselector got multiple or individual elements
      // Send each individual element from array with a forEach
      elements.forEach(function(trackedElement) {
        // Optional Event Section
        // https://stackoverflow.com/questions/154059/how-to-check-empty-undefined-null-string-in-javascript
        // If an event has been provided and is not empty
        if (element.hasOwnProperty('event')) {
              trackedElement.addEventListener(element.event, function() {
                  // Now we can start sending analytics for this special case
                  sendTracking(element.action, element.category, element.label);
                  console.info("Sending event for selector: " + element.selector);
                  console.debug("Did the right event send" + element.event);
              });
              // https://stackoverflow.com/questions/31399411/go-to-next-iteration-in-javascript-foreach-loop
              return; // This skips this element in the iteration so that it does not go to the switch statement.
        }
        // Solution - https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName
        switch(trackedElement.tagName.toLowerCase()) {
            // <button> tag case
            case "button":
            case "div":
                // Adds a listener for the button click event
                trackedElement.addEventListener("click", function(event) {
                    // Now we can start sending analytics
                    sendTracking(element.action, element.category, element.label);
                    console.info("Sending event for selector: " + element.selector);
                });
                break;
            // <a> tag case
            case "a":
                trackedElement.addEventListener("click", function(event) {
                // We may want to prevent default action for a link similarly to <forms>
                event.preventDefault();
                // Creates timeout for 1 second and then goes to link
                setTimeout(goToLink, 1000);
                //Keep track of whether or not link has navigated
                var hasNavigated = false;
                function goToLink() {
                  // Solution - https://stackoverflow.com/questions/10945478/can-i-execute-a-link-after-a-preventdefault
                    if (!hasNavigated) {
                        // If the link has not yet navigated set variable to true and allow link to navigate
                        hasNavigated = true;
                        window.location.href = trackedElement.getAttribute("href");
                    }
                }
                //  Then we can send the event to Google analytics
                sendTracking(element.action, element.category, element.label);
                console.info("Sending event for selector: " + element.selector);
            });
                break;
            // <form> tag case
            case "form":
                trackedElement.addEventListener("submit", function(event) {
                      //Prevents the browser from submitting the form and unloads the page
                      event.preventDefault();
                      // Creates a timeout after 1 second then calls to submit the form in case the library fails to load
                      setTimeout(submitForm, 1000);
                      // Keep track of whether ot not the form has been submitted. This prevents double form submission
                      // Set initial value (Form is not submitted yet)
                      var isFormSubmitted = false;
                      function submitForm() {
                          if (!isFormSubmitted) {
                              // If form has not yet been submitted set variable to true and then submit form
                              formSubmitted = true;
                              trackedElement.submit();
                          }
                      }
                      // Then we can send the event to Google analytics
                      sendTracking(element.action, element.category, element.label, submitForm);
                      console.info("Sending event for selector: " + element.selector);
                });
                break;
            // <input> tag case
            // Solution found - https://stackoverflow.com/questions/13207927/switch-statement-multiple-cases-in-javascript
            case "input":
            case "select":
            case "textarea":
                // If we need to we can check for specific input cases with this
                // Solution - https://stackoverflow.com/questions/3510867/finding-the-type-of-an-input-element : trackedElement.type
                // Setup "change" event listener for inputs
                trackedElement.addEventListener("change", function(event) {
                      // Now we can start sending analytics
                      sendTracking(element.action, element.category, element.label);
                      console.info("Sending event for selector: " + element.selector);
                });
                break;
            default:
                console.error("An unexpected element tag was found that we do not currently know how to parse");
                console.debug("Is this really a default case scenario?" + trackedElement.tagName.toLowerCase());
        } // End of Switch
      });
  });
};
