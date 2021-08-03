// List Movie Display

// - useEffect to prompt axios call on page load
// - enter API key, parameters, set adult to false
// - chain .then to pass relevant information from JSON object
//     - register info as movieDetails using setState
//         - [movieDetails, setMovieDetails]
// - chain .catch to handle errors
// - no dependency

// - display main page movie card (separate component)
// - display movieDetails using props
//     - display title, trailer, description, director, cast and genre passed from movieDetails

// - Add "Back to List" button to link to list search page
// - Link H1 "Quick Flick Finder" to main page as well

import { useState, useEffect } from "react";
import axios from "axios";

// npm install sweetalert2
// import Swal from 'sweetalert2'
import Swal from "sweetalert2";

// npm install react-player --save
// import ReactPlayer from "react-player"
import ReactPlayer from "react-player";

const MovieDisplay = () => {
	// userChoice will be assigned from movie ID from search bar on main page or from a click on movie thumbnail in list display frame
	const [movieID, setMovieID] = useState(435);
	const [movieDetails, setMovieDetails] = useState([]);
	const [trailerDetails, setTrailerDetails] = useState([]);
	const [cast, setCast] = useState([]);
	const [crew, setCrew] = useState([]);
	const apiKey = "08ee0b6bad4fa0390665644090dff4ff";
	const baseURL = `https://api.themoviedb.org/3/movie/${movieID}`;
	const imageURL = "https://image.tmdb.org/t/p/w500";
	const youTubeURL = "https://www.youtube.com/watch?v=";

	const errorHandling = () => {
		Swal.fire({
			title: "Error!",
			text: "Unable to find that movie. Please try again!",
			icon: "error",
			confirmButtonText: "OK",
		});
	};

	// Axios call to get movie details

	useEffect(() => {
		setMovieID(440);
		axios({
			url: baseURL,
			params: {
				api_key: apiKey,
			},
		})
			.then((res) => {
				setMovieDetails(res.data);
			})
			.catch(() => {
				errorHandling();
			});
	}, [movieID]);

	useEffect(() => {
		axios({
			url: `${baseURL}/videos`,
			params: {
				api_key: apiKey,
			},
		})
			.then((res) => {
				setTrailerDetails(res.data.results[0]);
			})
			.catch(() => {
				errorHandling();
			});
	}, [movieID]);

	useEffect(() => {
		axios({
			url: `${baseURL}/credits`,
			params: {
				api_key: apiKey,
			},
		})
			.then((res) => {
				setCast(res.data.cast);
				setCrew(res.data.crew);
			})
			.catch(() => {
				errorHandling();
			});
	}, [movieID]);

	console.log(movieDetails, trailerDetails, cast, crew);

	// Destructuring movieDetails object to display relevant information
	const { title, imdb_id, overview, poster_path } = movieDetails;

	// Setting the genres
	const genres = [];
	for (const genre in movieDetails.genres) {
		genres.push(movieDetails.genres[genre].name);
	}
	console.log(genres);

	// Setting trailerID to display relevant information
	console.log(trailerDetails.key);
	const trailerKey = trailerDetails.key;

	// Destructuring movieCredits object to display relevant information
	const actorsObject = cast.slice(0, 5);
	const actors = [];
	for (let i = 0; i < actorsObject.length; i++) {
		actors.push(actorsObject[i].name);
	}

	let directors = [];
	for (const role in crew) {
		if (crew[role].known_for_department === "Directing")
			directors.push(crew[role].name);
	}

	return (
		<div className="poster">
			<div className="description">
				<h2>{title}</h2>
				<img
					src={`${imageURL}${poster_path}`}
					alt={`Poster of ${title}`}
				/>
				<p>{overview}</p>
				<div>
					<ReactPlayer url={`${youTubeURL}${trailerKey}`} />
				</div>
				<p>{genres.join(", ")}</p>
				<p>Main Cast: {actors.join(", ")}</p>
				<p>Director: {directors[0]}</p>
				<a href={`https://www.imdb.com/title/${imdb_id}`}>On IMBD</a>
			</div>
		</div>
	);
};
export default MovieDisplay;