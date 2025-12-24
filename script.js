//You can edit ALL of the code here

// Begin with an empty state
const state = {
    shows: [], // this is our list of shows
    // episodes: [], // this is our list of episodes
    showsEpisodes: new Map(), // maps shows to episodes
    search: null, // search term
    currentShow: null,
    showsRoot: null,
    episodesRoot: null,
    currentShowTitle: null,
};

let totalEpisodes = 0;
let episodeCount = 0;
let selector = null;
// let endpoint = "https://api.tvmaze.com/shows/82/episodes";
// let endpoint = "";
const showsEndpoint = "https://api.tvmaze.com/shows";

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
    doFiltering(e.target.value, "");
};

function doFiltering(text, id) {
    episodeCount = 0;
    console.log(`filtering: text: ${text} id: ${id}`);
    const episodes = state.showsEpisodes[state.currentShow];
    for (let index = 0; index < episodes.length; index++) {
	// for (const episode in state.episodes) {
	const episode = episodes[index];
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
const fetchShows = async () => {
    const response = await fetch(showsEndpoint);
    if (response.ok) {
	//console.log(`response: ${response.status}`);
	return await response.json();
    } else {
	//console.log(`response: ${response.status}`);
	return "{'error':'" + response.status + "'}";
    }
};

const fetchEpisodes = async (endpoint) => {
    const response = await fetch(endpoint);
    if (response.ok) {
	//console.log(`response: ${response.status}`);
	return await response.json();
    } else {
	//console.log(`response: ${response.status}`);
	return "{'error':'" + response.status + "'}";
    }
};


function setup() {
    state.episodesRoot = document.getElementById("episodesRoot");
    state.episodesContent = document.getElementById("root");
    state.showsRoot = document.getElementById("showsRoot");
    state.currentShowTitle = document.getElementById("showTitle");
    episodesRoot.style.display = "none";
    const showsButton = document.getElementById("showsButton");
    showsButton.addEventListener("click", (() => {
	state.episodesRoot.style.display = "none";
	state.showsRoot.style.display = "block";
    }));
    
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
    selector.addEventListener('change', ((event) => {
	// window.alert(`selected ${event.target.value}`);
	filterInput.value = "";
	let filterId = "";
	if (event.target.value != "all") {
	    filterId = event.target.value;
	}
	doFiltering("", filterId);
    }));
    fetchShows().then((shows) => {
	state.shows = shows;
	renderShows();
    });
}

function clearEpisodeSelector() {
    const content = document.getElementById("episodeSelector");
    //console.log(`got root as ${content} with ${content.firstChild}`);
    while (content.lastChild.value != "all") {
	content.removeChild(content.lastChild);
    }
    document.getElementById("filterInput").value = "";
}

function removeEpisodes() {
    const content = state.episodesContent;
    //console.log(`got root as ${content} with ${content.firstChild}`);
    while (content.firstChild) {
	//console.log(`removing content ${content.firstChild}`);
	const child = content.firstChild;
	while (child.firstChild) {
	    //console.log(`removing child ${content.firstChild}`);
	    child.removeChild(child.lastChild);
	}
	content.removeChild(content.lastChild);
    }
}

function getShowEpisodes(showId) {
    // endpoint = url;
    state.showsRoot.style.display = "none";
    state.episodesRoot.style.display = "block";
    if (showId === state.currentShow) {
	render(state.showsEpisodes[showId]);
    } else {
	const endpoint = `https://api.tvmaze.com/shows/${showId}/episodes`;
	// state.episodes = getAllEpisodes();
	fetchEpisodes(endpoint).then((episodes) => {
	    state.showsEpisodes[showId] = episodes;
	    state.currentShow = showId;
	    if (!episodes.error) {
		console.log(`got ${episodes.length} episodes`);
		state.episodes = episodes;
		console.log(`setup: now render ${state.episodes.length} episodes`);
		render(state.showsEpisodes[showId]);
	    } else {
		console.log(episodes.error);
		window.alert(episodes.error);
	    }
	});
    }
}

// renderShows is only called once
// when a show is selected, the shows div is hidden and the episodes
// are displayed
function renderShows() {
    // console.log(state.episodes[0]);
    const content = state.showsRoot;
    const episodes = state.episodesRoot;
    content.style.display = "block";
    episodes.style.display = "none";
    const div = document.createElement("div");
    div.className = "container";
    div.id = "allShows";
    for (let index = 0; index < state.shows.length; index++) {
	const show = state.shows[index];
	const cell = displayShow(show);
	div.appendChild(cell);
	// link the episode object to its display div
	show.div = cell;
    }
    content.appendChild(div);
    const copyright = document.createElement("div");
    copyright.className = "copyright";
    copyright.innerHTML = '<p>Data from <a href="https://tvmaze.com/">https://tvmaze.com/</a></p>';
    content.appendChild(copyright);
}

// render is only called once
// filtering will set div.style.display to none
function render(episodes) {
    totalEpisodes = 0;
    episodeCount = 0;
    // console.log(state.episodes[0]);
    const content = state.episodesContent;
    const shows = state.showsRoot;
    content.style.display = "block";
    shows.style.display = "none";
    const div = document.createElement("div");
    div.className = "container";
    div.id = "allEpisodes";
    for (let index = 0; index < episodes.length; index++) {
	const episode = episodes[index];
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

// build the display for one show
function displayShow(show) {
    const cell = document.createElement("div");
    cell.className = "item";
    cell.id = show.id;
    // create the display elements
    const nameHeader = document.createElement("h2");
    nameHeader.addEventListener("click", (() => {
	// display the episodes for this show
	state.currentShowTitle.innerText = show.name;
	removeEpisodes();
	clearEpisodeSelector();
	console.log(`getting from ${show.id}`);
	getShowEpisodes(show.id);
    })); 
    const picImg = document.createElement("img");
    // const seasonEp = document.createElement("p");
    const summary = document.createElement("div");
    const genreBox = document.createElement("div");
    genreBox.className = "genreBox";
    const genres = document.createElement("div");
    const genresHeading = document.createElement("p");
    genresHeading.className = "genresHeading";
    genresHeading.innerHTML = "<b>Genres...</b>";
    const ratingDiv = document.createElement("div");
    genres.className = "genreList";
    summary.className = "summary";
    // seasonEp.className = "season_ep";
    nameHeader.innerText = show.name;
    summary.innerHTML = show.summary;
    ratingDiv.className = "rating";
    ratingDiv.innerHTML = `<p><b>Rating</b>: ${show.rating.average}, <b>Status</b>: ${show.status}, <b>Runtime</b>: ${show.runtime}</p>`;
    if (show.image != undefined) {
	picImg.src = show.image.medium;
    } else {
	picImg.src = "https://placehold.co/100x100"
    }
    for (let genreIndex = 0; genreIndex < show.genres.length; genreIndex++) {
	const genre = show.genres[genreIndex];
	const genreDiv = document.createElement("div");
	genreDiv.className = "genre";
	genreDiv.innerHTML = `<genre>${genre}</genre>`;
	genres.appendChild(genreDiv);
    }
    genreBox.appendChild(genresHeading);
    genreBox.appendChild(genres);
    cell.appendChild(nameHeader);
    cell.appendChild(picImg);
    // cell.appendChild(seasonEp);
    cell.appendChild(summary);
    cell.appendChild(genreBox);
    cell.appendChild(ratingDiv);
    return cell;
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
