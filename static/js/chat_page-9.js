      // const form = document.querySelector('.form-question');


      const chatContainer = document.querySelector(".responses");
      // console.log(form)
      console.log(chatContainer)
      let loadInterval;

      function loader(element) {
        element.textContent = "";

        loadInterval = setInterval(() => {
          element.textContent += ".";

          if (element.textContent === "....") {
            element.textContent = "";
          }
        }, 300);
      }
      function typeText(element, text) {
        let index = 0
    
        let interval = setInterval(() => {
            if (index < text.length) {
                element.innerHTML += text.charAt(index)
                index++
            } else {
                clearInterval(interval)
            }
        }, 20)
    }
      function generateUniqueId() {
        const timestamp = Date.now();
        const randomNumber = Math.random();
        const hexadecimalString = randomNumber.toString(16);

        return `id-${timestamp}-${hexadecimalString}`;
      }

      function chatStripe(prompt, uniqueId) {
        return `
        <div
                class="answer-field w-node-_0d41bce4-44bf-2f68-f9df-75f657743e73-14932c8f w-input"
                name="name"
                data-name="Name"
                id="name"
              >
          <div class="wrapper_msg">
            <div class="chat">
              <div class="profile">
                  <p>Me: ${prompt}</p>
              </div>
              
            </div>
          </div>
        </div>
        <div
                class="answer-field w-node-_0d41bce4-44bf-2f68-f9df-75f657743e73-14932c8f w-input"
                name="name"
                data-name="Name"
                id="name"
              >
          <div class="wrapper_msg">
            <div class="chat">
              <div class="profile">
                  <p>Chat: <div class="message" id=${uniqueId}> </div></p>
              </div>
            </div>
          </div>
        </div>
        `;
        }
        function getCookie(name) {
          let cookieValue = null;
          if (document.cookie && document.cookie !== "") {
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i].trim();
              // Does this cookie string begin with the name we want?
              if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(
                  cookie.substring(name.length + 1)
                );
                break;
              }
            }
          }
          return cookieValue;
        }
        const handleSubmit = async (e) => {
            const csrftoken = getCookie("csrftoken");
            // e.preventDefault();

            // const data = new FormData(form);
            const data = {
              prompt: document.getElementById("textarea").value,
            }

            document.getElementById("textarea").value = "";

            const uniqueId = generateUniqueId();

            chatContainer.innerHTML += chatStripe(data.prompt, uniqueId);

            chatContainer.scrollTop = chatContainer.scrollHeight;

            const messageDiv = document.getElementById(uniqueId);

            loader(messageDiv);
        clearInterval(loadInterval);
        const response = new XMLHttpRequest();
        const contextType = document.getElementById("field-2").value;
        response.onreadystatechange = function () {

          if (this.readyState == 4 && this.status == 200) {
            document.getElementById("hidden_context").value += this.responseText;
            typeText(messageDiv, this.responseText);
            document.getElementById("field-2").value = contextType;
            console.log(contextType)
          }
        };
        
        response.open("POST", "response/");
        response.setRequestHeader("X-CSRFToken", csrftoken);
        response.setRequestHeader("Content-type", "application/json");
        if (document.getElementById("field-2").value === "YES") {data["context"] = document.getElementById("hidden_context").value;} else { data["context"]=""}
        data["temperature"] = document.getElementById("field-1").value;
        messageDiv.innerHTML = " "
        console.log(data)
        response.send(JSON.stringify(data));
            }
        var btn = document.getElementsByClassName("submit-button-3")[0]
        console.log(btn)
        if (btn) {
            btn.addEventListener('click', handleSubmit);
        }
        var textArea = document.getElementById("textarea");

        if (textArea) {
            textArea.addEventListener('keyup', (e) => {
            if (e.keyCode === 13) {
                handleSubmit(e);
            }})
        document.getElementById("field-2").value = "YES";
        }
        
        