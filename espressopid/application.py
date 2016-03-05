import os.path as p
import logging

from tornado.web import Application, StaticFileHandler

from handlers import IndexHandler
from rest.handlers import TemperatureHandler
from rest.handlers.config import BrewConfigHandler, SteamConfigHandler

from config import Configuration
from thermostat import Thermostat

logger = logging.getLogger('tornado')
logger.addHandler(logging.StreamHandler())

# Directories
rootdir = p.abspath(p.dirname(__file__))
frontenddir = p.join(p.dirname(rootdir), 'www')

thermo = Thermostat()
config = Configuration(221, 260)

app = Application([
    # API
    (r"/api/temperature", TemperatureHandler, {'thermostat': thermo}),
    (r"/api/config/brew", BrewConfigHandler, {'configuration': config}),
    (r"/api/config/steam", SteamConfigHandler, {'configuration': config}),

    # Front-end
    (r"/(.*)", StaticFileHandler, {
        'path': frontenddir,
        "default_filename": "index.html"
    }),
], debug=True)

