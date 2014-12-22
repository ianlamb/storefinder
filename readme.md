STORE FINDER - UI PROTOTYPE

Demo - http://ianlamb.com/app/storefinder/

Notes
===========
Three ways to implement the "Review Stores" portion of this:
- pure Javascript, single-page application style (simple)
- through form post variables (better implementation imo, but needs server-side code)
- session saving on the back-end which can serve up session data each request (best implementation for big applications, but can be a resource hog and long time to implement)


Test Cases
===========
FILTERING
- select country > loads provinces, loads stores, keeps filter state, handles deselecting and clears store results, handles no data
- select province > loads cities, loads stores, keeps filter state, handles deselecting and returns to country filter level, handles no data
- select city > loads stores, keeps filter state, handles deselecting and returns to province filter level, handles no data
- enter store name > filters loaded stores on keyup (live)
- remove store name > clears name filter and returns to higher filter level

SELECTING STORES
- click filtered store > adds selected store, cannot add same store twice, can add a store back after it's removed
- click 'x' on selected store, removes store from selected stores list, if no stores selected disable continue btn

MOBILE
- size to mobile > adds blank options, reduces comboboxes to dropdowns
- size to desktop > removes blank options, expands dropdowns to comboboxes

CONTINUE
- click 'continue' > animates to the review stores section, loads selected stores list with location details, disabled until a store is selected
- click 'back' > animates back to the store finder section, retains all previous filters/selections
- animation remains smooth on all window sizes and the two sections never overlap or clip each other
