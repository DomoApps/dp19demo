
function createPost(){
    var postBody = document.getElementById("postBody").value;
    domo.post(`/domo/magnum/v1/collection/DP19Forum/documents`,
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
    domo.get(`/domo/magnum/v1/collection/DP19Forum/documents`)
        .then((data) => {
            renderPosts(data);
        })
}

function query() {
    var query = document.getElementById("searchbox").value !== null 
        ? document.getElementById("searchbox").value 
        : {};
    domo.post(`/domo/magnum/v1/collection/DP19Forum/documents/query`, 
        {'content.postBody': { '$regex': `${query}`, '$options': 'i' }}
    )
    .then(data => renderPosts(data));
}

function renderPosts(data) {
    var postList= '';
    data.forEach(post => {
        getUserAvatar(post.content.user).then(avatarURL => {
            postList += 
            `<li class="list-group-item">
                <span class="badge badge-secondary">${post.content.user}</span>
                <div>
                    <small>${post.content.postBody}</small>
                </div>
            </li>`
            posts.innerHTML = postList;
        })
    });
}