#include <Arduino.h>
#include <WiFi.h>              //Einbinden der WiFi-Bibliothek
#include <ESPAsyncWebServer.h> //Einbinden der Webserver-Bibliothek
#include <LittleFS.h>
#include <Wire.h> // Wire Bibliothek für I2C-Display

// Beispiel LM75 auf dem Carrier Board hat
// die Adresse 1001.000R/W. Diese 7 Bits entsprechen 0x48
#define SLAVE_ADR 0x48 // I2C 7-Bit-Adr

// Ein Objekt namens server erstellen. Der Bauplan bzw. die Klasse des
// Objekts heisst AsyncWebServer. Wir benutzen spaeter die Methoden
// on(), onNotFound() und begin() des Objekts. 80 bedeutet, dass der
// Webserver auf Port 80 Anfragen erwartet. Dies ist der Standard HTTP-Port.
AsyncWebServer server(80);

// WLAN-Zugangsdaten
char *ssid = "MagentaWLAN-9YPW";         // hier muss die SSID stehen
char *passwort = "39130840523380688734"; // hier muss das Passwort stehen
char *Speed1 = "speed1";

int pin = 22;
double speed = 0.0;
String speedString = "0.0";

void setup()
{

  ledcSetup(0, 16000, 8); // Channel 0, 5 kHz frequency, 8-bit resolution
  ledcAttachPin(pin, 0);
  ledcWrite(0, speed);

  // pinMode(pin, OUTPUT);

  Serial.begin(115200); // serielle Schnittstelle initialisieren
  Serial.print("Verbindungsaufbau zu ");
  Serial.println(ssid);
  WiFi.begin(ssid, passwort); // WiFi-Verbindung herstellen
  // warten bis Verbindung steht
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.print("Verbindung hergestellt.\n Lokale IP: ");
  Serial.println(WiFi.localIP());
  Serial.print("ESP Board MAC Adresse: ");
  Serial.println(WiFi.macAddress());

  if (!LittleFS.begin())
  {
    Serial.println("An Error has occurred while mounting LittleFS!");
  }
  // Die Antworten des Servers definieren
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(LittleFS, "/index.html", String(), false); });
  // server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest *request)
  //           { request->send(LittleFS, "/style.css"); });

  server.on("/train_icon.png", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(LittleFS, "/train_icon.png"); });

  server.on("/get", HTTP_GET, [](AsyncWebServerRequest *request)
            {
              if (request->hasParam(Speed1))
              {
                speedString = request->getParam(Speed1)->value();
                speed = speedString.toDouble();

                ledcWrite(0, speed);

              }
               request->send(LittleFS, "/index.html"); });

  server.onNotFound([](AsyncWebServerRequest *request)
                    { request->send(404, "text/plain", "Seite nicht vorhanden!"); });
  server.begin(); // Den Server starten mit der Methode begin()
}

void loop()
{
  Serial.print("Aktuelle Geschwindigkeit: ");
  Serial.println(speed);
  // analogWrite(pin, speed);
}