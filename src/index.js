/*** Libraries ***/
import 'JS/lib/router';

/*** Components ***/
import 'JS/components/form';

/*** Pages ***/
import 'JS/pages/app';
import 'JS/pages/authentication';
import 'JS/pages/countdown';
import 'JS/pages/end';
import 'JS/pages/rules';
import 'JS/pages/score';
import 'JS/pages/test';

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