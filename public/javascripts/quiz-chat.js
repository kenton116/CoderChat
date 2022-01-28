'use strict'
const socket = io();
const form = $('#form').get(0);
const messages = $('#message').get(0);
const input = $('#input').get(0);
const username = $('#username').attr('name');
const userCountValue = $('#user-count').get(0);
const quizName = $('#quiz-name').get(0);
const quizByUsername = $('#quiz-by-username').get(0);
const question = $('#question').get(0);
const answer = $('#answer').get(0);
const timer = $('#timer').get(0);

form.submit(function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value, username);
    input.value = '';
  }
});

socket.on('chat message', function(msg , user , userCount) {
  const item = document.createElement('p');
  item.className = 'message';
  item.innerText = user + ' : ' + msg;
  messages.appendChild(item);
  userCountValue.innerText = '👤' + userCount + '人';
});

socket.on('api' , function(api) {
  console.log('受け取り')
  const data = api;
  quizName.innerText = data.quizName;
  quizByUsername.innerText = data.createdBy;
  question.innerText = data.question;
  for(let i = 30; 1 > i; i--) {
    timer.innerText = i;
  }
  answer.innerText = data.answer;
})