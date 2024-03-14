import trashCanRouter from './trashCan.js';
import searchLocationRouter from './location.js'


function route(app) {
    app.use('/trashcans', trashCanRouter);
    app.use('/search-location', searchLocationRouter)
}


export default route;