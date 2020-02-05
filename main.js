const search = document.getElementById("search");
const profile = document.getElementById("profile");
const member = document.getElementById("member");
const urlgroup = "https://api.github.com/orgs/grupotesseract/public_members";
const urluser = "https://api.github.com/users";
var profileStatus = "";
const count = 8;
const sort = "created_at: asc";

async function getUser(user) {
  const membersResponse = await fetch(`${urlgroup}`);
  const profileResponse = await fetch(`${urluser}/${user}`);
  const reposResponse = await fetch(
    `${urluser}/${user}/repos?per_page=${count}&sort=${sort}`
  );

  profileStatus = profileResponse.status;
  const members = await membersResponse.json();
  const profile = await profileResponse.json();
  const repos = await reposResponse.json();
  return { members, profile, repos };
}

function FormataStringData(data) {
  var ano = data.split("-")[0];
  var mes = data.split("-")[1];
  var dia = data.split("-")[2];

  return dia + "/" + ("0" + mes).slice(-2) + "/" + ano;
}

function showProfile(user) {
  profile.innerHTML = `<div class="row mt-2 mb-2">
        <div id="users" class="col-sm-5"></div>
          <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="${user.avatar_url}">
            <ul class="list-group list-group-flush">
            <li class="list-group-item">User: <span class="">${
              user.login
            }</span></li>
              <li class="list-group-item">Repositórios: <span class="badge badge-success">${
                user.public_repos
              }</span></li>
              <li class="list-group-item">Seguidores: <span class="badge badge-primary">${
                user.followers
              }</span></li>
              <li class="list-group-item">Início Github: <span class="badge badge-secondary">${FormataStringData(
                user.created_at.substring(0, 10)
              )}</span></li>
            </ul>
            <div class="card-body">
              <a href="${
                user.html_url
              }" target="_blank" class="btn btn-lg btn-block btn-primary">Ver Perfil</a>
            </div>
          </div>        
      <div class="col -md -8"><div id="repos" class="mt-1"></div></div>
    </div>`;
}

function showDefaultProfile(message) {
  let output = "";

  profile.innerHTML = `<div class="card mt-2">
  <div id="header" class="card-header">
    Oooops... Desculpe, mas algo deu errado!
  </div>
  <div class="card-body text-center">
   <p class="card-text"> ${message} <p>
    <p class="card-text">
    <img width="200" heigth="200" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ-21vnn5jMmXy9VQNvelyXMt9grc9XK6TKr_F6LBYVKCEmOe4v">
    </p>
    <a href="http://paulinhomonteiro.com/curriculo" target="_blank" class="btn btn-lg btn-block btn-primary">Enquanto espera, que tal conhecer um pouco mais sobre o meu trabalho? Veja meu currículo</a>
  </div>
</div>`;

  document.getElementById("users").innerHTML = output;
}

function showRepos(repos) {
  let output = "";

  repos.forEach(repo => {
    output += `<div class="card card-body mb-2">
        <div class="row" mt-3>
          <div class="col-md-10"><a href=${repo.html_url} target="_blank">${repo.name}</a></div>
          <div class="col-md-10">
            <span class="badge badge-primary">Stars: ${repo.stargazers_count}</span>
            <span class="badge badge-primary">Watchers: ${repo.watchers}</span>
            <span class="badge badge-primary">Forks: ${repo.forks}</span>
          </div>
        </div>
      </div>`;
  });
  document.getElementById("repos").innerHTML = output;
}

function showMembers(members) {
  let output = "";

  members.forEach(member => {
    output += `<div class="card card-body mb-1">
        <div class="row justify-content-center align-items-center">
          <div id="member" class="col-md-12" style="cursor:pointer" onclick="findUser('${member.login}')">${member.login}
          <img class="img-thumbnail" heigth="50" width="50" align="right" src="${member.avatar_url}">
          </div>          
          </div>
      </div>`;
    document.getElementById("users").innerHTML = output;
  });
}

function findUser(user) {
  getUser(user).then(res => {
    if (profileStatus == 200) {
      showProfile(res.profile);
      showRepos(res.repos);
      showMembers(res.members);
    } else {
      console.log(res.profile.message);
      showDefaultProfile(res.profile.message);
    }
  });
}

search.addEventListener("keyup", e => {
  const user = e.target.value;

  getUser(user).then(res => {
    if (profileStatus == 200) {
      showProfile(res.profile);
      showRepos(res.repos);
      showMembers(res.members);
    } else {
      if (search.value !== "") {
        showDefaultProfile(res.profile.message);
      } else {
        findUser("reactjs");
      }
      showDefaultProfile(res.profile.message);
    }
  });
});
