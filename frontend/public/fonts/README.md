# Fonts

The site uses **Segoe UI**. Segoe UI is a Microsoft font and cannot be redistributed
with this repository, so the font files are not included.

Copy your licensed files into this folder with these exact names:

| File             | Weight   |
|------------------|----------|
| `segoeui.ttf`    | Regular (400) |
| `segoeuisb.ttf`  | Semibold (600) |
| `segoeuib.ttf`   | Bold (700) |

On Windows the installed Segoe UI is used automatically (`local()`), so the site
already looks right there even without these files. Without either, the browser
falls back to the system UI font.
