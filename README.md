# PyBlocks

PyBlocks is a project aimed at developing a blocks-based environment for introductory programming in Python. The core of the design is described in the paper [*Design of a blocks-based environment for introductory programming in Python*](http://eprints.port.ac.uk/18495/), Blocks and Beyond - Lessons and Directions for First Programming Environments, 22 Oct 2015, Atlanta, GA.

# Installation

1. Go to [*Google App Engine*](https://appengine.google.com/) and create an App Engine application.
2. Modify the 'app.yaml' file found in the 'appengine' folder according to the application you created in step 1.
3. For Windows: Download the [*Google App Engine SDK for Python*](https://cloud.google.com/appengine/docs/python/download#python_windows) and access your app through the GUI application.
4. For \*nix: Download the [*Google Cloud SDK*](https://cloud.google.com/sdk/). Either install it manually or through your package manager. Run 'gcloud init' to initialise your SDK, including logging into and allowing access to your Google Cloud platform. For full installation instructions, refer to the [*Google Cloud SDK Quickstart for Linux*](https://cloud.google.com/sdk/docs/quickstart-linux) page.

# Usage

To run on Windows, simply open the Google App Engine application and add your project, then either run it locally or deploy it.

To run the app locally on \*nix, run the 'dev_appserver.py' program, passing your 'appengine' folder as a parameter. (e.g.: '/opt/google_appengine/dev_appserver.py ~/git/PyBlocks/appengine/')

To deploy the app on \*nix, run 'gcloud app deploy \<path_to_app.yaml>. Please note that gcloud must be initialised according to the installation instructions prior to deployment.

If run locally, PythonBlocks can be accessed through 'localhost:8080'. Saving/loading of programs does not work locally. To access PythonBlocks after deployment on the Google App Engine platform, refer to your individual details as setup in step 1 of the installation instructions.

The latest release can be accessed via [*the official PythonBlocks website*](https://pythonblocks-1362.appspot.com/static/demos/python/index.html).

# Credit

[*Blockly*](https://github.com/google/blockly)
[*Skulpt*](https://github.com/skulpt/skulpt)
[*Google Drive API*](https://developers.google.com/drive/)
[*Google Cloud/App Engine*](https://cloud.google.com/appengine/)
[*Nivardus' Promise-based Google Picker API wrapper*](https://github.com/nivardus/google-drive-picker)

# Contributors

Dr. Matthew Poole
Josef Abbasikadijani

# License

Apache License v2.0
