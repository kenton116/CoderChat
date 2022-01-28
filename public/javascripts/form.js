'use strict';
const form = $('#form').get(0);
const tagValue = $('#tag-value').get(0);
const radioNodeList = form.tag;
const tag = radioNodeList.value;
tagValue.value = tag;