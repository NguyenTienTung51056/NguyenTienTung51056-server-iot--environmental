import trashCanRouter from './trashCan.js';
import deviceRouter from './device.js'


function route(app) {
    app.use('/trashcans', trashCanRouter);
    app.use('/devices', deviceRouter)
}


export default route;