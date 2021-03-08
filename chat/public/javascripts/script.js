const ws = new WebSocket("ws://localhost:3000");

function loadMsg() 
{
  //get all msgs and render it
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var myInit = { method: 'GET',
               headers: myHeaders,
               mode: 'cors',
               cache: 'default' };

  var myRequest = new Request('http://localhost:3000/chat/api/messages',myInit);

  fetch(myRequest).then(function(response) 
  {
      response.json().then(data =>
      {
        for(let i = 0; i < data.length; i++)
        {
            datas = JSON.parse(data[i]);
            renderMessages(datas);
        }
      });
  });
}

function sendData(params) 
{
    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'http://localhost:3000/chat/api/messages');
    xhr.setRequestHeader('Content-Type', 'application/json', true);
    xhr.onreadystatechange = function (oEvent) {
      if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log(xhr.responseText)
          }
          else if(xhr.status === 400) 
          {
              alert("Please enter the fields correctly");
              console.log("Error", xhr.statusText);
          } 
          else 
          {
              alert(xhr.statusText);
             console.log("Error", xhr.statusText);
          }
      }
    };
    xhr.send(JSON.stringify(params));
}

function editData(params, ts) 
{
    var xhr = new XMLHttpRequest();
    url = 'http://localhost:3000/chat/api/messages/'+ts;
    xhr.open("PUT", url);
    xhr.setRequestHeader('Content-Type', 'application/json', true);
    xhr.onreadystatechange = function (oEvent) {
      if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log(xhr.responseText)
          } 
          else{
              alert(xhr.statusText);
             console.log("Error", xhr.statusText);
          }
      }
    };
    xhr.send(JSON.stringify(params));
}

function editMessage(params) 
{
  document.getElementById("timestamp").value = params;
}



const editSubmit = (evt) => 
{
  evt.preventDefault();
  const message = document.getElementById("messageEdit");
  const author = document.getElementById("authorEdit");
  const ts = document.getElementById("timestamp");
  //put request
  datos = 
  {
    message: message.value,
    author: author.value,
  }
  resetHTML();
  editData(datos, ts.value);
  loadMsg();
  message.value = "";
  author.value = "";
  ts.value = "";
};

const renderMessages = (data) => 
{ 
  if(data.author == null || data.message == null)
    return;
  const html = "<div> <p>"+data.author+" : "+data.message+"</p> <button onclick=\"editMessage("+data.ts+")\"> Edit </button> <button onclick=\"deleteMessage("+data.ts+")\"> Delete </button> </div>";
  document.getElementById("messages").innerHTML += html;
};

function resetHTML() 
{ 
  document.getElementById("messages").innerHTML = "";
};

function deleteMessage(params) 
{
  var xhr = new XMLHttpRequest();
  url = 'http://localhost:3000/chat/api/messages/'+params;
  xhr.open("DELETE", url);
  xhr.setRequestHeader('Content-Type', 'application/json', true);
  xhr.onreadystatechange = function (oEvent) {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) 
        {
          resetHTML();
          loadMsg();
          console.log(xhr.responseText)
        } else 
        {
            alert(xhr.statusText);
           console.log("Error", xhr.statusText);
        }
    }
  };
  xhr.send();
}

const handleSubmit = (evt) => 
{
  evt.preventDefault();
  const message = document.getElementById("message");
  const author = document.getElementById("author");
  //post request
  datos = {
    message: message.value,
    author: author.value,
    ts: Date.now()+""
  }
  resetHTML();
  sendData(datos);
  loadMsg();
  message.value = "";
};

loadMsg();

const form = document.getElementById("form");
form.addEventListener("submit", handleSubmit);

const form1 = document.getElementById("edit");
form1.addEventListener("submit", editSubmit);