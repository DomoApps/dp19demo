
function createPost(){
    var postBody = document.getElementById("postBody").value;
    domo.post(`/domo/datastores/v1/collections/DP19Forum/documents`,
        {
            content: {
                user: domo.env.userId,
                postBody: postBody
            }
        }
    )
    .then((res) => {
        loadPosts();
    });
}

function loadPosts() {
    var posts = document.getElementById("posts");
    domo.get(`/domo/datastores/v1/collections/DP19Forum/documents`)
        .then((data) => {
            renderPosts(data);
        })
}

function query() {
    var query = document.getElementById("searchbox").value !== null 
        ? document.getElementById("searchbox").value 
        : {};
    domo.post(`/domo/datastores/v1/collections/DP19Forum/documents/query`, 
        {'content.postBody': { '$regex': `${query}`, '$options': 'i' }}
    )
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