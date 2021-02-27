# WebHL

## https://x8bitrain.github.io/webhl/

WebHL is a fork of [hlviewer.js](https://github.com/skyrim/hlviewer.js) that uses the File System Access API to load game assets direct from your computer rather than from a server, including recording.
Interface design from from [vgui.css](https://github.com/AlpyneDreams/vgui.css) 

### How to use

Click "Open Game Directory" and open your 'Half-life' game folder containing 'valve', 'gearbox', 'cstrike', 'tfc', etc folders, then choose a map or demo to load from the menu.

WASD, Ctrl or C and Space to move, F for fullscreen, esc to release mouse, and ~ to toggle the menu.

Click on the red circle in the bottom right to start recording footage, press again to download a webm.

Have fun!


### Bugs

 - Some sounds don't play in the right order.
 - Demos keep playing in different when switching maps after playing a demo.

### Troubleshooting
 - "...can't open this folder because it contains system files"
   - Unfortunately this is an unavoidable browser security feature. You might have to move your HL folder outside of Program Files to make it work, I recommend the [Goldsrc package](https://forums.sourceruns.org/t/goldsrc-package-2-4/2634) for this.
 - Nothing loads after choosing a game folder:
   - This is a [browser bug on chrome](https://bugs.chromium.org/p/chromium/issues/detail?id=1176294), try a few more times, it works 3/5 times.
 - Screen is black and or loads forever:
    - The map probably isn't compatible with the BSP parser, or the map isn't installed in your game folder. Open the console in the browser developer tools and check to see if there's a specific error, that usually reveals the problem.
