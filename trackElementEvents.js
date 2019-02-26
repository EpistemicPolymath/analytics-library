function trackElementEvents(elementList) {
  // For Testing
  function ga() { console.log(arguments); };
  // Google Analytics Custom Code
  window.onload = function customAnalyticsScript() {
  // ForEach that goes through all elements in the list using a switch case to set event listeners and send data to analytics
  elementList.forEach(function(element) {
      // Grab elements
      let elements = document.querySelectorAll(element.selector);
      // If queryselector got multiple or individual elements
      // Send each individual element from array with a forEach
      elements.forEach(function(trackedElement) {
        // Optional Event Section
        // https://stackoverflow.com/questions/154059/how-to-check-empty-undefined-null-string-in-javascript
        // If an event has been provided and is not empty
        if (element.hasOwnProperty('event')) {
              trackedElement.addEventListener(element.event, function() {
                  // Now we can start sending analytics for this special case
                  ga('send', {
                      hitType: 'event',
                      eventCategory: element.category,
                      eventAction: element.action,
                      eventLabel: element.label
                  });
              });
              // https://stackoverflow.com/questions/31399411/go-to-next-iteration-in-javascript-foreach-loop
              return; // This skips this element in the iteration so that it does not go to the switch statement.
        }
        // Solution - https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName
        switch(trackedElement.tagName.toLowerCase()) {
            // <button> tag case
            case "button":
                // Adds a listener for the button click event
                trackedElement.addEventListener("click", function(event) {
                    // Now we can start sending analytics
                    ga('send', {
                        hitType: 'event',
                        eventCategory: element.category,
                        eventAction: element.action,
                        eventLabel: element.label
                    });
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
                ga('send', {
                    hitType: 'event',
                    eventCategory: element.category,
                    eventAction: element.action,
                    eventLabel: element.label
                });
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
                      ga('send', {
                          hitType: 'event',
                          eventCategory: element.category,
                          eventAction: element.action,
                          eventLabel: element.label,
                          hitCallback: submitForm
                      });
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
                      ga('send', {
                        hitType: 'event',
                        eventCategory: element.category,
                        eventAction: element.action,
                        eventLabel: element.label
                      });
                });
                break;
        } // End of Switch
      });
  });
}; // End of customAnalyticsScript
};
