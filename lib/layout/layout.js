/**
 * Add mailto link by hand
 */

var mail = document.getElementById('mail');
mail.setAttribute('href', 'mailto:mattmuelle@gmail.com');

/**
 * Add google analytics
 */

var _gaq = window._gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-10351690-8']);
_gaq.push(['_setDomainName', 'mat.io']);
_gaq.push(['_trackPageview']);

var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
