# Weigh My Luggage
Simply, this is a handy tool to weigh your luggage. The tool subtracts your body weight from the scale weight.

I recently needed to pack up my life and move to another country.  I used the weighing method of standing on a scale while holding a piece of luggage, then subtracing my body weight. At the time, I created an Excel file to keep track of weights and automatically subtract my body weight. This app is a user friendly version that anyone can use.

## Demo
Try it for yourself and use it before travelling!
[https://weighmyluggage.netlify.app](https://weighmyluggage.netlify.app)


## Screenshot
<img width="500" alt="Weigh My Luggage screenshot" src="https://user-images.githubusercontent.com/1920793/223249828-416917f4-1b02-4490-8c35-33fb5f844ed3.png">


## Features
- Easily see whether luggage is overweight or has free space.
- Provides helpful instructions on how much weight needs to be reduced.
- Add luggage rows by pressing `Enter`.
- Toggle between lb and kg.
- Results update as you type.

## UX considerations
- Tab index skips the delete luggage button which is a destructive action.
-	Precision up to one decimal place which is consistent with most home scales.
- Fade animations to highlight changes as the user types.
- Accessibility: Use both high contrast colour and shapes for alerts.

## Future
- [x] Add ability to edit luggage description.
- [ ] Input validation
- [ ] Fix 'add luggage' and 'calculate buttons' to bottom of screen if there are many luggage rows.
- [ ] Remove unused CSS and minify files.
