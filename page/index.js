(async () => {
  let commitMessageList = document.getElementById("commit_message_list");
  let commitsRequest = await fetch("https://api.github.com/repos/Ivan-Krul/PersonalWizardWeb/commits").then(value => value.json());

  for (let i = 0; i < commitsRequest.length; i++) {
    commitMessageList.innerHTML += `<div><span>${commitsRequest[i].commit.message}</span></div>`;
  }

  let forksCount = document.getElementById("fork_count");
  let repoRequest = await fetch("https://api.github.com/repos/Ivan-Krul/PersonalWizardWeb").then(response => response.json());

  forksCount.innerText = repoRequest.forks_count;
})();