import json
import csv
import time
from collections import namedtuple

from tornado import gen
from tornado.web import RequestHandler
from tornado.ioloop import IOLoop, PeriodicCallback
from tornado.iostream import StreamClosedError

Reading = namedtuple('Reading', 'time, temp')

class EventHandler(RequestHandler):

    def initialize(self):
        self.set_header('content-type', 'text/event-stream')
        self.set_header('cache-control', 'no-cache')

        self.start = 0
        self.last = time.time()
        self.lastindex = 0
        self.data = []

        csvfile = '/home/alde/Development/espresso-pid/data/sample.csv'

        with open(csvfile, 'rb') as f:
            reader = csv.DictReader(f)
            for row in reader:
                taken = float(row['time'])

                if not self.start:
                    self.start = taken

                elapsed = taken - self.start
                temp = float(row['real_temp']) * 1.8 + 32.0

                self.data.append(Reading(elapsed, temp))

    def emit(self):
        reading = None
        lastreading = self.data[self.lastindex]
        current = time.time()
        since = current - self.last

        for i in xrange(self.lastindex + 1, len(self.data)):
            x = self.data[i]
            if since >= (x.time - lastreading.time):
                reading = x
                self.lastindex = i
            else:
                break

        if reading is not None:
            self.last = current

            try:
                self.write('data: {}\n\n'.format(json.dumps({
                    'time': reading.time,
                    'temp': reading.temp,
                })));
                self.flush()
            except StreamClosedError:
                pass

    @gen.coroutine
    def get(self):
        while True:
            self.emit()
            yield gen.sleep(0.33)
