# Weigh My Luggage
Simply, this is a handy tool to weigh your luggage. The tool subtracts your body weight from the scale weight.

I recently needed to pack up my life and move to another country.  I used the weighing method of standing on a scale while holding a piece of luggage, then subtracing my body weight. At the time, I created an Excel file to keep track of weights and automatically subtract my body weight. This app is a user friendly version that anyone can use.

# Demo
Try it for yourself and use it before travelling!
[https://weighmyluggage.netlify.app](https://weighmyluggage.netlify.app)

## Screenshot
<img width="500" alt="App screenshot" src="https://user-images.githubusercontent.com/1920793/221996309-86a14f80-0654-4953-998b-03e1a4afd170.png">

## Features
- Know when any luggage is over your airline's max weight.
- Easily see which luggage has free space to redistribute weight.
- Provides helpful instructions on how much weight needs to be reduced.
- Add and remove luggage rows.
- Toggle between lb and kg.

## UX considerations:
- Tab index skips the delete luggage button which is a destructive action.
-	Precision up to one decimal place which is consistent with most home scales.
- Inline error notifications.

## Future:
- [x] Add ability to edit luggage description.
- The app uses the [Content Template element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template). Older browsers [may not support this feature](https://caniuse.com/template). 
- Fix 'add luggage' and 'calculate buttons' to bottom of screen if there are many luggage rows.
- Make a live-updating version using ReactJS.
- Remove unused CSS and minify files.
