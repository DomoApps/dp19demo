
function submit() {
    var postBody = document.getElementById("postBody").value;
    var fileName = document.getElementById("attachment").value.replace(/^.*\\/, "");;
    var file = document.getElementById("attachment").files[0];
    if(file === undefined) {
        createPost(
            {
                content: {
                    user: domo.env.userId,
                    postBody: postBody
                }
            }
        );
    }
    else {
        var formData = new FormData();
        formData.append('file',file);
        var postOptions = { contentType: 'multipart' };
        domo.post(`domo/data-files/v1?name=${fileName}`, formData, postOptions)
            .then((response) => {
                createPost(
                    {
                        content: {
                            user: domo.env.userId,
                            postBody: postBody,
                            attachmentName: fileName,
                            attachmentURL: `domo/data-files/v1/${response.dataFileId}`,
                        }
                    }
                );
            });
    }
}


function createPost(body){
    domo.post(`/domo/datastores/v1/collections/DP19Forum/documents`,
        body
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
            `<li class="list-group-item">
                <div class="inline">
                    <img src="${avatarURL}" height=50/>
                    <small>${post.content.postBody}</small><br />
                </div>
                <div class="attachmentWrapper">
                    ${post.content.attachmentURL
                        ? `${'&#x1f4ce;'} <a href="${post.content.attachmentURL}" download>
                            <span class="badge badge-secondary">${post.content.attachmentName}</span>
                        </a>`
                        : ''}
                </div>
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