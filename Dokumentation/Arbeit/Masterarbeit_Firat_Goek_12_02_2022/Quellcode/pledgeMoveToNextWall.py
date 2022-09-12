def moveToNextWall(self):
    self.runningToNextWall = True
    collidedToFrontWall = CollistionTyp.NOTHING # Kollisionsart reset
    self.robot.moveRobot(0.05, 0.0, 0.0) # setzt vorwaertsgeschwindigkeit
    while (self.runningToNextWall and not (collidedToFrontWall == CollistionTyp.LIDAR_FRONT)):
        collidedToFrontWall = self.robot.checkCollision() # Kollisionserkennung des Roboter Moduls 
        self.checkQRCode() # Abfrage ob Ziel erreicht wurde
        if(collidedToFrontWall == CollistionTyp.LIDAR_FRONT): # frontal eine Wand erreicht?
            self.runningToNextWall = False
            break
        time.sleep(0.001) # kleine Pause um CPU entlastung
    self.robot.moveRobot(0.0, 0.0, 0.0) # Schleife beendet -> Roboter stoppen
    self.currentStep = self.getNextStep() # setzt den naechsten Zustand 