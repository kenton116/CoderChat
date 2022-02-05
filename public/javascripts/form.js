'use strict';
const form = $('#form').get(0);
const tagValue = $('#tag-value').get(0);
$('button').on('click', () => {
	const tag = $('input[name="tag"]:checked').val();
	tagValue.value = tag;
	console.log(tagValue)
});