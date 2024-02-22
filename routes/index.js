import trashCanRouter from './trashCan.js';
import deviceRouter from './device.js'
import imageRouter from './image.js'


function route(app) {
    app.use('/trashcans', trashCanRouter);
    app.use('/images', imageRouter)
    app.use('/devices', deviceRouter)
}


export default route;