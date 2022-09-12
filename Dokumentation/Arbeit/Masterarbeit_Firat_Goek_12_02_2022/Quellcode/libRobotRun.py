def run(self):
    self.running = True
    self.rate = rospy.Rate(10) #10Hz
    while (not rospy.is_shutdown() and self.running):
        # self.printROSINFO("while Loop")
        
        # ueberpruefung ob Roboter weg frei
        self.checkCollision()
        
         # setzt die Geschwindigkeiten der einzelnen Achsen
        self.twist_pub.publish(self.currentMoveValue)
        
         # Triggerung Hintergrund ROS-Prozesse, abwarten Zeit
        self.rate.sleep()
    print("End of LIBRobot Running")