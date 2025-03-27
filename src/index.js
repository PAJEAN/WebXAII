/*** Libraries ***/
import 'JS/lib/router';

/*** Components ***/

/*** Pages ***/
import 'JS/pages/app';
import 'JS/pages/rules';
import 'JS/pages/authentication';
import 'JS/pages/score';

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