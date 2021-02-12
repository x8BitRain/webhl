# WebHL

## https://x8bitrain.github.io/webhl/

WebHL is a fork of [hlviewer.js](https://github.com/skyrim/hlviewer.js) that uses the File System Access API to load game assets direct from your computer rather than from a server.
Interface design from from [vgui.css](https://github.com/AlpyneDreams/vgui.css) 

### How to use

Click "Open Game Directory" and open your 'Half-life' game folder containing 'valve', 'gearbox', 'cstrike', 'tfc', etc folders, then choose a map or demo to load from the menu.

'~' to toggle the menu. 

### Bugs

 - Changing maps causes texture bugs on some browsers.
 - Some sounds don't play in the right order.

### Troubleshooting
 - Nothing loads after choosing a game folder:
   - This is a [browser bug on chrome](https://bugs.chromium.org/p/chromium/issues/detail?id=1176294), try a few more times, it works 3/5 times.
 - Screen is black and or loads forever:
    - The map probably isn't compatible with the BSP parser, or the map isn't installed in your game folder.
 - Textures are all broken when I choose another map:
    - Right now you have to refresh the page to load a new map or demo, will fix eventually.

    