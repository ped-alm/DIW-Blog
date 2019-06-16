let db = JSON.parse(localStorage.getItem('db'));
if (!db) {
    db = dbStart;
}

document.addEventListener('DOMContentLoaded', function () {
    let elems = document.querySelectorAll('.modal');
    let instances = M.Modal.init(elems);
});

function addLike(id) {
    let post = findPost(id);
    post.likes++;
    updatePost(id, post);

    document.getElementById("likes_" + id).innerText = post.likes;
}

function commentsTrigger(id) {
    let innerHTML = "";
    let post = findPost(id);

    post.comments.forEach(item => {
        innerHTML += `
        <div class="row">
            <div class="col s12">
                <div class="card-panel indigo">
                    <span class="white-text">
                        ${item.name} <br><br> ${item.text}
                    </span>
                </div>
            </div>
        </div>`
    });

    document.getElementById("comModalContent").innerHTML = innerHTML;

    let element = document.querySelectorAll('.modal')[0];
    let modal = M.Modal.getInstance(element);
    modal.open();
}


function updatePost(id, post) {
    db.find((item, index, array) => {
        if (item.id == id)
            array[index] = post;
    });

    localStorage.setItem("db", JSON.stringify(db));
}

function findPost(id) {
    return db.find(item => item.id == id);
}

function comparePostDate(a, b) {
    let da = new Date(a.date);
    let db = new Date(b.date);

    if (da > db)
        return -1;
    if (da < db)
        return 1;
    return 0;
}

function loadData() {
    db.sort(comparePostDate);
    let innerHTML = "";

    for (let i = 0; i < db.length; i++) {
        innerHTML += `        
        <div class="col xl4 m6 s12">
            <div class="card large sticky-action">
                <div class="card-image waves-effect waves-block waves-light">
                    <img class="activator" alt="Post Image" src="data:image/png;base64, ${db[i].image}">
                </div>
                <div class="card-content">
                    <span class="card-title activator grey-text text-darken-4">
                        <div class="col s10">
                            <i class="material-icons left activator">calendar_today</i>
                            <h6 class="activator">${formatDate(db[i].date)}</h6>
                        </div>
                        <div class="col s2">
                            <i class="material-icons right">more_vert</i>
                        </div>
                        <div class="col s12 activator">
                            ${db[i].title}
                        </div>
                    </span>
                </div>
                <div class="card-action">
                    <div class="col s6">
                        <button class="waves-effect waves-light btn indigo right" onclick="addLike(${db[i].id})">
                            <i class="material-icons">thumb_up</i>
                            <span id="likes_${db[i].id}">${db[i].likes}</span>
                        </button>
                    </div>
                    <div class="col s6">
                        <button class="waves-effect waves-light btn indigo" onclick="commentsTrigger(${db[i].id})">
                            <i class="material-icons">speaker_notes</i>
                            <span id="comments_${db[i].id}">${db[i].comments.length}</span>
                        </button>
                    </div>
                </div>
                <div class="card-reveal">
                    <span class="card-title grey-text text-darken-4">
                        <div class="col s10">
                            <i class="material-icons left">calendar_today</i>
                            <h6>${formatDate(db[i].date)}</h6>
                        </div>
                        <div class="col s2">
                            <i class="material-icons right">close</i>
                        </div>
                        <div class="col s12">
                            ${db[i].title}
                        </div>
                    </span>
                    <div class="col s12">
                        <p>${db[i].text}</p>
                    </div>
                </div>
            </div>
        </div>`;
    }

    document.getElementById("container").innerHTML = innerHTML;
}

function formatDate(date) {
    let formattedDate = "";
    date = new Date(date);
    formattedDate += date.getDate() + "/";
    formattedDate += date.getMonth() + "/";
    formattedDate += date.getFullYear() + " ";
    formattedDate += date.getHours() + ":";
    formattedDate += date.getMinutes() + ":";
    formattedDate += date.getSeconds();

    return formattedDate;
}



