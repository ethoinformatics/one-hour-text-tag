require('./main.less');

var $ = window.$,
	template = require('./main.vash');

$(function(){
	var $body = $('body');
	$body.append(template({}));

	var $btn = $body.find('button[type=submit]'),
		$modal = $('#myModal'),
		$modalBody = $modal.find('.modal-body');

	$btn.click(function(ev){
		ev.preventDefault();

		var findText = $body.find('#txtSearch').val(),
			replaceText = $body.find('#txtReplace').val(),
			documentText = $body.find('textarea').val();

		var result = go(findText, replaceText, documentText);

		$modalBody.html(result);
		$modal.modal('show');
	});


});


function go(find, replace, txt){

	var a = new RegExp('\\b('+find +')\\b', 'ig');

	return txt.replace(a, '<b title="$1">'+replace+'</b>');
}


