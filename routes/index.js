import trashCanRouter from './trashCan.js';
import searchLocationRouter from './location.js'
import userRouter from './user.js'
import deviceRouter from './device.js'


function route(app) {
    app.use('/trashcans', trashCanRouter);
    app.use('/search-location', searchLocationRouter)
    app.use('/devices', deviceRouter)
    app.use('/users', userRouter)
}


export default route;