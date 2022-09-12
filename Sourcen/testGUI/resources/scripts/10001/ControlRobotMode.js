function ControlRobotMode(_name) {
    var instance = this;
    var DC = GetDeviceCode();
    var name = _name;
    var pages = [];
    var gamePage = null;
    var instructionPage = null;
    var startPage = null;
    var modeIsActive = false;
    var executeIsActive = false;
    var IDs = {
        INSTRUCTION : 0,
        GAME: 1
    }

    var scrollViewer = null;
    var counter = 0;
    var counterExecute = 0;
    var commands = [];
    var timerExecute = null;
    


    this.init = function(_pages, _startPage)
    {
        startPage = _startPage;
        pages = [null] * _pages.length;
        for (var i = 0; i < _pages.length; i++) {
            if (_pages[i].indexOf("game") >= 0) {
                gamePage = LoadPage(GetResource("screen\\"+DC+"\\" + DC +_pages[i]+".xui"));
                pages[IDs.GAME] = gamePage;
            }
            else {
                instructionPage = LoadPage(GetResource("screen\\"+DC+"\\"+ DC +_pages[i]+".xui"));
                pages[IDs.GAME] = gamePage;
            }
        }

        if (name == "programming" || name == "remoteControl") {
            scrollViewer = gamePage.CreateScrollViewer("wrappanel_img", ElementPos(100, 100, -1, -1), 800, 500, null, null, null);
            scrollViewer.SetHorizontalScrollBarVisible(false);
            scrollViewer.SetVerticalAlignment("top");
            gamePage["overlay"].SetVisible(false);
        }
        timerExecute = SetInterval(500, instance.executing);
        timerExecute.Stop();
    }

    this.startMode = function() {
        Log("startPage: " + name);
        modeIsActive = true;
        ChangePage(instructionPage);
    }

    this.stopMode = function() {
        modeIsActive = false;
        instance.abortGame();
        ChangePage(startPage);
    }

    this.startGame = function() {
        Log("startGame"  + name +modeIsActive);
        if(modeIsActive) {
            if (name == "programming" || name == "remoteControl") {
                scrollViewer.RemoveAll();
            }
            ChangePage(gamePage);
        }
    }

    this.abortGame = function() {
        Log("abortGame");
        if (name == "programming" || name == "remoteControl")
        {
            gamePage["btn_execute"].element.Deselect();
            gamePage["overlay"].SetVisible(false);
            scrollViewer.RemoveAll();
        }
        executeIsActive = false;
        timerExecute.Stop();
        commands = [];
        counter = 0; 
        counterExecute = 0;
    }

    this.executeGame = function() {
        if(modeIsActive)
        {
            if(commands.length > 0) {
                // timerExecute.Start();
                executeIsActive = true;
                gamePage["overlay"].SetVisible(true);
                Log("execute: " + instance.getName());
                instance.setAllCommandsDeselected();
                gamePage["btn_execute"].element.Select();
                var dir = commands[counterExecute];
                gamePage["img_" +counterExecute].SetText(GetResource("images/" + DC + "/btn_" + dir + "_down.png"));
                counterExecute++;
                return dir
            }
        }
    }

    this.executing = function() {
        if(modeIsActive) {
            Log("********** " + counterExecute + " name: " +name);
            if(counterExecute < commands.length)
            {
                var dir = commands[counterExecute];
                Log("-------" + dir);
                gamePage["img_" +counterExecute].SetText(GetResource("images/" + DC + "/btn_" + dir + "_down.png"));
                counterExecute++;
                return dir;
            }
            else {
                Log("Stop Excecute");
                executeIsActive = false;
                gamePage["overlay"].SetVisible(false);
                // timerExecute.Stop();
                counterExecute = 0;
                gamePage["btn_execute"].element.Deselect();
                SetTimer(250, instance.setAllCommandsDeselected);
                // instance.setAllCommandsDeselected();
                return false;
            }
        }
    }

    this.setAllCommandsDeselected = function() {
        for(var i = 0; i < commands.length; i++)
        {
            var dir = commands[i];
            gamePage["img_" + i].SetText(GetResource("images/" + DC + "/btn_" + dir + ".png"));
        }
    } 

    this.getName = function () {
        return name;   
    }

    this.goBack = function() {
        if (modeIsActive) {
            if (GetPage() == gamePage) {
                instance.abortGame();
                ChangePage(instructionPage);
            }
            else {
                instance.stopMode();
            }
        }
    }

    this.moveCommand = function(direction) {
        if((name == "programming" || name == "remoteControl") && GetPage() == gamePage) {
            if (direction == "delete") {
                if (!executeIsActive) {
                    Log(counter);
                    counter = (counter - 1) < 0 ? 0: counter - 1 ;
                    scrollViewer.RemoveElement(gamePage["img_" + counter].element);
                    Log(counter);
                    commands.pop();
                }
            } else {
                Log("img_" + counter);
                gamePage.CreateImage("img_" + counter, GetResource("images/" + DC + "/btn_" + direction + ".png"), ElementPos(0, 0, 0, 0), -1, -1, null, null, "wrappanel_img");
                gamePage["img_" + counter].SetMargin(5); 
                scrollViewer.AddElement(gamePage["img_" + counter].element);
                counter++;
                commands.push(direction);
            }
        }
    }

    this.getModeIsActive = function() {
        return modeIsActive;
    }
}