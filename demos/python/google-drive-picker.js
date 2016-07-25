/* GoogleDrivePicker v0.0.2, @license MIT, (c) 2015 Bennett Goble */

(function() {
  /**
   * Creates an instance of GoogleDrivePicker
   *
   * @constructor
   * @this {GoogleDrivePicker}
   * @param {Object} opts - Options for Picker
   * @param {string} opts.apiKey - The API Key from Google's API console
   * @param {string} opts.clientId - The client ID from Google's API console
   * @param {Function} opts.config - Configuration handler
   */
  function GoogleDrivePicker(opts) {
    opts               = opts ||  {};
    this.opts          = opts;
    this._gapi         = opts.gapi || window.gapi;
    this._oauthToken   = null;
    this._initialized  = false;
    this._attempts     = 0; // Initialization attempts
  }

  /**
   * Primary private initialization method, loads APIs
   *
   * @returns {Object} Promise
   */
  GoogleDrivePicker.prototype._initialize = function() {
    this._attempts++;
    return Promise.all([this._initializeAuth(), this._loadPicker()]).then(this._setInitialized.bind(this));
  };

  /**
   * Load auth API then authorize
   *
   * @returns {Object} Promise
   */
  GoogleDrivePicker.prototype._initializeAuth = function() {
    return this._loadAuth().then(this._authorize.bind(this));
  }

  /**
   * Load auth API
   *
   * @returns {Object} Promise
   */
  GoogleDrivePicker.prototype._loadAuth = function() {
    return new Promise(function(resolve, reject) {
      this._gapi.load('auth', {callback: resolve});
    }.bind(this));
  };

  /**
   * Tell the API to ask for Read-only Drive permissions when Picker opens, called after _loadAuth
   *
   * @returns {Object} Promise
   */
  GoogleDrivePicker.prototype._authorize = function() {
    return new Promise(function(resolve, reject) {
      this._gapi.auth.authorize({
        client_id: this.opts.clientId,
        scope: ['https://www.googleapis.com/auth/drive'],
        immediate: false
      }, function(data) {
        this._oauthToken = data.access_token;
        resolve();
      }.bind(this));
    }.bind(this));
  };

  /**
   * Load picker API
   * @returns {Object} Promise
   */
  GoogleDrivePicker.prototype._loadPicker = function() {
    return new Promise(function(resolve, reject) {
      this._gapi.load('picker', {callback: resolve});
    }.bind(this));
  };

  /**
   * APIs have been loaded and initialized
   */
  GoogleDrivePicker.prototype._setInitialized = function() {
    this._initialized = true;
  }

  /**
   * Create a picker
   *
   * @param {string} locale - Google drive locale
   * @param {string} view - Google drive view
   * @param {Function} configFn - Configuration function
   * @param {Function} cb - Callback
   * @returns {Object}
   */
  GoogleDrivePicker.prototype._createPicker = function(configFn, cb) {


    var view = new google.picker.View(google.picker.ViewId.DOCS);
    view.setMimeTypes("application/pythonblocks");
    var builder = new google.picker.PickerBuilder();



    if (configFn) {
      // Allow manual configuration by yielding the builder to configFn
      configFn(builder);
    }
    else {
      // Defaults
      builder.enableFeature(google.picker.Feature.NAV_HIDDEN)
          .addView(view)
          .addView(new google.picker.DocsUploadView());
    }

    builder.setOAuthToken(this._oauthToken)
           .setDeveloperKey(this.opts.apiKey)
           .setCallback(cb);

    return builder.build();
  };

  /**
   * Choose from Google Drive
   *
   * @param {Object} opts - Options (optional)
   * @param {Function} opts.config - Configuration handler
   * @returns {Object} Promise
   */
  GoogleDrivePicker.prototype.pick = function(opts) {
    opts        = opts || {};
    opts.config = opts.config || this.opts.config;



    return new Promise(function(resolve, reject) {
      var picker = this._createPicker(opts.config, function(data) {
        if (data.action == google.picker.Action.PICKED) {
          resolve(data);
        }
      });

      picker.setVisible(true);

    }.bind(this));
  };

  this.GoogleDrivePicker = GoogleDrivePicker;

}());

GoogleDrivePicker.prototype.init = function() {
  // Initialize and try again
  if (!this._initialized) {
    if (this._attempts > 2) {
      throw 'Unable to initialize Google Picker API, attempted 3 times';
    }
    return this._initialize();
  }
}
