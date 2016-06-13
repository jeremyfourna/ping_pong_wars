import { Meteor } from 'meteor/meteor';
import { TAPi18n } from 'meteor/tap:i18n';

let getUserLanguage = function() {
	// Put here the logic for determining the user language
	return 'fr';
};

if (Meteor.isClient) {
	Meteor.startup(function() {
		TAPi18n.setLanguage(getUserLanguage()).fail(function(error_message) {
			return throwError(error_message);
		});
	});
}
