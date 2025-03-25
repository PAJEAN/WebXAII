/*** Libraries ***/
import 'JS/lib/router';

/*** Components ***/
import 'JS/components/wc-tooltip';
import 'JS/components/bar-container/wc-column';
import 'JS/components/bar-container/wc-header';
import 'JS/components/wc-bar';
import 'JS/components/wc-modal';
import 'JS/components/wc-alert';
import 'JS/components/wc-button';
import 'JS/components/wc-loading';

/*** Pages ***/
import 'JS/pages/app';
import 'JS/pages/rules';
import 'JS/pages/authentication';
import 'JS/pages/results';

/*** CSS ***/
(function() {
	let load_css = (module) => {
		let tag = document.createElement('style');
		tag.innerHTML = module.default.toString();
		document.head.appendChild(tag);
	};

	import ('./css/var.css')
	.then(load_css);
})();