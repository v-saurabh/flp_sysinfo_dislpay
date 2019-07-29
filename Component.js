sap.ui.define([
	"sap/ui/core/UIComponent"
], function (UIComponent) {

	return UIComponent.extend("com.demo.sysinfo.Component", {

		metadata: {
			"manifest": "json"
		},

		init: function () {
			//var rendererPromise = this._getRenderer();

			// This is example code. Please replace with your implementation!
			UIComponent.prototype.init.apply(this, arguments);
			var renderer = sap.ushell.Container.getRenderer("fiori2");
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("/sap/bc/ui2/start_up?", "", false);
			var systemid = oModel.getProperty("/system");
			var client = oModel.getProperty("/client");
			var info = 'Sys:'+ systemid + " " + 'Client:' + client;
			renderer.setHeaderTitle(info);
		},

		/**
		 * Returns the shell renderer instance in a reliable way,
		 * i.e. independent from the initialization time of the plug-in.
		 * This means that the current renderer is returned immediately, if it
		 * is already created (plug-in is loaded after renderer creation) or it
		 * listens to the &quot;rendererCreated&quot; event (plug-in is loaded
		 * before the renderer is created).
		 *
		 *  @returns {object}
		 *      a jQuery promise, resolved with the renderer instance, or
		 *      rejected with an error message.
		 */
		_getRenderer: function () {
			var that = this,
				oDeferred = new jQuery.Deferred(),
				oRenderer;

			that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
			if (!that._oShellContainer) {
				oDeferred.reject(
					"Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
			} else {
				oRenderer = that._oShellContainer.getRenderer();
				if (oRenderer) {
					oDeferred.resolve(oRenderer);
				} else {
					// renderer not initialized yet, listen to rendererCreated event
					that._onRendererCreated = function (oEvent) {
						oRenderer = oEvent.getParameter("renderer");
						if (oRenderer) {
							oDeferred.resolve(oRenderer);
						} else {
							oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");
						}
					};
					that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
				}
			}
			return oDeferred.promise();
		}
	});
});