from base import BaseConfigHandler

class SteamConfigHandler(BaseConfigHandler):

    def initialize(self, configuration):
        self.configuration = configuration

    def temp(self):
        return self.configuration.steamtemp()

    def settemp(self, value):
        return self.configuration.setsteamtemp(value)
