document.addEventListener("DOMContentLoaded", function() {

    // ----------------- DÜNAAMILINE GRADIENT TAUST -----------------
    const body = document.body;

    function randomColor() {
        // tagastab rgb(r,g,b)
        const r=Math.floor(Math.random()*256);
        const g=Math.floor(Math.random()*256);
        const b=Math.floor(Math.random()*256);
        return `rgb(${r},${g},${b})`;
    }

    function changeBackground() {
        const color1 = randomColor();
        const color2 = randomColor();
        const angle = Math.floor(Math.random()*360);
        body.style.background = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
        body.style.transition = "background 3s ease";
    }

    setInterval(changeBackground, 4000); // iga 4 sekundi järel uus gradient
    changeBackground(); // esialgne taust

    // ----------------- DARK MODE -----------------
    const themeBtn = document.getElementById("themeBtn");
    if(localStorage.getItem("theme") === "dark") document.body.classList.add("dark-mode");
    themeBtn.addEventListener("click", function(){
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    });

    // ----------------- REFRESH BUTTON -----------------
    const refreshBtn = document.getElementById("refreshBtn");
    refreshBtn.addEventListener("click", ()=>{ location.reload(); });

    // ----------------- TO-DO LIST -----------------
    const taskList = document.getElementById("taskList");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskInput = document.getElementById("taskInput");
    const taskPriority = document.getElementById("taskPriority");

    function createTask(text,priority){
        const li = document.createElement("li");
        li.textContent = text + " ["+priority+"]";
        li.dataset.priority=priority;
        li.draggable=true;
        li.onclick=function(){li.remove(); saveTasks();};

        li.addEventListener('dragstart',()=>li.classList.add('dragging'));
        li.addEventListener('dragend',()=>{li.classList.remove('dragging'); saveTasks();});
        taskList.appendChild(li);
    }

    function saveTasks(){
        const items = taskList.querySelectorAll("li");
        const tasks = [...items].map(li=>({text:li.textContent,priority:li.dataset.priority}));
        localStorage.setItem("tasks",JSON.stringify(tasks));
    }

    function loadTasks(){
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(t=>createTask(t.text,t.priority));
    }

    addTaskBtn.addEventListener("click", ()=>{
        if(taskInput.value==="") return;
        createTask(taskInput.value, taskPriority.value);
        saveTasks();
        taskInput.value="";
    });

    taskList.addEventListener('dragover', e=>{
        e.preventDefault();
        const afterElement=getDragAfterElement(taskList,e.clientY);
        const dragging=document.querySelector('.dragging');
        if(afterElement==null) taskList.appendChild(dragging);
        else taskList.insertBefore(dragging,afterElement);
    });

    function getDragAfterElement(container,y){
        const draggableElements=[...container.querySelectorAll('li:not(.dragging)')];
        return draggableElements.reduce((closest,child)=>{
            const box=child.getBoundingClientRect();
            const offset=y-box.top-box.height/2;
            if(offset<0 && offset>closest.offset) return {offset:offset,element:child};
            else return closest;
        },{offset:Number.NEGATIVE_INFINITY}).element;
    }

    loadTasks();

    // ----------------- FILTER -----------------
    const filterInput = document.getElementById("filterInput");
    filterInput.addEventListener("input", ()=>{
        const filter = filterInput.value.toLowerCase();
        document.querySelectorAll("#nameList li").forEach(li=>li.style.display = li.textContent.toLowerCase().includes(filter)?"":"none");
    });

    // ----------------- CALCULATOR -----------------
    const calcBtn = document.getElementById("calcBtn");
    calcBtn.addEventListener("click", ()=>{
        const n1=Number(document.getElementById("num1").value);
        const n2=Number(document.getElementById("num2").value);
        const op=document.getElementById("operator").value;
        let res;
        switch(op){
            case "+": res=n1+n2; break;
            case "-": res=n1-n2; break;
            case "*": res=n1*n2; break;
            case "/": res=n2!==0?n1/n2:"Ei saa jagada 0-ga"; break;
        }
        document.getElementById("result").textContent="Tulemus: "+res;
        const li=document.createElement("li");
        li.textContent=`${n1} ${op} ${n2} = ${res}`;
        const history = document.getElementById("calcHistory");
        history.prepend(li);
        if(history.children.length>5) history.removeChild(history.lastChild);
    });

    // ----------------- GUESS GAME -----------------
    let randomNumber=Math.floor(Math.random()*10)+1;
    let score = Number(localStorage.getItem("guessScore")) || 0;
    document.getElementById("score").textContent = score;
    const guessBtn = document.getElementById("guessBtn");
    guessBtn.addEventListener("click", ()=>{
        const guess = Number(document.getElementById("guess").value);
        const result = document.getElementById("guessResult");
        const img = document.getElementById("guessImg");
        if(guess===randomNumber){
            result.textContent="Õige! 🎉"; result.style.color="green";
            img.src="images/smile.png";
            score+=1; randomNumber=Math.floor(Math.random()*10)+1;
        } else {
            result.textContent="Vale 😢"; result.style.color="red";
            img.src="images/sad.png";
            if(score>0) score-=1;
        }
        document.getElementById("score").textContent = score;
        localStorage.setItem("guessScore", score);
    });

    // ----------------- FORM VALIDATION -----------------
    const regForm = document.getElementById("regForm");
    const formMessage = document.getElementById("formMessage");
    regForm.addEventListener("submit", function(e){
        e.preventDefault();
        const name=document.getElementById("name").value;
        const email=document.getElementById("email").value;
        const regex=/\S+@\S+\.\S+/;
        if(name===""||email==="") formMessage.textContent="Täida kõik väljad!", formMessage.style.color="red";
        else if(!regex.test(email)) formMessage.textContent="Sisesta korrektne email!", formMessage.style.color="red";
        else formMessage.textContent="Registreeritud! 🎉", formMessage.style.color="green";
    });

});