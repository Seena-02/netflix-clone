import React, {useState, useEffect} from "react";
import axios from "./axios";
import './Row.css'
import Youtube from "react-youtube";
//import movieTrailer from "movie-trailer"
const base_url = "http://image.tmdb.org/t/p/original";

function Row( {title, fetchUrl, isLargeRow} ) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        //if [], run once when the row loads, and don't run again.
        async function fetchData() {
            //appends request url with API_KEY at thend of baseURL from axios
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
        //[], must be populated with the outsourced variable, because it in now a dependency within useEffect()
    }, [fetchUrl]);

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        },
    };

    //OLD handleClick function useing move-trailer
    // const handleClick = (movie) => {
    //     if (trailerUrl) {
    //         setTrailerUrl('');
    //     } else {
    //         movieTrailer(movie?.name || "")
    //         .then(url => {
    //             const urlParams = new URLSearchParams (new URL(url).search);
    //             setTrailerUrl(urlParams.get('v'));
    //         }).catch(error => console.log(error));
    //     }
    // }

    const handleClick = async (movie) => {
        if (trailerUrl) {
          setTrailerUrl("");
        } else {
          let trailerurl = await axios.get(
            `/movie/${movie.id}/videos?api_key=${process.env.REACT_APP_SECRET_KEY}`
          );
          setTrailerUrl(trailerurl.data.results[0]?.key);
        }
      };

    return (
        <div className="row">
            <h2>{title}</h2>
                <div className = "row_posters">
                    {/*row-poster*/}
                    {movies.map(movie => (
                        <img
                        key={movie.id}
                        onClick = {() => handleClick(movie)} 
                        className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                        src = {`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} 
                        alt={movie.name}
                        />
                    ))}
                </div>
                {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
        </div>
    )
}

export default Row;