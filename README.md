# Espresso PID

Espresso PID is a project I started to improve my espresso machine. Most low to
mid end espresso machines do a poor job at maintaining the ideal temperature
while brewing or steaming. Espresso PID uses a Raspberry Pi, solid state
relays, and a thermocouple to regulate the machine's interal boiler.

The proportional-integral-derivative controller (PID controller) is a software
based solution writtn in Node.js that uses the Pi's general purpose IO pins to
read the boiler's temperature and turn the boiler on/off depending on the PID
controller output.

In addition, Espresso PID serves a web server written in a mixture of Node.js,
React, and D3.js to configure the target temperatures and display temperature
graphs.
