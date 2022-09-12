/*************************************************************************************************************************
 * DESCRIPTION: 
 * 				This is the graphical user interface for a mobile robot. 
 * 				The Human-Machine-Interface is used to operate the mobile robot with the help of different modes. 
 * 				These include modes such as remote control, programming,
 * 				an algorithm that allows the robot to find its own way 
 * 				and a mode that allows the robot to find the fastest way by creating a map
 * 
 * DEVELOPER: 
 * 				Firat Gök <f.goek@huettinger.de>
 * 
 * DATE:		
 * 				15.09.2021
 * VERSION: 	
 * 				0.0.1
*************************************************************************************************************************/

#include <scripts/10001/10001_Settings.js>
#include <scripts/10001/ControlRobotMode.js>
var settings = new Settings();

var DC = GetDeviceCode();

var debugMode = true;

var startPage = null;
var instructionAlgorithmPage = null;
var instructionMappingPage = null;
var instructionRemoteControlPage = null;
var instructionProgrammingPage = null;
var popupPage = null;

var gameAlgorithmPage = null;
var gameMappingPage = null;
var gameRemoteControlPage = null;
var gameProgrammingPage = null;


var instructionPages = [instructionProgrammingPage, instructionRemoteControlPage, instructionAlgorithmPage, instructionMappingPage];
var gamePages = [gameProgrammingPage, gameRemoteControlPage, gameAlgorithmPage, gameMappingPage];
var MODES = {
	PROGRAMMING: 0,
	REMOTE_CONTROL: 1,
	ALGORITHM: 2,
	MAPPING: 3,
	START: 4
};
var MODE_PAGES_IDS = {
	PROGRAMMING: {INSTRUCTION_PAGE: 0, GAME_PAGE: 5}, 
	REMOTE_CONTROL: {INSTRUCTION_PAGE: 1, GAME_PAGE: 6},
	ALGORITHM: {INSTRUCTION_PAGE: 2, GAME_PAGE: 7},
	MAPPING: {INSTRUCTION_PAGE: 3, GAME_PAGE: 8},
	START: {INSTRUCTION_PAGE: 4}
};

// var pages = [null, null, null, null, null, null, null, null, null];
var pages = [null] * 9;
var modes = ["Programming", "RemoteControl", "Algorithm", "Mapping"];
var pageNames = ["start", "instruction", "game"];

var controlProgramming = new ControlRobotMode("programming");
var controlRemoteControl = new ControlRobotMode("remoteControl");
var controlAlgorithm = new ControlRobotMode("algorithm");
var controlMapping = new ControlRobotMode("mapping");
var modesController = [controlProgramming, controlRemoteControl, controlAlgorithm, controlMapping];


// Network Settings
var listener = null;
var listenerPort = 5001;
var sendingIP = "192.168.2.159"; //"192.168.2.165"; //"172.20.72.12"; //"127.0.0.1";
var sendingPort = 5000;


function StartCallback() {

	if (GetSetting("Debug") == "1") {
		Log("DEBUG VERSION");
        SetSetting("Warmup", 10);
        SetWindow(1920, 1080, true);
		SetTimeout(settings.TIMEOUT_MIN, settings.TIMEOUT_SEC);		
    } else {
		debugMode = false;
		Log("RELEASE VERSION");
        SetInterval(settings.FOCUS_INTERVAL_MS, doFocus);
        HideCursor();
        SetSetting("Warmup", "" + settings.WARMUP_TIME_IN_MS);
        SetWindow(settings.SCREEN_WIDTH, settings.SCREEN_HEIGHT, false);
        SetTimeout(settings.TIMEOUT_MIN, settings.TIMEOUT_SEC);
	}

	listener = ListenUDP(listenerPort, OnMessageUDP);
	initPages();
}

function OnMessageUDP(msg) {
	Log(msg);
	if(msg != "stop" || msg != "collistion")
	{
		for (var i = 0; i < modesController.length; i++) {
			var dirCommand = modesController[i].executing();
			Log(dirCommand);
			if(dirCommand != false) {
				sendMsgToRobot(dirCommand);
			} else {
				OpenPage(popupPage);
			}
		}
	}
}



function debugLog(msg) {
	if (debugMode){
		Log(msg);
	}
}

function doFocus() {
	Focus();
}

