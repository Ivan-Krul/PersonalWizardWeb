(async() => {
	let githubFeed = document.getElementById("github_feed");
	let repoRequest = await fetch("https://corsproxy.io/?https%3A%2F%2Fapi.github.com%2Frepos%2FIvan-Krul%2FPersonalWizardWeb").then(text => text.json());


githubFeed.innerText = `Pushed at: ${repoRequest.pushed_at}`;

})()