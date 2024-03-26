import trashCanRouter from './trashCan.js';
import searchLocationRouter from './location.js'
import userRouter from './user.js'


function route(app) {
    app.use('/trashcans', trashCanRouter);
    app.use('/search-location', searchLocationRouter)
    app.use('/users', userRouter)
}


export default route;