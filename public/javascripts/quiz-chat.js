'use strict'
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
const report = $('#report');
const alertMessage = $('#alert-message').get(0);
const reportQuizId = $('#report-quiz-id').get(0);
const reportForm = $('#report-form').get(0);

form.on('click',function(e) {
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
  console.log('受け取り');
  const data = JSON.parse(api);
  console.log(data);
  alertMessage.innerText = '';
  quizName.innerText = 'クイズ名: ' + data[1].quizName;
  quizByUsername.innerText = '作成者: ' + data[4].creatUser;
  question.innerText = '問題: ' + data[2].question;
  reportQuizId.value = data[0].quizId;
  answer.innerText = "";
  socket.on('timer' , function(t) {
    console.log('タイマー受け取り');
    timer.innerText = '残り解答時間: ' + t;
    if(1 > t) {
      quizName.innerText = '';
      quizByUsername.innerText = '';
      question.innerText = '';
      answer.innerText = '答え: ' + data[3].answer;
    };
  });
});