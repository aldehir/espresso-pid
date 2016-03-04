from tornado.web import RequestHandler, MissingArgumentError
import json

class BaseConfigHandler(RequestHandler):

    def get(self):
        temp = self.temp()
        self.write(json.dumps({ 'temperature': temp }))

    def post(self):
        try:
            value = int(self.get_body_argument('value'))
        except MissingArgumentError:
            self.write(json.dumps({'error': 1,
                                   'message': 'No temperature provided'}))
        except ValueError:
            self.write(json.dumps({'error': 2,
                                   'message': 'Invalid temperature provided'}))

        try:
            self.settemp(value)
            self.write(json.dumps({'error': 0,
                                   'message': 'Temperature successfully set'}))
        except ValueError as e:
            self.write(json.dumps({'error': 3, 'message': e.message}))
