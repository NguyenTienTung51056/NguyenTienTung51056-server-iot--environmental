import trashCanRouter from './trashCan.js';
import deviceRouter from './device.js'
import imageRouter from './image.js'
import searchLocationRouter from './location.js'


function route(app) {
    app.use('/trashcans', trashCanRouter);
    app.use('/images', imageRouter)
    app.use('/devices', deviceRouter)
    app.use('/search-location', searchLocationRouter)
}


export default route;