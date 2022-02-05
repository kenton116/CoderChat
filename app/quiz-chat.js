'use strict'
import $ from 'jquery'
const socket = io();
const form = $('#form');
const messages = $('#message').get(0);
const input = $('#input').get(0);
const username = $('#username').attr('name');
const userCountValue = $('#user-count').get(0);
const quizName = $('#quiz-name').get(0);
const quizByUsername = $('#quiz-by-username').get(0);
const question = $('#question').get(0);
const answer = $('#answer').get(0);
const timer = $('#timer').get(0);
const alertMessage = $('#alert-message').get(0);
const reportQuizId = $('#report-quiz-id');
const starQuizId = $('#star-quiz-id');
const report = $('#report').get(0);
const star = $('#star').get(0);
const isAnswer = $('#is-answer').get(0);
report.style.display = 'none';
star.style.display = 'none';
let isAnswerValue = isAnswer.checked;

form.on('click', (e) => {
  e.preventDefault();
  if (input.value) {
    isAnswerValue = isAnswer.checked;
    socket.emit('chat message', input.value, username, isAnswerValue);
    input.value = '';
  }
});

socket.on('chat message', (msg , user , userCount , isAnswer) => {
  const item = document.createElement('p');
  item.className = 'message';
  if(isAnswer === true) {
    item.classList.add = 'answer-message';
  }
  item.innerText = user + ' : ' + msg;
  messages.prepend(item);
  userCountValue.innerText = '👤' + userCount + '人';
});

socket.on('api' , (api) => {
  const data = JSON.parse(api);
  report.style.display = 'none';
  star.style.display = 'none';
  alertMessage.innerText = '';
  quizName.innerText = data[1].quizName;
  quizByUsername.innerText = '👤 ' + data[4].createUser + '　🏷 ' + data[6].tag + '　⭐️ ' + data[5].star;
  question.innerText = 'Q. ' + data[2].question;
  reportQuizId.val(data[0].quizId);
  starQuizId.val(data[0].quizId);
  answer.innerText = "";

  socket.on('timer' , (t) => {
    timer.innerText = '⏳ ' + t;
    if(1 > t) {
      question.innerText = '';
      report.style.display = 'block';
      star.style.display = 'block';
      answer.innerText = 'A.　' + data[3].answer;
    };
  });
});

if (window.performance) {
  if (performance.navigation.type === 1) {
    socket.emit('reload' , 'reloaded');
  }
}