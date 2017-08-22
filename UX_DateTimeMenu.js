Ext.define('Ext.ux.DateTimeMenu', {
	extend: 'Ext.menu.Menu',

	alias: 'widget.datetimemenu',

	requires: [
		'Ext.ux.DateTimePicker'
	],

	ariaRole: 'dialog',

	//<locale>
	/**
	 * @cfg {String} ariaLabel ARIA label for the Date Picker menu
	 */
	ariaLabel: 'Date picker',
	//</locale>

	/**
	 * @cfg {Boolean} hideOnClick
	 * False to continue showing the menu after a date is selected.
	 */
	hideOnClick: true,

	/**
	 * @cfg {String} pickerId
	 * An id to assign to the underlying date picker.
	 */
	pickerId: null,

	/**
	 * @cfg {Object} [pickerCfg] Date picker configuration. This config
	 * takes priority over {@link #pickerId}.
	 */

	/**
	 * @cfg {Number} maxHeight
	 * @private
	 */

	/**
	 * @property {Ext.picker.Date} picker
	 * The {@link Ext.picker.Date} instance for this DateMenu
	 */

	// DateTimePicker menu is a special case; Date picker does all key handling
	// except the Esc key which is also handled unlike the ordinary menu
	enableFocusableContainer: false,

	initComponent: function() {
		var me = this,
			cfg, pickerConfig;

		if (me.pickerCfg) {
			// pickerConfig = Ext.apply({
			// 	cls: Ext.baseCSSPrefix + 'menu-date-item',
			// 	margin: 0,
			// 	border: false,
			// 	id: me.pickerId,
			// 	xtype: 'datetimepicker'
			// }, me.pickerCfg);
		} else {
			// Need to keep this insanity for backwards compat :(
			cfg = Ext.apply({}, me.initialConfig);
			// Ensure we clear any listeners so they aren't duplicated
			delete cfg.listeners;
		}

		pickerConfig = Ext.applyIf({
			cls: Ext.baseCSSPrefix + 'menu-date-item',
			margin: 0,
			border: false,
			id: me.pickerId,
			xtype: 'datetimepicker'
		}, me.pickerCfg? me.pickerCfg: cfg);

		Ext.apply(me, {
			showSeparator: false,
			plain: true,
			bodyPadding: 0, // remove the body padding from the datetimepicker menu item so it looks like 3.3
			items: [pickerConfig]
		});

		me.callParent();

		me.picker = me.down('datetimepicker');

		/**
		 * @event select
		 * @inheritdoc Ext.picker.Date#select
		 */
		me.relayEvents(me.picker, ['select']);

		if (me.hideOnClick) {
			me.on('select', me.hidePickerOnSelect, me);
		}
	},

	onEscapeKey: function(e) {
		// Unlike the other menus, DateTimePicker menu should not close completely on Esc key.
		// This is because ordinary menu items will allow using Left arrow key to return
		// to the parent menu; however in the Date picker left arrow is used to navigate
		// in the calendar. So we use Esc key to return to the parent menu instead.
		if (this.floating && this.ownerCmp && this.ownerCmp.focus) {
			this.ownerCmp.focus();
		}
	},

	hidePickerOnSelect: function() {
		Ext.menu.Manager.hideAll();
	}
});
