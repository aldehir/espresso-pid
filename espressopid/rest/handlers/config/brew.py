from base import BaseConfigHandler

class BrewConfigHandler(BaseConfigHandler):

    def initialize(self, configuration):
        self.configuration = configuration

    def temp(self):
        return self.configuration.brewtemp()

    def settemp(self, value):
        return self.configuration.setbrewtemp(value)
