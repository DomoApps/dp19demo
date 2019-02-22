# STEP 1 - Domo Init Blank slate
### Base Level CSS
Add this to your app.css file:

body{
  margin: 0;
  background-color: #f2f2f2;
}
h1 {
  text-align: center;
}
.mt-20 {
  margin-top: 20px;
}

# STEP 2 - Configure a collection
### Manifest.json
Add this property to your manifest file:

"collections": [
    {
    "name": "DP19Forum",
      "schema": {"columns":
        [
          {"name": "user", "type": "STRING"},
          {"name": "postBody", "type": "STRING"}
        ]
      },
    "syncEnabled": true
    }
  ],

# STEP 3 - Add some boilerplate HTML and Bootstrap code.
### Index.html
Add this stylesheet from the bootstrap cdn:
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />

Add this javascript file from the bootstrap cdn:
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>

Bootstrap cdn can be found here: https://www.bootstrapcdn.com/
Bootstrap component documentation here: https://getbootstrap.com/

Add these html elements styled with bootstrap classes to the HTML body:

<h1>DomoPalooza2019 Forum</h1>
<!-- List of Posts -->
<ul class="list-group" id="posts">
</ul>

<!-- New Post Input Box -->
<div class="input-group mb-3 mt-20">
    <div class="input-group-prepend">
    <span class="input-group-text" id="basic-addon1">New Post</span>
    </div>
    <textarea class="form-control" aria-label="With textarea" id="postBody"></textarea>
</div>
<button type="button" class="btn btn-primary">Submit</button>

# STEP 4 - Add functionality to your app to use AppDB
### App.js

Add these 2 functions to your app.js file:

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

# STEP 5 - Query AppDB
### App.js

Add this additional function to your app.js file:

function query() {
    var query = document.getElementById("searchbox").value !== null 
        ? document.getElementById("searchbox").value 
        : {};
    domo.post(`/domo/magnum/v1/collection/DP19Forum/documents/query`, 
        {'content.postBody': { '$regex': `${query}`, '$options': 'i' }}
    )
    .then(data => renderPosts(data));
}

Pull the post rendering function out of the loadPosts() function and create a new function:

function renderPosts(data) {
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
}

Modify the loadPosts() function to use the new renderPosts() function:

function loadPosts() {
    var posts = document.getElementById("posts");
    domo.get(`/domo/magnum/v1/collection/DP19Forum/documents`)
        .then((data) => {
            renderPosts(data);
        })
}

### Index.html

Add the following new html elements to index.html:

<!-- Search Box -->
<div class="input-group mb-3">
    <div class="input-group-prepend">
    <span class="input-group-text" id="search-addon">Search</span>
    </div>
    <input type="text" class="form-control" placeholder="Search..." aria-label="Search" aria-describedby="search-addon" id="searchbox">
</div>
<button type="button" class="btn btn-primary" onClick="query()">Submit</button>

# STEP 6 - Query the Users endpoint to look up the user avatar
### App.js

Add the following function into your app.js file:

function getUserAvatar(id) {
    return domo.get(`/domo/users/v1/${id}?includeDetails=true`).then(data => {
        return data.avatarKey + '?size=100';
    })
}

Refactor your renderPosts() function to use the getUserAvatar() function:

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

