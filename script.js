//You can edit ALL of the code here

// Begin with an empty state
const state = {
  episodes: [], // this is our list of episodes
  search: null, // search term
};

//let filterText = "";
//let filterId = "";
let totalEpisodes = 0;
let episodeCount = 0;
let selector = null;
const endpoint = "https://api.tvmaze.com/shows/82/episodes";

function filterIn(episode, filterText) {
    console.log(`filter ${episode.summary}\n${episode.name}\n${filterText}`);
    const result =
	  episode.summary.toLowerCase().includes(filterText.toLowerCase())
	  ||
	  episode.name.toLowerCase().includes(filterText.toLowerCase());
    console.log(`result ${result}`);
    return result;		
}


const filterEpisodes = function (e) {
    selector.value = "all";
    // filterText = e.target.value;
    // console.log(`filter text is ${filterText} now.`);
    doFiltering(e.target.value, "");
};

function doFiltering(text, id) {
    episodeCount = 0;
    console.log(`filtering: text: ${text} id: ${id}`);
    for (let index = 0; index < state.episodes.length; index++) {
	// for (const episode in state.episodes) {
	const episode = state.episodes[index];
	if ((text.length == 0 && id.length == 0) ||
	    (text.length > 0 && filterIn(episode, text)) ||
	    (id.length > 0 && episode.div.id == id)) {
	    // show the div
	    episode.div.style.display = "block";
	    episodeCount++;
	} else {
	    // hide the div
	    episode.div.style.display = "none";
	}
    }
    updateCount();
};


// Fetch stuff
const fetchEpisodes = async () => {
    const response = await fetch(endpoint);
    if (response.ok) {
	console.log(`response: ${response.status}`);
	return await response.json();
    } else {
	console.log(`response: ${response.status}`);
	return "{'error':'" + response.status + "'}";
    }
};


function setup() {
    selector = document.getElementById("episodeSelector");
    filterInput = document.getElementById('filterInput');
    filterInput.addEventListener('input', filterEpisodes);
    filterInput.addEventListener('propertyChange', filterEpisodes);
    selector.addEventListener('click', (event) => {
	if (event.target.value == "all") {
	    filterInput.value = "";
	    doFiltering("", "");
	}
    });
    selector.addEventListener('change', (event) => {
	// window.alert(`selected ${event.target.value}`);
	filterInput.value = "";
	let filterId = "";
	if (event.target.value != "all") {
	    filterId = event.target.value;
	}
	doFiltering("", filterId);
    });
    // state.episodes = getAllEpisodes();
    fetchEpisodes().then((episodes) => {
	if (!episodes.error) {
	    console.log(`got ${episodes.length} episodes`);
	    state.episodes = episodes;
	    console.log(`setup: now render ${state.episodes.length} episodes`);
	    render(state.episodes);
	} else {
	    console.log(episodes.error);
	    window.alert(episodes.error);
	}
    });
}
// render is only called once
// filtering will set div.style.display to none
function render() {
    totalEpisodes = 0;
    episodeCount = 0;
    // console.log(state.episodes[0]);
    const content = document.getElementById("root");
    const div = document.createElement("div");
    div.className = "container";
    div.id = "allEpisodes";
    for (let index = 0; index < state.episodes.length; index++) {
	const episode = state.episodes[index];
	const cell = displayEpisode(episode);
	div.appendChild(cell);
	// link the episode object to its display div
	episode.div = cell;
	episodeCount++;
	totalEpisodes++;
    }
    updateCount();
    content.appendChild(div);
    const copyright = document.createElement("div");
    copyright.className = "copyright";
    copyright.innerHTML = '<p>Data from <a href="https://tvmaze.com/">https://tvmaze.com/</a></p>';
    content.appendChild(copyright);
}

// update the display showing number of episodes displayed
function updateCount() {
    const count = document.getElementById("episodeCount");
    count.innerText = `${episodeCount}/${totalEpisodes}`;
}

// build the display for one episode
function displayEpisode(episode) {
    const cell = document.createElement("div");
    cell.className = "item";
    const episodeCode = createEpisodeCode(episode);
    cell.id = `${episodeCode}-${episode.name}`;
    // add this episode to the episode selector
    const option = document.createElement("option");
    option.value = cell.id;
    option.innerText = cell.id;
    selector.appendChild(option);
    // create the display elements
    const nameHeader = document.createElement("h2");
    const picImg = document.createElement("img");
    // const seasonEp = document.createElement("p");
    const summary = document.createElement("div");
    summary.className = "summary";
    // seasonEp.className = "season_ep";
    nameHeader.innerText = `${episode.name} - ${episodeCode}`;
    summary.innerHTML = episode.summary;
    if (episode.image != undefined) {
	picImg.src = episode.image.medium;
    } else {
	picImg.src = "https://placehold.co/100x100"
    }
    cell.appendChild(nameHeader);
    cell.appendChild(picImg);
    // cell.appendChild(seasonEp);
    cell.appendChild(summary);
    return cell;
}

function createEpisodeCode(episode) {
    let code = `S${numFormat(episode.season)}E${numFormat(episode.number)}`;
    return code;
}

function numFormat(number) {
    if (number < 10) {
	return `0${number}`;
    } else {
	return number;
    }
}

window.onload = setup;
