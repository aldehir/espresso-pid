from tornado.web import RequestHandler

class IndexHandler(RequestHandler):

    def initialize(self, loader, thermostat, configuration):
        self.loader = loader
        self.thermo = thermostat
        self.config = configuration

    def get(self):
        template = self.loader.load("index.html")
        self.write(template.generate(config=self.config))
