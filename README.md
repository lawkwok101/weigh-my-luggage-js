# Weigh My Luggage
Simply, this handy tool weighs your luggage by subtracting your body weight from the scale weight.

Determining luggage weight using a scale is straightforward: stand on a scale while holding a piece of luggage, then subtract your body weight. However, it’s cumbersome to keep track of all the numbers when you have multiple bags and have to constantly rearrange them. This tool clearly shows you which bags are overweight and which bags have room so you don't pay for overweight bag fees again.

## Demo
Try it for yourself and use it before travelling!
[https://weighmyluggage.netlify.app](https://weighmyluggage.netlify.app)


## Screenshot
<img width="550" alt="Weigh My Luggage screenshot" src="https://user-images.githubusercontent.com/1920793/227598989-6b49e5ac-8f63-45ac-a456-3e90c2f09599.png">


## Features
- Easily see whether luggage is overweight or has free space.
- Provides helpful instructions on how much weight needs to be reduced.
- Add luggage rows by pressing `Enter`.
- Toggle between lb and kg.
- Results update as you type.

## UX considerations
-	Precision up to one decimal place which is consistent with most home scales.
- Tab index skips the delete luggage button which is a destructive action.
- Results are highlighted for visual feedback as the user types.
- Added slight delay so results are updated after typing is finished.
- Accessibility: Use high contrast colour, shapes, and underlines for alerts.

## Future
- [ ] Improve mobile experience.
- [ ] Fix 'add luggage' and 'calculate buttons' to bottom of screen if there are many luggage rows.
- [ ] Remove unused CSS and minify files.
