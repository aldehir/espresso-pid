from tornado.web import RequestHandler
import json

class TemperatureHandler(RequestHandler):

    def initialize(self, thermostat):
        self.thermostat = thermostat

    def get(self):
        temp, time = self.thermostat.status()
        self.write(json.dumps({'temperature': temp, 'time_taken': time}))
