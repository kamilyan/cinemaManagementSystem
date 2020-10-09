const Movie = require('../models/odm/subscriptionsDB/movies');

module.exports.displayMovies = async (req, res, next) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports.displayMovie = async (req, res, next) => {
    try {
        movie = await Movie.findById(req.params.id);
        if (movie == null) {
            return res.status(404).json({ message: 'Cannot find movie' });
        }
        res.json(movie);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.addMovie = async (req, res, next) => {
    const movie = new Movie({
        name: req.body.name,
        genres: req.body.genres,
        image: req.body.image,
        premiered: req.body.premiered
    });

    try {
        const newMovie = await movie.save();
        res.status(201).json(newMovie);
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports.editMovie = async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (movie == null) {
            return res.status(404).json({ message: 'Cannot find movie' });
        }
        movie.name = req.body.name;
        movie.genres = req.body.genres;
        movie.image = req.body.image;
        movie.premiered = req.body.premiered;
        const updatedMovie = await movie.save();
        res.status(200).json(updatedMovie);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.deleteMovie = async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id);
        await movie.remove();
        res.json({ message: 'Deleted movie' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}