'use strict';
const form = $('#form').get(0);
const tagValue = $('#tag-value').get(0);
$('radio').on('click', () => {
	const tag = $('input[name="tag"]:checked').val();
	tagValue.value = tag;
});