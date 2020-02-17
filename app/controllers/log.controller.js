const Log = require('../models/log.model.js');
const BinN = require('../models/binN.model.js');
const request = require('request');
const NoResponse = require('../models/noResponse.model.js');


exports.getAllLogs = (req,res)=>{
    // Log.find().then()
 }

// Create and Save a new Note
exports.saveLog = (req, res) => {
    // Validate request

    if(!req.body) {
        return res.status(400).send({
            message: "Log content can not be empty"
        });
    }

    // Create a Note
    const logData = new Log({
        EQCycle : req.body.EQCycle,
        SOC : req.body.SOC,
        SOH : req.body.SOH,
        batteryStatus : req.body.batteryStatus,
        binNumber : req.body.binNumber,
        buildNo : req.body.buildNo,
        configVersion : req.body.configVersion,
        current : req.body.current,
        device : req.body.device,
        driver : req.body.driver,
        fwVersion : req.body.fwVersion,
        maxCellTemp : req.body.maxCellTemp,
        maxCellVoltage : req.body.maxCellVoltage,
        minCellTemp : req.body.minCellTemp,
        minCellVoltage : req.body.minCellVoltage,
        batteryLog_time : new Date(req.body.batteryLog_time).toISOString(),
        totalChargeCapacity : req.body.totalChargeCapacity,
        totalCycleCapacity : req.body.totalCycleCapacity,
        totalDisChargeCapacity : req.body.totalDisChargeCapacity,
        vehicle : req.body.vehicle,
        battery : req.body.battery,
        bin : req.body.bin,
        deviceBatteryVoltage : req.body.deviceBatteryVoltage,
        distanceTravelled : req.body.distanceTravelled,
        gprsAvailable : req.body.gprsAvailable,
        gpsAvailable : req.body.gpsAvailable,
        haltedSecs : req.body.haltedSecs,
        hardwareV : req.body.hardwareV,
        heading : req.body.heading,
        ignitionStatus : req.body.ignitionStatus,
        lat : req.body.lat,
        lng : req.body.lng,
        mainPowerStatus : req.body.mainPowerStatus,
        movingSecs : req.body.movingSecs,
        odometer : req.body.odometer,
        recordType : req.body.recordType,
        softwareV : req.body.softwareV,
        speed : req.body.speed,
        locationLog_time : new Date(req.body.locationLog_time).toISOString(),
        vehicleBatteryVoltage : req.body.vehicleBatteryVoltage,
        vehicleStatus : req.body.vehicleStatus,
        x : req.body.x,
        y : req.body.y,
        z : req.body.z
    });

    // Save Note in the database
    logData.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
};

async function getLogsRaw  (req, ress)  {
    batteryId =  req.params.batteryId.toUpperCase();
    imeiNo =  req.params.imeiNo;
    // batteryId = '1950449A';
    // imeiNo =  354716089394053;
    let result;
    if(batteryId.toUpperCase() =='NA'){
        result = await getBinNumber(imeiNo);
        batteryId = result.value;
    }else if(imeiNo==0){
        result =  await getIMEINumber(batteryId);
        imeiNo = result.value;
    }
   getLogFromOLA(batteryId,imeiNo,ress);
};

