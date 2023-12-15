const trashCanRouter = require('./trashCan');
const deviceRouter = require('./device');


function route(app){
    app.use('/trashcans', trashCanRouter);
    app.use('/devices',deviceRouter)
}


module.exports = route;