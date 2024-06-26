const int pin_SENSOR = 12;
const int pin_LED = 13;
int sensorState = 0;
int count_value = 0;
int prestate = 0;

void setup(){
  pinMode(pin_LED, OUTPUT);
  pinMode(pin_SENSOR,INPUT);
  Serial.begin(9600);
}

void loop(){
  sensorState = digitalRead(pin_SENSOR);
  if (sensorState == HIGH && prestate == 0){
    count_value++;
    Serial.print("/t");
    Serial.println(count_value);
    digitalWrite(pin_LED , HIGH);
    delay(500);
    digitalWrite(pin_LED , LOW);
    prestate = 1;
  } else if (sensorState == LOW) {
    prestate = 0;
  }
}