exports.getLogs = (req, res) => {
 
    let params = req.params;
    // console.log('====================', params.searchKey);
    Log.find({ [params.searchKey] : { $gte: new Date(params.fDate),$lt:new Date(params.tDate) }},{_id : 0},)
    .sort({[params.searchKey]:-1})
    .then(logs => {
        // console.log('logs=========',logs)
        res.send(logs);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
    
};

exports.getNotRespondingBins = (req, res) => {
 
    NoResponse.find({},{_id : 0})
    .then(logs => {
        // console.log('logs=========',logs)
        res.send(logs);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
    
};

function uniformData(data){

    let uniformedData ={
        TCU_FW_version: data.fwVersion,
        BMS_Build_Number: data.buildNo ,
        BMS_Config_Version: data.configVersion ,
        BMS_Date_IST: data.batteryLog_time ,
        BMS_Date: "NA" ,
        BMS_Time: "NA" ,
        gps_data_valid_status: data.gpsAvailable ,
        latitude: data.lat ,
        longitude: data.lng ,
        SoC: data.SOC ,
        SoH: data.SOH ,
        SoP: "NA" ,
        battery_status: data.batteryStatus ,
        cycle_capacity: data.totalCycleCapacity ,
        current: data.current ,
        equivalent_cycle: data.EQCycle ,
        maximum_cell_voltage: data.maxCellVoltage ,
        minimum_cell_volatage: data.minCellVoltage ,
        number_of_cells:"NA" ,
        cell_voltages: "NA" ,
        maximum_cell_temperature: data.maxCellTemp ,
        minimum_cell_temperature: data.minCellTemp ,
        pdu_temperature: "NA" ,
        board_temperature: "NA" ,
        number_of_temperature_sensors: "NA" ,
        cell_temperatures: "NA" ,
        errors: "NA" ,
        warnings: "NA" ,
        events: "NA" ,
        network_information: "NA" ,
        network_mode: "NA" ,
        aging_debug_info_advance: "NA" ,
        aging_debug_info_impede: "NA" ,
        internal_running_state: "NA" ,
        blive: "NA" ,
        ID: "NA" ,
        sequene_number:"NA" ,
        TCU_AccX: data.x ,
        TCU_AccY: data.y ,
        TCU_AccZ: data.z ,
        sender_ID: data.imeiNo ,
        BIN: data.binNumber ,
        server_date: data.locationLog_time ,
        // Device : data.device,//
        // Driver : data.driver,//
        Total_Charge_Capacity : data.totalChargeCapacity,
        Total_Discharge_Capacity : data.totalDisChargeCapacity,
        // Vehicle : data.vehicle,//
        // Battery : data.battery,//
        // Device_Battery_Voltage : data.deviceBatteryVoltage,//
        // Distance_Travelled : data.distanceTravelled,//
        GPRS_Available : data.gprsAvailable,
        // Halted_Secs : data.haltedSecs,//
        // HardwareV : data.hardwareV,//
        // Heading : data.heading,//
        // Ignition_Status : data.ignitionStatus,//
        // Main_Power_Status : data.mainPowerStatus,//
        // Moving_Secs : data.movingSecs,//
        // Odometer : data.odometer,//
        // Record_Type : data.recordType,//
        // Speed : data.speed,//
        // Vehicle_Battery_Voltage : data.vehicleBatteryVoltage,//
        // Vehicle_Status : data.vehicleStatus,//
        LocationLog_Time : data.locationLog_time
    }
// console.log('uniform dtat -------------',uniformedData.sender_ID);
    return uniformedData;
};

function saveNoResponseData(binNumber,imeiNo){
    const params = new NoResponse({
        binNumber : binNumber,
        imeiNo : imeiNo
    });

    // Save Note in the database
    params.save()
    .then(res => {
        return 'success';
    }).catch(err => {
        console.log('err',err)
        return `failed to save ${data}`;
    });
}

async function getBinNumber(imei_tcu){
    let promise = new Promise((resolve, reject) => {
        BinN.find({"imei_tcu" : `${imei_tcu.toString()}`},{binNumber : 1})
        .then(notes => {
            let result = {
                status : 200,
                message : '',
                value : ''
            }
            if(notes[0]!=undefined){
                result.message = 'data found';
                result.value = notes[0].binNumber
            }else{
                result.message = 'data not found';
            }
            resolve(result) ;
        }).catch(err => {
            console.log('bin fetch error : ',err)
            reject("Some error occurred while retrieving binNumber.");  
        });
        
    });

    return await promise;
}

async function getIMEINumber(binNumber){
    let promise = new Promise((resolve, reject) => {
        BinN.find({"binNumber" : `${binNumber}`},{imei_tcu : 1})
        .then(data => {
            let result = {
                status : 200,
                message : '',
                value : 0
            }
            if(data[0]!=undefined){
                result.message = 'data found';
                result.value = data[0].imei_tcu
            }else{
                result.message = 'data not found';
            }
            resolve(result) ;
        }).catch(err => {
            reject(err)
        });
        
    });

    return await promise;
}
// Retrieve and return all notes from the database.
exports.getBinNumbers = (req, res) => {
    BinN.find({},{_id : 0})
    .then(notes => {
        res.send(notes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

module.exports.getLogsRaw = getLogsRaw;

function getLogFromOLA(batteryId,imeiNo,ress){
    // console.log('getLogFromOLA called , batteryID : ',batteryId , imeiNo);
    request(`http://34.93.117.215:8443/battery/data/${batteryId}`, { json: true }, (err, res, body) => {
            if (err) { return console.log('errrrrrr',err); }
            
            if (body.battery_log==undefined) { 
                let status = saveNoResponseData(batteryId,imeiNo);
                ress.status(200).send({
                    status : false,
                    message: "No data found for this BIN/IMEI"
                });
                return console.log(`body : ${body.battery_log} , bin no : ${batteryId}`);
            }
    
            const logData = new Log({
                EQCycle : body.battery_log ? body.battery_log.EQCycle : null,
                SOC : body.battery_log ? body.battery_log.SOC : null,
                SOH : body.battery_log ? body.battery_log.SOH : null,
                batteryStatus : body.battery_log ? body.battery_log.batteryStatus : null,
                binNumber : body.battery_log ? body.battery_log.binNumber : null,
                buildNo : body.battery_log ? body.battery_log.buildNo : null,
                configVersion : body.battery_log ? body.battery_log.configVersion : null,
                current : body.battery_log ? body.battery_log.current : null,
                device : body.battery_log ? body.battery_log.device : null,
                driver : body.battery_log ? body.battery_log.driver : null,
                fwVersion : body.battery_log ? body.battery_log.fwVersion : null,
                maxCellTemp : body.battery_log ? body.battery_log.maxCellTemp : null,
                maxCellVoltage : body.battery_log ? body.battery_log.maxCellVoltage : null,
                minCellTemp : body.battery_log ? body.battery_log.minCellTemp : null,
                minCellVoltage : body.battery_log ? body.battery_log.minCellVoltage : null,
                batteryLog_time : body.battery_log ? new Date( body.battery_log.time).toISOString() : null,
                totalChargeCapacity : body.battery_log ? body.battery_log.totalChargeCapacity : null,
                totalCycleCapacity : body.battery_log ? body.battery_log.totalCycleCapacity : null,
                totalDisChargeCapacity : body.battery_log ? body.battery_log.totalDisChargeCapacity : null,
                vehicle : body.battery_log ? body.battery_log.vehicle : null,
                battery : body.location_log ? body.location_log.battery : null,
                bin : body.location_log ? body.location_log.bin : null,
                deviceBatteryVoltage : body.location_log ? body.location_log.deviceBatteryVoltage : null,
                distanceTravelled : body.location_log ? body.location_log.distanceTravelled : null,
                gprsAvailable : body.location_log ? body.location_log.gprsAvailable : null,
                gpsAvailable : body.location_log ? body.location_log.gpsAvailable : null,
                haltedSecs : body.location_log ? body.location_log.haltedSecs : null,
                hardwareV : body.location_log ? body.location_log.hardwareV : null,
                heading : body.location_log ? body.location_log.heading : null,
                ignitionStatus : body.location_log ? body.location_log.ignitionStatus : null,
                lat : body.location_log ? body.location_log.lat : null,
                lng : body.location_log ? body.location_log.lng : null,
                mainPowerStatus : body.location_log ? body.location_log.mainPowerStatus : null,
                movingSecs : body.location_log ? body.location_log.movingSecs : null,
                odometer : body.location_log ? body.location_log.odometer : null,
                recordType : body.location_log ? body.location_log.recordType : null,
                softwareV : body.location_log ? body.location_log.softwareV : null,
                speed : body.location_log ? body.location_log.speed : null,
                locationLog_time : body.location_log ? new Date(body.location_log.time).toISOString() : null,
                vehicleBatteryVoltage : body.location_log ? body.location_log.vehicleBatteryVoltage : null,
                vehicleStatus : body.location_log ? body.location_log.vehicleStatus : null,
                x : body.location_log ? body.location_log.x : null,
                y : body.location_log ? body.location_log.y : null,
                z : body.location_log ? body.location_log.z : null,
                imeiNo : imeiNo
            });

            // Save Note in the database
            logData.save()
            .then(data => {
                let uniformedData =  uniformData(data);
                let result ={
                    status : true,
                    message: "SUCCESS",
                    data : uniformedData
                }
                ress.send(result);
            }).catch(err => {
                console.log('err',err)
                ress.status(500).send({
                    status : false,
                    message: err.message || "Some error occurred while creating the Note."
                });
            });
    
        });
}


