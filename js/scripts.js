$(document).ready(function(){
	const apiBaseUrl = 'http://api.themoviedb.org/3';
	const imageBaseUrl = 'http://image.tmdb.org/t/p/';
	const nowPlayingUrl = apiBaseUrl + '/movie/now_playing?api_key='+apiKey;

	genreButtons();


	$.getJSON(nowPlayingUrl,(nowPlayingData)=>{
		// for (let i = 0; i < genreArray.length; i++){
		// 	buttonsHTML += `<button class='btn btn-success genre-button'>${genreArray[i].name}</button>`;
		// 	}
		// $('#genre-buttons').html(buttonsHTML);
		var nowPlaying = getHTML(nowPlayingData);
		$('#movie-grid').html(nowPlaying);
		$('.movie-poster').click(function(event){
			var movieID = $(this).attr('movie-id');	
			movieModal(nowPlayingData,movieID);		
		})
		$grid = $('#movie-grid').isotope({
			itemSelector: '.movie-poster'
		});
		$('.genre-button').click(function(event){
			$grid.isotope({filter: `.${this.innerText}`})
		})				
	})



	$('#movie-form').submit((event)=>{
		event.preventDefault();
		var userInput = encodeURI($('#search-input').val());
		$('#search-input').val('');
		var searchUrl = `${apiBaseUrl}/search/movie?query=${userInput}&api_key=${apiKey}`;
		
		$.getJSON(searchUrl,(searchMovieData)=>{
			var searchMovie = getHTML(searchMovieData);			
			$('#movie-grid').html(searchMovie);

			$('.movie-poster').click(function(event){
				var movieID = $(this).attr('movie-id');
				movieModal(searchMovieData,movieID);				
			});
			$('#movie-grid').isotope('destroy');

			$grid = $('#movie-grid').isotope({
				itemSelector: '.movie-poster'
				});
			$('.genre-button').click(function(event){
				$grid.isotope({filter: `.${this.innerText}`})
				})				

			// sortPosters();

		})
	})



	function getHTML(data){
			var movieHTML = '';
			for (let i = 0; i < data.results.length; i++){
				var poster = imageBaseUrl + 'w300' +data.results[i].poster_path;
				var description = data.results[i].overview;
				var release = data.results[i].release_date;
				var title = data.results[i].title;
				var id = data.results[i].id;
				var thisMovieGenres = data.results[i].genre_ids;
				var movieGenreClassList = " ";
				for (let j = 0; j < genreArray.length; j++){
					if (thisMovieGenres.indexOf(genreArray[j].id) > -1){
						movieGenreClassList += genreArray[j].name + ' ';
					}
				};
				console.log(movieGenreClassList)
				var backdrop = `${imageBaseUrl}w780${data.results[i].backdrop_path}`;
				var movieUrl = `${apiBaseUrl}/movie/${id}?api_key=${apiKey}`;
				movieHTML += `<div class='col-sm-6 col-md-4 col-lg-3 movie-poster${movieGenreClassList}' movie-id=${id} data-toggle='modal' data-target='#myModal'>`;
					movieHTML += `<img src="${poster}"/>`;
				movieHTML += '</div>';
			}
			return movieHTML;
	}

	function movieModal(data,movieID){
		var movieIDUrl = `${apiBaseUrl}/movie/${movieID}?api_key=${apiKey}`
		$.getJSON(movieIDUrl,(movieData)=>{
			var backdrop = `${imageBaseUrl}w780${movieData.backdrop_path}`
			$('#myModalLabel').html(movieData.title);
			$('.modal-body').html(`<div class="backdrop"><img src="${backdrop}" /></div><div class="release"><span class="info">Release Date: </span>${movieData.release_date}</div><div class="synopsis">${movieData.overview}</div>`);
		})
	}

	function genreButtons(){
		var buttonsHTML = '';		
		for (let i = 0; i < genreArray.length; i++){
			buttonsHTML += `<button class='btn btn-success genre-button'>${genreArray[i].name}</button>`;
		}
		$('#genre-buttons').html(buttonsHTML);
	}



})
