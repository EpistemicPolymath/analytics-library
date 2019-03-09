This script works with Google Analytics to track user interactions with the content on a website. The script will allow you to specify the elements on the website to be tracked and then viewed in Event reports.

A JSON file needs to be created in order to send information about each element to the script. This is an example of how a single JSON object should be formatted when it is sent to the script.
```javascript
{
          {
              selector: "#importantButton",
              category: "Buttons",
              action: "click",
              label: "This button was clicked",
              url: "\/?(.*)\/?"
            }
}
```
The **selector** property refers to the element(s) on the page that will be tracked. <br/>
The **category** property is the name that you supply as a way to group objects that can be tracked. *(E.g. "Videos")* <br/>
The **action** property names the type of event or interaction you want to track for the particular object. *(E.g. "Play")* <br/>
The **label** property provides additional information about events that are tracked. <br/>
The **url** property contains the REGEX requirements that refer to the pathname on the website that the element is on. This way we only check for the element on that specified page.<br/> 

The JSON file may contain multiple objects to refer to the elements on a website.


