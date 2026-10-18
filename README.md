# IGDC

Persian, RTL, light-only static website with the local Ravi variable font.

## Changes in this revision

- index.html: horizontal member rail (up to 10), compact all-members link, phone and Instagram inputs, Telegram contact.
- gallery.html and members.html: Telegram footer and event navigation.
- form.html: legacy registration entry now lists event registration links.
- assets/main.css and assets/site.css: Ravi-only typography, weights up to 550, four-column desktop events, filled diamond matching circle footprint, border-free About values, responsive member rail.
- assets/main.js: Telegram drafts and keyboard scrolling.
- assets/cms.js: member limit 10, event limit 4, external registration URLs, bulk gallery images and Telegram settings.
- content/site.json: Telegram username replaces email.
- content/events.json: registrationUrl added.
- content/gallery.json: images list added; existing item details retained.
- .pages.yml and pages.yml: English labels and helper text; named collapsed member/event records; bulk gallery selection.
- Removed the unused Vazir.woff2 font. Ravi-VF.ttf is the only font referenced by the site.

## Deploy

Repository: https://github.com/armvnhs/IGDC

Extract IGDC-ready.zip and upload the contents to the root of main. Include .pages.yml and .nojekyll with their leading dots. Upload the files and folders, not the ZIP. pages.yml is an identical convenience copy; Pages CMS reads .pages.yml.

GitHub Settings → Pages: Deploy from a branch, main, / (root).

Site: https://armvnhs.github.io/IGDC/

## CMS

Open https://app.pagescms.org/ and select armvnhs/IGDC, main. CMS labels and helper text are English; website content remains Persian.

### Gallery

Gallery → Gallery images lets you select/upload multiple photos in one control. Remove or reorder photos here. There are no real gallery photos locally yet; an empty gallery displays a message.

Photo captions (optional) starts collapsed. Select the same photo and optionally add Caption, Display date and Accessible image description. A caption record alone does not add a photo. Removed photos do not reappear because their captions remain. Old JSON without an images key is still supported.

### Members

Records start collapsed and show the member name and role. The homepage shows up to 10 available members in a horizontal row. The full Members page shows everyone. There are 4 local member records; add the others in the CMS.

### Events

The homepage shows up to 4 available events. There are 3 local event records; no event/date was invented to fill the fourth place.

Enable Registration open and enter a full HTTPS Registration URL to show the event button. Closed events and unsafe or missing links have no active registration button. Current URLs are blank; add the real event registration URLs in the CMS.

### Contact

Site settings → Telegram username defaults to igdc_ir. The form asks for name, phone, Instagram username, subject and message. It prepares a Telegram draft; the user completes sending in Telegram. There is no email, server submission or automatic message transmission.

## Preview and validation

Use a local static web server for content/*.json. Direct file:// viewing may show static HTML fallback because browser fetch restrictions prevent loading JSON.

22 behavioral checks passed. Chrome checks covered desktop (1280px), mobile (390px), no horizontal page overflow, mobile menu, horizontal member navigation, Ravi font, matching hero shape footprints and border-free About values.

CMS documentation: https://pagescms.org/docs/configuration/
