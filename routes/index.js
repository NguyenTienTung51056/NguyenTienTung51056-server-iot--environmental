import trashCanRouter from './trashCan.js';
import imageRouter from './image.js'
import searchLocationRouter from './location.js'


function route(app) {
    app.use('/trashcans', trashCanRouter);
    app.use('/images', imageRouter)
    app.use('/search-location', searchLocationRouter)
}


export default route;