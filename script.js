//You can edit ALL of the code here

// Begin with an empty state
const state = {
  episodes: [], // this is our list of episodes
  search: null, // search term
};

// const endpoint = "https://randomuser.me/api?nat=GB&results=10";

// Fetch stuff
const fetchEpisodes = async () => {
  const response = await fetch(endpoint);
  return await response.json();
};


function setup() {
    const allEpisodes = getAllEpisodes();
    /*
      fetchEpisodes().then((episodes) => {
      state.episodes = episodes;
      render();
      });
    */
    makePageForEpisodes(allEpisodes);
}


function makePageForEpisodes(episodeList) {
    // const rootElem = document.getElementById("root");
    state.episodes = episodeList;
    render();
}

function render() {
    console.log(state.episodes[0]);
    const content = document.getElementById("root");
    const div = document.createElement("div");
    div.className = "container";
    for (let index = 0; index < state.episodes.length; index++) {
	const episode = state.episodes[index];
	const cell = displayEpisode(episode);
	div.appendChild(cell);
    }
    content.appendChild(div);
    const copyright = document.createElement("div");
    copyright.className = "copyright";
    copyright.innerHTML = '<p>Data from <a href="https://tvmaze.com/">https://tvmaze.com/</a></p>';
    content.appendChild(copyright);
    
}


function displayEpisode(episode) {
    const cell = document.createElement("div");
    cell.className = "item";
    const nameHeader = document.createElement("h2");
    const picImg = document.createElement("img");
    // const seasonEp = document.createElement("p");
    const summary = document.createElement("div");
    summary.className = "summary";
    // seasonEp.className = "season_ep";
    nameHeader.innerText = `${episode.name} ${createEpisodeCode(episode)}`;
    // cell.id = episode.email;
    console.log(`episode is ${episode}`);
    // seasonEp.innerText = `Season: ${episode.season} Episode: ${episode.number} (${createEpisodeCode(episode)})`;
    summary.innerHTML = episode.summary;
    picImg.src = episode.image.medium;
    cell.appendChild(nameHeader);
    cell.appendChild(picImg);
    // cell.appendChild(seasonEp);
    cell.appendChild(summary);
    return cell;
}

function createEpisodeCode(episode) {
    let code = "S";
    if (episode.season < 10) {
	code = code + "0";
    }
    code = code + episode.season + "E";
    if (episode.number < 10) {
	code = code + "0";
    }
    code = code + episode.number;
    return code;
}

window.onload = setup;
