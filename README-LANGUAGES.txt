WHOLE-WEBSITE LANGUAGE SWITCH

Open index.html using Live Server or your existing deployment. Select a Bible language in the reader to change the interface language for the entire main site. The preference is saved for your next visit, including the login page.

Interface localization: English, Tagalog, Cebuano/Bisaya, Waray-Waray; partial UI coverage for Ilocano and Hiligaynon when editions are available. Some interface text stays English where no verified localization was written.
Bible text: Uses the selected translation from the same free Bible APIs as before. No AI-generated Scripture.
Daily verse: Fetches the selected Bible verse when supported.
Search: Search service is English KJV only; interface and caveat are localized. Search results remain English.
Favorites: Already-saved text stays in its original translation.
Privacy and Terms documents remain in English to avoid introducing misleading legal translations.

Files must remain together. Upload the folder contents to your website hosting root.

UPDATE: The language dropdown is now beside Home in the top navigation. The original reader dropdown was moved, not duplicated.

FINAL UPDATE (2026-11-16)
- Language dropdown now sits at the far right of the header, immediately before Sign Out.
- Fixed obsolete mobile navigation handler that previously stopped JavaScript startup.
- Removed duplicate Firebase auth-guard import from index.html.
- Confirmed local JS syntax; network API and OAuth still require browser testing on deployed origin.
- The list of extra Philippine translations is determined by live API availability and license information.
- Browser storage holds language, favorites, and read progress on this device. These are not synced to Firebase.
