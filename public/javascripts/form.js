'use strict';
const form = $('#form').get(0);
const tagValue = $('#tag-value').get(0);
$('button').on('click', function() {
	const tag = $('input[name="tag"]:checked').val();
	console.log(tag);
	tagValue.value = tag;
})