// the Pressure applied to each pile is simulated by a Force sensor  as pressure sensor
// the Wind Speed(mps), the Humidity(percentage), the rain(mm/day) are simulated by a Potentiometer 
// the air Temperature (degree C) is measured by Temperature sensor

void setup()
{
  pinMode(A0, INPUT); // pin A0 is configured as an input for listening to the temperature sensor 
  pinMode(A1, INPUT); // pin A1 is configured as an input for listening to the potentiometer sensor
  pinMode(A2, INPUT); // pin A2 is configured as an input for listening to the force sensor as pressure sensor
  Serial.begin(9600);
}
 
void loop()
{
 
 // pressure in Kpa
 int force = analogRead(A2); // reading on A2 (how much pressure is applied to the pile) 
 Serial.print("Pressure:");
 Serial.println(map(force, 0, 466, 0, 600)); 
 
 int readingA1 = analogRead(A1); // reading on A1
  
 // wind speed in mps
 // analog input converted to voltage
 float voltageW = readingA1 * (5.0 / 1023.0);
 // voltage converted to MPH (miles per hour)
 float windSpeed = (voltageW - 0.4) * 10 * 2.025 * 2.237;
 // mph to mps (meter per second): 1 mhp = 0.45mps
 windSpeed*=0.45; 
 Serial.print("Wind Speed:"); 
 Serial.println(windSpeed);
 
 // temperature in degree C
 int temperature = analogRead(A0); // reading on A0
 // measure the 5v with a meter for an accurate value
 float voltageT = temperature * 4.68;
 voltageT /= 1024.0;
 float temperatureC = (voltageT - 0.5) * 100;
 Serial.print("Temperature:"); 
 Serial.println(temperatureC);
  
 // humidity in percentage
 int humidity = readingA1;
 Serial.print("Humidity:"); 
 Serial.println(map(humidity, 0, 1023, 0, 100));
 
 // rain in mm/day
 int rain = readingA1;
 Serial.print("Rain:"); 
 Serial.println(map(rain, 0, 1023, 0, 300));

  
 delay(2000); // wait for 2 seconds
}
