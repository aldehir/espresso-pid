import os.path as p
import logging

from tornado.web import Application, StaticFileHandler
from tornado.template import Loader

from handlers import IndexHandler
from rest.handlers import TemperatureHandler
from rest.handlers.config import BrewConfigHandler, SteamConfigHandler

from config import Configuration
from thermostat import Thermostat

logger = logging.getLogger('tornado')
logger.addHandler(logging.StreamHandler())

# Directories
rootdir = p.abspath(p.dirname(__file__))
templatedir = p.join(rootdir, 'templates')

publicdir = p.join(rootdir, 'public')
imgdir = p.join(publicdir, 'images')
cssdir = p.join(publicdir, 'stylesheets')
jsdir = p.join(publicdir, 'js')

thermo = Thermostat()
config = Configuration(221, 260)

loader = Loader(templatedir)
app = Application([
    # Front-end
    (r"/", IndexHandler, {
        'loader': loader,
        'thermostat': thermo,
        'configuration': config
    }),

    # Static files
    (r"/images/(.*)", StaticFileHandler, {'path': imgdir}),
    (r"/stylesheets/(.*)", StaticFileHandler, {'path': cssdir}),
    (r"/js/(.*)", StaticFileHandler, {'path': jsdir}),

    # API
    (r"/api/temperature", TemperatureHandler, {'thermostat': thermo}),
    (r"/api/config/brew", BrewConfigHandler, {'configuration': config}),
    (r"/api/config/steam", SteamConfigHandler, {'configuration': config}),
])

