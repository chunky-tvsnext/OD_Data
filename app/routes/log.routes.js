module.exports = (app) => {
    const logs = require('../controllers/log.controller.js');

    // Create a new Note
    app.post('/logs', logs.saveLog);
    // Create a new Note
    // app.get('/rawLogs/:batteryId', logs.getLogsRaw);
    app.get('/rawLogs/:batteryId/:imeiNo', logs.getLogsRaw);
    app.get('/getBinNumbers', logs.getBinNumbers);
    app.get('/getAllLogs', logs.getAllLogs);
    // app.get('/getLogs', logs.getLogs);
    app.get('/getLogs/:searchKey/:fDate/:tDate', logs.getLogs);
    app.get('/getNotRespondingBins', logs.getNotRespondingBins);

    
}