function initPages() {
	startPage = LoadPage(GetResource("screen\\"+DC+"\\"+DC+ "_start" +".xui"));
	popupPage = LoadPage(GetResource("screen\\"+DC+"\\"+DC+ "_popup" +".xui"));
	controlProgramming.init(["_instruction_programming", "_game_programming"], startPage);
	controlRemoteControl.init(["_instruction_remote_control", "_game_remote_control"], startPage);
	controlAlgorithm.init(["_instruction_algorithm", "_game_algorithm"], startPage);
	controlMapping.init(["_instruction_mapping", "_game_mapping"], startPage);
	OpenPage(startPage);
}

function changeLanguage(lng) {
	SetLanguage(lng);
}


function startMode(mode) {
	Log("mode: " + mode);
	for (var i = 0; i < modesController.length; i++) {
		if(modesController[i].getName() == mode) {
			modesController[i].startMode();
		}
	}
}

function goBack() {
	for (var i = 0; i < modesController.length; i++) {
		modesController[i].goBack();
	}
}

function goToStart() {
	for (var i = 0; i < modesController.length; i++) {
		modesController[i].stopMode();
	}
}

function startGame() {
	for (var i = 0; i < modesController.length; i++) {
		modesController[i].startGame();
	}
}

function moveCommand(direction) {
	for (var i = 0; i < modesController.length; i++) {
		modesController[i].moveCommand(direction);
	}
}

function executeGame() {
	for (var i = 0; i < modesController.length; i++) {
		var dirCommand = modesController[i].executeGame();
		Log("ip: " + sendingIP + " port: " + sendingPort + " msg: " + dirCommand + " modeActive: " + modesController[i].getModeIsActive());
		if(modesController[i].getModeIsActive())
		{
			if(dirCommand != false) {
				// SendUDPString(sendingIP, sendingPort, dirCommand);
				sendMsgToRobot(dirCommand);
			}
		}
	}
}

function sendMsgToRobot(msg) {
	Log("sendMsgToRobot: " + msg);
	if (msg != false && msg != null)
		SendUDPString(sendingIP, sendingPort, msg);
}

function closePopup() {
	ClosePageByName(popupPage);
}


function KeyDownCallback(_key){
	debugLog("down "+ _key);

	if (_key == "D1"){
		controlProgramming.startMode();
		controlProgramming.startGame();
	} else if (_key == "D2"){
		controlProgramming.testScrollview();
	} else if (_key == "D3"){
		controlProgramming.moveCommand("up");
	} else if (_key == "D4"){
		controlProgramming.abortGame();
	} else if (_key == "D5"){
		moveCommand("forward");
	} else if (_key == "D6"){
		moveCommand("backward");
	} else if (_key == "D7"){
		executeGame();
	} else if (_key == "W"){
		SendUDPString(sendingIP, sendingPort, "x:0.05;y:0;ang:0;");
	} else if (_key == "A"){
		SendUDPString(sendingIP, sendingPort, "x:0;y:0;ang:45.0;");
	} else if (_key == "S"){
		SendUDPString(sendingIP, sendingPort, "x:-0.05;y:0;ang:0;");
	} else if (_key == "D"){
		SendUDPString(sendingIP, sendingPort, "x:0;y:0;ang:-45.0;");
	} else if (_key == "Space"){
		SendUDPString(sendingIP, sendingPort, "x:0.0;y:0;ang:0;");
	} else if (_key == "P"){
		OpenPage(popupPage);
	} else if (_key == "O"){
		closePopup();
	}else if (_key == "L"){
		SendUDPString(sendingIP, sendingPort, "algorithm");
	}else if (_key == "K"){
		SendUDPString(sendingIP, sendingPort, "stop");
	}else if (_key == "I"){
		SendUDPString(sendingIP, sendingPort, "resetOdom");
	}else if (_key == "NumPad1"){
		SendUDPString(sendingIP, sendingPort, "testMoveToWall");
	}else if (_key == "NumPad2"){
		SendUDPString(sendingIP, sendingPort, "testTurnLeft");
	}else if (_key == "NumPad3"){
		SendUDPString(sendingIP, sendingPort, "testTurnRight");
	}else if (_key == "NumPad4"){
		SendUDPString(sendingIP, sendingPort, "testFollowWall");
	}

	if (_key == "D"){
		debugMode = true;
		Log("turn On DebugMode");
	} else if (_key == "R"){	
		debugMode = false;
		Log("turn On DebugMode");
	}
}

function TimeoutCallback() {
	debugLog("TIMEOUT");
	goToStart();
}






