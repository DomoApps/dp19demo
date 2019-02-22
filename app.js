
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
            var postList= '';
            data.forEach(post => {
                postList += 
                    `<li class="list-group-item">
                        <span class="badge badge-secondary">${post.content.user}</span>
                        <div>
                            <small>${post.content.postBody}</small>
                        </div>
                    </li>`
                posts.innerHTML = postList;
            });
        })
}
