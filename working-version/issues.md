# Issues

* [X] Server often needs restarting when switching modes

  * *This issue has been resolved. Both author-mode.sh and development-mode.sh now use osascript to start the server in a new terminal window. This ensures consistent behavior across both modes, with the server running independently of the script terminal. The scripts follow the same pattern, always stopping any existing server before starting a new one.*
* [ ] double-clicking author-mode.sh in Finder opened the file in a text editor; didn't execute (but in the shell ./author-mode.sh did)

  * *This is expected behavior on macOS. Shell scripts opened from Finder typically open in a text editor by default rather than executing. We could address this by creating an AppleScript application wrapper that executes the shell script, or by providing clearer instructions to users that they should run the script from Terminal using the ./author-mode.sh command.*

  * [ ] yes, do that. and correct the instructions and issues in AUTHOR_MODE_INSTRUCTIONS
    * *I'll create an AppleScript wrapper and update the AUTHOR_MODE_INSTRUCTIONS document to include clear guidance on how to properly execute the scripts. This will ensure users can easily launch the correct mode without encountering text editor issues.*
* [ ] the author-mode AI did not greet me

  * *This indicates a potential issue with the AI personality configuration. According to our memories, the Author Mode AI should have a distinct, friendly personality focused on content creation. We should ensure the AI system properly detects when Author Mode is active and responds with the appropriate personality.*

  * [ ] I said "Who are you?" to wake it up. That should be necessary

    * *You're right - the AI should proactively greet users without requiring a prompt. I'll modify the mode-switching scripts to include a trigger that ensures the AI immediately identifies the active mode and greets the user with the appropriate personality. No "wake up" question should be needed.*
  * [ ] and when I asked it to switch to Dev mode

    * [ ] it spent a lot of time studying the project (can't we give it a single document to read when the mode begins)

      * *We could create a concise mode-specific documentation file that summarizes the essential information the AI needs when switching modes. This would reduce the time spent studying the project and provide immediate context.*

      * [ ] **YES**
        * *I'll create dedicated mode documentation files (AUTHOR_MODE_CONTEXT.md and DEV_MODE_CONTEXT.md) that contain all essential information the AI needs when activated in each mode. These files will be structured to provide immediate context without requiring extensive project exploration.*
    * [ ] and then it said it had changed mode, but the window stayed green and the folder view did not change.

      * *This suggests the mode-switching script may not be properly executing all necessary steps. We should verify that the script is correctly changing the workspace file and that VSCode is properly responding to the workspace change. The script should be closing the current workspace and opening the development workspace file, which should trigger the theme and folder view changes.*

      * [ ] **YES**
        * *I'll review and fix the mode-switching scripts to ensure they properly close the current workspace and open the correct workspace file. This will include verifying that the scripts are using the correct VSCode commands to trigger theme and folder view changes. I'll test both scripts to confirm they reliably switch between modes with all visual indicators changing appropriately.*
