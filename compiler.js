let txt = document.querySelector("textarea");
let btn = document.querySelector(".compile");
let print_result = document.querySelector(".result");
let select = document.querySelector("select");
let clear = document.querySelector(".clear");
let theme = document.querySelector(".theme");
let output = document.querySelector(".output");
let copy = document.querySelector(".copy");
let btns = document.querySelectorAll("button");
let ul = document.querySelector("ul");
let lengthCode = document.querySelector(".length");
let p = document.querySelector(".loadMsg");
let load = document.querySelector(".loading");
let url = "https://course.codequotient.com/api/executeCode";
let msg = document.querySelector(".alert");
let intr;
let count = 0;
let func;
let language = 0,running=false;
let hints = ['()','{}','[]',"''","``",'""',];
btn.addEventListener("click", () => {
  
  if (txt.value != "" && running==false) {
    print_result.innerHTML = " ";
    clearInterval(intr)
    running=true;
    dataSend();
  }else if(running===true){
    msgdisplay("Prevoius code is under compilation", "red");

  } 
  else {
    msgdisplay("codeEditor is empty", "red");
  }
});
let dataSend = () => {
  p.classList.remove("hide");
  load.classList.remove("hide");
  let rqst = new XMLHttpRequest();
  rqst.open("POST", url);
  let code = {
    code: txt.value,
    langId: language,
  };
  console.log(txt.value, code);
  rqst.setRequestHeader("Content-Type", "application/json");
  rqst.send(JSON.stringify(code));

  rqst.onreadystatechange = () => {
    if (rqst.readyState == 4) {
      let obj = JSON.parse(rqst.responseText);
      if (obj.hasOwnProperty("codeId"))
        intr = setInterval(() => {
          response(obj.codeId, intr);
        }, 1000);
      console.log(rqst.readyState);
    }
  };
};
let response = (CodeId, intr) => {
  let rqst2 = new XMLHttpRequest();
  rqst2.open("GET", `https://course.codequotient.com/api/codeResult/${CodeId}`);
  console.log(CodeId);
  rqst2.send();
  rqst2.onreadystatechange = () => {
    if (rqst2.readyState == 4) {
      let obj = JSON.parse(rqst2.responseText);
      console.log(obj);
      let data = JSON.parse(obj.data);
      console.log(data);

      if (data.hasOwnProperty("langid")) {
        print(data);
        clearInterval(intr);
      }
      console.log(data);
    }
  };
};
let sel = () => {
  console.log(select.value);
  switch (select.value) {
    case "Python":
      language = 0;
      break;
    case "Javascript":
      language = 4;
      break;
    case "C":
      language = 7;
      break;
    case "CPP":
      language = 77;
      break;
    case "Java":
      language = 8;
      break;
  }
};
select.addEventListener("change", sel);
clear.addEventListener("click", () => {
  clearInterval(intr);
  p.classList.add("hide");
  load.classList.add("hide")
  txt.value = "";
  print_result.innerHTML=""
  ul.innerHTML=""
  count=1;
  lengthCode.innerHTML=""
});
theme.addEventListener("click", () => {
  if (theme.classList.contains("fa-toggle-off")) {
    theme.classList.remove("fa-toggle-off");
    theme.classList.add("fa-toggle-on");
    document.body.style.backgroundColor = "#36454F";
    document.body.style.color = "white";
    output.style.backgroundColor = "black";
    output.style.color = "white";
    btns.forEach((e) => e.classList.add("hover"));
    select.classList.add("hover");
  } else {
    theme.classList.add("fa-toggle-off");
    theme.classList.remove("fa-toggle-on");
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
    output.style.backgroundColor = "black";
    output.style.color = "white";
    btns.forEach((e) => e.classList.remove("hover"));
    select.classList.remove("hover");
    clearInterval(func);
  }
});
copy.addEventListener("click", () => {
  if (txt.value != "") {
    navigator.clipboard.writeText(txt.value);

    msgdisplay("code is copy", "green");
  } else {
    msgdisplay("codeEditor is empty", "red");
  }
});
txt.addEventListener("keydown", (event) => {
  console.log(txt.selectionEnd,event.key)
  if (event.key === "Enter" ||( txt.selectionStart==0 && event.key!=='Backspace' ) && (txt.selectionStart===0 && event.key!=='ArrowUp')
    && (txt.selectionStart===0 && event.key!=='ArrowDown' && (txt.selectionStart===0 && event.key!=='ArrowRight') && (txt.selectionStart===0 && event.key!=='ArrowLeft'))
        ) {
    count++;
    let li = document.createElement("li");
    li.innerHTML = `${count}`;
    ul.append(li);
          
  } else if (event.key === "Backspace") {
    if (
      txt.selectionStart >=0 &&
      txt.value.slice(txt.selectionStart -1, txt.selectionStart) === "\n"
    ){
        ul.lastChild.remove();
      }else if(event.key==='Backspace' && txt.selectionStart===0){
        ul.lastChild.remove();
      }
      count--;

    }
    console.log(count)
    if (count <= 0) count = 0;

    // let hint=hints.findIndex(h=> h.includes(event.key));
  // console.log(hint)
  // if (hint !== -1) {
  // txt.value=txt.value+hints[hint];
  // }
  });
txt.addEventListener("input", () => {
  if (txt.value.length > 0) {
    lengthCode.innerHTML = `character ${txt.value.length},lines ${ul.childNodes.length-1} `;
  } else {
    lengthCode.innerHTML = 0;
  }
  
});


let msgdisplay = (msg_print, clr) => {
  msg.style.display = "block";
  msg.style.backgroundColor = `${clr}`;
  msg.innerHTML = `${msg_print}`;
  setTimeout(() => {
    msg.style.display = "none";
  }, 2000);
};

let print = (data) => {
  setTimeout(() => {
    p.classList.add("hide");
    load.classList.add("hide");

    if (data.ouput != "" && data.errors === "") {
      console.log(data.output);
      print_result.style.color = "whitesmoke";
      print_result.innerHTML = data.output;
      console.log(print_result.innerHTML);
    } else if (data.errors !== "") {
      console.log(data.output);
      print_result.style.color = "red";
      print_result.innerHTML = data.errors;
    }
    running=false;
  }, 1000);
};
