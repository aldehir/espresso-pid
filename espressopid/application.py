from tornado.web import Application

from rest.handlers import TemperatureHandler
from rest.handlers.config import BrewConfigHandler, SteamConfigHandler

from config import Configuration
from thermostat import Thermostat

thermostat = Thermostat()
config = Configuration(221, 260)

app = Application([
    (r"/api/temperature", TemperatureHandler, { 'thermostat': thermostat }),
    (r"/api/config/brew", BrewConfigHandler, { 'configuration': config }),
    (r"/api/config/steam", SteamConfigHandler, { 'configuration': config })
])

