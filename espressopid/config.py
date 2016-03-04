
MAX_TEMPERATURE = 290

class Configuration(object):

    def __init__(self, brewtemp, steamtemp):
        self._brewtemp = brewtemp
        self._steamtemp = steamtemp

    def brewtemp(self):
        return self._brewtemp

    def steamtemp(self):
        return self._steamtemp

    def setbrewtemp(self, value):
        if value >= self.steamtemp():
            raise ValueError("Brew temperature must be below "
                             "steam temperature")

        if value > MAX_TEMPERATURE:
            raise ValueError("Brew temperature above max temperature "
                             "of {0}".format(MAX_TEMPERATURE))

        self._brewtemp = value

    def setsteamtemp(self, value):
        if value <= self.brewtemp():
            raise ValueError("Steam temperature must be above "
                             "brew temperature")

        if value >= MAX_TEMPERATURE:
            raise ValueError("Steam temperature above max temperature "
                             "of {0}".format(MAX_TEMPERATURE))

        self._steamtemp = value

