from datetime import datetime
import json
from bson import ObjectId

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            #datetime.date.__str__
            #return str(obj.date())
            return obj.strftime("%d/%m/%Y %H:%M")
        return json.JSONEncoder.default(self,obj)

class SocketEncoder(object):
    @staticmethod
    def dumps(*args, **kwargs):
        """ if 'cls' not in kwargs:
            kwargs['cls'] = MyAwesomeEncoder """
        print("json dumps:")
        print(args)
        return json.dumps(*args, **kwargs)

    @staticmethod
    def loads(*args, **kwargs):
        return json.loads(*args, **kwargs)