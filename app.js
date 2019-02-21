
function createPost(){
    var postBody = document.getElementById("postBody").value;
    fetch(`/domo/magnum/v1/collection/DP19Forum/documents`, {
        method: 'POST',
        headers: {
            "accept": 'application/json',
            "content-type": 'application/json'
        },
        body: JSON.stringify({
            content: {
                user: domo.env.userId,
                postBody: postBody
            }
        }),
    }).then((res) => {
        loadPosts();
    });
}

function loadPosts() {
    var posts = document.getElementById("posts");
    domo.get(`/domo/magnum/v1/collection/DP19Forum/documents`)
        .then((data) => {
            renderPosts(data);
        })
}

function query() {
    var query = document.getElementById("searchbox").value !== null 
        ? document.getElementById("searchbox").value 
        : {};
    
    fetch(`/domo/magnum/v1/collection/DP19Forum/documents/query`, {
        method: 'POST',
        headers: {
            "accept": 'application/json',
            "content-type": 'application/json'
        },
        body: JSON.stringify({
            'content.postBody': { '$regex': `${query}`, '$options': 'i' }
        }),
    })
    .then(resp => resp.json())
    .then(data => renderPosts(data));
}

function renderPosts(data) {
    var postList= '';
    
    data.forEach(post => {
        getUserAvatar(post.content.user).then(avatarURL => {
            postList += 
            `<li class="list-group-item inline">
                <img src="${avatarURL}" height=50/>
                <small>${post.content.postBody}</small>
            </li>`
            posts.innerHTML = postList;
        })
    });
}

function getUserAvatar(id) {
    return domo.get(`/domo/users/v1/${id}?includeDetails=true`).then(data => {
        return data.avatarKey + '?size=100';
    })
}