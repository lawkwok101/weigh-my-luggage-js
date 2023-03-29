# Weigh My Luggage
This handy tool weighs your luggage by subtracting your body weight from the scale weight.

Determining luggage weight using a scale is straightforward: stand on a scale while holding a piece of luggage, then subtract your body weight. However, it’s cumbersome to keep track of all the numbers when you have multiple bags and have to constantly rearrange them. This tool clearly shows you which bags are overweight and which bags have room so you don't pay for overweight bag fees again.

## Demo
Try it for yourself and use it before travelling!
[https://weighmyluggage.netlify.app](https://weighmyluggage.netlify.app)


## Screenshot
<img width="550" alt="Weigh My Luggage screenshot" src="https://user-images.githubusercontent.com/1920793/227598989-6b49e5ac-8f63-45ac-a456-3e90c2f09599.png">


## Features
After filling out the required fields, an overweight or free space label will appear beside each luggage. The message area at the bottom provides a summary of how much weight needs to be reduced, whether you have room in other bags, or if you need to remove some items.

### Other helpful features include
- Add luggage rows by pressing `Enter`.
- Toggle between lb and kg.
- Results that update as you type.

## UX considerations
-	Precision up to one decimal place which is consistent with most home scales.
- Tab index skips the delete luggage button which is a destructive action.
- Pressing `Enter` tabs through luggage rows. A new luggage row is added if tab focus is on the last row.
- Results are highlighted for visual feedback as the user types.
- Added slight delay so results are updated after typing is finished.
- Accessibility: Use high contrast colour, shapes, and underlines for alerts.
