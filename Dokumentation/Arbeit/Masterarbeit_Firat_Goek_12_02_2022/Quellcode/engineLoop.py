def main():
    api = APIEngine()
    
    while True:
        try:
            # api.input() # wurde ersetzt durch Nezwerk Callback funktion
            api.update()
            api.output()
            time.sleep(0.001)
        except KeyboardInterrupt:
            print("Goodbye from ROS API")
            sys.exit(0)
            api.shutdown()

if __name__ == '__main__':
    main()