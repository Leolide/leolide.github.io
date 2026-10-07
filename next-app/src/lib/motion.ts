// Shared motion tokens (Emil Kowalski's values). Use these instead of hand-typed curves.
//   EASE_OUT    — strong ease-out for anything entering/exiting: starts fast, settles softly
//   EASE_IN_OUT — strong ease-in-out for things moving on screen
// Same curves exist in CSS as --ease-out / --ease-in-out (globals.css).
export const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.77, 0, 0.175, 1];
