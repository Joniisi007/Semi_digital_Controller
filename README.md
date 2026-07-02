# Semi-Digital Controller for Analog Model Trains
This project is a new way to control your analog model railroad via a web app. The web app controls the speed using PWM. For it to work, you need to build your own circuit board with, for example, an ESP32 and an H-bridge like the IBT-2. If you want to make changes to the original code, go ahead, as long as you follow the terms of the license. If you have any questions, feel free to contact me, but please keep in mind that I might live in a different time zone.
 
## 🛠️ Hardware
You need: 
- A microcontroller
- A micro SD card reader
- An H-bridge
- A power source for the microcontroller
- A power source for the track

I used: 
- **MCU:** ESP32-WROVER (from a Freenove starter set)
- **SD card reader:** Built-in on the ESP32 board
- **H-bridge:** IBT-2
- **Power source MCU:** Small USB cable connected to a PC (for development)
- **Power source track:** Fleischmann N scale transformer
## 💻 Run Locally

Clone the project

```bash
  git clone https://github.com/Joniisi007/Semi_digital_Controller
```

Go to the project directory

```bash
  cd Semi_digital_Controller
```

### Setup with PlatformIO (Recommended)
If you are using VS Code, we highly recommend the PlatformIO extension.

Required Libraries:

- ArduinoJson

- AsyncTCP

- ESPAsyncWebServer

Install dependencies with PlatformIO:

```bash
  pio lib install
```
Upload the files in the Data folder using LittleFS:

```bash
 pio run -t uploadfs 
```
Upload the main.cpp file:

```bash
  pio run -t upload
```

## 📄 License

[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.en)

### Regarding non-commercial use:
- You are welcome to create videos, blogs, or articles about this project.
- Any commercial sale of the software or hardware layout is prohibited without explicit permission under the license.
## 🗃️ Documentation
Further documentation is currently only available in German 😔. However, if anyone needs it in English, I will translate it. Please contact me if that is the case. Please keep in mind this could take a few days. 

[Documentation](https://github.com/Joniisi007/Semi_digital_Controller/blob/develop/Semi-Digitaler%20Controller%20f%C3%BCr%20eine%20analoge%20Anlage.pdf)


## 🤝 Sharing & Giving Credit 

I really want to see this project grow and make it a viable solution for other model railroads. Because I licensed this project under the CC BY-NC 4.0 license, you are free to fork it, modify it, and share your version.

If you make your changes public, I would appreciate a short shout-out. A link to this repo and a note with the license in your README is enough, or you can just copy and paste this template:
```markdown 
   Origin: https://github.com/Joniisi007/Semi_digital_Controller (by Joniisi007)
   Original license: CC BY-NC 4.0
```
## 📝 Coming eventually
New features that are planned.

- [ ] multi track support 
- [ ] switch support 
- [ ] separate webserver(self hosted)
- [ ] small Database(self hosted)
- [ ] Automatic light on on the Layout (Triggered by the Room Brightness)
## Credits
### Img: 
https://www.svgrepo.com/svg/436572/train?edit=true 
by Streetmix
https://www.svgrepo.com/svg/501089/arrow-double-start
https://www.svgrepo.com/svg/500758/arrow-right-bold
https://www.svgrepo.com/svg/500512/close-bold
https://www.svgrepo.com/svg/506784/add-square

### License:
https://www.svgrepo.com/page/licensing/#MIT
https://www.svgrepo.com/page/licensing/#CC%20Attribution