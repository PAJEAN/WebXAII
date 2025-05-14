/*** Libraries ***/
import 'JS/lib/router';

/*** Components ***/
import 'JS/components/wc-form';
import 'JS/components/wc-loading';

/*** Pages ***/
import 'JS/pages/p-auth';
import 'JS/pages/p-instruction';
import 'JS/pages/p-questionnaire';
import 'JS/pages/p-task';
import 'JS/pages/p-score';


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