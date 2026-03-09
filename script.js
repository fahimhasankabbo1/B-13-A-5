let allIssuesData = []

fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
.then(res => res.json())
.then(data => {

allIssuesData = data.data

renderIssues(allIssuesData)

})




const loginForm = document.getElementById("loginForm")

if (loginForm) {

loginForm.addEventListener("submit", function(e){

e.preventDefault()

const user = document.getElementById("username").value
const pass = document.getElementById("password").value

const userError = document.getElementById("userError")
const passError = document.getElementById("passError")
const successMsg = document.getElementById("successMsg")

userError.innerText = ""
passError.innerText = ""
successMsg.innerText = ""

if(user !== "admin"){
userError.innerText = "Username incorrect"
}

if(pass !== "admin123"){
passError.innerText = "Password incorrect"
}

if(user === "admin" && pass === "admin123"){

successMsg.innerText = "Login successful"

setTimeout(function(){

window.location.href = "dashboard.html"

},1000)

}

})

}



function renderIssues(data){

const grid = document.getElementById("issueGrid")
const count = document.getElementById("issueCount")

if(!grid) return

grid.innerHTML = ""

count.innerText = data.length + " Issues"


data.forEach(item => {

const border = item.status === "open"
? "border-t-green-500"
: "border-t-purple-500"


const card = `

<div onclick="openModal(${item.id})"
class="border border-t-4 ${border} p-4 rounded-lg shadow-sm bg-white cursor-pointer">

<div class="flex justify-between mb-2">

<img src="${
item.status === "open"
? "icons/Open-Status.png"
: "icons/Closed- Status.png"
}" class="w-4 h-4">

<span class="text-[10px] font-bold px-2 py-0.5 rounded
${item.priority === "high" ? "bg-red-100 text-red-600"
: item.priority === "medium" ? "bg-yellow-100 text-yellow-700"
: "bg-gray-200 text-gray-600"}">

${item.priority}

</span>

</div>


<h3 class="text-sm font-bold mb-1">
${item.title}
</h3>

<p class="text-xs text-gray-500 mb-3">
${item.description}
</p>


<div class="flex gap-2 mb-3">

${item.labels.map(label => {

let color = ""

if(label === "bug"){
color = "bg-red-100 text-red-600"
}

else if(label === "help wanted"){
color = "bg-yellow-100 text-yellow-700"
}

else if(label === "enhancement"){
color = "bg-green-100 text-green-600"
}

else if(label === "documentation"){
color = "bg-orange-100 text-orange-600"
}

else if(label === "good first issue"){
color = "bg-blue-100 text-blue-600"
}

return `<span class="text-xs font-bold ${color} px-2 py-0.5 rounded">
${label.toUpperCase()}
</span>`

}).join("")}

</div>


<div class="text-[10px] text-gray-400 border-t pt-2">

#${item.id} by ${item.author}<br>
${new Date(item.createdAt).toLocaleDateString()}

</div>

</div>

`

grid.innerHTML += card

})

}





function changeTab(status){

document.querySelectorAll(".tab-btn")
.forEach(btn => btn.classList.remove("active"))

document.getElementById("tab-"+status)
.classList.add("active")

const loader = document.getElementById("loader")
const grid = document.getElementById("issueGrid")

grid.innerHTML = ""

loader.classList.remove("hidden")

setTimeout(function(){

loader.classList.add("hidden")

if(status === "all"){

renderIssues(allIssuesData)

}

else{

const filtered =
allIssuesData.filter(issue => issue.status === status)

renderIssues(filtered)

}

},600)

}




function openModal(id){

fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
.then(res => res.json())
.then(data => {

const issue = data.data

document.getElementById("m-title").innerText = issue.title

const status = document.getElementById("m-status")

if(issue.status === "open"){

status.innerText = "Opened"

status.className =
"bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-bold"

}

else{

status.innerText = "Closed"

status.className =
"bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs font-bold"

}

document.getElementById("m-meta").innerText =
`Opened by ${issue.author}`

document.getElementById("m-desc").innerText =
issue.description


document.getElementById("m-assignee").innerText =
issue.assignee || "Not Assigned"


const priorityText = document.getElementById("m-priority")

priorityText.innerText = issue.priority.toUpperCase()


if(issue.priority === "high"){
priorityText.className = "px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600"
}

else if(issue.priority === "medium"){
priorityText.className = "px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700"
}

else{
priorityText.className = "px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600"
}


const labels = document.getElementById("m-labels")

labels.innerHTML = ""

issue.labels.forEach(label => {

let color = ""

if(label === "bug"){
color = "bg-red-100 text-red-600"
}

else if(label === "help wanted"){
color = "bg-yellow-100 text-yellow-700"
}

else if(label === "enhancement"){
color = "bg-green-100 text-green-600"
}

else if(label === "documentation"){
color = "bg-orange-100 text-orange-600"
}

else if(label === "good first issue"){
color = "bg-blue-100 text-blue-600"
}

labels.innerHTML +=
`<span class="${color} px-2 py-1 rounded text-xs font-bold">
${label.toUpperCase()}
</span>`

})



const modal = document.getElementById("issueModal")

modal.classList.remove("hidden")
modal.classList.add("flex")

})

}




function closeModal(){

const modal = document.getElementById("issueModal")

modal.classList.add("hidden")
modal.classList.remove("flex")

}




function searchIssues(){

const keyword = document.getElementById("searchInput").value

fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${keyword}`)
.then(res => res.json())
.then(data => {

renderIssues(data.data)

})

}



const searchInput = document.getElementById("searchInput")

if(searchInput){

searchInput.addEventListener("keyup",function(e){

if(e.key === "Enter"){
searchIssues()
}

})

}